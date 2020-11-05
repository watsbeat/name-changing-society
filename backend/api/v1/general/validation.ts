import { RequestHandler } from 'express';

export const validation: RequestHandler = (req, res, next) => {
    if (req.accepts('application/json')) {
        next();
    } else {
        next(new Error('Content Type not supported'));
    }
};
