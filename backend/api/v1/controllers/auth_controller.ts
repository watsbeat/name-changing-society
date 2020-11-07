import { db } from '../config/db';
import Users from './user_controller';

const passport = require('passport');

/**
 * Register a new user as part of the app signup process
 */
export const registerUser = async (req: any, res: any, next: any) => {
    try {
        // TODO: Should wait until all steps are going to successfully before updating db
        const userDetails = req.body;
        const userAlreadyRegistered = await Users.getUser(userDetails);

        if (userAlreadyRegistered) {
            throw new Error('User already exists. Username and email must be unique.');
        }

        await Users.createNewUser(userDetails);
        const newRegisteredUserId = await Users.getUser(userDetails);

        if (!newRegisteredUserId) {
            throw new Error('Cannot find newly created user in db. Something went wrong.');
        }

        await Users.addUserToCitizensList(newRegisteredUserId.id);

        // Get citzen id and update users table
        const newUserCitizenId = await db.one('SELECT id FROM citizens WHERE user_id = $1', newRegisteredUserId.id);
        await db.none('UPDATE users SET citizen_id = $1 WHERE id = $2', [newUserCitizenId.id, newRegisteredUserId.id]);

        // TODO: Create current name for user at registration
        // ! But this would prevent from signing up if current name wasn't unique
        
        // TODO: Login with new user details or redirect to login

        res.status(200).send('Registered successfully!');
    } catch (err) {
        console.error(err);
        res.status(400).send('Error occurred at signup!');
    }
};

/**
 * Sign in an authenticated user to the app
 */
export const loginUser = (req: any, res: any) => {
    passport.authenticate('local')(req, res, () => {
        try {
            // console.log(`
            //     user: ${req.body.username}
            //     session: ${req.session}
            //     is authenticated: ${req.isAuthenticated()}
            // `);
            if (req.body.remember) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
            } else {
                req.session.cookie.expires = false; // Cookie expires at end of session
            }
            res.send(req.user);
        } catch (err) {
            console.error('Error occurred at login:', err);
        }
    });
};

/**
 * Sign out a user from the app
 */
export const logoutUser = (req: any, res: any, next: any) => {
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
