const User = require("../models/users");  // Users Schema

exports = module.exports = (app) => {

    // Session middleware -> This function will work before accessing the main page only
    app.use("/", async (req, res, next) => {
        // I've seperated this because you don't need to update the session.user everyime there is a subtle change
        // Query once after page refresh is okay though
        if (req.session.loggedIn) {
            // Find the user and populate() with friends. So that you can see the user's friends and messages
            const user = await User.findOne({_id: req.session.user._id}).populate({ 
                path: 'friends',
                populate: {
                    path: 'receiver requester',
                    model: 'Users',
                    select: 'username firstName lastName picture lastSeen'
                } 
            })
        
            req.session.user = user;
            res.locals.user = req.session.user;
        }
        
        next();
    })
}
