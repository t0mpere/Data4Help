const PrivateCustomer = require('../model/PrivateCustomer');
const UserData = require('../model/UserData');
const BusinessCustomer = require("../model/BusinessCustomer");
/*
*   PrivateCustomer Module:
*
*   Will interface only with the mobile app, providing all the methods of managing the
*   account (login, register, subscribe, etc.) and which also allows the Private Customer to see his/her personal data.
 */

/*
Object Containing
args: {
    email
    password
    name
    surname
    sex
    placeOfBirth
    dateOfBirth
    cf
}
like
registerPrivateCustomer({
    email:'tompere96@gmail.com',
    password: 'psw',
    name:'Tommaso',
    surname: 'Peresson',
    sex: 'M',
    placeOfBirth: 'Udine',
    dateOfBirth: new Date(1996,5,11),
    cf:'PRSTMS96H11L483L'
});
callback returns weather if the committing was successful or not
*/
function registerPrivateCustomer(args,callback) {
    new PrivateCustomer(args).commitToDb(callback);

}
/*
 * checks if exist any private/business customer with given email
 *
 * callback(res) res is bool
 */
function isCustomerRegistered(email,callback) {
    return PrivateCustomer.isEmailPresent(email,callback);
}
/*
*   callback(res) res is an array of UserData
 */
function getPersonalData(email,callback) {
    return UserData.getUserDataFromEmail(email,callback);
}
/*
*   callback(err)
 */
function addUserDataToDb(data,callback){
    for(let i = 0; i < data.length; i++){
        data[i].commitToDb(callback);
    }
}


/*
 *   BusinessCustomer Module:
 *   Will interface only with the web app (business customer side) that will provide the methods for managing the account
 *   for the Business Customer
 *
 */
function registerBusinessCustomer(args,callback){
    args._active = 0;
    new BusinessCustomer(args).commitToDb(callback);

}


 /*
 *   SystemManager Account:
 *   Will interface only with the web app ( system manager side) providing methods to see the business customers
 *   who want to register and to accept / reject them
 */

 module.exports = {
     registerPrivateCustomer:registerPrivateCustomer,
     addUserDataToDb:addUserDataToDb,
     isCustomerRegistered:isCustomerRegistered,
     registerBusinessCustomer:registerBusinessCustomer

 }