var session = require('express-session');
var sessionstore = require('sessionstore');

module.exports = function(app) {
    app.use(session({
        secret: 'fgzaaflpt20imorsst20',
        store: sessionstore.createSessionStore(),
        resave: false,
        saveUninitialized: false
    }));
}