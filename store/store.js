import {createStore, combineReducers, applyMiddleware} from 'redux'
import ReudxThunk from 'redux-thunk'
import axios from 'axios'

const userInitialState = {}

const logoutActionCreator = () => {
    return {
        type: 'LOGOUT'
    }
}

const userReducer = (state = userInitialState, action) => {
    switch(action.type) {
        case 'LOGOUT':
            return {}
        default:
            return state
    }
}

const allReducers = combineReducers({
    user: userReducer
})

const initializeStore = (state) => {
    const store = createStore(
        allReducers,
        Object.assign({},{user: userInitialState}, state),
        applyMiddleware(ReudxThunk)
    )

    return store
}

export default initializeStore