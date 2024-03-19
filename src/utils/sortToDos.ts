import { HeadCell, Order, TodoFieldNames, TodoIds } from "../components/TaskContainer/type";
import { useTodoStore } from "../store";

export default function sortToDos(todoIds: TodoIds, order: Order, orderBy: TodoFieldNames, headCells: Array<HeadCell>, todoListMap) {
    const fn = getComparator(order, orderBy, headCells);

    return [...todoIds].sort((todoId1, todoId2) => {
        const todo1 = todoListMap.get(todoId1);
        const todo2 = todoListMap.get(todoId2);

        return fn(todo1, todo2);
    });
}

function descendingComparator(a, b, property, dataType) {
    
    let p1 = a[property];
    let p2 = b[property];
    if(!p2) {
      return 1;
    } else if(!p1) {
      return -1;
    }
    switch(dataType) {
      case "number": 
        p1 = Number(p1);
        p2 = Number(p2);
        break;
      case "text":
      case "url":
        p1 = p1.toLowerCase();
        p2 = p2.toLowerCase();
        break;
      case "datetime-local":
        p1 = (new Date(p1)).getTime();
        p2 = (new Date(p2)).getTime();
        break;
      case "checkbox": 
        p1 = p1? 1: 0;
        p2 = p2? 1: 0;
        break;


    }

    if(p2 < p1) {
      return -1;
    } else if(p2 > p1){
      return 1;
    }



    return 0;
}

function getComparator(order, orderBy, formFields) {
    let fieldObj = formFields.filter((field) => {
        return field.id === orderBy;
    })[0];

    if(!fieldObj) {
        return;
    }

    let dataType = fieldObj.type || "number";

    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy, dataType)
        : (a, b) => -descendingComparator(a, b, orderBy, dataType);
}