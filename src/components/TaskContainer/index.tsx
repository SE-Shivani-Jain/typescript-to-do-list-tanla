// @ts-nocheck
import * as React from 'react';
import h from 'react-dom';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import moment from "moment";
import './taskContainer.scss';
import getFilteredTodos from "../../utils/getFilteredTodos";
import sortToDos from "../../utils/sortToDos";


import { 
    TodoFieldNames, 
    Todo, 
    TodoTableProps, 
    Order, 
    TodoTableHeadProps, 
    HeadCell, 
    TodoIds, 
    TodoId, 
    TaskTypeFields,
    taskType,
    TaskTypeList,
    FilterObj} from "./type";
import { addTaskType, getEmptyToDo, saveToLocalStorage, useTodoStore} from "../../store";
import { createSelectors } from "../../store/createSelectors";
import { Button, Input } from "@mui/material";

const headCells: HeadCell[] = [
    {
        id: TodoFieldNames.DONE,
        numeric: false,
        disablePadding: false,
        label: "Status",
        type: "checkbox"
    },
    {
      id: TodoFieldNames.TITLE,
      numeric: false,
      disablePadding: true,
      label: 'Title',
      type: "text"
    },
    {
      id: TodoFieldNames.TASK_TYPE,
      numeric: true,
      disablePadding: false,
      label: 'Type',
      type: "number",
    //   nameParts: [TaskTypeFields.NAME, TaskTypeFields.COLOR_CODE],
	//   keyName: TodoFieldNames.TASK_TYPE,
    //   isForeignKey: true,
    //   forgein_key_info: {
    //         tableName: 'taskTypes',
    //         foreignKeyName: TaskTypeFields.ID
    //   },
      
      customComponents: {
        valueComponent: ColorCodeValue,
        inputComponent: ColorCodeInput
      }

    },
    {
      id: TodoFieldNames.DUE_DATE,
      numeric: true,
      disablePadding: false,
      label: 'Due Date',
      type: "datetime-local",
      formatFn: (value) =>  moment(value).format('h:mm a, MMM Do YYYY')
  
    },
    {
      id: TodoFieldNames.ESTIMATE,
      numeric: true,
      disablePadding: false,
      label: "Estimate",
      type: "number"
    }
   
  ];


// main component
export default function TodoTable() {
    // props - heading, todoList, todoFields 
    // state - order, orderBy

    const todoListMap = useTodoStore((state) => state.todoListMap);
    const todoIds = useTodoStore((state) => state.todoIds);
    const addTodo = useTodoStore((state) => state.addTodo);
    const storeState = useTodoStore((state) => state);

    // console.log("todolist map: " +  todoListMap?.keys());

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Todo>(TodoFieldNames.DUE_DATE);
    const [filter, setFilter] = React.useState<Partial<Todo>>({
      status: undefined
    });
  
    React.useEffect(() => {
      return () => {
        // saveToLocalStorage(storeState);
      }
    }, []);

    // const [todoIds, setTodoIds] = React.useState<TodoIds>([]);

    // React.useEffect(() => {
    //     todoIds = [];
    //     for (let id of todoListMap?.keys()) {
    //         todoIds.push(id);
    //     }
    //     // console.log("todoIds: " + todoIds);
    // }, [todoListMap?.keys()])


    

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Todo,
      ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };

    // return <div> hey</div>
    return <React.Fragment>

    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Header heading = {"Time Tracker"} />
        <TableContainer>
        <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'// : 'medium'}
          >
            <TodoTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells = {headCells}
            />
            <TableBody>
                {/* <TodoRowUI todo={getEmptyToDo()} isNew = {true}/> */}

                {sortToDos(getFilteredTodos(filter, todoIds, todoListMap), order, orderBy, headCells, todoListMap).map((todoId: TodoId, index: number) => {
                    const todo = todoListMap.get(todoId);
                      //  console.log("todo: " + todo);
                    return <TodoRowUI key = {todoId} todo={todo}/>

                })}
            </TableBody>
            
        </Table>
        </TableContainer>
        </Paper>
    </Box>
    <Button onClick={(e) => {
        setFilter({
          
        })
        addTodo();
    }}>Add new</Button>

    <TaskTypesList/>
    <TodoFilter {...{filter, setFilter}}/>
    </React.Fragment>

   
}



function TodoFilter({setFilter, filter}: {filter: FilterObj, setFilter: (filterObj: FilterObj) => void}) {
  // let filterObj: FilterObj = {};
  // const [filterObj, setFilterObj] = React.useState<FilterObj>({});

  function filterList(filterObj) {
    setFilter({...filterObj});
  }

  return <div className="todoFilters">
  <Header heading="Todo Filters"/>
  <form 
    role = "form" 
    onSubmit={(e) => {
      e.preventDefault();
      // filterList();
      
      // filterObj = {};
    }}
  >
      {headCells.map((headCell) => {
        return <label className="filterLabel" key={headCell.id + '_filter'}>
          {`${headCell.label} ${[TodoFieldNames.ESTIMATE, TodoFieldNames.DUE_DATE].includes(headCell.id)? "less than": ""} `}
          <InputField {...{ headCell, placeholder: headCell.label,  isFilter: true, isEmpty: false, editMode : true,
            value: filter[headCell.id],
            closeInput: (value) => {
              // filterObj[headCell.id] = value;
              // filterObj = {
              //   ...filterObj,
              //   [headCell.id]: value
              // };
              // console.log({...filterObj});
              filterList({...filter,
                [headCell.id]: value});
              

          }}}/>
        </label>
      })}
      {/* <Button type="submit"> Filter </Button> */}
      <Button type="submit" onClick = {
        () => {
          // filterObj = {};
          // setFilterObj({});
          // filterList();

          filterList({});
        }
      }> Clear </Button>

  </form>
  </div>

}

function TaskTypesList() {
  const taskTypes = useTodoStore((state) => state.taskTypes);

  // const [newTaskType, setNewTaskType] = React.useState<taskType>({id: });


  const addTaskType = useTodoStore((state) => state.addTaskType);

  const [taskTypeEntered, setTaskTypeEntered] = React.useState<boolean>(false);
  const [newTaskType, setNewTaskType] = React.useState<taskType>({
    id: -1,
    name: "",
    color_code: "#000000"
  });

  let colorInputNode: HTMLInputElement, taskTypeInputNode: HTMLInputElement;
  

  React.useEffect(() => {
    taskTypeEntered && colorInputNode.focus();
  }, [taskTypeEntered])


  return <div className="taskTypeSection">
    <Header heading = {'Task Types'} />
    
    {
      taskTypes.map((taskType) => {
        return <ColorCodeValue key = {taskType.id} {
          ...{
            taskTypeObj: taskType
          }
        }/>
      })
    }

    <input 
          type="text" 
          className="taskType taskTypeInput"  
          placeholder="Add new" 
          value={newTaskType.name}
          ref = {(node) => {
            taskTypeInputNode = node;
         }} 

          onKeyDown={(e) => {
            if(e.key === 'Enter') { 
              if(newTaskType.name) {
                // addTaskType(e.target.value, colorInputNode.value);
                setTaskTypeEntered(true);
              }
            } else {
              setTaskTypeEntered(false);

            }
          }} onChange={(e) => {
            // addTodo();
            // if(e.target.value) {
              // addTaskType(e.target.value);
              setNewTaskType({
                ...newTaskType,
                name: e.target.value
              });

            // }
        }}
    />

    {taskTypeEntered && (
      <>
      <div>Please select a Color</div>

      <input 
        type="color" 
        className="colorCodeInput"  
        placeholder="Add new"  
        ref = {(node) => {
          colorInputNode = node;
        }} 
        value={newTaskType.color_code}
        onKeyDown={(e) => {
          if(e.key === 'Enter') {
            if(newTaskType.name) {

              addTaskType(newTaskType.name, newTaskType.color_code);
              // colorInputNode.value = "";
              // setNewTaskTypeName("");

              setNewTaskType({
                id: newTaskType.id,
                name: "",
                color_code: "#000000"
              })
            }

            setTaskTypeEntered(false);


            // taskTypeInputNode.style.visibility = 'hidden';
          }
        }} 
      
        onChange={(e) => {
          // addTodo();
          setNewTaskType({
            ...newTaskType,
            color_code: e.target.value
          })
        }}/>
      </>

      )
    }
  </div>
  

}

function NewTaskTypeUI() {

}

function TodoRowUI({todo}: {todo: Todo, isNew?: boolean}) {
    const {
        id,
        title,
        due_date,
        estimate,
        taskType,
        done,
        isEmpty
    }: Todo = todo;

    const handleClick = (event: React.MouseEvent<unknown>, todo: Todo) => {
        // todoList?.get(id).

        // dispatch action to toggle status
    }

    // console.log("todo: " + todo);

    return (<TableRow
        hover
        onClick={(event) => handleClick(event, todo)}
        role="checkbox"
        aria-checked={done}
        tabIndex={-1}
        key={id}
        selected={done}
        sx={{ cursor: 'pointer' }}
    >
        {headCells.map((headCell) => {
            return <TodoTableCell key = {headCell.id} headCell = {headCell} todoId = {id} isEmpty = {todo.isEmpty} value={todo[headCell.id]}/>
        })}
    </TableRow>)
}

function TodoTableCell({headCell, todoId, value, isEmpty}: {headCell: HeadCell, todoId: TodoId, isEmpty?: boolean, value: any}) {
    
    const {
         type,
         formatFn
    } = headCell;
    const [editMode, setEditMode] = React.useState<boolean>(false);
    const editTodo = useTodoStore((state) => state.editTodo);

    const isCheckbox = type === 'checkbox';
    // let isEmpty: boolean = false;

    React.useEffect(() => {
        if(value === undefined ) {
          // console.log("todoid, headcell: " +  todoId, headCell.id) 
        } else {
            if(isCheckbox) {
                setEditMode(true);
            } else if(headCell.id === TodoFieldNames.TITLE && isEmpty) {
                setEditMode(true);
            }
        }
        
    }, [type])
     
    const valueField =  (formatFn? formatFn(value) : (typeof value === "undefined"? "-": value).toString()); 
    
    return <TableCell 
      className={`${isCheckbox? "": "todoTableCell"}`} 
      padding={type === 'checkbox'? 'checkbox': 'normal'} 
      align={headCell.numeric? "right": "left"} 
      onClick={() => {
          setEditMode(true);
     }}
    >
        {
            editMode && <InputField 
              isEmpty = {isEmpty}  
              value={valueField}
              closeInput = {(newVal, submitted = true) => {
                  editTodo(todoId, {
                      [headCell.id]: newVal,
                      isEmpty: false
                  })
                  if(!isCheckbox && submitted) {
                      setEditMode(false);
                  }
              }}
              editMode = {editMode}
              headCell = {headCell} 
              placeholder = {headCell.label} 
            />
        }

        
          <div>
            {
              ((isCheckbox || editMode)? "": (
                  headCell.customComponents?.valueComponent? <headCell.customComponents.valueComponent value={value}/>: valueField
              ))
            }
          </div>
            
        </TableCell>
}

   
function InputField({headCell, placeholder: placeholder, isEmpty,  value, editMode, closeInput, isFilter}: {
    headCell: HeadCell, 
    isEmpty?: boolean, 
    placeholder: any,
    editMode: boolean,
    value?: any,
    closeInput?: (newValue: any, submitted?: boolean| true, ) => void,
    isFilter?: boolean
}) {
    const {type} = headCell;
    // console.log("placeholder: " + placeholder);
    const [inputValue, setValue] = React.useState(value);

    const isCheckbox = type === 'checkbox';

    function getValue(e) {
        if(isCheckbox) {
          return e.target.checked;  
        } else {
          return e.target.value;

        }
    }

    React.useEffect(() => {
        isEmpty && inputNode?.focus();
    }, [isEmpty])

    React.useEffect(() => {
        editMode && !isCheckbox && inputNode?.focus();
    }, [editMode]);

    let inputNode: HTMLInputElement;

    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
        type, 
        placeholder, 
        value: inputValue, 
        onChange: (e: React.ChangeEvent) => {
        // dispatch action for edit todo
            setValue(getValue(e));

            if((isFilter || isCheckbox)) {
              closeInput && closeInput(getValue(e), false);
            }
            
            // setEditMode(false);
        },
        onKeyDown: (e) => {
            if(e.key == 'Enter') {
                e.preventDefault();
                closeInput && closeInput(getValue(e));
            }
        },
        onBlur: (e) => {
            // e.preventDefault();
            // isCheckbox &&  closeInput && closeInput(getValue(e));
        },
        checked: inputValue !== undefined && type === 'checkbox' && Boolean(JSON.parse(inputValue))
    }

    if(!isCheckbox) {
      delete inputProps.checked;
    } else {
      // console.log("here");
    }

    // console.log("placeholder: " + placeholder);

  if(headCell.customComponents?.inputComponent) {
    return <headCell.customComponents.inputComponent {...{editMode, isFilter, ...inputProps}}/>
  } else {
    return <input className="inputField" ref={(node) => {
        // @ts-expect-error
        inputNode = node;
    }} {...inputProps}/>
  }

}

function ColorCodeValue({taskTypeObj, value}: {taskTypeObj: taskType, value?: any}) {

    const taskTypes: TaskTypeList = useTodoStore((state) => state.taskTypes);
    const taskType = taskTypeObj || taskTypes.filter((type) => {
        return type.id === Number(value);
    })[0];



    // const {
    //     name
    // } = taskType;

    return <div  style={getInlineTaskTypeStyle(taskType)} className="taskType"> 
       
        <span >{taskType.name}</span>
    </div>
}

function getInlineTaskTypeStyle(taskType: taskType) {
    return {backgroundColor: taskType[TaskTypeFields.COLOR_CODE]};
}

function ColorCodeInput({ 
	editMode,
  isFilter,
	...inputProps}: {
        editMode: boolean,
        isFilter: boolean
    }) {
		// let inputNode;
    const taskTypes: TaskTypeList = useTodoStore((state) => state.taskTypes);
		
    let inputNode: HTMLInputElement;

    React.useEffect(() => {
        editMode && inputNode?.focus();
    }, [editMode]);
	

	return (
		<select className="taskTypeOption"  {...{...inputProps}}
                    // @ts-expect-error
			ref={(node)=>inputNode=node}
			>
				{editMode? taskTypes.map((taskType: taskType) => {
					// return <option style={backgroundColor: taskType[TaskTypeFields.COLOR_CODE]} key={value} value={value}>{value}</option>
                    return <TaskTypeOption key={taskType.id} {...taskType}/>
                    
				}): 
          // @ts-expect-error
          <TaskTypeOption {...taskTypes[taskTypes.indexOf(inputProps.value)]}/>
      }
      // @ts-nocheck
      {isFilter && <TaskTypeOption {...{
        id: "all",
        name: "all",
        color_code: 'none'
      }}/>}   
			    
			
			</select>
		);
}

function TaskTypeOption(taskType: taskType) {
    const {
        color_code,
        id,
        name
    } = taskType;
    return <option style={getInlineTaskTypeStyle(taskType)} key={id} value={id}>{name}</option>

}

function Header({heading}: {heading: string}) {
    return  ( <div>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 }
          }}
        >
        <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
        >
            {heading}
        </Typography>
        </Toolbar>
    </div>
    )
  }


function TodoTableHead(props: TodoTableHeadProps) {
    const { order, orderBy, onRequestSort, headCells } =
      props;

    const createSortHandler =
      (property: keyof Todo) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };
  
    return (
      <TableHead>
        <TableRow>
          
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }




function useEditModeFocus({editMode, inputNode}: {editMode: boolean, inputNode: HTMLInputElement}) {

    React.useEffect(() => {
        editMode && inputNode?.focus();
    }, [editMode])
}

