function hasUser() {
    return (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.render('invalid');
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (req.user) {
            res.render('invalid');
        } else {
            next();
        }
    };
}

module.exports = {
    hasUser,
    isGuest
};