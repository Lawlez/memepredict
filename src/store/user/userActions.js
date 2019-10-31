export const setUserName = name => {
    return {
        type: 'SET_USER_NAME',
        payload: name
    }
}

export const setLoggedIn = login => {
    return {
        type: 'SET_LOGGED_IN',
        payload: login
    }
}
