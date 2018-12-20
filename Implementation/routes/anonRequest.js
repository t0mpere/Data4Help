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

router.get('/makeRequest',(req,res) => {
    res.render('anonRequest')
});

router.get('/',(req,res) => {
    RequestServices.getQueries(req.user._email,(result)=>{
        console.log(result);
        if(result.length > 0){
            res.render('anonRequestViewer',{queries:result})
        }
    })

});
router.post('/',(req,res) => {
    RequestServices.getQueryData(req.user._email,req.body.title,(result) => {
        console.log('result: ',result);
        if(result.length > 0){
            res.send({res:result})
        }else {
            res.send({res:result});
        }
    })

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
        res.send({result : result})
    });

});

module.exports = router;