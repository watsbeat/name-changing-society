import { db } from '../config/db';
import bcrypt from 'bcrypt';
import { abort } from 'process';

const passport = require('passport');

/**
 * Check the db to see if a user with those registration details already exists
 * @param userDetails - the details the user submitted at signup
 */
export const getUser = async (userDetails: any): Promise<any> => {
    try {
        const { username, email } = userDetails;
        return await db.oneOrNone('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    } catch (err) {
        console.error(err);
        throw new Error('Error getting user.');
    }
}

/**
 * Create a new user in users db table with a hashed password
 * @param userDetails - the details the user submitted at signup
 */
export const createNewUser = async (userDetails: any) => {
    try {
        const { username, email, password } = userDetails;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Remove null constraint for citizen_id from users
        await db.none('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [
            username,
            email,
            hashedPassword
        ]);
    } catch (err) {
        throw new Error('Failed to create new user in db.');
    }
}

/**
 * Create an entry for the user_id in the citizens table
 * @param userIdToAdd - the user_id to add
 */
export const addUserToCitizensList = async (userIdToAdd: number) => {
    try {
        // TODO: Check to see if user is already has a citizen listing - future feat, assume they don't for now.
        await db.none(`INSERT INTO citizens (user_id) VALUES (${userIdToAdd})`);
    } catch (err) {
        console.error(err);
        throw new Error('Failed to add user to citizens list.')
    }
}

// TODO: Move user-related functions to user controller / User class
export const register = async (req: any, res: any, next: any) => {
    try {
        // TODO: Should wait until all steps are going to successfully before updating db
        const userDetails = req.body;
        const userAlreadyRegistered = await getUser(userDetails);

        if (userAlreadyRegistered) {
            throw new Error('User already exists. Username and email must be unique.');
        }

        await createNewUser(userDetails);
        const newRegisteredUserId = await getUser(userDetails);

        if (!newRegisteredUserId) {
            throw new Error('Cannot find newly created user in db. Something went wrong.');
        }

        await addUserToCitizensList(newRegisteredUserId.id);

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

export const login = (req: any, res: any) => {
    passport.authenticate('local')(req, res, () => {
        try {
            console.log(`
                user: ${req.body.username}
                session: ${req.session}
                is authenticated: ${req.isAuthenticated()}
            `);
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
