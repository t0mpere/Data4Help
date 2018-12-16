const PrivateRequest = require('../model/PrivateRequest');
const UserData = require('../model/UserData');
/*
*
*   Incoming Request handler functions:
*
*   Will interface only with the mobile application, providing methods to accept or reject the request from a
*   Business Customer, showing all the information available on the latter.
 */
function acceptPrivateRequest(PCEmail,BCEmail,callback) {

}
function denyPrivateRequest(PCEmail,BCEmail,callback) {

}




/*
*
*   Request handler functions:
*
*   will interface only with the web app used by Business Customer, providing methods to see information about made
*   requests (updates or results) and to make others, both individual and anonymized requests.
*
 */
function makePrivateRequest(BCEmail,PCEmail,callback) {
    PrivateRequest.getPrivateRequest(PCEmail,BCEmail,(res) =>{
        if (res === false) {
            new PrivateRequest(new Date(),0,PCEmail,BCEmail).commitToDb();
            callback(true);
        } else {
            callback(false);
        }
    })
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
getPrivateData('giackosparrow@hotmail.it','cami.231298@gmail.com',(res) =>{
   console.log(res);
});