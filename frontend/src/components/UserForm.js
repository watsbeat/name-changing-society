import React, { useState } from 'react';
import { Avatar, Button, TextField, Paper, Grid, Typography, CssBaseline, Fab } from '@material-ui/core/';
import { Link } from 'react-router-dom';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage:
            'url(https://images.unsplash.com/photo-1519111564097-8a1e8ddfb738?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2304&q=80)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    label: {
        color: 'gray',
    },
    avatar: {
        margin: theme.spacing(2.5),
        background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
	},
	fabIcon: {
        marginTop: 20,
    },
}));

const UserForm = ({ label, handleSubmit, errorMessage }) => {
    const classes = useStyles();
    const initialFormState = {
        username: '',
        email: '',
        password: '',
    };
    const [userDetails, setUserDetails] = useState(initialFormState);

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setUserDetails({
            ...userDetails,
            [name]: value,
        });
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        let user = {
            username: userDetails.username,
            password: userDetails.password,
        };
        if (label === 'Register') {
            user.email = userDetails.email;
        }
        console.log('USER TO SUBMIT:', user);
        return handleSubmit(user);
    }

    return (
        <Grid container component="main" className={classes.root} onSubmit={handleFormSubmit}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOpenIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" className={classes.label}>
                        {label}
                    </Typography>
                    <p className={classes.label}>
                        <q>What's in a name? that which we call a rose. By any other name would smell as sweet.</q>
                    </p>
                    <Typography component="h5">{errorMessage && <p>{errorMessage}</p>}</Typography>
                    <form data-cy="login-form" className={classes.form} noValidate>
                        <TextField
                            data-cy="username"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            onChange={handleChange}
                            autoFocus
                        />
                        {label === 'Register' && (
							<TextField
								data-cy="email"
								variant="outlined"
								margin="normal"
								required
								fullWidth
								name="email"
								label="Email"
								type="email"
								id="email"
								autoComplete="email"
								onChange={handleChange}
							/>
						)}
                        <TextField
                            data-cy="password"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                        />
                        <Button
                            data-cy="login-button"
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            {label}
                        </Button>
                        <Grid container>
                            <Grid item>
                                {label === 'Register' && (
                                    <Link to="/auth/login" variant="inherit" color="primary">
                                        {'Or login'}
                                    </Link>
                                )}
                                {label === 'Login' && (
                                    <Link to="/auth/register" variant="inherit" color="primary">
                                        {'Or create an account'}
                                    </Link>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                    <Fab
                        className={classes.fabIcon}
                        color="secondary"
                        aria-label="add"
                        size="medium"
                        variant="extended"
						component={Link}
						to='/browse'
                    >
                        <SearchIcon className={classes.extendedIcon} />
                        Browse Available Names As Guest
                    </Fab>
                </div>
            </Grid>
        </Grid>
    );
};

export default UserForm;
