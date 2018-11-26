var express = require('express');
const customer = require('../model/Customer');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    customer.getCustomerFromDb("'1079106370@qq.com'",function (result) {
        console.log(result);
        res.render('index',{title: result.email})
    });

});

module.exports = router;
