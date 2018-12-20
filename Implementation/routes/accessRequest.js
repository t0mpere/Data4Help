let express = require('express');
let router = express.Router();
let passport = require('passport');
const UserServices = require('../Controller/UserServices');
const RequestServices = require('../Controller/RequestServices');
const Utils = require('../routes/utils');

router.use(function(req, res, next) {
    if(Utils.isBusinessCustomer(req))
        next();
    else res.render('deniedAccess')
});

router.get('/',(req,res) => {
        console.log(req.user._email);
        RequestServices.getPrivateRequests(req.user._email,(result) =>{
            res.render('accessRequest',{privateRequests:result});
        });
});

router.get('/makeRequest',(req,res) => {
    res.render('privateRequestForm')
});
router.post('/makeRequest',(req,res) =>{
    RequestServices.makePrivateRequest(req.user._email,req.body.email,(result) =>{
        res.send({result:result});
    })
});

router.post('/', function(req, res) {
    console.log(req.user._email,req.body.email);
    RequestServices.getPrivateData(req.user._email,req.body.email,(result) =>{
        res.send({res:result});
    });

});

module.exports = router;