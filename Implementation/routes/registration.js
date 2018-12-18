let express = require('express');
let router = express.Router();
let passport = require('passport');
const UserServices = require('../Controller/UserServices');

router.get('/', (req, res) => {
    res.render('registration',{auth: req.isAuthenticated()});
});
router.post('/', (req,res) =>{
    if(!req.isAuthenticated()){
        UserServices.registerBusinessCustomer(req.body,(result) =>{
            if(result !== false){
                res.render('login',{auth: req.isAuthenticated(),newReg: true})
            }
        })
    }else
    {
        res.render('deniedAccess');
    }

});

module.exports = router;