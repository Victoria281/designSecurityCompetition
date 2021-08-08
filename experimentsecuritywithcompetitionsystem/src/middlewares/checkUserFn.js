module.exports.getClientUserId = (req, res, next) => {
        console.log('http header - user ', req.headers['user']);
        req.body.userId = req.headers['user'];
        console.log('Inspect user id which is planted inside the request header : ', req.body.userId);
        if (req.body.userId != null) {
            next()
            return;
        } else {
            res.status(403).json({ message: 'Unauthorized access' });
            return;
        }

    } //End of getClientUserId