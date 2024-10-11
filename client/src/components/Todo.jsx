import { TextInput, Button } from "flowbite-react";
import { useContext, useState } from "react";
import axios from "axios";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineCheckBox , MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { GiPencil } from "react-icons/gi";
import { FaRegSave } from "react-icons/fa";
import TodosContext from "../context/TodosContext";
import ToastContext from "../context/ToastContext";


export default function Todo({data, index}) {
    //console.log(data);
    const [isEditing, setIsEditing] = useState(false);
    const [todoDescInput, setTodoDescInput] = useState(data.todoDesc);
    const {todosDispatch} = useContext(TodosContext);
    const {toastDispatch} = useContext(ToastContext);

    //Change the status of the todo
    const handleChangeStatus = async () => {
        try {
            const response = await axios.patch("http://localhost:5000/todo/changeTodoStatus", {
                isTodo: true,
                todoID: data._id,
                todoStatus: !data.todoStatus
            }, {withCredentials: true})
            console.log(response.data)
            const {message, success} = response.data;
            todosDispatch({type: "CHANGE_STATUS", todoID: data._id, todoStatus: data.todoStatus})
            toastDispatch({type:"Show", success: success, message: message});
        } catch(error) {
            console.log(error);
        }
    }

    //Change description of the todo
    const handleEditing = async () => {
        //Editing is set to true, show save button. When clicked, update database and state
        if (isEditing && todoDescInput.length > 0) {
            try {
                //Only update if description is changed
                if (todoDescInput != data.todoDesc) {
                    const response = await axios.patch("http://localhost:5000/todo/changeTodoDesc", {
                        isTodo: true,
                        todoID: data._id,
                        todoDesc: todoDescInput
                    }, {withCredentials: true})
                    const {message, success} = response.data;
                    //console.log(response.data);
                    todosDispatch({type: "CHANGE_DESC", todoID: data._id, todoDesc: todoDescInput })
                    toastDispatch({type:"Show", success: success, message: message});
                }
                setIsEditing(false);
            } catch(error) {
                console.log(error);
            }
            
        }
        else {
            setIsEditing(true);
        }
    }

    //Remove todo from the database and state
    const handleRemoveTodo = async () => {
        try {
            const response = await axios.delete("http://localhost:5000/todo/removeTodo", {
                params:{
                    isTodo: true,
                    todoID: data._id
                },
                withCredentials: true,
            });
            const {message, success} = response.data;
            todosDispatch({type:"REMOVE_TODO", todoID: data._id});
            toastDispatch({type:"Show", success: success, message: message});
            //console.log(response.data);
            //console.log(data._id)
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className="flex flex-row w-full py-5 mx-auto font-light border-b-2 text-black text-lg">
            <div className="flex flex-row flex-1 w-10/12 items-center">
                <div className="flex flex-col px-2">
                    {data.todoStatus ? 
                        (<button onClick={handleChangeStatus} className="w-fit text-emerald-500"><MdOutlineCheckBox /></button>):
                        (<button onClick={handleChangeStatus} className="w-fit"><MdOutlineCheckBoxOutlineBlank /> </button>)
                    }
                </div>
                <div className="flex-1">
                    {isEditing ? 
                        (<input type="text" className="w-1/2" value={todoDescInput} onChange={(e) => {setTodoDescInput(e.target.value)}} placeholder="Please enter a description to save!" />) :
                        (<p className="w-full">{data.todoDesc}</p>)
                    }
                </div>
            </div>

            <div className="flex flex-row items-center">
                <div>
                    {isEditing ?
                        (<button className="w-fit flex flex-row items-center" onClick={handleEditing}><FaRegSave className="mr-1" /> <span className="mr-1">Save</span></button>) :
                        (<button className="w-fit flex flex-row items-center" onClick={handleEditing} ><GiPencil className="mr-1"/><span className="mr-1">Edit</span></button>)
                    }
                </div>
                <button className="ml-4 text-red-500" onClick={handleRemoveTodo}><RiDeleteBin5Line /></button>
            </div>
        </div>
    )
}