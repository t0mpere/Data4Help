const db = require('../database/DbConnection');
const PrivateCustomer = require('../model/PrivateCustomer');
class PrivateRequest {

    get _timestamp() {
        return this.timestamp;
    }

    get _accepted() {
        return this.accepted;
    }

    get _businessCustomerEmail() {
        return this.BusinessCustomers_email;
    }

    get _privateCustomerEmail() {
        return this.PrivateCustomers_email;
    }

    constructor(args) {
        this.timestamp = args.timestamp;
        this.accepted = args.accepted;
        this.BusinessCustomers_email = args.BusinessCustomers_email;
        this.PrivateCustomers_email = args.PrivateCustomers_email;
    }

    commitToDb(callback) {
        PrivateCustomer.isPrivateCustomerInDb(this._privateCustomerEmail,null,(res) =>{
           if(res){
               let sql = "INSERT INTO PrivateRequest(accepted,BusinessCustomers_email,PrivateCustomers_email) VALUES (?)";
               let values = [
                   [
                       this.accepted,
                       this.BusinessCustomers_email,
                       this.PrivateCustomers_email
                   ]
               ];
               db.con.query(sql, values, (err) => {
                   if (err) {
                       callback(false);
                       throw err;
                   }
                   else callback(true);
               });
           } else callback(res);
        });


    }

    /*
    *
    *   This function returns a specific Private Request, given a Private Customer email and a Business Customer email
    *
     */
    static getPrivateRequest(PCEmail, BCEmail, callback) {
        let sql = "SELECT * FROM PrivateRequest where PrivateCustomers_email = ? and BusinessCustomers_email = ?";
        db.con.query(sql, [[PCEmail], [BCEmail]], (err, res) => {
            if (err) {
                callback(false);
                throw err;
            }
            if (res.length) {
                let tuple = res[0];
                callback(new PrivateRequest(tuple));
            } else callback(false);
        })
    }

    /*
    *
    *   This function sets the status of a Private Request, depending on whether the request was accepted or not
    *
     */
    static setAcceptedStatus(BCEmail,PCEmail,val,callback){
        let sql = "UPDATE PrivateRequest  SET accepted = ?  WHERE BusinessCustomers_email = ? and PrivateCustomers_email = ?;"
        db.con.query(sql,[[val],[BCEmail],[PCEmail]],(err,res)=>{
            if(err) {
                callback(false);
                throw err;
            }
            if(res.affectedRows === 0){
                callback(false);
            }else callback(true);
        })

    }

    /*
    *
    *   This function returns all the Private Requests belonging to a specific Private Customer, given its email
    *
     */
    static getPrivateRequestsByPC(PCEmail, callback) {
        let sql = "SELECT * FROM PrivateRequest where PrivateCustomers_email = ? order by accepted asc ";
        db.con.query(sql, [[PCEmail]], (err, res) => {
            if (err) throw err;
            if (res.length) {
                let tuples = res;
                let results = [];
                for (let i = 0; i < tuples.length; i++) {
                    results.push(new PrivateRequest(tuples[i]));
                }
                callback(results);
            } else callback(false);
        })
    }

    /*
    *
    *   This function returns all the Private Requests belonging to a specific Business Customer, given its email
    *
     */
    static getPrivateRequestsByBC(BCEmail, callback) {
        let sql = "SELECT * FROM PrivateRequest where BusinessCustomers_email = ? order by accepted asc ";
        db.con.query(sql, [[BCEmail]], (err, res) => {
            if (err) throw err;
            if (res.length) {
                let tuples = res;
                let results = [];
                for (let i = 0; i < tuples.length; i++) {
                    results.push(new PrivateRequest(tuples[i]));
                }
                callback(results);
            } else callback(false);
        })
    }
}

module.exports = PrivateRequest;