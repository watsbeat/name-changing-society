import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { submitNewName } from '../services/names';
import { TextField, Paper, Button, FormControl } from '@material-ui/core';
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
    const [firstNameState, setFirstNameState] = useState('');
    const [middleNameState, setMiddleNameState] = useState('');
    const [lastNameState, setLastNameState] = useState('');


    function handleFirstNameChange(event) {
        const value = event.target.value;
        setFirstNameState(value);
    }

    function handleMiddleNameChange(event) {
        const value = event.target.value;
        setMiddleNameState(value);
    }

    function handleLastNameChange(event) {
        const value = event.target.value;
        setLastNameState(value);
    }

    function handleNameSubmit() {
        const newName = {
            first_name: firstNameState,
            middle_name: middleNameState,
            last_name: lastNameState
        };
        console.log('Name to submit:', newName);

        submitNewName(newName, loggedInUser)
            .then((response) => {
                console.log('Submitted name response:', response);
                setFirstNameState('');
                setMiddleNameState('');
                setLastNameState('');
            })
            .catch((error) => {
                console.log('Error on name submission:', error);
            });
        // history.push('/dashboard');
    }

    return (
        <Paper className={classes.paper}>
            <form noValidate autoComplete="off">
                <div>
                    <h1 className={classes.title}>Feel like a change?</h1>
                </div>
                <FormControl>
                    <TextField
                        onChange={handleFirstNameChange}
                        // name="name"
                        label="First Name"
                        className={classes.textField}
                        value={firstNameState}
                    ></TextField>
                </FormControl>
                <FormControl>
                    <TextField
                        onChange={handleMiddleNameChange}
                        // name="name"
                        label="Middle Name"
                        className={classes.textField}
                        value={middleNameState}
                    ></TextField>
                </FormControl>
                <FormControl>
                    <TextField
                        onChange={handleLastNameChange}
                        // name="name"
                        label="Last Name"
                        className={classes.textField}
                        value={lastNameState}
                    ></TextField>
                </FormControl>
                <p className={classes.disc}>
                    Names are subject to availability. The Name Changing Society makes no guarantee that your name will
                    be updated per your request. Names will not be updated unless they are unique.
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
            </form>
        </Paper>
    );
};

export default withRouter(RequestNewName);
