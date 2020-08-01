const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


module.exports = async (req, res, next) => {
  console.log('req.session.views: ', req.session.views)
  console.log('isAUTH - req.session.userId: ', req.session.userId)

    const authHeader = req.get('Authorization');
    if(req.session.userId) {
      console.log('USER COOKIE FOUND!')
      req.isAuth = true;
      req.userId = req.session.userId
      return next();
    }
    if(!authHeader) {
      //console.log('THERE IS NO AUTH HEADER - MOVE ON')
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // Authorization: Bearer asdfjklasdfl
    //console.log('token: ', typeof token)
    if (!token || token === "" || token === 'null') {
      //console.log('THERE IS NO BEARER - MOVE ON')
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try { decodedToken = jwt.verify(token, 'somesupersecretkey') }
    catch (err) {
        req.isAuth = false;
        return next();
    }

    if(!decodedToken) {
        req.isAuth = false;
        return next();
    } 
    console.log('decodedToken.userId: ', decodedToken.userId)
    req.isAuth = true;
    req.userId = decodedToken.userId;
    if(!req.session.userId) {
      console.log('no userID on session yet, lets set it.')
      req.session.userId = req.userId
    }
    next()
}