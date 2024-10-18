//Import react hooks, routers
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
//Import axios instance
import axiosInstance from "../Axios/axios";
//Import React Icons
import {HiEye, HiEyeSlash} from "react-icons/hi2"
//Import flowbite-react Components
import { Button, Label, TextInput } from "flowbite-react";
//Import Components
import ShowToast from "../components/Toast/ShowToast";
//Import Context
import ToastContext from "../context/ToastContext";
import UserAuthContext from "../context/UserAuthContext"
//Import custom hooks
import useTogglePassword from "../hooks/useTogglePassword";

export default function Login() {
    const navigate = useNavigate();
    const {toast, toastDispatch} = useContext(ToastContext);
    const {userDispatch} = useContext(UserAuthContext);
    const [showPassword, {setTogglePassword}] = useTogglePassword();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const {email, password} = inputValue;
    

    //Store user input entered from the input fields
    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setInputValue(prevInputValue => {
            return({
                ...prevInputValue,
                [name]: value,
            })
        })
    }

    /**
     * Submit input to the server, login user if successful
     * Show toast for error message
     */
    const handleSubmit = async function(e) {
        //Prevent page from refreshing
        e.preventDefault();
        //console.log(inputValue);
        toastDispatch({type: "SHOW_INFINITE", success: true, message: "Logging In..."});
        try {
            //Send input value to the server
            const response = await axiosInstance.post("/user/login", {...inputValue});
            //console.log("Data: ", data);
            if (response) {
                const {success, message, user, accessToken} = response.data;
                sessionStorage.setItem('accessToken', accessToken);
                userDispatch({type: "SET_USER", user});
                //console.log(response);

                //Show toast  
                toastDispatch({type: "Show", success: success, message: message});

                setTimeout(() => {
                    toastDispatch({type: "Hide"});
                    navigate("/");
                }, 1000);
            }
        } catch(error) {
            //console.log("Error: ", error);
            //console.log("Status Code: ", error.response.status);
            const { data } = error.response;
            const {success, message} = data;
            //console.log("Success: " + success);
            //console.log("Message: " + message);
            //Show error message as toast
            toastDispatch({type: "Show", success: success, message: message});
        }

    }
    //console.log("Session User: ",sessionUser);

    return (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-r from-gray-300 to-slate-200">
            <div className="flex flex-col w-1/6 h-1/2 m-auto px-3.5 bg-white shadow-2xl rounded-lg">
                <h1 className="text-center text-3xl font-bold text-sky-500 pt-10">Login</h1>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="flex flex-col py-2">
                        <div className="my-2">
                            <Label htmlFor="email" className="text-lg font-normal">Email</Label>
                        </div>
                        <TextInput type="email" id="email" name="email" value={email} placeholder="Enter your email" onChange={handleOnChange}></TextInput>
                    </div>
                    <div className="flex flex-col py-2">
                        <div className="my-2">
                            <Label htmlFor="password" className="text-lg font-normal">Password</Label>
                        </div>
                        {/*Reveal password as text or hide password after clicking icon button. Change icon button depending on the show password state*/}
                        <div className="relative flex flex-row">
                            <TextInput className="w-screen" type={showPassword ? "text" : "password"} id="password" name="password" value={password} placeholder="Enter your password" onChange={handleOnChange}></TextInput>
                            <button className="absolute right-2.5 inset-y-0" onClick={setTogglePassword}>{showPassword ? <HiEye/> : <HiEyeSlash/>}</button>
                        </div>
                    </div>
                    <Button type="submit" className="bg-sky-500 w-28 m-auto mt-4 font-bold">Login</Button>
                    <div className="flex flex-row mt-5">
                        <p className="font-normal text-lg">Don't have an account? <Link to="/signup" className="font-semibold text-red-700">Register</Link> </p>
                    </div>
                </form>
                {toast.showToast && <ShowToast/>}
            </div>
        </div>
    )
}