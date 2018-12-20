let express = require('express');
let router = express.Router();
let passport = require('passport');
const Utils = require('../routes/utils');
const RequestServices = require('../Controller/RequestServices');

router.use(function(req, res, next) {
    if(Utils.isBusinessCustomer(req))
        next();
    else res.render('deniedAccess')
});

router.get('/',(req,res) => {
    res.render('anonRequest')
});

router.post('/makeRequest',(req,res) =>{
    //console.log(req.body);
    let params = req.body;
    //do modifications to params

    //check parameters
    //check at least one true
    //repeat check date
    //check consistency between from to

    console.log(req.user);
    RequestServices.makeAnonRequest(req.user._email,params,(result) => {
        res.render('anonRequest',{result : result})
    });

});

module.exports = router;