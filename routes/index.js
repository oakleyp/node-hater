const express = require('express');
const session = require('express-session');
const mustache = require('mustache');
const models = require('../models/index');
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

    if (order == 'desc') result.reverse();

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
        
        if(allposts.length) {

        switch (req.params.sortby) {
            case 'bottom':
                allposts = sortByHate(allposts, 'ASC');
                break;
            case 'top':
            default:
                allposts = sortByHate(allposts, 'DESC');
                break;
        }

        //Format posts into json objects for mustache rendering
        let post_data = [];
        for (var i = 0; i < allposts.length; i++) {
            let post_id = allposts[i]['id'];
            let post_content = allposts[i]['content'];
            let post_haters = allposts[i]['HaterIds'].split(',');
            
            //Formatted date of creation
            let date_time = new Date(allposts[i].createdAt.toString());
            date_time = (date_time.getMonth() + '/' + date_time.getDay());
            
            //Get user info for each post, there's only 20 maximum queries per page but this could probably be optimized a lot.
            models.User.find({
                where: {
                    id: allposts[i]['UserId']
                }
            }).then((user) => {
                //TODO: Haters and tags markup
                //console.log("Found user by id: ", user);

                let username = user.username,
                    fullname = user.firstname + " " + user.lastname;
                
                let haters_markup = '',
                    delete_markup = '';
                
                //Check to see whether this post is the current user's
                if(typeof(req.session.udata) != 'undefined' && req.session.udata != {}) {
                    if(req.session.udata.username != username) {
                        haters_markup = `<button id="hatebtn${post_id}" class="hate-btn">Hate this</button> - `;
                    } else {
                        delete_markup = `<button id="deletebtn${post_id}" class="delete-btn">Delete</button>`;
                    }
                }
                
                if(post_haters.length > 0 && post_haters.join(',').replace(',').trim() != "")
                        haters_markup += `${post_haters.length} haters.`;
                else haters_markup += `No haters.`;
                

                post_data.push({
                    post_id: post_id,
                    username: username,
                    fullname: fullname,
                    profile_link: `/profile/${user.id}`,
                    timestamp: date_time,
                    content: post_content,
                    haters_markup: haters_markup,
                    delete_markup: delete_markup
                });

                if (post_data.length == (allposts.length)) {
                    console.log("Rendering all posts:");
                    console.dir(post_data);
                    let pagedata = {
                        logged_in: authenticated,
                        posts: post_data,
                        udata: req.session.udata
                    };
                    res.render('index', pagedata);
                }

            }).catch((error) => {
                console.log("There was some error getting users: " + error.message);
            })
        }
            
        } else {
            let pagedata = {
                logged_in: authenticated,
                posts: null,
                udata: udata
            }
            res.render('index', pagedata);
        }


    })

});

router.post('/home', function(req, res) {
    let post_content = req.body.post_content;
    if(post_content.length < 255 && post_content.length > 0) {
        if(req.session && req.session.authenticated && req.session.udata.uid) {
            models.Post.create({
                UserId: req.session.udata.uid,
                content: post_content,
            }).then((post) => {
                if(post == null) {
                    console.log("There was some error making that post... it came back null, tf?");
                }
                
                console.log("Created post: ");
                console.dir(post);
                
                //Maybe just send back json result if doing ajax posts later
                res.redirect(303, '/home/bottom/1');
            }).catch((err) => {
                console.log("There was some error making that post" + err.message);
            });
        }
    }
    
    res.redirect(303, '/home/top/1');
    
    
})

router.post('/hate/:id', function(req, res) {
    let post_id = req.params['id'];
    
    if(req.session && req.session.udata) {
        
        let uid = req.session.udata.uid;
        
        models.Post.findOne({where: {id: post_id}}).then((post) => {
            
            let haterids_str = '';
            
            if(post.HaterIds.length > 0) {
                let haterids = post.HaterIds.split(",");
                let undone = false;
                console.dir(haterids);
                for(var i = 0; i < haterids.length; i++) {
                    if(haterids[i].toString() == uid.toString()) {
                        console.log("Undoing hate.");
                        if(haterids.length == 1) haterids = [];
                        else haterids = haterids.splice(i, 1);
                        undone = true;
                        break;
                    }
                }
                
                if(!undone) {
                    console.log("Pushing new id to haterids: " + uid);
                    haterids.push(uid.toString());
                }
                
                haterids_str = haterids.join(',');
                
                console.log("Found a post, attempting to update haterids string ", haterids_str);
                console.dir(haterids);
                
            } else haterids_str = uid.toString();
            
            
            //Return the result to ajax caller
            post.HaterIds = haterids_str;
            res.json(post);
            
            models.Post.update({HaterIds: haterids_str}, {where: {id: post_id}}).then((upost) => {
                console.log("Post hates updated with: ", upost);
            }).catch((err) => {
                console.log("Error updating post id: " + req.params['id'] + " -> msg: " + err.message);
            })
            
            
        }).catch((err) => {
            console.log("Error finding post to update: " + req.params['id'] + " -> msg: " + err.message);
            res.json({});
        })
    } else res.json({});
    

});

router.post('/delete/:id', function(req, res) {
    let post_id = req.params['id'];
    
    if(req.session && req.session.udata) {
        let uid = req.session.udata.uid;
        
        models.Post.findOne({where: {id: post_id, UserId: uid}}).then(post => {
            if(post) {
                res.json(post);
                models.Post.destroy({where: {id: post_id}}).then(dpost => {
                    console.log("Post deleted: ", dpost);
                }).catch(err => {
                    res.json({});
                    console.log("Error deleting post. -> ", err);
                })
            } else res.json({});
        }).catch(err => {
            console.log("Error finding post to delete -> ", err);
            res.json({});
        })
    } else res.json({});
})

router.get('/logout', function (req, res) {
    if (req.session && req.session.authenticated) {
        req.session.authenticated = false;
        delete req.session.udata;
    }

    res.redirect('/login');
})

module.exports = router;
