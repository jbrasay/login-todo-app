import { useContext } from "react"
import TodoContext from "../../context/TodosContext"
import Todo from "../Todo";

export default function ActiveTodos() {
    const {todos, todosDispatch} = useContext(TodoContext);

    /*
    const newTodos = todos.map((data, index) => {
       return (!data.todoStatus && <Todo key={data._id} data={data} index={index}/> );
    })
    */

    const newTodos = todos.filter(todo => todo.todoStatus == false).map((data, index) => {
        return <Todo key={data._id} data={data} index={index}/>
    });

    console.log("Active Todos: " + newTodos.length);
    return (
        <div>
            <h1>Active Todos</h1>
            {(newTodos.length !== 0) ? 
                (newTodos) :
                (<h1>No Active Todos Found!</h1>)
            }
        </div>
    )
}