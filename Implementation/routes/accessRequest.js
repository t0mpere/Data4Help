let express = require('express');
let router = express.Router();
let passport = require('passport');
const UserServices = require('../Controller/UserServices');
const RequestServices = require('../Controller/RequestServices');

router.get('/',(req,res) => {
    if(req.isAuthenticated()){
        console.log(req.user._email);
        RequestServices.getPrivateRequests(req.user._email,(result) =>{
            res.render('accessRequest',{privateRequests:result});
        });
    }else res.render('accessRequest');
});
router.post('/', function(req, res) {
    console.log(req.user._email,req.body.email);
    RequestServices.getPrivateData(req.user._email,req.body.email,(result) =>{
        res.send({res:result});
    });

});

module.exports = router;