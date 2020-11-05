import React, { useState } from 'react';
import {
	registerUser,
	setLoggedInUser,
	getLoggedInUser,
} from '../services/auth';
import { useGlobalState } from '../config/globalState';
import UserForm from './UserForm';

const Register = ({ history }) => {
	const { dispatch } = useGlobalState();

	const [errorMessage, setErrorMessage] = useState(null);

	function handleSubmit(userDetails) {
		registerUser(userDetails)
			.then((response) => {
				console.log('register user res:', response);
				setLoggedInUser(response.id);
				dispatch({
					type: 'setLoggedInUser',
					data: getLoggedInUser(),
				});
				history.push('/dashboard');
			})
			.catch((error) => {
				setErrorMessage('Please try again');
				console.log('Error registering user', error);
			});
	}

	return (
		<UserForm
			handleSubmit={handleSubmit}
			errorMessage={errorMessage}
			label={'Register'}
		/>
	);
};

export default Register;
