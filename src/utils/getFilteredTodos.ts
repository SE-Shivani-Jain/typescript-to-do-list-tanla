import { Todo, TodoFieldNames } from "../components/TaskContainer/type";
import { useTodoStore } from "../store";

export default function getFilteredTodos(filterObj: Partial<Todo>, todoIds, todoListMap) {
        if(!filterObj) {return todoIds;}

        // console.log("filterobj: " );
        // console.log(filterObj);


        return todoIds.filter((todoId) => {
            const todo = todoListMap?.get(todoId);
            const filters = {};
            let doesSatisfy = true;
            // console.log(  "todo  ", todo);

            todo && Object.keys(todo).forEach((fieldName: string) => {
                if(doesSatisfy) {

                    const filterValue = filterObj[fieldName];
                    const c1 = filterValue !== "" && filterValue !== undefined;
                    const c2 = filterValue !== "all"; 
                    if(c1 && c2) {
                        

                        let condition = true;
                        const todoValue = todo[fieldName];

                        // console.log(  "todo value: ", todoValue, "fieldName: " + fieldName, "filterValue: " + filterValue);

                        if(fieldName === TodoFieldNames.TITLE) {
                            condition =   (todoValue.indexOf(filterValue) >= 0);
                        
                        } else if(fieldName === TodoFieldNames.ESTIMATE) {
                        
                            condition =  (todoValue <= Number(filterValue));
                            
                        }  else if(fieldName === TodoFieldNames.DUE_DATE) {
                        
                            condition =  (new Date(todoValue) <=  new Date(filterValue));
                            
                        }
                        
                        else {
                            condition =  (filterValue == todoValue)
                        }
                        doesSatisfy = condition;
                    }

                } 
            });
            // console.log("does satisfy: " + doesSatisfy)
            return doesSatisfy;
        });

}