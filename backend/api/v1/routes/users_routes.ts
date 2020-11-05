import { Router, Request, Response } from 'express';
import { jsonParser } from '../general/bodyParser';
import Users from '../controllers/user_controller';
import { userAuthenticated } from '../general/authChecker';

export let usersRouter = Router();

usersRouter.use(userAuthenticated);

usersRouter.route('/:user_id')
    .get(
        jsonParser,
        async (req: Request, res: Response, next: Function): Promise<void> => {
            try {
                const { user_id } = req.params;
                const response = await Users.getUserCurrentName(parseInt(user_id));
                res.send(response);
            } catch (err) {
                next(err);
            }
        }
    )
    .post(
        jsonParser,
        async (req: Request, res: Response, next: Function): Promise<void> => {
            try {
                const { user_id } = req.params;
                const { name } = req.body;
                await Users.submitNewName(parseInt(user_id), name);
                res.send('Created new name!');
            } catch (err) {
                next(err);
            }
        }
    );

usersRouter.get(
    '/:user_id/history',
    jsonParser,
    async (req: Request, res: Response, next: Function): Promise<void> => {
        try {
            const { user_id } = req.params;
            const response = await Users.getUserHistoricalNames(parseInt(user_id));
            res.send(response);
        } catch (err) {
            next(err);
        }
    }
);
