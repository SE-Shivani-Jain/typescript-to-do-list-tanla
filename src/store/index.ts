// @ts-nocheck

import { create } from 'zustand'
import { taskType, TaskTypeFields, TodoIds, TaskTypeList, Todo, TodoFieldNames, TodoListMap, TodoId } from '../components/TaskContainer/type';
import { green, purple } from '@mui/material/colors';

const LOCALSTORAGE_KEY_NAME = "todosState";

export interface TodoState {
    todoListMap?: TodoListMap,
    maxId: TodoId,
    taskTypes: TaskTypeList,
    todoIds: TodoIds,
    addTodo: (index?: number) => void,
    deleteTodo: (id: TodoId) => void,
    editTodo: (id: TodoId, params: Partial<Todo>) => void,
    addTaskType: (name: taskType[TaskTypeFields.NAME], color: taskType[TaskTypeFields.COLOR_CODE]) => void,
}

// const ONE_SECOND = 1000;
// const ONE_HOUR = 60 * ONE_HOUR;

// const d = new 







export const addTodo = (index?: number): void => useTodoStore.setState((state: TodoState) => {
    let maxId: TodoId = state.maxId || 0;
    maxId = maxId + 1;

    const newTodo: Todo ={...getEmptyToDo(maxId)};
    index = index || state.todoIds?.length || 0;

    const newIds: TodoIds = [...state.todoIds];
    newIds.splice(index, 0, maxId);
    const newToDoMap: TodoListMap = new Map(state.todoListMap);
    newToDoMap.set(maxId, newTodo);

    const newState: Partial<TodoState> = {
        maxId: maxId, 
        todoListMap: newToDoMap,
        todoIds: newIds
    };

    saveToLocalStorage(newState);
    return newState;

})

export const deleteTodo = (todoId: TodoId):void => useTodoStore.setState((state: TodoState) => {
    const newToDoMap = new Map(state.todoListMap);
    newToDoMap.delete(todoId);

    // remove from todoIds
    const newTodoIds: Array<TodoId> = state.todoIds?.slice();
    const index = newTodoIds.indexOf(todoId);
    newTodoIds.splice(index, 1);


    const newState: Partial<TodoState> =  {
        todoListMap: newToDoMap,
        todoIds: newTodoIds
    };

    saveToLocalStorage(newState);
    return newState;

})

export const editTodo = (todoId: TodoId, params: Partial<Todo>): void => useTodoStore.setState((state: TodoState) => {
    const newToDoMap = new Map(state.todoListMap);

    console.log("todoid edit: " + todoId, "params: " + JSON.stringify(params));

    const oldTodo = newToDoMap.get(todoId);
    newToDoMap.set(todoId, {
        ...oldTodo,
        ...params
    });

    const newState: Partial<TodoState> =  {
        todoListMap: newToDoMap,
    };

    console.log(newState);
    saveToLocalStorage(newState);
    return newState;

})

export const toggleTodo = (todoId: TodoId) => useTodoStore.setState((state: TodoState) => {

    const todoToToggle = state.todoListMap?.get(todoId);

    const editTodo = useTodoStore((state) => state.editTodo);   

    editTodo(todoId, {
        done: !todoToToggle?.done
    });

    //TODO please check if this works

    return state;

});

export const  addTaskType = (name: taskType[TaskTypeFields.NAME], color: taskType[TaskTypeFields.COLOR_CODE]): void =>  useTodoStore.setState((state: TodoState) => {

    const newTaskType: taskType = {
        id: (state.taskTypes?.length || 0) + 1,
        color_code: color,
        name: name
    }

    const newState: Partial<TodoState> = {taskTypes: state.taskTypes?.concat([newTaskType])};

    saveToLocalStorage(newState);
    return newState;
});

export const saveToLocalStorage = (newState: Partial<TodoState>): void => useTodoStore.setState((state: TodoState) => {
   console.log("saving to local storage");
    const finalState = {...state, ...newState};
   
   const localStorageState = saveStorage(finalState);

    return {...newState};
});


function saveStorage(finalState) {
    const localStorageState = {
        ...finalState,
        todoMap: {
        }
    }
    
    // localStorageState.todoMap =}
    for (let entry of finalState.todoListMap?.entries()) {
        localStorageState.todoMap[entry[0]] = entry[1]; 
    }



    console.log("localStorageState: ") ;
    console.log(localStorageState.todoMap);

    localStorage.setItem(LOCALSTORAGE_KEY_NAME, JSON.stringify(localStorageState));

    return localStorageState;

}
   
function retreiveLocalStorage() {

    const defaultTodos: Array <Todo> = [
        {done: false, id: 1, title: 'set up meeting', taskType: 1, due_date: new Date((new Date()).setDate((new Date()).getHours() + 2)), estimate: 15},
        {done: false, id: 2, title: 'deployment', taskType: 1, due_date: new Date((new Date()).setDate((new Date()).getHours() + 2)), estimate: 25},
        {done: false, id: 3, title: 'cook food', taskType: 2, due_date: new Date((new Date()).setDate((new Date()).getHours() + 1)), estimate: 45}
    ]
    
    
    const defaultState: Partial<TodoState> = {
        todoIds: [1, 2, 3], 
        taskTypes: [
            {id: 1, color_code: '#00c853', name: 'work'},
            {id: 2, color_code: '#aa00ff', name: "home"},
        ],
        todoListMap: new Map<TodoId, Todo>([
            [1, defaultTodos[0]],
            [2, defaultTodos[1]],
            [3, defaultTodos[2]]
        ]),
        maxId: 3
    };

    let initialState: Partial<TodoState>;

    const storage = localStorage.getItem(LOCALSTORAGE_KEY_NAME);



    if(storage) {
        initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_NAME));
    console.log("localstate");
    console.log(initialState);

        initialState.todoListMap = new Map();
        Object.keys(initialState.todoMap).forEach((id) => {
            initialState.todoListMap.set(Number(id),  initialState.todoMap[id]);
        })
        delete initialState.todoMap;
    } else {
        initialState = {...defaultState};
    }

    console.log("initialState");
    console.log(initialState);

    return {...initialState};

}



export const useTodoStore = create<TodoState>()((set) => ({
    // todoListMap: initialState.todoListMap,
    // taskTypes: initialState.taskTypes,
    // maxId: initialState.maxId,
    // todoIds: initialState.todoIds,
    ...retreiveLocalStorage(),
    addTodo,
    editTodo,
    deleteTodo,
    addTaskType,
    // saveToLocalStorage
    // addTask: ()
    
}));

// saveToLocalStorage(initialState);
export function getEmptyToDo(maxId) {
    const emptyToDo: Todo = {done: false, isEmpty: true, id: maxId, title: '', taskType: 1, due_date: new Date((new Date()).setDate((new Date()).getHours() + 2)), estimate: 15}
    return emptyToDo;
}