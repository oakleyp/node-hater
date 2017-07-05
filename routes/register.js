var express = require('express');
var models = require('../models/index');
var router = express.Router();

//Returns true if the given newuser data object is valid
function validateUser(userobj) {
    //TODO: Validation
    return true;
}

function writeUser(userobj) {
    models.User.create({
        firstname: userobj.firstname,
        lastname: userobj.lastname,
        email: userobj.email,
        username: userobj.username,
        password: userobj.password,
        description: '',
        active: true,
        HaterIds: '',
        HateesIds: '',
        PostIds: '',
        CommentIds: '',
        DisinterestIds: ''
    })
}

router.get('/', function (req, res) {
    res.render('register', {});
});

router.post('/', function (req, res) {
    console.log("Register posted values: ", req.body);

    //Clear session first so redirect to login page doesn't open any previous user's page
    req.session.authenticated = false;
    req.session.udata = {};

    if (Object.keys(req.body).length != 0) {
        let newuser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username.toLowerCase(),
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword
        }

        if (validateUser(newuser)) {
            models.User.findOrCreate({
                where: {
                    username: newuser.username
                },
                defaults: {
                    firstname: newuser.firstname,
                    lastname: newuser.lastname,
                    email: newuser.email,
                    password: newuser.password,
                    
                }
            }).spread(function (user, created) {
                console.log(user.id, created);
            }).then(()=> { res.redirect(303, '/login') });
        }



        /*fs.readFile(dataFilePath, 'utf-8', function (err, fdata) {

            if (err) console.log(`Error reading data file... POST - /register`);
            else {

                let data = JSON.parse(fdata);
                
                //See if username is already taken
                let taken = false;
                for(var i = 0; i < data.users.length; i++) {
                    if(data.users[i].username == newuser.username) {
                        taken = true;
                        break;
                    } 
                }
                if (taken) {
                    res.render('register', {error: `<span class="error_msg">Sorry, the username '${newuser.username}' is already in use. Please try a different one.<span>`});
                } else {
                    data.users.push(newuser);

                    writeFile(dataFilePath, data);

                    res.render('login', {
                        error: `<span>Your account has been created successfully. Please login to continue.</span>`
                    });
                }
            }
        });*/
    } else {
        res.render('register', {
            error: `<span class="error">Error: One or more fields were either left blank or are invalid. There hasn't been any logic implemented to know which one yet, so figure it out yourself.`
        });
    }
});

module.exports = router;
