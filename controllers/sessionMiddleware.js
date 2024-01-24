exports = module.exports = (app) => {

    // Session middleware -> This function will work before accessing each route
    app.use((req, res, next) => {
        if (!req.session) {  // Basically checks if the user is logged in everytime there is a page load
            res.locals.loggedIn = false
        } else {
            res.locals.loggedIn = req.session.loggedIn;  // If logged in, send logged in data via locals.loggedIn
            res.locals.user = req.session.user;  // Also send user data to fill profile picture, username, see friends etc.
            next();
        }
    });
}
