module.exports = (req, res, next) => {
    // check that the client is authenticated
    // if(req.session && req.session.loggedIn){
    //     next();
    // }else {
    //     res.status(401).json({you: "You need to login to get data"});
    // }
    if(req.headers.authorization){
        next();
    }else {
        res.status(401).json({you: "You need to login to get data"});
    }
    
}