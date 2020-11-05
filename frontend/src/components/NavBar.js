import React from 'react';
import { useGlobalState } from '../config/globalState';
import { logoutUser, setLoggedInUser } from '../services/auth';
import StyledLink from './StyledLink';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AppsIcon from '@material-ui/icons/Apps';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    toolBar: {
        background: 'linear-gradient(to right, #ec008c, #fc6767)', // 'linear-gradient(to right, #ff5f6d, #ffc371)'
    },
    logoutButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    icon: {
        fill: 'white',
    },
    link: {
        textDecoration: 'none',
        height: 'auto',
    },
}));

export default function NavBar() {
    const { store, dispatch } = useGlobalState();
    const { loggedInUser } = store;

    const classes = useStyles();

    function handleLogout() {
        setLoggedInUser(null);
        logoutUser()
            .then((response) => {
                console.log('Got back response on logout', response.status);
            })
            .catch((error) => {
                console.log('The server may be down - caught an exception on logout:', error);
            });
        dispatch({
            type: 'setLoggedInUser',
            data: null,
        });
    }

    return (
        <AppBar position="static">
            <Toolbar className={classes.toolBar}>
                <StyledLink icon={AppsIcon} link="/" />
                <Typography variant="h6" className={classes.title}>
                    Name Changing Society
                </Typography>
                {loggedInUser && <StyledLink icon={DashboardIcon} link="/dashboard" text="Dashboard" /> && (
                    <StyledLink icon={ExitToAppIcon} link="/auth/logout" text="Logout" onClick={handleLogout} />
                )}
            </Toolbar>
        </AppBar>
    );
}
