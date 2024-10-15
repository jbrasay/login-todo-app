//Import react hooks, routers
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
//Import axios instance
import axiosInstance from "../Axios/axios";


//Import components
import FilterTodos from "./FilterTodos";

//Import Context
import TodosContext from "../context/TodosContext";


export default function ShowTodos() {
    const navigate = useNavigate();
    const {todosDispatch} = useContext(TodosContext);

    //Initialize Todos
    useEffect(() => {
        const getTodos = async () => {
            try {
                //console.log("Fetching Todos");
                const {data} = await axiosInstance.get("/todo/getAllTodos")
                //console.log(data);
                todosDispatch({type: "SET_TODOS", payload: data.data });
            } catch(error) {
                console.log("Error: ", error);
                console.log("Status code: ", error.response.status)
                //Send user to the login screen if unable to renew access token
                navigate("/login");
            }
        }
        getTodos();
    },[])
    //console.log(todos);
    return (
        <div className="px-4 pb-10">
            <FilterTodos/>
            <Outlet/>
        </div>
    )
 
}