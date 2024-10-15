//Import react hooks, routers
import { useState, useContext} from "react";
//Import componentns
import ShowToast from "../components/Toast/ShowToast";
import Header from "../components/navbars/Header";
import AddTodos from "../components/AddTodos";
import ShowTodos from "../components/ShowTodos";
//Import context
import ToastContext from "../context/ToastContext";
import FilterContext from "../context/FilterContext";



export default function Home() {
    const {toast} = useContext(ToastContext);
    const [currentFilter, setCurrentFilter] = useState("All");

    return  (
        <FilterContext.Provider value={{currentFilter, setCurrentFilter}}>
            <div className="h-screen flex flex-col bg-gradient-to-r from-gray-300 to-slate-200">       
                <Header/>
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