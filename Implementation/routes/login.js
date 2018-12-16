let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/', (req, res) => {
    res.render('login',{auth: req.isAuthenticated(), newReg: false});
});

router.post('/', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;
