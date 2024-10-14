export default function userReducer(sessionUser, action) {
    switch(action.type) {
        case "SET_USER": {
            return action.user;
        }
        case "UNSET_USER": {
            return {};
        }
    }
}