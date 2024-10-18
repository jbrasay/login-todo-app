export default function toastReducer(toast, action) {
    switch(action.type) {
        case "Show": {
            return (
                {
                    ...toast,
                    showToast: true,
                    success: action.success,
                    message: action.message
                }
            )
        }
        case "SHOW_TOGGLE": {
            return (
                {
                    ...toast,
                    showToast: true,
                    success: action.success,
                    message: action.message,
                    showInfinite: false,
                    showToggle: true
                }
            )
        }
        case "SHOW_INFINITE": {
            return (
                {
                    ...toast,
                    showToast: true,
                    success: action.success,
                    message: action.message,
                    showToggle: false,
                    showInfinite: true
                }
            )
        }
        case "Hide": {
            return {...toast, showToast: false}
        }
    }
}