import { useContext } from "react";
import TodosContext from "../../context/TodosContext";
import Todo from "../Todo";

export default function AllTodos() {
    const {todos, todosDispatch} = useContext(TodosContext);
    //console.log("From ALL TODOS");
    //console.log(todos);

    const newTodos = todos.map((data, index) => {
        //console.log(data);
        return (<Todo key={data._id} data={data} index={index}/>)
    })

    return (
        <div>
            <h1>All Todos</h1>
             {(newTodos.length !==0) ?
                (newTodos) :
                (<h1>No Task Found!</h1>)    
            }
        </div>
    )
}