const JWT = require('jsonwebtoken');
const secret = "P@rv3z@2552"

const createTokenForUser = (user) => {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImgURL : user.profileImgURL,
        role: user.role
    }

    const token = JWT.sign(payload, secret);

    return token;
}

const verifyToken = (token) => {
    const verified = JWT.verify(token, secret);

    return verified;
}

module.exports = {
    createTokenForUser,
    verifyToken
}