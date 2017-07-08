var express = require('express');  
let models = require('../models/index');
var router = express.Router(); 

router.get('/', function (req, res) {
    if (req.session.authenticated) {
        res.redirect('/');
    } else {
        res.render('login', {});
    }
});

router.post('/', function (req, res) {
    let username = req.body.username.toLowerCase();
    let password = req.body.password;
    let remember = req.body.remember; //TODO: Remember user next time

    models.User.findOne({
        where: {
            username: username,
            password: password
        }
    }).then((user) => {
        if(user != null) {
            //Start session and redirect to index
            req.session.authenticated = true;
            req.session.udata = {
                uid: user.id,
                username: user.username,
                fullname: user.firstname + " " + user.lastname,
            }
            
            console.log("Session created with user data: ");
            console.dir(req.session.udata);
            
            res.redirect(303, '/home/top/1');
        } else {
            res.render('login', {error: `<span class="error">The username and password combination you provided was not correct. Please try again.</span>`});
        }
    })

});

module.exports = router;