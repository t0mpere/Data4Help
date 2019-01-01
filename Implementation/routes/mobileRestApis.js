let express = require('express');
let router = express.Router();
const UserServices = require("../Controller/UserServices");

router.get('/pc', (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let JSONResp = {
        prova:'prova'
    };
    res.end(JSON.stringify(JSONResp));

});
router.post('/login',(req, res) => {
    UserServices.authPrivateCustomer(req.body.email,req.body.password,(authResult) =>{
        res.writeHead(200, {"Content-Type": "application/json"});
        let JSONResp = {
            auth:authResult
        };
        res.end(JSON.stringify(JSONResp));
    });


});
router.post('/userdata',(req, res) => {
    UserServices.authPrivateCustomer(req.body.email,req.body.password,(authResult) =>{
        if(authResult) {
            res.writeHead(200, {"Content-Type": "application/json"});
            UserServices.getPersonalData(req.body.email,(response) => {
                let JSONResp = response;
                res.end(JSON.stringify(JSONResp));
            })

        }
    });


});

module.exports = router;
