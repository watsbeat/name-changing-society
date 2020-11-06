import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../config/globalState';
import { Grid, Paper, Typography } from '@material-ui/core';
import Names from './Names';
import HistoricalNames from './UserNameHistory';
import { getUserCurrentName, getUserNameHistory } from '../services/names';
import RequestNewName from './RequestNewName';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: '100%',
    },
    paper: {
        padding: theme.spacing(5),
        textAlign: 'left',
        color: 'white',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to right, #4a00e0, #8e2de2)',
    },
}));

function UserDashboard() {
    const { store } = useGlobalState();
    const { names, loggedInUser } = store;
    const [historicalNames, setHistoricalNames] = useState([]);
    const [currentName, setCurrentName] = useState();

    useEffect(() => {
        loggedInUser && 
            getUserNameHistory(loggedInUser)
                .then((historicalNames) => {
                    setHistoricalNames(historicalNames);
                })
                .catch((err) => {
                    console.error(`An error occurred setting the name history: ${err}`);
                });
        loggedInUser && 
            getUserCurrentName(loggedInUser)
                .then((currentName) => {
                    console.log('CURRENT NAME:', currentName);
                    setCurrentName(currentName.first_name);
                })
                .catch((err) => {
                    console.error(`An error occurred setting user's current name: ${err}`);
                });
    }, [loggedInUser, setCurrentName, setHistoricalNames]);

    const classes = useStyles();
    return (
        <main className={classes.content}>
            {/* <div className={classes.toolbar} /> */}
            <div className={classes.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                    <Paper data-cy="currentName" className={classes.paper}>
                        <Typography data-cy="user">
                            <h1>Welcome, {currentName}! 👋</h1>
                            <p>Are you ready to find your next awesomely unique name?</p>
                            <p>User ID: {loggedInUser}</p>
                        </Typography>
                    </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <RequestNewName />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <HistoricalNames historicalNames={historicalNames} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Names names={names} />
                    </Grid>
                </Grid>
            </div>
        </main>
    );
}

export default UserDashboard;
