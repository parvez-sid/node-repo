const { verifyToken } = require("../service/auth");

function checkForAuthenticationCookie (cookieName){

    return (req, res, next) => {
        const tokenCookie = req.cookies[cookieName];
        if(!tokenCookie) return next();

        try {
            const user = verifyToken(tokenCookie);
            req.user = user
        } catch (error) {
            
        }
        return next()
    };
}

module.exports = {
    checkForAuthenticationCookie,
}