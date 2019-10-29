const userReducer = (state = {
    memes: [],
    account: null,
    subreddit: 'dankmemes',

}, action ) =>{
    switch (action.type) {
    case 'SET_MEMES':
        state = {
            ...state,
            memes: [ ...state.memes,
                action.payload]
        }
        break
    case 'SET_ACCOUNT':
        state = {
            ...state,
            account: action.payload
        }
        break
    default:
        return state
    }
    return state
}

export default userReducer