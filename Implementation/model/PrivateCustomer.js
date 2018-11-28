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

    static getPrivateCustomerFromDb(email,callback){
        let sql = "SELECT * FROM PrivateCustomers WHERE email = '"+email+"'";
        db.con.query(sql,function (err,res,fields) {
            //converting date
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
            callback(err,pc);
        })
    }
        
    constructor(email,password,name,surname,sex,cf,dateOfBirth,placeOfBirth,placeOfBirthProvincia){
        super(email,password);
        this._name = name;
        this._surname = surname;
        if(sex === 'M' || sex === 'F'){
            this._sex = sex;
        }else {
            throw 'Wrong value for sex, use provided enum: '+ sex;
        }
        this._email = email;
        this._password = password;
        this._sex = sex;
        if(!dateOfBirth instanceof Date) throw 'PrivateCustomer: incorrect type on date';
        this._dateOfBirth = dateOfBirth;
        this._placeOfBirth = placeOfBirth;

        if(PrivateCustomer.getCf({
            _name:name,
            _surname:surname,
            _sex:sex,
            _dateOfBirth:dateOfBirth,
            _placeOfBirth:placeOfBirth
        }) === cf)

            this._cf = cf;
        else throw 'invalid cf';

    }

    addPrivateCustomerToDb(){
        let sql = "INSERT INTO PrivateCustomers VALUES (?)";
        let values = [
            [
                this._email,
                this._password,
                "default()",
                "default()",
                this._name,
                this._surname,
                this._sex,
                this._placeOfBirth,
                "",
                this._dateOfBirth,
                this._cf
            ]
        ];
        db.con.query(sql,values);
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
//new PrivateCustomer("cami.231298@gmail.com","passuord","Camilla","Nardini",Sex.FEMALE,"NRDCLL98T63L483W",new Date(1998,11,23),"Udine");
