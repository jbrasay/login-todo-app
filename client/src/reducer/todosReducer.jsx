export default function todosReducer(todos, action) {
    switch(action.type) {
        case "SET_TODOS": {
            return action.payload;
        }
        case "ADD_TODO": {
            return (
                [
                    ...todos,
                    action.resData
                ]
            )
        }
        case "REMOVE_TODO": {
            return todos.filter(todo => todo._id != action.todoID)
        }
        case "CHANGE_STATUS": {
            todos.find(todo => todo._id == action.todoID).todoStatus = !action.todoStatus;
            return [...todos];
        }
        case "CHANGE_DESC": {
            todos.find(todo => todo._id == action.todoID).todoDesc = action.todoDesc;
            return [...todos];
        }
    }
}