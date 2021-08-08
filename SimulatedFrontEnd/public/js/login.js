let $loginFormContainer = $('#loginFormContainer');
if ($loginFormContainer.length != 0) {
    console.log('Login form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function (event) {
        console.log("submit is clicked")
        event.preventDefault();
        const baseUrl = 'http://ec2-44-194-146-225.compute-1.amazonaws.com:5000';
        let email = $('#emailInput').val();
        let password = $('#passwordEncrypt').val();
        console.log("password is encrpted")
        console.log(password)
        let code = $('#codeInput').val();
        let resend = $('#resend').val();
        console.log(code)
        console.log(email)
        let webFormData = new FormData();
        webFormData.append('email', email);
        webFormData.append('password', password);
        webFormData.append('email_code', code);
        webFormData.append('resend', resend);
        axios({
            method: 'post',
            url: baseUrl + '/api/user/login',
            data: webFormData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(function (response) {
                console.log(response)
                if (response.data.status == "fail") {
                    localStorage.setItem("email", response.data.data.email)

                    console.log(window.location.href)
                    console.log(window.location.pathname)
                    if (window.location.pathname == "/code.html") {
                        console.log("code is wrong")
                        new Noty({
                            type: 'error',
                            layout: 'topCenter',
                            theme: 'sunset',
                            timeout: '6000',
                            text: 'Code is wrong',
                        }).show();
                    } else {
                        console.log("redirecting")
                        window.location.replace('/code.html');
                    }

                }
                //Inspect the object structure of the response object.
                //console.log('Inspecting the respsone object returned from the login web api');
                //console.dir(response);
                userData = response.data.data;
                if (userData.role_name == 'user') {
                    localStorage.clear();
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('user_id', userData.user_id);
                    localStorage.setItem('role_name', userData.role_name);
                    window.location.replace('user/manage_submission.html');
                    return;
                }
                if (response.data.data.role_name == 'admin') {
                    localStorage.clear();
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('user_id', userData.user_id);
                    localStorage.setItem('role_name', userData.role_name);
                    window.location.replace('admin/manage_users.html');
                    return;
                }
            })
            .catch(function (response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '6000',
                    text: 'Unable to login. Check your email and password',
                }).show();

            });
    });

} //End of checking for $loginFormContainer jQuery object