import { useReducer, useState, useEffect } from 'react'
import {Routes, Route, useNavigate} from "react-router-dom"

import axios from 'axios'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AllTodos from './components/todofilters/AllTodos'
import ActiveTodos from './components/todofilters/ActiveTodos'
import CompletedTodos from './components/todofilters/CompletedTodos'
import todosReducer from './reducer/todosReducer'
import TodosContext from './context/TodosContext'
import toastReducer from './reducer/toastReducer'
import ToastContext from './context/ToastContext'
import UserNameContext from './context/UserNameContext' 
import TokenContext from './context/TokenContext'

export default function App() {
    const navigate = useNavigate();
    const [toast, toastDispatch] = useReducer(toastReducer, {showToast: false, success: false, message: ""});
    const [todos, todosDispatch] = useReducer(todosReducer, []);
    const [username, setUserName] = useState("");
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const verifyCookie = async () => {
            try {
                const {data} = await axios.post("http://localhost:5000/user/verify", {isTodo: false}, {withCredentials: true});
                //console.log(data);
                const {status, message} = data;
                console.log(status);
                console.log(message);
                console.log(hasToken);
                if (status) {
                    console.log("Has Token")
                    const {username} = data;
                    setUserName(username);
                    setHasToken(true);
                }
                
            } catch(error) {
                console.log("error");
            }
            
        }
        verifyCookie();
    }, [username, hasToken])

    return (
        <div>
            <ToastContext.Provider value={{toast, toastDispatch}}>
                <TokenContext.Provider value={{setHasToken}}>
                    <UserNameContext.Provider value={{username, setUserName}}>
                        <TodosContext.Provider value={{todos, todosDispatch}}>
                            <Routes>
                                <Route path="/*" element={hasToken ? <Home /> : <Login />}>
                                    <Route index element={<AllTodos/>}/>
                                    <Route path="activeTodos" element={<ActiveTodos/>}/>
                                    <Route path="completedTodos" element={<CompletedTodos/>}/>
                                </Route>
                                <Route path="/login" element={<Login />}/>
                                <Route path="/signup" element={<Signup />}/>
                            </Routes>
                        </TodosContext.Provider>
                    </UserNameContext.Provider>
                </TokenContext.Provider>
            </ToastContext.Provider>

        </div>
    )

}