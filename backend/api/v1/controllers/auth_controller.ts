import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db';
import bcrypt from 'bcrypt';

const passport = require('passport');

export const register = async (req: any, res: any, next: any) => {
    try {
        console.log(req.body);
        const { username, password } = req.body;
        
        // Check if user already exists
        await db.none('SELECT * FROM users WHERE username = $1', username);
        
        // Create new user in db with unique id and hashed password
        const userId = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        await db.none('INSERT INTO users (username, password, user_id) VALUES ($1, $2, $3)', [
            username,
            hashedPassword,
            userId,
        ]);
        // TODO: Login with new user details or redirect to login
        res.status(200).send('Registered successfully!');
    } catch (err) {
        console.error(err);
        res.status(400).send('Error occurred at signup');
    }
};

export const login = (req: any, res: any) => {
    passport.authenticate('local')(req, res, () => {
        try {
            console.log('authenticated user: ', req.body.username);
            console.log('session: ', req.session);
            if (req.body.remember) {
                console.log('Remember', req.body.remember);
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
            } else {
                console.log('Does not remember');
                req.session.cookie.expires = false; // Cookie expires at end of session
            }
            console.log('is authenticated?', req.isAuthenticated());
            res.send(req.user);
        } catch (err) {
            console.error('Error occurred at login:', err);
        }
    });
};

export const logout = (req: any, res: any, next: any) => {
    try {
        console.log('is authenticated?', req.isAuthenticated());
        req.logout();
        console.log('is authenticated after logout?', req.isAuthenticated());
        req.flash('Success', 'Logged out. See you soon!');
        // res.redirect('/v1');
        res.sendStatus(200);
    } catch (err) {
        console.error('Error occurred at logout', err);
    }
};
