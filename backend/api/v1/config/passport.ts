import { db } from './db';
import bcrypt from 'bcrypt';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

export const strategy = new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
    },
    async (username: string, password: string, done: any) => {
        try {
            const user = await db.one('SELECT * FROM users WHERE username = $1', username);
            const passwordMatches = await bcrypt.compare(password, user.password);

            if (!passwordMatches) {
                throw new Error('Incorrect password.');
            }

            done(null, user);
        } catch (err) {
            console.error('No authenticated user!', err);
            return done(null, false, { message: 'Incorrect username or password.' });
        }
    }
);

passport.use(strategy);

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});
