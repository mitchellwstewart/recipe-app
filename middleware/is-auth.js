const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // Authorization: Bearer asdfjklasdfl
    if (!token || token === "") {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    console.log('try to decode this dang JWT: ', token)
    try {
        decodedToken = jwt.verify(token, 'somesupersecretkey')
        console.log('WORKED: ', decodedToken)
    }
    catch (err) {
      console.log('DIDNt WORK: ', err)
        req.isAuth = false;
        return next();
    }

    if(!decodedToken) {
        req.isAuth = false;
        return next();
    }
    
    req.isAuth = true;
    req.userId = decodedToken.userId;
    console.log('hitting it')
    next()
}