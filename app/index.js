const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const parseurl = require('parseurl');
const app = express();

//Define view engine
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//Define initial session vars
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    authenticated: false,
    udata: {} //Holds logged in user variables
}));

app.use(function (req, res, next) {
    let views = req.session.views;

    if (!views) {
        views = req.session.views = {};
    }

    let pathname = parseurl(req).pathname;

    views[pathname] = (views[pathname] || 0) + 1;

    next();
});

//Define routes
const index = require('../routes/index');
const profile = require('../routes/profile');
const register = require('../routes/register');
const login = require('../routes/login');

app.use('/', index);
app.use('/profile', profile);
app.use('/register', register);
app.use('/login', login);



app.listen(3000, () => { console.log('App started.') });