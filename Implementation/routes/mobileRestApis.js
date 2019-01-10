let express = require('express');
let router = express.Router();
const UserServices = require("../Controller/UserServices");
const RequestServices = require("../Controller/RequestServices");

router.get('/pc', (req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let JSONResp = {
        prova:'prova'
    };
    res.end(JSON.stringify(JSONResp));

});
router.post('/login',(req, res) => {
    console.log(req.body);
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
                if(!response){
                    JSONResp = {result:response}
                }
                res.end(JSON.stringify(JSONResp));
            })

        }else {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.send();
        }
    });


});

router.post('/access_requests',(req, res) => {
    UserServices.authPrivateCustomer(req.body.email,req.body.password,(authResult) =>{
        if(authResult) {
            res.writeHead(200, {"Content-Type": "application/json"});
            UserServices.getPrivateRequests(req.body.email,(response) => {
                let JSONResp = response;
                if(!response){
                    JSONResp = {result:response}
                }
                res.end(JSON.stringify(JSONResp));
            })

        }else {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.send();
        }
    });


});
router.post('/access_requests/set_status',(req, res) => {
    UserServices.authPrivateCustomer(req.body.email,req.body.password,(authResult) =>{
        if(authResult) {
            res.writeHead(200, {"Content-Type": "application/json"});
            console.log(req.body);
            RequestServices.setPrivateRequestStatus(req.body.email,req.body.BCEmail,req.body.val,(result) =>{
                RequestServices.getPrivateRequestsByPc(req.body.email,(response) => {
                    let JSONResp = response;
                    if(!response){
                        JSONResp = {result:response}
                    }
                    res.end(JSON.stringify(JSONResp));
                });
            })

        }else {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.send();
        }
    });


});

router.post('/put_userdata',(req, res) => {
    console.log(req.body);
    UserServices.authPrivateCustomer(req.body.email,req.body.password,(authResult) =>{
        if(authResult) {
            res.writeHead(200, {"Content-Type": "application/json"});

            let JSONResp;
            UserServices.putUserData(req.body,(result)=>{
                JSONResp = {result:result};
                res.end(JSON.stringify(JSONResp));
            })

        }else {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.send();
        }
    });


});7


router.post('/register_pc',(req, res) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    console.log(req.body);
    req.body.dateOfBirth = new Date(req.body.dateOfBirth);
    UserServices.registerPrivateCustomer(req.body,(result) =>{
            let JSONResp = {result:result};
            res.end(JSON.stringify(JSONResp));
    })




});

module.exports = router;
