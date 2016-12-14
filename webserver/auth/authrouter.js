let authByToken = require('./authbytoken');
let bodyParser = require('body-parser');
let apiRoutes = require('express').Router();
let jsonBodyParser = bodyParser.json();
let urlEncodedParser = bodyParser.urlencoded({
    extended: false
});
apiRoutes.post('/signin', jsonBodyParser, urlEncodedParser, function(req, res) {

    if (!req.body.email || !req.body.pwd) {        
        res.status(401).json({
            error: "Please try with valid credentials..!"
        });
        return;
    }

    try {

        authByToken.signin(req.body.email, req.body.pwd,
            function(err, user, jwtToken) {
                if (err) {
                    console.log("Called back with error  : ", err);
                    return res.status(500).json({
                        error: "Internal error in processing request, please retry later..!"
                    });
                }

                if (!jwtToken) {
                    return res.status(403).json({
                        error: "Internal error in processing request, please retry later..!"
                    });
                } 
                    user['token'] = jwtToken;
                    return res.status(200).json(user);
                
            },
            function(err) {
                console.log("Signin failed with error : ", err);
                return res.status(403).json(err);
            });
    } catch (err) {
        console.log("Caught error: ", err);
        return res.status(500).json({
            error: "Internal error in processing request, please retry later..!"
        });
    }
}); 

module.exports = apiRoutes;







