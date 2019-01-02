let express = require('express');
let router = express.Router();
let passport = require('passport');
const UserServices = require('../Controller/UserServices');
const Utils = require('../routes/utils');

router.use(function(req, res, next) {
    if(Utils.isSystemManager(req))
        next();
    else {
        res.status(401);
        res.render('deniedAccess');
    }
});

router.get('/pendingRequests/',(req,res) => {
    UserServices.getPendingBusinessCustomers((result)=> {
        res.render('pendingRequests',{pendingBusinessCustomers:result});
    });
});
router.post('/pendingRequests/',(req,res) => {
    if (req.body.accepted === 'true'){
        UserServices.setBusinessCustomerActive(req.body.email,(result) =>{})
    } else{
        UserServices.setBusinessCustomerDenied(req.body.email,(result) =>{})
    }
    res.send('');
});
module.exports = router;