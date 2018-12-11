let express = require('express');
let router = express.Router();

router.get('/', function(req, res){
    if(req.isAuthenticated){
        res.send('Not logged in.')
    }else{
        req.logout();
        res.redirect('/');
    }

});

module.exports = router;
