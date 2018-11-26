const db = require('../database/DbConnection');
const Customer = require('./Customer');
const CodiceFiscale = require("codice-fiscale-js");
const Sex = {
    MALE: 'm',
    FEMALE: 'f'
};

class PrivateCustomer extends Customer{

    static getCf(privateCustomer) {
        CodiceFiscale.compute({
            name: privateCustomer._name,
            surname: privateCustomer._surname,
            gender: privateCustomer._sex,
            day: privateCustomer.dateOfBirth.day,
            month: privateCustomer.dateOfBirth.month,
            year: privateCustomer.dateOfBirth.year,
            birthplace: privateCustomer._placeOfBirth,
            birthplaceProvincia: privateCustomer._placeOfBirthProvincia // Optional
        });
    }
        
    constructor(email,password,name,surname,sex,cf,dateOfBirth,placeOfBirth,placeOfBirthProvincia){
        super(email,password);
        this._name = name;
        this._surname = surname;
        if(sex === 'm' || sex === 'f'){
            this._sex = sex;
        }else {
            throw 'Wrong value for sex, use provided enum'
        }
        this._email = email;
        this._password = password;
        this._sex = sex;
        if(dateOfBirth !== typeof Date) throw 'PrivateCustomer: incorrect type on date';
        this._dateOfBirth = dateOfBirth;
        this._placeOfBirth = placeOfBirth;
        this._placeOfBirthProvincia = placeOfBirthProvincia;
        if(PrivateCustomer.getCf({
            _name:name,
            _surname:surname,
            _sex:sex,
            _dateOfBirth:dateOfBirth,
            _placeOfBirth:placeOfBirth,
            _placeOfBirthProvincia:placeOfBirthProvincia
        }))
        this._cf = cf;
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