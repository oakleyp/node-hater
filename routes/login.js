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
    }).then((result) => {
        if(result != null) {
            //Start session and redirect to index
        }
    })
    /*fs.readFile(dataFilePath, 'utf-8', function (err, fdata) {
        if (err) {
            console.log(`Error reading file ${path}. `, err);
            console.log(`Error parsing data:`, fdata);

        } else {
            let data = JSON.parse(fdata);
            let authenticated = data['users'].find(function (user) {
                if (user.username === username && user.password === password) {
                    req.session.udata = {
                        username: username,
                        firstname: user.firstname,
                        lastname: user.lastname,
                    }
                    return true;
                } else {
                    return false;
                }
            });

            if (authenticated) {

                req.session.authenticated = true;
                res.redirect('/');
            } else {
                res.render('login', {
                    error: `<span class="error">Error: The username and password combination you provided is not correct.</span>`
                });
            }

        }
    });*/


});

module.exports = router;