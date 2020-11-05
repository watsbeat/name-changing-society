import { Router, Request, Response } from 'express';
import { jsonParser } from '../general/bodyParser';
import Names from '../controllers/names_controller';

export let namesRouter = Router();

namesRouter.get(
    '/',
    jsonParser,
    async (req: Request, res: Response, next: Function): Promise<void> => {
        try {
            const response = await Names.listNamesExpiringWithin28Days();
            res.send(response);
        } catch (err) {
            next(err);
        }
    }
);
