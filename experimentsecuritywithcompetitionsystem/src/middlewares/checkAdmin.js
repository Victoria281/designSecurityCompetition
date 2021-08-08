module.exports.checkUserRoleAdmin = (req, res, next) => {
        console.log('user role '+req.userrole);
        if (req.userrole != 'admin') {
            res.status(403).json({ message: 'Unauthorized access' })
        } else {
            next()
        }

    } //End of checkUserRoleAdmin