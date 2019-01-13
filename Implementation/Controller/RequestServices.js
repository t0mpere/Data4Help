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

/*
*
*   This function returns all the Private Requests belonging to a specific Private Customer, given its email
*
 */
function getPrivateRequestsByPc(PCEmail,callback) {
    PrivateRequest.getPrivateRequestsByPC(PCEmail,callback);
}

/*
*
*   This function sets the status of a Private Request, depending on whether the request was accepted or not
*
 */
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

/*
*
*   This functions return all data belonging to an Anonymous Request
*
 */
function getQueryData(BCEmail,title,callback) {
    AnonRequest.getAnonymousRequestByBC(BCEmail,title,(res) =>{
        if(res) {
            res.getQueryData(callback);
        } else callback(false);
    });
}

/*
*
*   This function returns all Anonymous Requests belonging to a specific Business Customer, given its email
*
 */
function getQueries(BCEmail,callback) {
    AnonRequest.getAnonymousRequestsByBC(BCEmail,(res)=>{
        if(!res) callback(false);
        else callback(res);
    })
}

/*
*
*   This function makes a new Private Request, only if it doesn't already exist
*
 */
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

/*
*
*   This function returns all the Private Requests belonging to a specific Private Customer, given its email
*
 */
function getPrivateRequests(BCEmail,callback) {
    PrivateRequest.getPrivateRequestsByBC(BCEmail,callback);
}

/*
*
*  This function returns User Data of a specific Private Customer, only if the Private Request
*  has been accepted (res.accepted === 1)
*
 */
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

/*
*
*   This function make a new Anonymous Requests, checking that all the parameters belonging to the Anonymous Request
*   are consistent
*
 */
function makeAnonRequest(BCEmail, params, callback) {

    //check parameters
    let check = true;

    if(!params.title.length){
        check = false;
    }

    if(isNaN(params.age_from) || isNaN(params.age_to)){
        check = false;
    }

    //check if age_from is bigger than age_to
    if(parseInt(params.age_to) < parseInt(params.age_from) || params.age_to < 0 || params.age_from < 0){
        check = false;
    }

    //check consistency between date if it's a subscription
    if(params.periodical !== '0')
        params.date_to = 0;
    else{
        let date_from = params.date_from.split("-");
        let date_to = params.date_to.split("-");
        let day_from = parseInt(date_from[2], 10);
        let month_from = parseInt(date_from[1], 10);
        let year_from = parseInt(date_from[0], 10);
        let day_to = parseInt(date_to[2], 10);
        let month_to = parseInt(date_to[1], 10);
        let year_to = parseInt(date_to[0], 10);

        if(year_to < year_from)
            check = false;
        else if(year_from === year_to && month_to < month_from)
            check = false;
        else if(year_from === year_to && month_to === month_from && day_to < day_from)
            check = false;
    }

    params.date_from = new Date(params.date_from);
    params.date_to = new Date(params.date_to);

    if(!check)
        callback(false);
    else {
        AnonRequest.isInDb(BCEmail, params, (res) => {
            if (res === false) {
                new AnonRequest(BCEmail, params).commitToDb(callback);
            }
            else callback(false);
        })
    }
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