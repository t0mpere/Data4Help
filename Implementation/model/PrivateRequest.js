const db = require('../database/DbConnection');
class PrivateRequest{

    get timestamp() {
        return this._timestamp;
    }

    get accepted() {
        return this._accepted;
    }

    get businessCustomerEmail() {
        return this._businessCustomerEmail;
    }

    get privateCustomerEmail() {
        return this._privateCustomerEmail;
    }

    constructor(args){
        this._timestamp =args.timestamp;
        this._accepted = args.accepted;
        this._businessCustomerEmail = args.BusinessCustomers_email;
        this._privateCustomerEmail = args.PrivateCustomers_email;
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
                callback(false);
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
                callback(new PrivateRequest(tuple));
            }else callback(false);
        })
    }
    static getPrivateRequestsByPC(PCEmail,callback){
        let sql = "SELECT * FROM PrivateRequest where PrivateCustomers_email = ?";
        db.con.query(sql,[[PCEmail]],(err,res) =>{
            if(err) throw err;
            if(res.length) {
                let tuples = res;
                for (let i = 0; i < tuples.length; i++ ) {
                    callback(new PrivateRequest(tuples[i]));
                }
            }else callback(false);
        })
    }

    static getPrivateRequestsByBC(BCEmail,callback){
        let sql = "SELECT * FROM PrivateRequest where BusinessCustomers_email = ?";
        db.con.query(sql,[[BCEmail]],(err,res) =>{
            if(err) throw err;
            if(res.length) {
                let tuples = res;
                for (let i = 0; i < tuples.length; i++ ) {
                    callback(new PrivateRequest(tuples[i]));
                }
            }else callback(false);
        })
    }
}

module.exports = PrivateRequest;
