var express = require('express');  
var router = express.Router(); 

//Routes here

router.get('/', function(req, res) => {
    if(req.session && req.session.authenticated) {
        
    } else {
        res.redirect(303, '/login');
    }
});

module.exports = router;