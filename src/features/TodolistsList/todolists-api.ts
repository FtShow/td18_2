import axios from "axios";
import { UpdateTaskType } from "./tasks.reducer";
import { TaskPriorities, TaskStatuses } from "../../common/emuns/enums";
import { instance } from "../../common/instance/instance";
import { BaseResponse } from "../../common/types/types";




// api
export const todolistsAPI = {
  getTodolists() {
    const promise = instance.get<TodolistType[]>("todo-lists");
    return promise;
  },
  createTodolist(title: string) {
    const promise = instance.post<BaseResponse<{ item: TodolistType }>>("todo-lists", { title: title });
    return promise;
  },
  deleteTodolist(id: string) {
    const promise = instance.delete<BaseResponse>(`todo-lists/${id}`);
    return promise;
  },
  updateTodolist(id: string, title: string) {
    const promise = instance.put<BaseResponse>(`todo-lists/${id}`, { title: title });
    return promise;
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(arg: AddTaskArgs) {
    return instance.post<BaseResponse<{ item: TaskType }>>(`todo-lists/${arg.todoListId}/tasks`, { title: arg.title });
  },
  updateTask(arg: UpdateTaskType) {
    return instance.put<BaseResponse<TaskType>>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`, arg.domainModel);
  },
};


export type AddTaskArgs = {
  todoListId: string,
  title: string,
}


// types
export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};


export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
