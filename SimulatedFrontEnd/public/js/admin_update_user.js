let $updateUserFormContainer = $('#updateUserFormContainer');
if ($updateUserFormContainer.length != 0) {
    console.log('Update User form is detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit user role data
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = 'http://ec2-44-194-146-225.compute-1.amazonaws.com:5000';
        //Collect role id value from the input element, roleIdInput
        let roleId = $('#roleIdInput').val();
        //Obtain user id from local storage
        let userId = localStorage.getItem('user_id');
        let token = localStorage.getItem('token');
        //There is a hidden textbox input, userRecordIdInput
        let recordId = $('#userRecordIdInput').val();
        let webFormData = new FormData();
        webFormData.append('roleId', roleId);
        webFormData.append('recordId', recordId);
        axios({
                method: 'put',
                url: baseUrl + '/api/user/',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data', 'user': userId, 'authorization': "Bearer "+token}
            })
            .then(function(response) {
                new Noty({
                    type: 'success',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '5000',
                    text: 'User role has changed.',
                }).show();
            })
            .catch(function(response) {
                if (response.response.status == 403) {
                    localStorage.clear();
                    window.location.replace('/home.html');
                } else{
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '6000',
                    text: 'Unable to update.',
                }).show();
            }

            });
    });
    $('#backButton').on("click", function(e) {
        e.preventDefault();
        window.history.back();
    });

    function getOneUser() {

        const baseUrl = 'http://ec2-44-194-146-225.compute-1.amazonaws.com:5000';
        var query = window.location.search.substring(1);
        let arrayData = query.split("=");
        let recordIdToSearchUserRecord = arrayData[1];
        let userId = localStorage.getItem('user_id');
        let token = localStorage.getItem('token');
        axios({
            headers: {
            'user': userId,
            'authorization': "Bearer "+token
        },
                method: 'get',
                url: baseUrl + '/api/user/' + recordIdToSearchUserRecord,
            })
            .then(function(response) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically populate the elements with data.
                console.dir(response.data.data);
                const record = response.data.data.userdata;
                $('#fullNameOutput').text(record.fullname);
                $('#emailOutput').text(record.email);
                $('#userRecordIdInput').val(record.user_id);
                $('#roleIdInput').val(record.role_id);

            })
            .catch(function(response) {
                if (response.response.status == 403) {
                    localStorage.clear();
                    window.location.replace('/home.html');
                } else{
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable retrieve user data',
                }).show();
            }
            });

    } //End of getOneUser
    //Call getOneUser function to do a GET HTTP request on an API to retrieve one user record
    getOneUser();
} //End of checking for $updateUserFormContainer jQuery object