import { FunctionComponent } from "react";
import { TodoState } from "../../store";

export enum TodoFieldNames {
    ID = "id",
    TITLE = "title",
    TASK_TYPE = "taskType",
    DUE_DATE = "due_date",
    ESTIMATE = "estimate",
    DONE = "done",
    IS_EMPTY = "isEmpty"
}


export interface Todo {
    [TodoFieldNames.ID]: number,
    [TodoFieldNames.TITLE]: string,
    [TodoFieldNames.TASK_TYPE]: number,
    [TodoFieldNames.DUE_DATE]: Date,
    [TodoFieldNames.ESTIMATE]: number,
    [TodoFieldNames.DONE]: boolean | false
    [TodoFieldNames.IS_EMPTY]?: boolean
}

export enum TaskTypeFields {
    ID = "id",
    NAME = "name",
    COLOR_CODE = "color_code"
}

export interface taskType {
    [TaskTypeFields.ID]: number,
    [TaskTypeFields.COLOR_CODE]: string,
    [TaskTypeFields.NAME]: string
}

export interface TodoTableProps {
    heading: string
}

export type FilterObj  = Partial<Todo>;

export type TodoId = Todo[TodoFieldNames.ID];
export type TodoIds = Array<TodoId>;

export type TodoListMap = Map<TodoId, Todo>;
// export interface TodoListMap {
    
//     get: (id: TodoId) => Todo,
//     set: (id: TodoId, value: Todo) => void
    
// }

export type TaskTypeList = Array<taskType>;

export interface HeadCell {
    disablePadding: boolean;
    id: keyof Todo;
    label: string;
    numeric: boolean;
    type: string;
    formatFn?: (value: any) => any,
    customComponents?: {
        valueComponent?: FunctionComponent <any>
        inputComponent?: FunctionComponent <any>
    }
}
  
export interface TodoTableHeadProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Todo) => void;
    order: Order;
    orderBy: string;
    headCells: Array<HeadCell>
  }



export type Order = 'asc' | 'desc';

