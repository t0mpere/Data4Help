var express = require('express');
var router = express.Router();
let passport = require('passport');
const Utils = require('../routes/utils');

/* GET home page. */
router.get('/', function(req, res, next) {

  console.log(req.user);
  if(req.isAuthenticated()){
      res.render('index', { title: 'Data4Help' , user: req.user._email });
  }else{
    res.render('index',{title: 'Data4Help'})
  }

});

module.exports = router;
