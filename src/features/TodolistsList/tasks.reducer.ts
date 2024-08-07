import {
  AddTaskArgs,
  taskForDeleteType,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType
} from "features/TodolistsList/todolists-api";
import { AppThunk } from "app/store";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { appActions } from "app/app.reducer";
import {
  fetchTodolistsTC,
  removeTodolistTC,
  todolistsActions,
  todolistsThunks
} from "features/TodolistsList/todolists.reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerAppError } from "../../common/utils";
import { TaskPriorities, TaskStatuses } from "../../common/emuns/enums";


const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;

      })
      .addCase(removeTaskTC.fulfilled, (state, action)=>{
          const tasks = state[action.payload.todolistId];
          const index = tasks.findIndex((t) => t.id === action.payload.taskId);
          if (index !== -1) tasks.splice(index, 1);


      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel };
        }
      })
      .addCase(todolistsThunks.addTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsThunks.removeTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsThunks.fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearTasksAndTodolists, () => {
        return {};
      });
  }
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;

export enum ResultCode {
  Success,
  Error = 1,
  Captcha = 10,
}

// thunks

export const fetchTasksTC = createAppAsyncThunk<
  { tasks: TaskType[], todolistId: string },
  string
>(`${slice.name}/fetchTasks`, async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todolistId);
      const tasks = res.data.items;
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { tasks, todolistId };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }


  }
);

// export const fetchTasksTC =
//   (todolistId: string): AppThunk =>
//   (dispatch) => {
//     dispatch(appActions.setAppStatus({ status: "loading" }));
//     todolistsAPI.getTasks(todolistId).then((res) => {
//       const tasks = res.data.items;
//       dispatch(tasksActions.setTasks({ tasks, todolistId }));
//       dispatch(appActions.setAppStatus({ status: "succeeded" }));
//     });
//   };


export const removeTaskTC = createAppAsyncThunk<taskForDeleteType, taskForDeleteType>(`${slice.name}/removeTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await todolistsAPI.deleteTask(arg)
    return arg

  }catch (err){
    return rejectWithValue(null);
  }
});
// export const _removeTaskTC =
//   (taskId: string, todolistId: string): AppThunk =>
//     (dispatch) => {
//       todolistsAPI.deleteTask(todolistId, taskId).then(() => {
//         dispatch(tasksActions.removeTask({ taskId, todolistId }));
//       });
//     };

export const addTaskTC = createAppAsyncThunk<{
    task: TaskType
  }, AddTaskArgs>(`${slice.name}/addTask`, async (arg, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      try {
        const res = await todolistsAPI.createTask(arg);

        if (res.data.resultCode === ResultCode.Success) {
          const task = res.data.data.item;
          return { task };
        } else {
          handleServerAppError(res.data, dispatch);
          return rejectWithValue(null);
        }

      } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
      }
      //dispatch(appActions.setAppStatus({ status: "loading" }));
    }
  )
;
export const updateTaskTC = createAppAsyncThunk<UpdateTaskType, UpdateTaskType>(`${slice.name}/updateTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;

  try {
    const state = getState();
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state");
      return rejectWithValue(null);
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel
    };

    const res = await todolistsAPI.updateTask({
      taskId: arg.taskId,
      todolistId: arg.todolistId,
      domainModel: apiModel
    });

    if (res.data.resultCode === ResultCode.Success) {
      return arg;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});
export type UpdateTaskType = {
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistId: string
}
// export const _updateTaskTC =
//   (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
//     (dispatch, getState) => {
//       const state = getState();
//       const task = state.tasks[todolistId].find((t) => t.id === taskId);
//       if (!task) {
//         //throw new Error("task not found in the state");
//         console.warn("task not found in the state");
//         return;
//       }
//
//       const apiModel: UpdateTaskModelType = {
//         deadline: task.deadline,
//         description: task.description,
//         priority: task.priority,
//         startDate: task.startDate,
//         title: task.title,
//         status: task.status,
//         ...domainModel
//       };
//
//       const res = todolistsAPI
//         .updateTask(todolistId, taskId, apiModel)
//         .then((res) => {
//           if (res.data.resultCode === ResultCode.success) {
//             dispatch(tasksActions.updateTask({ taskId, model: domainModel, todolistId }));
//           } else {
//             handleServerAppError(res.data, dispatch);
//           }
//         })
//         .catch((error) => {
//           handleServerNetworkError(error, dispatch);
//         });
//     };

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
