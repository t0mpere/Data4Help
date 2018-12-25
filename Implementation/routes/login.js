let express = require('express');
let router = express.Router();
let passport = require('passport');
const Utils = require('../routes/utils');
const UserServices = require("../Controller/UserServices");

router.get('/', (req, res) => {
    if(!req.isAuthenticated()){
        res.render('login',{newReg: false});
    }res.redirect('/bc/logout');
});
router.get('/pc', (req, res) => {
        res.writeHead(200, {"Content-Type": "application/json"});
        let JSONResp = {
            prova:'prova'
        };
        res.end(JSON.stringify(JSONResp));

});
router.post('/pc',(req, res) => {
    UserServices.authPrivateCustomer(req.body.email,req.body.password,(authResult) =>{
        res.writeHead(200, {"Content-Type": "application/json"});
        let JSONResp = {
            auth:authResult
        };
        res.end(JSON.stringify(JSONResp));
    });


});

router.post('/', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;
