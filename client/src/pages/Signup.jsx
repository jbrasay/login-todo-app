import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ShowToast from "../components/Toast/ShowToast";
import {HiEye, HiEyeSlash} from "react-icons/hi2"
import { Button, Label, TextInput } from "flowbite-react";
import ToastContext from "../context/ToastContext";


export default function Signup() {
    const navigate = useNavigate();
    const {toast, toastDispatch} = useContext(ToastContext);
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState({
        email: "",
        username: "",
        password: ""
    })
    const {email, username, password} = inputValue;

    //Store user input entered from the input field
    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setInputValue(prevInputValue => {
            return ({
                ...prevInputValue,
                [name]: value
            })
        })

    }

    //Reveal or hide password
    const handleShowPassword = (e) => {
        e.preventDefault();
        if (showPassword) {
            setShowPassword(false);
        }
        else {
            setShowPassword(true);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //console.log(inputValue);
            //Send cookies
            const {data} = await axios.post("http://localhost:5000/user/signup", {...inputValue,}, { withCredentials: true });
            const {success, message} = data;
            toastDispatch({type: "Show", success: success, message: message});
            setTimeout(() => {
                toastDispatch({type: "Hide"});
                navigate("/");
            }, 1000)
            //console.log(data);
        }catch(error) {
            //console.log(error);           
            const { data } = error.response;
            const {success, message} = data;
            //console.log(data);
            toastDispatch({type: "Show", success: success, message: message});
        }
    }

    return (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-r from-gray-300 to-slate-200">
            <div className="flex flex-col w-1/6 h-1/2 m-auto px-3.5 bg-white shadow-2xl rounded-lg">   
                <h1 className="text-center text-3xl font-bold text-sky-500 pt-10">Sign Up</h1>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="flex flex-col py-2">
                        <div className="my-2">
                            <Label htmlFor="email" className="text-lg font-normal">Email</Label>
                        </div>
                        <TextInput type="email" id="email" name="email" value={email} placeholder="Enter your email" onChange={handleOnChange}></TextInput>
                    </div>
                    <div className="flex flex-col py-2">
                        <div className="my-2">
                            <Label htmlFor="username" className="text-lg font-normal">Username</Label>
                        </div>
                        <TextInput type="text" id="username" name="username" value={username} placeholder="Enter your username" onChange={handleOnChange}></TextInput>
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
                    <Button type="submit" className="bg-sky-500 w-28 m-auto mt-4 font-bold">Sign Up</Button>
                    <div className="flex flex-row mt-5">
                        <p className="font-normal text-lg">Already have an account? <Link to="/login" className="font-semibold text-red-700">Login</Link></p>
                    </div>
                </form>
                {toast.showToast && <ShowToast/>}
            </div>
        </div>
    )
}