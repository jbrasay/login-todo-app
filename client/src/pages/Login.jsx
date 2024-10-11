import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import ShowToast from "../components/Toast/ShowToast";
import {HiEye, HiEyeSlash} from "react-icons/hi2"
import { Button, Label, TextInput } from "flowbite-react";
import ToastContext from "../context/ToastContext";
import TokenContext from "../context/TokenContext";
import UserNameContext from "../context/UserNameContext";

export default function Login() {
    const navigate = useNavigate();
    const {toast, toastDispatch} = useContext(ToastContext);
    const {setUserName} = useContext(UserNameContext)
    const {setHasToken} = useContext(TokenContext);
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const {email, password} = inputValue;
    

    //Update input value
    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setInputValue(prevInputValue => {
            return({
                ...prevInputValue,
                [name]: value,
            })
        })
    }
    
    const handleShowPassword = (e) => {
        e.preventDefault();
        if (showPassword) {
            setShowPassword(false);
        }
        else {
            setShowPassword(true);
        }
    }

    const handleSubmit = async function(e) {
        e.preventDefault();
        //console.log(inputValue);
        try {
            
            const {data} = await axios.post("http://localhost:5000/user/login", {...inputValue}, {withCredentials: true});
            console.log(data);
            const {success, message, user} = data;
            //console.log(response);
            toastDispatch({type: "Show", success: success, message: message});
            setHasToken(true);
            setUserName(user.username)
            setTimeout(() => {
                toastDispatch({type: "Hide"});
                navigate("/");
            }, 1000)
        }catch(error) {
            //console.log(error);
            const { data } = error.response;
            const {success, message} = data;
            //console.log("Success: " + success);
            //console.log("Message: " + message);
            toastDispatch({type: "Show", success: success, message: message});
        }

    }

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
                        <div className="relative flex flex-row">
                            <TextInput className="w-screen" type={showPassword ? "text" : "password"} id="password" name="password" value={password} placeholder="Enter your password" onChange={handleOnChange}></TextInput>
                            <button className="absolute right-2.5 inset-y-0" onClick={handleShowPassword}>{showPassword ? <HiEye/> : <HiEyeSlash/>}</button>
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