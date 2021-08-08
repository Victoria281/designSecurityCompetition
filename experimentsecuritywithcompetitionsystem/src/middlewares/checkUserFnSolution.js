const config = require('../config/config');
const jwt = require('jsonwebtoken');
module.exports.checkForValidUserRoleUser = (req, res, next) => {
    //If the token is valid, the logic extracts the user id and the role information.
    //If the role is not user, then response 403 UnAuthorized
    //The user id information is inserted into the request.body.userId
        console.log('http header - user ', req.headers['user']);
        var userid = req.headers['user']
        if (typeof req.headers.authorization !== "undefined") {
            // Retrieve the authorization header and parse out the
            // JWT using the split function
            let token = req.headers.authorization.split(' ')[1];
            //console.log('Check for received token from frontend : \n');
            // console.log(token);
            jwt.verify(token, config.JWTKey, (err, data) => {
                console.log('data extracted from token \n',data);
                var decoded = data;
                if (err) {
                    console.log(err);
                    return res.status(403).send({ message: 'Unauthorized access' });
                }
                else if (decoded.id != userid){
                    console.log("Invalid Userid")
                    return res.status(403).send({ message: 'Unauthorized access' });
                }
                else {
                    req.userId = data.id;
                    req.userrole = data.userrole;
                    next();
                }
            })
  
      }else{
        res.status(403).send({ message: 'Unauthorized access' });

      }
    } //End of checkForValidUserRoleUser