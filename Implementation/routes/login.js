let express = require('express');
let router = express.Router();
let passport = require('passport');
const Utils = require('../routes/utils');

router.get('/', (req, res) => {
    res.render('login',{auth: Utils.isBusinessCustomer(req), newReg: false});
});

router.post('/', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;
