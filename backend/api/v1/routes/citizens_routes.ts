import { Router, Request, Response } from 'express';
import Citizens from '../controllers/citizens_controller';
import { userAuthenticated } from '../general/authChecker';

export let citizensRouter = Router();

citizensRouter.use(userAuthenticated);

citizensRouter.get(
    '/',
    async (req: Request, res: Response, next: Function): Promise<void> => {
        try {
            const response = await Citizens.getCitizens();
            res.send(response);
        } catch (err) {
            next(err);
        }
    }
);
