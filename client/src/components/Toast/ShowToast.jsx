import { Toast } from "flowbite-react"
import {HiCheck, HiExclamation} from "react-icons/hi"
import ToastContext from "../../context/ToastContext";
import { useContext} from "react"

export default function ShowToast() {
    const {toast, toastDispatch} = useContext(ToastContext);
    //Close the toast after 1 second
    if (!toast.showToggle || !toast.showInfinite) {
        setTimeout(()=> {
            toastDispatch({type: "Hide"});
        }, toast.duration)
    }

    //Show toast
    return (
        <div>
            <Toast className="w-full bg-slate-200">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ">
                    {toast.success ? 
                        (<HiCheck className="h-5 w-5 bg-green-100 text-green-500" />) :
                        (<HiExclamation className="h-5 w-5 bg-orange-100 text-red-500" />)    
                    }
                </div>
                <div className="ml-3 text-sm font-normal">{toast.message}</div>
                {toast.showToggle ? <Toast.Toggle/> : null}
            </Toast>
        </div>
    )
}