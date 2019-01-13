const db = require('../database/DbConnection');
const Customer = require('./Customer');
const CodiceFiscale = require("codice-fiscale-js");
const mailServer = require('../Controller/MailServer').mailServer;
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

    /*
    *
    *   This function checks if a Private Customer is present in the database, given its email and it codice fiscale
    *
     */
    static isPrivateCustomerInDb(email,cf,callback){
        PrivateCustomer.getPrivateCustomerFromDb(email,cf,(res)=>{
            if (res === false) callback(false);
            else callback(true);
        })
    }

    isInDb(callback){
        PrivateCustomer.isPrivateCustomerInDb(this.email,this.cf,callback);
    }

    /*
    *
    *   This function returns a specific Private Customer, given its email and its codice fiscale
    *
     */
    static getPrivateCustomerFromDb(email,cf,callback){
        if(email !== undefined && cf !== undefined) {
            let sql = "SELECT * FROM PrivateCustomers WHERE email = ? or codiceFiscale = ?";
            db.con.query(sql, [[email],[cf]], function (err, res) {
                if (err) {
                    callback(false);
                    throw err;
                }
                else {
                    //converting date
                    if (res.length === 0) callback(false);
                    else {
                        let date = new Date(res[0].dateOfBirth);
                        //mapping from tuple to object
                        let pc = new PrivateCustomer(
                            res[0]
                        );
                        callback(pc);
                    }
                }
            });
        }else callback(false);
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
    /*
    *
    *   This function checks the consistency of the attribute of the Private Customer
    *
     */
    isPCValid(){
        if(this._email === undefined)throw 'no email';
        if(this._sex !== 'M' && this._sex !== 'F') {
            return false;
        }
        if(!(this._dateOfBirth instanceof Date)) {return false}
        return PrivateCustomer.getCf(this) === this._codiceFiscale;

    }
    constructor(args){
        super(args.email,args.password);
        this._args = args;
        this._name = args.name;
        this._surname = args.surname;

        this._email = args.email;
        this._password = args.password;
        this._sex = args.sex;
        this._dateOfBirth = args.dateOfBirth;
        this._placeOfBirth = args.placeOfBirth;
        this._codiceFiscale = args.codiceFiscale.toUpperCase();


    }
    /*
    * callback(res) res is:
     * true if the commit is successful
    * false if the PC is already present in the db
     */
    commitToDb(callback){
        let tmp = this;
        Customer.isEmailPresent(this.email,(res)=>{
            if(res){
                callback(false);
                return false
            }else {
                this.isInDb(function (res) {
                    if (res) {
                        callback(false);
                    } else {

                        let sql = "INSERT INTO PrivateCustomers(email,password,name,surname,sex,placeOfBirth,dateOfBirth,codiceFiscale) VALUES (?)";
                        let values = [
                            [
                                tmp._email,
                                tmp._password,
                                tmp._name,
                                tmp._surname,
                                tmp._sex,
                                tmp._placeOfBirth,
                                tmp._dateOfBirth,
                                tmp._codiceFiscale
                            ]
                        ];

                        db.con.query(sql, values, (err) => {
                            if (err) {
                                callback(false);
                                throw err;
                            } else {
                                callback(true);
                                mailServer.sendMail({
                                    from:'"Data4Help"data4help@mail.com',
                                    to: tmp._email,
                                    subject: 'You\'re successfully subscribed to Data4Help as a Private Customer' ,
                                    text: 'Congratulation your now subscribed \npassword: '+tmp.password+'\nTrackMe\n\n data4help.herokuapp.com'
                                },function (error,info) {
                                    console.log("email sent: " + info)
                                });
                            }
                        });
                        return this;
                    }
                });

            }
        })
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
        return this._codiceFiscale;
    }

    get dateOfBirth() {
        return this._dateOfBirth;
    }

    get placeOfBirth() {
        return this._placeOfBirth;
    }
}
module.exports = PrivateCustomer;