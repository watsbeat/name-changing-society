function stateReducer(state, action) {
    switch (action.type) {
        case 'setNames':
            return {
                ...state,
                names: action.data,
            };
        case 'setUserNameHistory':
            return {
                ...state,
                names: action.data,
            };
        case 'addName':
            return {
                ...state,
                names: [action.data, ...state.names],
            };
        case 'setLoggedInUser':
            return {
                ...state,
                loggedInUser: action.data,
            };
        default:
            return state;
    }
}

export default stateReducer;
