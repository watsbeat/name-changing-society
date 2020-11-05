import { db } from '../config/db';
import bcrypt from 'bcrypt';

const passport = require('passport');

export const register = async (req: any, res: any, next: any) => {
    try {
        console.log(req.body);
        const { username, password, email, full_name } = req.body;

        // Check if user already exists
        await db.none('SELECT * FROM users WHERE username = $1', username);

        // Create new user in db and hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.none('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [
            username,
            hashedPassword,
            email,
        ]);

        const newUser = await db.one('SELECT * FROM users WHERE username = $1 AND password $2', [
            username,
            password,
        ]);

        // TODO: Create current name for user at registration
        // User.submitNewName(newUser.userId, full_name)

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
