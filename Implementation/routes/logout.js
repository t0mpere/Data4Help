let express = require('express');
let router = express.Router();

router.get('/', function(req, res){
    if(req.isAuthenticated() === false){
        res.render('deniedAccess');
    }else{
        req.logout();
        res.redirect('/');
    }

});

module.exports = router;
