const db = require('../database/DbConnection');
class PrivateRequest{
    constructor(timestamp,accepted,privateCustomerEmail,businessCustomerEmail){
        this._timestamp =timestamp;
        this._accepted = accepted? 1 : 0;
        this._businessCustomerEmail = businessCustomerEmail;
        this._privateCustomerEmail = privateCustomerEmail;
    }
    commitToDb(callback){
        let sql = "INSERT INTO PrivateRequest(accepted,BusinessCustomers_email,PrivateCustomers_email) VALUES (?)";
        let values = [
            [
                this._accepted,
                this._businessCustomerEmail,
                this._privateCustomerEmail
            ]
        ];
        db.con.query(sql,values,(err) => {
            if (err) {
                callback(err);
                throw err;
            }
            else callback(true);
        });
    }
    static getPrivateRequest(PCEmail,BCEmail,callback){
        let sql = "SELECT * FROM PrivateRequest where PrivateCustomers_email = '"+PCEmail+"' and BusinessCustomers_email = '"+ BCEmail +"'";
        db.con.query(sql,(err,res) =>{
            if(err) throw err;
            if(res.length) {
                let tuple = res[0];
                console.log("time: "+ tuple.timestamp);
                callback(new PrivateRequest(
                    tuple.timestamp,
                    tuple.accepted,
                    tuple.BusinessCustomers_email,
                    tuple.PrivateCustomers_email
                ));
            }else callback(false);
        })
    }
}
module.exports = PrivateRequest;
