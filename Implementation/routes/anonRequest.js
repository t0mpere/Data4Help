let express = require('express');
let router = express.Router();
let passport = require('passport');
const RequestServices = require('../Controller/RequestServices');

router.get('/',(req,res) => {
    if(req.isAuthenticated()){
        console.log(req.user._email);
        RequestServices.getPrivateRequests(req.user._email,(result) =>{
            res.render('anonRequest',{privateRequests:result});
        });
    }else res.render('anonRequest');
});

module.exports = router;