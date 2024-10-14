import { useContext } from "react"
import { NavLink } from "react-router-dom"
import FilterContext from "../context/FilterContext"
export default function FilterTodos() {
    //State for what is the current filter
    const {currentFilter, setCurrentFilter} = useContext(FilterContext);

    return (
        <div className="flex justify-end"> 
            <ul className="menu menu-horizontal ">
                <li>
                    <details>
                        <summary className="font-normal text-sm">{currentFilter}</summary>
                        <ul className="bg-white rounded-none">
                            <li onClick={() => setCurrentFilter("All")}><NavLink to="/">All</NavLink></li>
                            <li onClick={() => setCurrentFilter("Active")}><NavLink to="activeTodos">Active</NavLink></li>
                            <li onClick={() => setCurrentFilter("Completed")}><NavLink to="completedTodos">Completed</NavLink></li>
                        </ul>
                    </details>
                </li>
            </ul>
        </div>
    )
}