import { Router } from 'express';
import { jsonParser } from '../general/bodyParser';
import { register, login, logout } from '../controllers/auth_controller';
import { shouldBeLoggedIn, shouldBeLoggedOut, userAuthenticated } from '../general/authChecker';

export let authRouter = Router();

authRouter.post('/register', jsonParser, shouldBeLoggedOut, register);
authRouter.post('/login', jsonParser, shouldBeLoggedOut, login);
authRouter.get('/logout', jsonParser, shouldBeLoggedIn, logout);
