const db = require('../database/DbConnection');
class Customer {

    static isEmailPresent(email,callback){
        let sql = "SELECT * FROM Customers WHERE email = '" + email +"'";
        db.con.query(sql,function (err,res) {
            if (err) throw err;
            if(res[0] !== undefined)
                callback(true);
            else
                callback(false);
        })
    }

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



}
module.exports = Customer;