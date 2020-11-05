import express from 'express';
import { router } from './api/v1/app';
import { db } from './api/v1/config/db';
import cors from 'cors';
import { logger } from './api/v1/general/logging';
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// TODO: Possibly move passport and express session config into api/v1/app.ts
const passport = require('passport');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);

const app = express();
const port = process.env.PORT || 8091;

app.use(cookieParser());
app.use(flash());
app.use(logger);
// app.use(validation);

const allowList = [
	'http://localhost:3000'
]

const corsOptions = {
	credentials: true,
	origin: function (origin: any, callback: any) {
		const allowListIndex = allowList.findIndex((url) => url.includes(origin));
		callback(null, allowListIndex > -1);
	}
};

app.use(cors(corsOptions));

const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 3600000,
    },
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
        pool: db.$pool,
        tableName: 'session'
    }),
};

if (app.get('env') === 'production') {
    // Use secure cookies in production (requires SSL/TLS)
    // session.cookie = { secure: true };
    console.log('PROD mode');
}

app.use(expressSession(session));

app.use(passport.initialize());
app.use(passport.session());

// Attach custom passport configuration
require('./api/v1/config/passport');

app.disable('x-powered-by');

app.use('/v1', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
