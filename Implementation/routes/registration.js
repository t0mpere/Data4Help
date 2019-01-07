let express = require('express');
let router = express.Router();
let passport = require('passport');
const UserServices = require('../Controller/UserServices');
const Utils = require('../routes/utils');

router.use(function (req,res,next) {
    if(req.isAuthenticated()) {
        res.render('error',{error:{status:'not logged in',stack: null}});
    }else next();
});
router.get('/', (req, res) => {
    res.render('registration',{auth: Utils.isBusinessCustomer(req)});
});
router.post('/', (req,res) =>{
    if(!req.isAuthenticated()){
        UserServices.registerBusinessCustomer(req.body,(result) =>{
            if(result !== false){
                res.render('login',{auth: req.isAuthenticated(),newReg: true})
            }else {
                res.render('registration',{auth: req.isAuthenticated(), regError: true})
            }
        })
    }

});

module.exports = router;