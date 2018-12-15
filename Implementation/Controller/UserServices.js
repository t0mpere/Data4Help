const PrivateCustomer = require('../model/PrivateCustomer');
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
createPrivateCustomer({
    email:'tompere96@gmail.com',
    password: 'psw',
    name:'Tommaso',
    surname: 'Peresson',
    sex: 'M',
    placeOfBirth: 'Udine',
    dateOfBirth: new Date(1996,5,11),
    cf:'PRSTMS96H11L483L'
});
*/

function createPrivateCustomer(args) {
    new PrivateCustomer(args).commitToDb();
}
function isPrivateCustomerRegistered(email,callback) {
    PrivateCustomer.isEmailPresent(email,callback);
}
function getPersonalData() {

}


/*
 *   BusinessCustomer Module:
 *   Will interface only with the web app (business customer side) that will provide the methods for managing the account
 *   for the Business Customer
 *
 */


 /*
 *   SystemManager Account:
 *   Will interface only with the web app ( system manager side) providing methods to see the business customers
 *   who want to register and to accept / reject them
 */