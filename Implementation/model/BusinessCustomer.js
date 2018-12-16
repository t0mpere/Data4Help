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


    constructor(args) {
        super(args.email, args.password);
        this._name = args.name;
        this._partitaIva = args.partitaIva;
        this._address = args.address;
        this._comune = args.comune;
        this._nazione = args.nazione;
        this._email = args.email;
        this._password = args.password;
        this._active = args.active;
    }
    //TODO test
    commitToDb(callback){
        Customer.isEmailPresent(this.email,(res) =>{
            if(res === false) {
                let sql = "INSERT INTO BusinessCustomers(email, password, name, partitaIva, address, comune, nazione, active) VALUES (?)";
                let values = [
                    [
                        this._email,
                        this._password,
                        this._name,
                        this._partitaIva,
                        this._address,
                        this._comune,
                        this._nazione,
                        this._active
                    ]
                ];
                db.con.query(sql, values);
                callback(this);
            }
            else {
                callback(false);
            }
        });

    }


    isBusinessCustomerInDb(callback){
        BusinessCustomer.getBusinessCustomerFromDb(this.email,callback);
    }

    //TODO test
    static getBusinessCustomerFromDb(email,callback){
        let sql = "SELECT * FROM BusinessCustomers WHERE email = ?";
        db.con.query(sql,email,function (err,res) {
            if (err) {
                callback(false);
                throw err;
            }

            if(res.length === 0) {
                callback(false);
                return;
            }
            //mapping from tuple to object
            let bc = new BusinessCustomer(
                res[0]
            );
            callback(bc);
        })
    }
    setActiveStatus(value,callback){
        let sql = "UPDATE BusinessCustomers  SET active = ?  WHERE email = ? ;";
        db.con.query(sql,[value,this.email],function (err) {
            if (err) {
                callback(false);
                throw err;
            }

            callback(true);
        })
    }

}
module.exports = BusinessCustomer;
let bc = BusinessCustomer.getBusinessCustomerFromDb('acme@corp.com',(res) =>{
    res.setActiveStatus(1,(res) => {
        console.log(res);
    })
});
