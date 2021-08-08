function checkAdmin() {

    const baseUrl = 'http://ec2-44-194-146-225.compute-1.amazonaws.com:5000';

    let userId = localStorage.getItem('user_id');
    let token = localStorage.getItem('token');
    axios({
        headers: {
            'user': userId,
            'authorization': "Bearer " + token,
        },
        method: 'get',
        url: baseUrl + '/api/user/' + userId,
    })
        .then(function (response) {
            if (response.data.data.userdata['role_name'] == 'user'){
                localStorage.clear();
                window.location.replace('/home.html');
                
            }
        })
        .catch(function (response) {
            console.log(response)

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
                text: 'Unable retrieve user role',
            }).show();
            }
            
        });

} //End of getOneUser