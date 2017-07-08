//Creates and posts a hidden form to the specified url, with input elements and values given by params object
function post(url, params) {
    console.log(`Submitting form to url ${url} with params:`, params);

    let form = document.createElement('form');
    form.setAttribute('action', url);
    form.setAttribute('method', 'POST');

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            let hiddenfield = document.createElement('input');
            hiddenfield.setAttribute('type', 'hidden');
            hiddenfield.setAttribute('name', key);
            hiddenfield.setAttribute('value', params[key]);

            form.appendChild(hiddenfield);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

//Creates and posts a hidden form via AJAX to the specified URL, returns JSON response in promise
function post_ajax(url, params) {
    return new Promise((resolve, reject) => {
        console.log(`AJAX submitting POST req to url ${url} with params:`, params);
        let xhttp = new XMLHttpRequest();
        //AJAX callback 
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Got response from ajax post: ");
                console.dir(JSON.parse(this.response));
                
                resolve(JSON.parse(this.response));
            } else {
                //reject(this.response);
            }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        let req_body_string = '';
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                req_body_string += `${key}=${params[key]}&`;
            }
        }
        xhttp.send(req_body_string);
    });
}
