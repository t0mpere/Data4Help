const db = require('../database/DbConnection');
const Customer = require('./Customer');

class BusinessCustomer extends Customer{
    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get name() {
        return this._name;
    }

    get partitaIva() {
        return this._partitaIva;
    }

    get address() {
        return this._address;
    }

    get comune() {
        return this._comune;
    }

    get nazione() {
        return this._nazione;
    }


    constructor(email,password,name,partitaIva,address,comune,nazione,active) {
        super(email, password);
        this._name = name;
        this._partitaIva = partitaIva;
        this._address = address;
        this._comune = comune;
        this._nazione = nazione;
        this._email = email;
        this._password = password;
        this._active = active;
    }
    //TODO test
    addBusinessCustomerToDb(){
        let sql = "INSERT INTO BusinessCustomers VALUES (?)";
        let values = [
            [
                this._email,
                this._password,
                "default()",
                this._name,
                this._partitaIva,
                this._address,
                this._comune,
                this._nazione,
                this._active
            ]
        ];
        db.con.query(sql,values);
    }
    static isBusinessCustomerInDb(email,callback){
        let sql = "SELECT * FROM BusinessCustomers WHERE email = ?";
        db.con.query(sql,email,function (err,res) {
            if (err) throw err;
            if(res.length === 0) {
                callback(false);
                return;
            }
            //mapping from tuple to object
            let bc = new BusinessCustomer(
                res[0].email,
                res[0].password,
                res[0].name,
                res[0].partitaIva,
                res[0].address,
                res[0].comune,
                res[0].nazione,
                res[0].active
            );
            callback(bc);
        })
    }

    isBusinessCustomerInDb(callback){
        BusinessCustomer.isBusinessCustomerInDb(this.email,callback);
    }

    //TODO test
    static getBusinessCustomerFromDb(email,callback){
        BusinessCustomer.isBusinessCustomerInDb(email,(res)=>{
            if(res === undefined) throw "Business Customer non in db";
            else callback(res);
        })
    }

}
module.exports = BusinessCustomer;