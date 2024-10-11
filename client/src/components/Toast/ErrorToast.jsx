import { Toast } from "flowbite-react"
import { useContext } from "react";
import {HiExclamation} from "react-icons/hi"
import ToastContext from "../../context/ToastContext";

export default function ErrorToast() {
    const {toast, toastDispatch} = useContext(ToastContext);
    //const handleOnDismiss = () => (toastDispatch({type: "Hide"}));
    return (
        <div>
            <Toast className="w-full bg-slate-200">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-200 text-red-700">
                    <HiExclamation className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{toast.message}</div>
            </Toast>
        </div>
    )
}