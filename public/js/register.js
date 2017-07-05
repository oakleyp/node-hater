//Returns array of verbose error strings for each problem with the submission, or empty array if all's good
// More thorough validation occurs server-side
function validateFields(data) {
    let result = [];

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (data[key] == null) {
                //Shouldn't really happen on a modern browser, all fields are required.
                return ['Sorry, one or more fields were left blank. Please fill out the entire form and try again.'];
            }
        }
    }

    return result;
}

document.querySelector('#register-form').addEventListener('submit', submit);

function submit(event) {
    event.preventDefault();
    console.log("Submitting form.");

    let inputs = event.target.getElementsByTagName('input');
    let fields = {};

    //Check fields, post
    for (var i = 0; i < inputs.length; i++) {
        let name = inputs[i].name;
        let value = inputs[i].value;

        switch (name) {
            case 'firstname':
                fields['firstname'] = value;
                break;
            case 'lastname':
                fields['lastname'] = value;
                break;
            case 'username':
                fields['username'] = value;
                break;
            case 'email':
                fields['email'] = value;
                break;
            case 'password':
                fields['password'] = value;
                break;
            case 'cpassword':
                fields['cpassword'] = value;
                break;
            default:
                break;
        }

    }
    
    console.log("Fields submitted:");
    console.dir(fields);

    let errors = validateFields(fields);

    if (errors.length == 0) {
        //Post fields
        post('/register/', fields);
    } else {
        console.log("Errors in submission.");
        let alerts = '';
        for (var i = 0; i < errors.length; i++) {
            alerts += `${errors[i]}`;
        }

        alert(alerts);

    }
}
