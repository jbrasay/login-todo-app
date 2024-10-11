import { useEffect, useReducer, useState, useContext} from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import ShowToast from "../components/Toast/ShowToast";
import MyNavBar from "../components/navbars/MyNavBar";
import AddTodos from "../components/AddTodos";
import ShowTodos from "../components/ShowTodos";
import ToastContext from "../context/ToastContext";
import FilterContext from "../context/FilterContext";


export default function Home() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const {toast} = useContext(ToastContext);
    const [currentFilter, setCurrentFilter] = useState("All");

    useEffect(() => {
        const verifyCookie = async () => {
            const {data} = await axios.post("http://localhost:5000/user/verify", {isTodo: false}, {withCredentials: true});
            //console.log(data);
            const {status, message} = data;
            console.log(message);
            if (!status) {
                navigate("/login");
            }
            const {username} = data;
            setUsername(username);
            
        }
        verifyCookie();
    }, [username])


    return  (
        <FilterContext.Provider value={{currentFilter, setCurrentFilter}}>
            <div className="h-screen flex flex-col bg-gradient-to-r from-gray-300 to-slate-200">       
                <MyNavBar username={username}/>
                <div className="flex flex-col justify-center mx-auto h-1/6 w-1/6">
                    {toast.showToast && <ShowToast className=""/>}
                </div>
                <div className="mt-10 px-20 w-2/5 mx-auto bg-white shadow-xl">
                    <AddTodos/>
                    <ShowTodos />
                </div>
            </div>
        </FilterContext.Provider>
    )
}