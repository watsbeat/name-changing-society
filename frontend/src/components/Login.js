import React, { useState } from 'react';
import {
	loginUser,
	setLoggedInUser,
	getLoggedInUser,
} from '../services/auth';
import { useGlobalState } from '../config/globalState';
import UserForm from './UserForm';

const Login = ({ history }) => {
	const { dispatch } = useGlobalState();

	const [errorMessage, setErrorMessage] = useState(null);

	function handleSubmit(userDetails) {
		loginUser(userDetails)
			.then((response) => {
				setLoggedInUser(response.user_id);
				dispatch({
					type: 'setLoggedInUser',
					data: getLoggedInUser(),
				});
				history.push('/dashboard');
			})
			.catch((error) => {
				setLoggedInUser(null);
				if (error.response && error.response.status === 401)
					setErrorMessage(
						'Authentication failed. Please check your username and password.'
					);
				else
					setErrorMessage(
						'There may be a problem with the server. Please try again soon.'
					);
			});
	}

	return (
		<UserForm
			handleSubmit={handleSubmit}
			errorMessage={errorMessage}
			label={'Login'}
		/>
	);
};

export default Login;
