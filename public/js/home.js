const sortselect = document.getElementById('sortby');
const newpostbox = document.getElementById('new-post-box');
const postlist = document.getElementById('posts');

sortselect.addEventListener('change', function (event) {
    let options = sortselect.childNodes;

    for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {
            switch (options[i].value) {
                case 'top':
                    window.location.href = '/home/top/1';
                    break;
                case 'bottom':
                    window.location.href = '/home/bottom/1';
                    break;
            }
        }
    }
});

newpostbox.addEventListener('keypress', function (event) {
    if (event.keyCode == 13) {
        let post_content = newpostbox.value;
        if (post_content.length < 255 && post_content.length > 0) {
            let fields = {
                post_content: post_content
            };
            post('/home', fields);
        }
    }
});

//Watch for hate, delete, edit btn press
document.querySelector('body').addEventListener('click', function (event) {
    if (event.target.tagName.toLowerCase() === "button") {
        if (event.target.className.toLowerCase() === "hate-btn") {
            let post_id = event.target.id.replace("hatebtn", "");

            console.log("There was a hate click");

            post_ajax(`/hate/${post_id}`, {}).then(result => {
                //TODO Change hate display with returned latest number
                if(result) {
                    let postelem = document.getElementById(`post${result.id}`);
                    let haterspan = postelem.getElementsByClassName('haters')[0];
                    
                    if(result.HaterIds != "") {
                        let count = (result.HaterIds.includes(",")) ? result.HaterIds.split(",").length : '1';
                        haterspan.innerHTML = `<button id="hatebtn${post_id}" class="hate-btn">Hate this</button> - ${count} haters`;
                    } else {
                        haterspan.innerHTML = `<button id="hatebtn${post_id}" class="hate-btn">Hate this</button> - No haters`;
                    }
                }
            }, err => {
                console.log("Got an error after posting ajax: ");
                console.dir(err);
            });
        } else if(event.target.className.toLowerCase() === "delete-btn") {
            let post_id = event.target.id.replace("deletebtn", "");
            
            console.log("There was a delete click");
            
            post_ajax(`/delete/${post_id}`, {}).then(result => {
                if(result) {
                    let postelem = document.getElementById(`post${result.id}`);
                    postlist.removeChild(postelem);
                }
            }, err => {
                console.log("Got an error after posting delete ajax");
                console.log(err);
            });
        }
    }
})


//Make sure the select is showing the right option when the page is loaded
document.addEventListener('DOMContentLoaded', function () {

    let options = sortselect.options;
    let value = window.location.href.includes('bottom') ? 'bottom' : 'top';
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == value) {
            console.log(`Value: ${value}`);
            sortselect.selectedIndex = i;
            break;
        }
    }
}, false);
