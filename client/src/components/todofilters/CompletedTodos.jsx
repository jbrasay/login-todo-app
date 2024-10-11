import { useContext } from "react"
import TodosContext from "../../context/TodosContext"
import Todo from "../Todo";

export default function CompletedTodos() {
    const {todos, todosDispatch} = useContext(TodosContext);
    /*
    const newTodos = todos.map((data, index) => {
        //If todo is completed return todo
        if (data.todoStatus) {
            return (<Todo key={data._id} data={data} index={index}/>)
        }
    })
    */
    const newTodos = todos.filter(todo => todo.todoStatus == true).map((data, index) => {
        return <Todo key={data._id} data={data} index={index}/>
    });
    console.log("Completed Todos: " + newTodos.length);
    return (
        <div>
            <h1>Completed Todos</h1>
            {(newTodos.length !== 0) ? 
                (newTodos) :
                (<h1>No Completed Todos Found!</h1>)
            }
        </div>
    )
}