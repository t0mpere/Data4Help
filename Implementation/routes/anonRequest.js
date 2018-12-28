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
    console.log(req.body);
    let params = req.body;
    //do modifications to params

    //check parameters
    let check = true;

    if(!params.title.length){
        check = false;
    }

    if(isNaN(params.age_from) || isNaN(params.age_to)){
        check = false;
    }

    //check if age_from is bigger than age_to
    if(parseInt(params.age_to) < parseInt(params.age_from) || params.age_to < 0 || params.age_from < 0){
        check = false;
    }

    //check consistency between date if it's a subscription
    if(params.periodical !== '0')
        params.date_to = 0;
    else{
        let date_from = params.date_from.split("-");
        let date_to = params.date_to.split("-");
        let day_from = parseInt(date_from[2], 10);
        let month_from = parseInt(date_from[1], 10);
        let year_from = parseInt(date_from[0], 10);
        let day_to = parseInt(date_to[2], 10);
        let month_to = parseInt(date_to[1], 10);
        let year_to = parseInt(date_to[0], 10);

        if(year_to < year_from)
            check = false;
        else if(year_from === year_to && month_to < month_from)
            check = false;
        else if(year_from === year_to && month_to === month_from && day_to < day_from)
            check = false;
    }

    params.date_from = new Date(params.date_from);
    params.date_to = new Date(params.date_to);

    //repeat check date
    //check consistency between from to


    if(!check)
        res.send({result : check});
    else{
        console.log(req.user);
        RequestServices.makeAnonRequest(req.user._email,params,(result) => {
            res.send({result : result})
        });
    }

});

module.exports = router;