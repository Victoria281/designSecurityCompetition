const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");



const Decrypt = (data) => {
    return new Promise((resolve, reject) => {
        const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");
        const iv = CryptoJS.enc.Utf8.parse("ABCDEF1234123412");
        console.log("decrypting")
        let encryptedHexStr = CryptoJS.enc.Hex.parse(data);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        console.log("decrypted")
        console.log(decryptedStr.toString())
        return resolve(decryptedStr.toString())
    })

}

exports.processLogin = async (req, res, next) => {


    let email = req.body.email;
    console.log("check inside resend")
    console.log(req.body.resend)
    if (req.body.resend == "resend") {
        console.log("resending email")
        await auth.sendEmail(email, null)
            .then((emailsent) => {
                console.log(emailsent)

                if (emailsent.status == "success") {
                    console.log("email sent")
                    return res.status(200).json({
                        status: "sent",
                        message: "email has been sent"
                    });
                }
                else {
                    return res.status(500).json({
                        status: "error",
                        message: "email failed"
                    });
                }
            })
            .catch((error) => {
                return res.status(500).json({
                    status: "error",
                    message: "email failed"
                });
            })


    }
    else {

        let password = req.body.password;
        console.log("inside password")
        console.log(password)


        let email_code = req.body.email_code;
        let fail = false;
        let loginByCode = false;
        await Decrypt(password)
            .then((decoded_pwd) => {
                console.log("new password")
                password = decoded_pwd
                console.log(decoded_pwd)
                return auth.checkLogin(email)
            })

            .then((code) => {
                console.log("checking result for checklogin")
                console.log(code)
                console.log("whats indide newcode")
                console.log(code.newcode)
                if (code.newcode) {
                    return res.status(200).json({
                        status: "fail",
                        data: {
                            email: email
                        }
                    });
                }
                loginByCode = code.coderequired

                return auth.authenticate(email, loginByCode, email_code)
            })

            .then((results) => {
                if (loginByCode) {
                    console.log(results[0].codechecked)
                    if (results[0].codechecked == false) {
                        return res.status(200).json({
                            status: "fail",
                            data: {
                                email: email
                            }
                        });
                    }
                }

                console.log("Finished calling authenticate, checking password now")
                if (results.length == 1) {
                    if ((password == null) || (results[0] == null)) {
                        fail = true
                        auth.loginAttempts(email, fail)
                        return res.status(500).json({
                            status: "error",
                            message: "login failed"
                        });
                    }

                    if (bcrypt.compareSync(password, results[0].user_password) == true) {
                        if (results.logincode == false)
                            auth.loginAttempts(email, fail)
                        return res.status(200).json({
                            status: "success",
                            data: {
                                user_id: results[0].user_id,
                                role_name: results[0].role_name,
                                token: jwt.sign({ id: results[0].user_id, userrole: results[0].role_name }, config.JWTKey, {
                                    expiresIn: 86400 //Expires in 24 hrs
                                })
                            }
                        });

                    } else {
                        fail = true
                        auth.loginAttempts(email, fail)
                        // return res.status(500).json({ message: 'Login has failed.' });
                        return res.status(500).json({
                            status: "error",
                            message: "Login has failed."
                        });
                    } //End of passowrd comparison with the retrieved decoded password.
                } //End of checking if there are returned SQL results
            })
            .catch((err) => {
                if (err == 'Login has failed') {
                    fail = true;
                    auth.loginAttempts(email, fail)
                }
                console.log(err)
                return res.status(500).json({
                    status: "error",
                    message: "Login has failed."
                });
            })

    }

};


exports.processRegister = async (req, res, next) => {
    console.log('processRegister running.');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;


    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            console.log('Error on hashing password');
            return res.status(500).json({
                status: "error",
                message: "Unable to complete registration"
            });
        } else {

            await user.createUser(fullName, email, hash)
                .then((results) => {
                    if (results != null) {
                        console.log(results);
                        return res.status(200).json({
                            status: "success",
                            message: "Completed registration."
                        });
                    }
                })
                .catch((err) => {
                    console.log('processRegister method : callback error block section is running.');
                    console.log(err, '==================================================================');
                    return res.status(500).json({
                        status: "error",
                        message: "Unable to complete registration"
                    });
                })

        }
    });


}; // End of processRegister