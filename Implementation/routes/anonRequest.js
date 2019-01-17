let express = require('express');
let router = express.Router();
const Utils = require('../routes/utils');
const RequestServices = require('../Controller/RequestServices');

router.use(function(req, res, next) {
    if(Utils.isBusinessCustomer(req))
        next();
    else {
        res.status(401);
        res.render('deniedAccess');
    }
});

router.get('/makeRequest',(req,res) => {
    res.render('anonRequest')
});

router.get('/',(req,res) => {
    RequestServices.getQueries(req.user._email,(result)=>{
        res.render('anonRequestViewer',{queries:result})
    })

});
router.post('/',(req,res) => {
    RequestServices.getQueryData(req.user._email,req.body.title,(result) => {
        if(result.length > 0){
            res.send({res:result})
        }else {
            res.send({res:result});
        }
    })

});

router.post('/makeRequest',(req,res) =>{
    RequestServices.makeAnonRequest(req.user._email,req.body,(result) => {
        res.send({result : result})
    });
});

module.exports = router;