import {Link, useNavigate} from "react-router-dom"
import axios from "axios";
import { useContext } from "react";
import ToastContext from "../../context/ToastContext";
import FilterContext from "../../context/FilterContext";

export default function Header({username}) {
    const navigate = useNavigate();
    const {toast, toastDispatch} = useContext(ToastContext);
    const {currentFilter, setCurrentFilter} = useContext(FilterContext);

    //Logout user, send a post to logout route to remove cookies and change page to the login screen
    const logout = async () => {
        try {
            const {data} = await axios.post("http://localhost:5000/user/logout", {}, {withCredentials: true});
            const {message, success} = data;
            toastDispatch({type:"Show", success: success, message: message})
            setTimeout(() => {
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
                            <summary className="text-xl">Welcome! <span className="font-bold text-red-700">{username}</span></summary>
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
