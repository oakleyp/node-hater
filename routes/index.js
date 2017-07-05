const express = require('express');
const session = require('express-session');
const mustache = require('mustache');
const models = require('../models');
const router = express.Router();

//Returns array, sorted either ascending or descending, by number of haters per post
function sortByHate(postlist, order = 'DESC') {
    order = order.toLowerCase();

    //Create temporary array containing positions and sort values
    let mappedlist = postlist.map((el, i) => {
        return {
            index: i,
            value: el.HaterIds.length
        };
    })

    //Sort the mapped array containing the reduced values
    mappedlist.sort((a, b) => {
        return +(a.value > b.value) || +(a.value === b.value) - 1;
    })

    let result = mappedlist.map((el) => {
        return postlist[el.index];
    })

    if (order == 'asc') result.reverse();

    return result;
}

//Run once to put something in the db
/*models.Post.findOrCreate({
  where: {
      id: 1,
      UserId: 1,
      content: `Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to...`,
      TagIds: '1,2',
      HaterIds: '1,2',
      CommentIds: '2',
      createdAt: null,
      updatedAt: null
  }
}).spread(function (post, created) {
  console.log(post.id, created);
});*/

router.get('/', function (req, res) {
    res.redirect(303, '/home/top/1');
})

router.get('/home', function (req, res) {
    res.redirect(303, '/home/top/1');
})

router.get('/home/:sortby/:pgnum', function (req, res) {
    let pgnum = 1,
        offset = 0,
        authenticated = false,
        udata = {};

    if (req.session) {
        authenticated = req.session.authenticated;
        udata = req.session.udata;
    }

    if (req.params.pgnum != null && req.params.pgnum >= 1) {
        pgnum = req.params.pgnum;
    }

    //Generate 20 items per page
    if (pgnum > 1) offset = 20 * (pgnum - 1);

    models.Post.findAll({
        limit: 20,
        offset: offset
    }).then((results) => {
        let allposts = results;

        switch (req.params.sortby) {
            case 'bottom':
                allposts = sortByHate(allposts, 'ASC');
                break;
            case 'top':
            default:
                allposts = sortByHate(allposts, 'DESC');
                break;
        }

        console.log("All posts retrieved, 20 results:");
        console.dir(results);
        console.dir(allposts);

        //Format posts into json objects for mustache rendering
        let post_data = [];
        for (var i = 0; i < allposts.length; i++) {
            //Get user info for each post, there's only 20 maximum queries per page but this could probably be optimized a lot.
            models.User.find({
                where: {
                    id: allposts[i]['UserId']
                }
            }).then((user) => {
                //TODO: Haters and tags markup
                console.log("Found user by id: ", user);

                let username = user.username,
                    fullname = user.firstname + " " + user.lastname;

                post_data.push({
                    username: username,
                    fullname: fullname,
                    timestamp: user.createdAt,
                    content: user.content,
                    haters_markup: "",
                    tags_markup: ""
                })

                if (i == (allposts.length)) {
                    //                    console.log("Rendering all posts");
                    //                    let pagedata = {
                    //                        logged_in: authenticated,
                    //                        posts: post_data,
                    //                        udata: udata
                    //                    };
                    //                    res.render('index', pagedata);
                }

            })
        }

        console.log("Rendering all posts");
        let pagedata = {
            logged_in: authenticated,
            posts: post_data,
            udata: udata
        };
        res.render('index', pagedata);
    })

});

router.get('/logout', function (req, res) {
    if (req.session && req.session.authenticated) {
        req.session.authenticated = false;
        delete req.session.udata;
    }

    res.redirect('/login');
})

module.exports = router;
