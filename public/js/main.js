//Creates and posts a hidden form to the specified url, with input elements and values given by params object
function post(url, params) {
    console.log(`Submitting form to url ${url} with params:`, params);
    
    let form = document.createElement('form');
    form.setAttribute('action', url);
    form.setAttribute('method', 'POST');
    
    for(var key in params) {
        if(params.hasOwnProperty(key)) {
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