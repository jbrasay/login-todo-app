import { useReducer, useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
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

export default function App() {
    const [toast, toastDispatch] = useReducer(toastReducer, {showToast: false, success: false, message: ""});
    const [todos, todosDispatch] = useReducer(todosReducer, []);

    return (
        <div>
            <ToastContext.Provider value={{toast, toastDispatch}}>
                <TodosContext.Provider value={{todos, todosDispatch}}>
                    <Routes>
                        <Route path="/*" element={<Home />}>
                            <Route index element={<AllTodos/>}/>
                            <Route path="activeTodos" element={<ActiveTodos/>}/>
                            <Route path="completedTodos" element={<CompletedTodos/>}/>
                        </Route>
                        <Route path="/login" element={<Login />}/>
                        <Route path="/signup" element={<Signup />}/>
                    </Routes>
                </TodosContext.Provider>
            </ToastContext.Provider>

        </div>
    )

}