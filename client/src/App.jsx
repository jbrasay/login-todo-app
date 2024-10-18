//Import hooks, routers
import { useReducer, useEffect } from 'react';
import {Routes, Route, useNavigate} from "react-router-dom";
//Import axios instance
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
import userReducer from './reducer/userReducer';
//Import Context
import TodosContext from './context/TodosContext';
import ToastContext from './context/ToastContext';
import UserAuthContext from './context/UserAuthContext';

export default function App() {
    const navigate = useNavigate();
    const [toast, toastDispatch] = useReducer(toastReducer, {showToast: false, success: false, message: "", duration: 1000, showToggle: false, showInfinite: false});
    const [todos, todosDispatch] = useReducer(todosReducer, []);
    const [sessionUser, userDispatch] = useReducer(userReducer, {});
 
    /**
     * Verify refresh cookies and create a new access token
     * Store the new access token in  session storage
     * If refresh token is invalid or does not exist, send user to the login screen
     */
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await axiosInstance.post("/user/verifyCookie");
                //console.log("Response: ", response.data)
                if (response) {
                    const {accessToken, user} = response.data;
                    //Store access token in session storage
                    sessionStorage.setItem("accessToken", accessToken);
                    //Store user in user reducer variable
                    userDispatch({type: "SET_USER", user});
                }
            } catch(error) {
               //console.log("Verify Cookie Error: ", error);
                //Send user back to login screen if refresh token is not found, invalid, or expired
                navigate("/login");
            }
        }
        verifyAuth();
    }, [])

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