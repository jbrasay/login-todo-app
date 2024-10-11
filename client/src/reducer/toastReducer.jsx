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
        case "Hide": {
            return {...toast, showToast: false}
        }
    }
}