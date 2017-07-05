//Returns array of verbose error strings for each problem with the submission, or empty array if all's good
// More thorough validation occurs server-side
function validateFields(data) {
    
    //TODO: Actually validate
    let result = [];
    
    for(var key in data) {
        if(data.hasOwnProperty(key)) {
            
        }
    }
    
    return true;
    
    return result;
}

document.querySelector('#login-form').addEventListener('submit', submit);

function submit(event){
    event.preventDefault();
    
    let inputs = event.target.getElementsByTagName('input');
    
    //Check fields, post
    let fields = {
        username: inputs[0],
        password: inputs[1],
        remember: inputs[2]
    };
    
    if(validateFields(fields)) {
        post('/login/', fields);
    }
    
    
}