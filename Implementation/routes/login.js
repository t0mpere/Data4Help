let express = require('express');
let router = express.Router();
let passport = require('passport');
const Utils = require('../routes/utils');

router.get('/', (req, res) => {
    if(!req.isAuthenticated()){
        res.render('login',{newReg: false});
    }res.redirect('/bc/logout');
});

router.post('/', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;
