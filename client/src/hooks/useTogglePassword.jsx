import { useState } from "react"

/**
 * Toggle for revealing a password on the login and sign up screen
 * 
 * @param {*} initialState The initial state for Toggle Password
 * @returns The state and the function to change the state
 */
export default function useTogglePassword(initialState = false) {
    const [showPassword, setState] = useState(initialState);

    const handleTogglePassword = (e) =>{
        e.preventDefault(); 
        setState(!showPassword);
    }

    return [showPassword, {setTogglePassword: handleTogglePassword}]
}


