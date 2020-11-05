import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { submitNewName } from '../services/names';
import { TextField, Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../config/globalState';

const useStyles = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
        '& > *': {
            margin: theme.spacing(1),
        },
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'left',
        height: '100%',
        width: '100%',
    },
    title: {
        color: 'gray',
    },
    disc: {
        fontSize: '14px',
        fontStyle: 'italic',
        color: 'gray',
    },
}));

const RequestNewName = ({ history }) => {
    const classes = useStyles();
    const { store } = useGlobalState();
    const { loggedInUser } = store;
    const [nameState, setNameState] = useState('');

    function handleChange(event) {
        const value = event.target.value;
        setNameState(value);
    }

    function handleNameSubmit() {
        const newName = {
            name: nameState,
        };
        console.log(newName);
        console.log(loggedInUser);
        submitNewName(newName, loggedInUser)
            .then((response) => {
                console.log(response);
                setNameState('');
            })
            .catch((error) => {
                console.log('error', error);
            });
        history.push('/dashboard');
    }

    return (
        <Paper className={classes.paper}>
            <div>
                <h1 className={classes.title}>Feel like a change?</h1>
            </div>
            <TextField
                onChange={handleChange}
                name="name"
                label="Full Name"
                className={classes.textField}
                value={nameState}
            ></TextField>
            {/* <TextField
                onChange={handleChange}
                name="name"
                label="Last Name"
                className={classes.textField}
                value={nameState}
            ></TextField> */}
            <p className={classes.disc}>
                Names are subject to availability. The Name Changing Society makes no guarantee that your name will be
                updated per your request. Names will not be updated unless they are unique.
            </p>
            <Button
                data-cy="login-button"
                type="submit"
                variant="outlined"
                color="secondary"
                onClick={handleNameSubmit}
            >
                Request New Name
            </Button>
        </Paper>
    );
};

export default withRouter(RequestNewName);
