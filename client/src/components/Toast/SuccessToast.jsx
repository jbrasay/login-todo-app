import { Toast } from "flowbite-react"
import {HiCheck, HiExclamation, HiX, HiFire} from "react-icons/hi"
import { useContext } from "react";
import ToastContext from "../../context/ToastContext";

export default function SuccessToast() {
    const {toast, toastDispatch} = useContext(ToastContext);
    const handleOnDismiss = () => (toastDispatch({type: "Hide"}));

    return (
        <div>
            <Toast className="w-full bg-slate-200 ">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                    <HiCheck className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{toast.message}</div>
            </Toast>
        </div>
    )
}