import {applyMiddleware, combineReducers, createStore, compose} from 'redux'
//import {createLogger} from 'redux-logger'
import user from './user/userReducer'
import notify from './notify/notifyReducer'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export default createStore(
    combineReducers({
        user,
        notify,
    }),
    {},
    composeEnhancers(applyMiddleware(/*createLogger()*/)),
)