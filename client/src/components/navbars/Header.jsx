import {Link, useNavigate} from "react-router-dom"
import { useContext } from "react";

//import axios
import axiosInstance from "../../Axios/axios";



//Import Context
import ToastContext from "../../context/ToastContext";
import FilterContext from "../../context/FilterContext";
import UserAuthContext from "../../context/UserAuthContext";


export default function Header() {
    const navigate = useNavigate();
    //const {username} = useContext(UserNameContext);
    const {toastDispatch} = useContext(ToastContext);
    const {sessionUser, accessToken} = useContext(UserAuthContext);
    const {currentFilter, setCurrentFilter} = useContext(FilterContext);

    //console.log("HEADER Session User: ", sessionUser);
    //console.log("HEADER Access Token: ", accessToken);

    /**
     * Logs off user, send a post to logout endpoint to remove cookies 
     * Remove access token from session storage
     * Change page to the login screen
     */
    const logout = async () => {
        try {
            const response = await axiosInstance.post("/user/logout"); 
            const {message, success} = response.data;
            //toastDispatch({type:"Show", success: success, message: message})
            toastDispatch({type: "SHOW_INFINITE", success: true, message: message});
            setTimeout(() => {
                sessionStorage.removeItem("accessToken");
                toastDispatch({type: "Hide"});
                navigate("/login");
            }, 1000)
        }catch(error) {
            const { data } = error.response;
            const {success, message} = data;
            toastDispatch({type: "Show", success: success, message: message});
        }
     }

    return (
        <div className="navbar bg-white shadow-2xl">
            <div className="flex-1">
                <span className="btn btn-ghost text-2xl font-bold text-sky-500" onClick={() => setCurrentFilter("All")}><Link to="/">ToDo App</Link></span>
            </div>
            <div className="pr-5 flex-none">
                <ul className="menu menu-horizontal">
                    <li>
                        <details>
                            <summary className="text-xl">Welcome! <span className="font-bold text-red-700">{sessionUser.username}</span></summary>
                            <ul className="bg-white rounded-none w-40 p-2">
                                <li><a className="btn btn-ghost text-lg font-normal" onClick={logout}>Log out</a></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    )
    
}
