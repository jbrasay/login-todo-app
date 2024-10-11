import { Button, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import axios from "axios";
import ToastContext from "../context/ToastContext";
import TodosContext from "../context/TodosContext";

export default function AddTodos() {
    const [todoDesc, setTodoDesc] = useState("");
    const {toastDispatch} = useContext(ToastContext);
    const {todosDispatch} = useContext(TodosContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        addTask(todoDesc);
        setTodoDesc("");

    }
    const addTask = async (todoToAdd) => {
        console.log(todoDesc);
        try {
            const {data} = await axios.post("http://localhost:5000/todo/addTodo", {
                isTodo: true,
                todoDesc: todoToAdd,
                todoStatus: false,
            }, {withCredentials: true});
            const {message, success, resData} = data;
            //console.log(resData);
            todosDispatch({type:"ADD_TODO", resData: resData});
            toastDispatch({type:"Show", success: success, message: message});
        } catch(error) {
            //console.log(error);
            const {data} = error.response;
            const {message, success} = data;
            toastDispatch({type:"Show", success: success, message: message});
            ///console.log(message);
        }
    }
    //console.log(todos)
    return (
        <div className=" pt-20 pb-10 border-b-2 ">
            <form className="m-auto flex flex-col w-11/12 relative" onSubmit={handleSubmit}>
                <div className="">
                    <TextInput 
                    className="w-full h-full" 
                    type="text" 
                    value={todoDesc} 
                    placeholder="Add new todo..." 
                    onChange={(e) => {setTodoDesc(e.target.value)}}/>
                </div>
                <div className="absolute m-auto top-0 bottom-0 right-2.5 w-12 h-8">
                    <Button type="submit" className="w-full h-full items-center font-normal">Add</Button>
                </div>
            </form>
        </div>
    )
}