const db = require('../database/DbConnection');
const Customer = require('./Customer');
const CodiceFiscale = require("codice-fiscale-js");
const Sex = {
    MALE: 'M',
    FEMALE: 'F'
};

class PrivateCustomer extends Customer{

    static getCf(privateCustomer) {
        return CodiceFiscale.compute({
            name: privateCustomer._name,
            surname: privateCustomer._surname,
            gender: privateCustomer._sex,
            day: privateCustomer._dateOfBirth.getDate(),
            month: privateCustomer._dateOfBirth.getMonth() + 1,
            year: privateCustomer._dateOfBirth.getFullYear(),
            birthplace: privateCustomer._placeOfBirth
            //birthplaceProvincia: privateCustomer._placeOfBirthProvincia // Optional
        });
    }

    isInDb(callback){
        PrivateCustomer.getCustomerFromDb(this.email,(res)=>{
            if (res === false) callback(false);
            else callback(true);
        })
    }

    static getPrivateCustomerFromDb(email,callback){
        let sql = "SELECT * FROM PrivateCustomers WHERE email = ?";
        db.con.query(sql,email,function (err,res) {
            if (err) callback(false);
            else{
                //converting date
                if(res.length === 0) callback(false);
                else {
                    let date = new Date(res[0].dateOfBirth);
                    //mapping from tuple to object
                    let pc = new PrivateCustomer(
                        res[0].email,
                        res[0].password,
                        res[0].name,
                        res[0].surname,
                        res[0].sex,
                        res[0].codiceFiscale,
                        date,
                        res[0].placeOfBirth,
                        res[0].placeOfBirthProvincia
                    );
                    callback(pc);
                }
            }
        })
    }
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
    */
    constructor(args){
        super(args.email,args.password);
        this._args = args;
        this._name = args.name;
        this._surname = args.surname;
        if(args.sex === 'M' || args.sex === 'F'){
            this._sex = args.sex;
        }else {
            console.log(args.sex);
            throw 'Wrong value for sex, use provided enum: ' + sex;
        }
        this._email = args.email;
        this._password = args.password;
        this._sex = args.sex;
        if(!(args.dateOfBirth instanceof Date)) throw 'PrivateCustomer: incorrect type on date';
        this._dateOfBirth = args.dateOfBirth;
        this._placeOfBirth = args.placeOfBirth;

        if(PrivateCustomer.getCf(this) === args.cf)

            this._cf = args.cf;
        else throw 'invalid cf';

    }
    /*
    * callback(res) res is:
     * true if the commit is successful
    * false if the PC is already present in the db
     */
    commitToDb(callback){
        if(Customer.isEmailPresent(this.email)) {
            callback(false);
            return false
        }else {
            let sql = "INSERT INTO PrivateCustomers(email,password,name,surname,sex,placeOfBirth,dateOfBirth,codiceFiscale) VALUES (?)";
            let values = [
                [
                    this._email,
                    this._password,
                    this._name,
                    this._surname,
                    this._sex,
                    this._placeOfBirth,
                    this._dateOfBirth,
                    this._cf
                ]
            ];
            db.con.query(sql, values,(err) => {
                if (err) {
                    callback(false);
                    throw err
                }else {
                    callback(true)
                }
            });
            return this;
        }
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get name() {
        return this._name;
    }

    get surname() {
        return this._surname;
    }

    get sex() {
        return this._sex;
    }
    get cf() {
        return this._cf;
    }

    get dateOfBirth() {
        return this._dateOfBirth;
    }

    get placeOfBirth() {
        return this._placeOfBirth;
    }
}
module.exports = PrivateCustomer;