var express = require('express');
var router = express.Router();
let passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: req.isAuthenticated() ,content: 'placeholder' });
});

module.exports = router;
