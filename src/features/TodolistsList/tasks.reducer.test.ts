import {
  addTaskTC,
  fetchTasksTC, removeTaskTC,
  tasksActions,
  tasksReducer,
  TasksStateType,
  updateTaskTC
} from "features/TodolistsList/tasks.reducer";

import {
  fetchTodolistsTC,
  removeTodolistTC,
  todolistsActions,
  todolistsThunks
} from "features/TodolistsList/todolists.reducer";
import { Action } from "../../common/types/types";
import { TaskPriorities, TaskStatuses } from "../../common/emuns/enums";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low
      }
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low
      }
    ]
  };
});

test("correct task should be deleted from correct array", () => {
  const action: Action<typeof removeTaskTC.fulfilled> = removeTaskTC.fulfilled({
    taskId: "2",
    todolistId: "todolistId2"
  }, "", {
    taskId: "2",
    todolistId: "todolistId2"
  });


  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every((t) => t.id !== "2")).toBeTruthy();
});

test("correct task should be added to correct array", () => {
  type Action<T extends (...arg: any) => any> = Omit<ReturnType<T>, "meta">
  //const action = addTaskAC("juce", "todolistId2");
  const action: Action<typeof addTaskTC.fulfilled> = addTaskTC.fulfilled({

    task: {
      todoListId: "todolistId2",
      title: "juce",
      status: TaskStatuses.New,
      addedDate: "",
      deadline: "",
      description: "",
      order: 0,
      priority: 0,
      startDate: "",
      id: "id exists"
    }
  }, "requestId", { title: "newT", todoListId: "todolistId2" });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified task should be changed", () => {
  const action: Action<typeof updateTaskTC.fulfilled> = updateTaskTC.fulfilled({
    taskId: "2",
    domainModel: { status: TaskStatuses.New },
    todolistId: "todolistId2"
  }, "requestId", {
    taskId: "2",
    domainModel: { status: TaskStatuses.New },
    todolistId: "todolistId2"
  });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});

test("title of specified task should be changed", () => {
  const action: Action<typeof updateTaskTC.fulfilled> = updateTaskTC.fulfilled({
    taskId: "2",
    domainModel: { title: "yogurt" },
    todolistId: "todolistId2"
  }, "requestId", {
    taskId: "2",
    domainModel: { title: "yogurt" },
    todolistId: "todolistId2"
  });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("yogurt");
  expect(endState["todolistId2"][0].title).toBe("bread");
});

test("new array should be added when new todolist is added", () => {
  const action = todolistsThunks.addTodolistTC.fulfilled({
    todolist: {
      id: "blabla",
      title: "new todolist",
      order: 0,
      addedDate: ""
    }
  }, '', "new todolist");

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("propertry with todolistId should be deleted", () => {
  const action: Action<typeof removeTodolistTC.fulfilled> =
    removeTodolistTC.fulfilled({ id: "todolistId2" }, '', { id: "todolistId2" })

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});

test("empty arrays should be added when we set todolists", () => {
  const action: Action<typeof fetchTodolistsTC.fulfilled> = fetchTodolistsTC.fulfilled({
    todolists: [
      { id: "1", title: "title 1", order: 0, addedDate: "" },
      { id: "2", title: "title 2", order: 0, addedDate: "" }
    ]
  }, '', );

  const endState = tasksReducer({}, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["1"]).toBeDefined();
  expect(endState["2"]).toBeDefined();
});

test("tasks should be added for todolist", () => {

  const action: Action<typeof fetchTasksTC.fulfilled> = fetchTasksTC.fulfilled({
    tasks: startState["todolistId1"],
    todolistId: "todolistId1"
  }, "requestId", "todolistId1");

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: []
    },
    action
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});
