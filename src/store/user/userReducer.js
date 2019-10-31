const userReducer = (
    state = {
        isLoggedIn: true,
        userName: null
    },
    action
) => {
    switch (action.type) {
    case 'SET_USER_NAME':
        state = {
            ...state,
            userName: action.payload
        }
        break
    case 'SET_LOGGED_IN':
        state = {
            ...state,
            isLoggedIn: action.payload
        }
        break
    default:
        return state
    }
    return state
}

export default userReducer
