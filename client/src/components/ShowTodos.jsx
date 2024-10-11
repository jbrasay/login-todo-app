import { Outlet } from "react-router-dom";
import axios from "axios";
import FilterTodos from "./FilterTodos";
import { useContext, useEffect } from "react";
import TodosContext from "../context/TodosContext";


export default function ShowTodos() {
    const {todos, todosDispatch} = useContext(TodosContext);

    //Initialize Todos
    useEffect(() => {
        const getTodos = async () => {
            try {
                console.log("Fetching Todos");
                const {data} = await axios.get("http://localhost:5000/todo/getAllTodos", {
                    params:{
                        isTodo: true
                    },
                    withCredentials: true,
                });
                //console.log(data);
                todosDispatch({type: "SET_TODOS", payload: data.data });
                

            } catch(error) {
                console.log(error);
            }
        }
        getTodos();

    }, [])
    //console.log(todos);
    return (
        <div className="px-4 pb-10">
            <FilterTodos/>
            <Outlet/>
        </div>
    )
 
}