//Import hooks, routers
import { useReducer, useEffect } from 'react';
import {Routes, Route, useNavigate} from "react-router-dom";

import axiosInstance from './Axios/axios';

//Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

//Import Components
import AllTodos from './components/todofilters/AllTodos';
import ActiveTodos from './components/todofilters/ActiveTodos';
import CompletedTodos from './components/todofilters/CompletedTodos';

//Import Reducer
import todosReducer from './reducer/todosReducer';
import toastReducer from './reducer/toastReducer';
//import tokenReducer from './reducer/tokenReducer';
import userReducer from './reducer/userReducer';

//Import Context
import TodosContext from './context/TodosContext';
import ToastContext from './context/ToastContext';
import UserAuthContext from './context/UserAuthContext';

export default function App() {
    const navigate = useNavigate();
    const [toast, toastDispatch] = useReducer(toastReducer, {showToast: false, success: false, message: ""});
    const [todos, todosDispatch] = useReducer(todosReducer, []);
    //const [accessToken, tokenDispatch] = useReducer(tokenReducer, "");
    const [sessionUser, userDispatch] = useReducer(userReducer, {});
    //const [hasAccessToken, setHasAccessToken] = useState(sessionStorage.getItem("accessToken") != null);
    
    //console.log("FROM APP");
    //console.log("Has Access Token: ", hasAccessToken)
    /*
    useEffect(() => {
        const verifyCookie = async () => {
            console.log("Original Verify Cookie");
            try {
                const {data} = await axios.post("http://localhost:5000/user/verify", {isTodo: false}, {withCredentials: true});
                
                //console.log(data);
                const {status, message} = data;
                //console.log(status);
                //console.log(message);
                //console.log(hasToken);
                if (status) {
                    //console.log("Has Token")
                    const {username} = data;
                    setUserName(username);
                    setHasToken(true);
                }
                
            } catch(error) {
                //console.log("error");
            }
            
        }
        verifyCookie();
    }, [])
    */

    /**
     * Verify refresh cookies and create a new access token
     * Store the new access token in  session storage
     * If refresh token is invalid or does not exist, send user to the login screen
     */
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                console.log("Verifying Refresh Cookie!");
                const response = await axiosInstance.post("/user/verifyCookie");
                //console.log("Response: ", response.data)
                const {accessToken, user} = response.data;
                sessionStorage.setItem("accessToken", accessToken);
                userDispatch({type: "SET_USER", user});
                
                //tokenDispatch({type: "SET_TOKEN", accessToken});
    
            } catch(error) {
               //console.log("Verify Cookie Error: ", error);
                //Send user back to login screen if refresh token is not found, invalid, or expired
                navigate("/login");
            }
        }
        verifyAuth();
    }, [])
    
    //console.log("Session User: ", sessionUser);
    /*
    if(sessionStorage.getItem("accessToken")) {
        console.log("Sesson exist: ", sessionStorage.getItem("accessToken") )
    }
    */

    return (
        <div>
            <ToastContext.Provider value={{toast, toastDispatch}}>
                <TodosContext.Provider value={{todos, todosDispatch}}>
                    <UserAuthContext.Provider value={{sessionUser, userDispatch}}>
                        <Routes>
                            <Route path="/*" element={(sessionStorage.getItem("accessToken")) ? <Home /> : <Login />}>
                                <Route index element={<AllTodos/>}/>
                                <Route path="activeTodos" element={<ActiveTodos/>}/>
                                <Route path="completedTodos" element={<CompletedTodos/>}/>
                            </Route>
                            <Route path="/login" element={<Login />}/>
                            <Route path="/signup" element={<Signup />}/>
                        </Routes>
                    </UserAuthContext.Provider>
                </TodosContext.Provider>
            </ToastContext.Provider>

        </div>
    )

}