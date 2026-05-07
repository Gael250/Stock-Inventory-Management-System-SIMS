const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {

    } else {
        res.satus(401).json({
            success: false,
            message: 'Access denied! Please login first.'
        });
    }
};

module.exports = isAuthenticated;