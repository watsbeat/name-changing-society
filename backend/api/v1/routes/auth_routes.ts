import { Router } from 'express';
import { jsonParser } from '../general/bodyParser';
import { registerUser, loginUser, logoutUser } from '../controllers/auth_controller';
import { shouldBeLoggedIn, shouldBeLoggedOut } from '../general/authChecker';

export let authRouter = Router();

authRouter.post('/register', jsonParser, shouldBeLoggedOut, registerUser);
authRouter.post('/login', jsonParser, shouldBeLoggedOut, loginUser);
authRouter.get('/logout', jsonParser, shouldBeLoggedIn, logoutUser);
