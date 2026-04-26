const jwt = require('jsonwebtoken');

//Generate JWT 
module.exports = (userId) => {
    return jwt.sign({ userId: userId },
         process.env.SECRET_KET,
         {expiresIn : process.env.LOGIN_EXPIRES}
        );
}