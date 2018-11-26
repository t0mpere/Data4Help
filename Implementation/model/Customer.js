const db = require('../database/DbConnection');
class Customer {
    constructor(email,password){
        this.email = email;
        this.password = password;
    }
    getEmail(){

        db.con.query("select * from PrivateCustomer ");
        return this.email;
    }
    static getCustomerFromDb(email,callback){
        let tmp;
        db.con.query("SELECT * FROM PrivateCustomers where email = "+email+";",function (err,res,fields) {
            if (err) throw err;
            tmp = new Customer(res[0].email,res[0].password);
            callback(tmp);
            console.log(tmp);
        });
    }



}
module.exports = Customer;