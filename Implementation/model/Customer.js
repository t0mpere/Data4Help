const db = require('../database/DbConnection');
class Customer {


    constructor(email,password){
        this._password = password;
        this._email = email;
    }
    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    static getCustomerFromDb(email,callback){

        db.con.query("SELECT * FROM PrivateCustomers,BusinessCustomers where email = "+email+";",function (err,res) {
            if (err) throw err;

            let tmp = new Customer(res[0]._email,res[0].password);
            //Function that handles the result of the query
            callback(tmp);
            console.log(tmp);
        });
    }



}
module.exports = Customer;