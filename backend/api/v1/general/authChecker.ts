export const shouldBeLoggedIn = (req: any, res: any, next: any) => {
	console.log('LOGGED IN?');
	console.log('is authenticated?', req.isAuthenticated());
    !req.user ? res.send('Already logged out!') : next();
};

export const shouldBeLoggedOut = (req: any, res: any, next: any) => {
	console.log('LOGGED OUT?');
	console.log('is authenticated?', req.isAuthenticated());
    req.user ? next(new Error('Already logged in!')) : next();
};

export const userAuthenticated = (req: any, res: any, next: any) => {
	if (req.isAuthenticated()) {
		console.log(`User authenticated: ${JSON.stringify(req.user)}`);
		next();
	} else {
		console.log(`User not authenticated: ${JSON.stringify(req.user)}`);
		res.sendStatus(403);
	}
};
