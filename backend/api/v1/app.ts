import { Router } from 'express';
import { shouldBeLoggedIn } from './general/authChecker';
// Routers
import { usersRouter } from './routes/users_routes';
import { namesRouter } from './routes/names_routes';
import { citizensRouter } from './routes/citizens_routes';
import { authRouter } from './routes/auth_routes';

export let router = Router();

router.get('/', (req, res) => {
    res.send('Name Changing Society App 👋');
});

router.use('/auth', authRouter);
router.use('/names', namesRouter);
router.use('/users', usersRouter);
router.use('/citizens', citizensRouter);
