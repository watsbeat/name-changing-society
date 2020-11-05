import React, { useEffect, useReducer } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';
import BrowseNames from './components/BrowseNames'
import { getNames } from './services/names';
import stateReducer from './config/stateReducer';
import { StateContext } from './config/globalState';
import { getLoggedInUser } from './services/auth';
import Names from './components/Names';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const initialState = {
        names: [],
        loggedInUser: null,
    };

    const [store, dispatch] = useReducer(stateReducer, initialState);
    const { names, loggedInUser } = store;

    useEffect(() => {
        dispatch({
            type: 'setLoggedInUser',
            data: getLoggedInUser(),
        });
        getNames()
            .then((names) => {
                dispatch({
                    type: 'setNames',
                    data: names,
                });
            })
            .catch((error) => {
                console.log('An error occurred fetching names from the server:', error);
            });
    }, [loggedInUser]);

    return (
        <StateContext.Provider value={{ store, dispatch }}>
            <Router>
                <NavBar />
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() =>
                            loggedInUser ? (
                                <Redirect to="/dashboard" />
                            ) : (
                                <Redirect to="/auth/login" />
                            )
                        }
					/>
                    <Route exact path={ROUTES.LOGIN} component={Login} />
                    <Route exact path={ROUTES.LOGOUT} component={Login} />
                    <Route exact path={ROUTES.REGISTER} component={Register} />
                    <Route exact path={ROUTES.NAMES} component={Names} names={names} />
                    <Route exact path='/browse' component={BrowseNames} names={names} />
                    <PrivateRoute exact path={ROUTES.DASHBOARD} component={UserDashboard} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        </StateContext.Provider>
    );
}

export default App;
