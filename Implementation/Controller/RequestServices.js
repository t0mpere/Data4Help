const PrivateRequest = require('../model/PrivateRequest');
const UserData = require('../model/UserData');
const AnonRequest = require('../model/AnonymousRequest');
/*
*
*   Incoming Request handler functions:
*
*   Will interface only with the mobile application, providing methods to accept or reject the request from a
*   Business Customer, showing all the information available on the latter.
 */
function getPrivateRequestsByPc(PCEmail,callback) {
    PrivateRequest.getPrivateRequestsByPC(PCEmail,callback);
}
function setPrivateRequestStatus(PCEmail,BCEmail,val,callback) {
    PrivateRequest.setAcceptedStatus(BCEmail,PCEmail,val,callback)
}




/*
*
*   Request handler functions:
*
*   will interface only with the web app used by Business Customer, providing methods to see information about made
*   requests (updates or results) and to make others, both individual and anonymized requests.
*
 */
function getQueryData(BCEmail,title,callback) {
    AnonRequest.getAnonymousRequestByBC(BCEmail,title,(res) =>{
        res.getQueryData(callback);
    });
}
function getQueries(BCEmail,callback) {
    AnonRequest.getAnonymousRequestsByBC(BCEmail,(res)=>{
        if(!res) callback(false);
        else callback(res);
    })
}

function makePrivateRequest(BCEmail,PCEmail,callback) {
    PrivateRequest.getPrivateRequest(PCEmail,BCEmail,(res) =>{
        if (res === false) {
            new PrivateRequest({
                timestamp:new Date(),
                accepted:0,
                PrivateCustomers_email:PCEmail,
                BusinessCustomers_email:BCEmail}
                ).commitToDb(callback);
        } else {
            callback(false);
        }
    })
}

function getPrivateRequests(BCEmail,callback) {
    PrivateRequest.getPrivateRequestsByBC(BCEmail,callback);
}

function getPrivateData(BCEmail,PCEmail,callback) {
    PrivateRequest.getPrivateRequest(PCEmail,BCEmail,(res)=>{
        if(res === false) callback(res);
        else {
            if(res.accepted === 1){
                UserData.getUserDataFromEmail(PCEmail,callback);
            }else {
                callback(false);
            }
        }

    })
}

function makeAnonRequest(BCEmail, params, callback) {
    AnonRequest.isInDb(BCEmail, params, (res) =>{
        if (res === false) {
            new AnonRequest(BCEmail,params).commitToDb(callback);
        }
        else callback(false);
    })

}

module.exports = {
    getPrivateRequests:getPrivateRequests,
    getPrivateData:getPrivateData,
    makePrivateRequest:makePrivateRequest,
    makeAnonRequest:makeAnonRequest,
    getQueryData:getQueryData,
    getQueries:getQueries,
    getPrivateRequestsByPc:getPrivateRequestsByPc,
    setPrivateRequestStatus:setPrivateRequestStatus
};