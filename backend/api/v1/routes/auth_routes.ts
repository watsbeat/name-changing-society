import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth_controller';
import { shouldBeLoggedIn, shouldBeLoggedOut } from '../general/authChecker';

export let authRouter = Router();

authRouter.post('/register', shouldBeLoggedOut, registerUser);
authRouter.post('/login', shouldBeLoggedOut, loginUser);
authRouter.get('/logout', shouldBeLoggedIn, logoutUser);
