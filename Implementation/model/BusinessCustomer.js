const db = require('../database/DbConnection');
const Customer = require('./Customer');
const mailServer = require('../Controller/MailServer').mailServer;

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
                db.con.query(sql, values,(err)=>{
                    if(err){

                        callback(false);
                        throw err;
                    }

                    else {

                        callback(true);
                        mailServer.sendMail({
                            from:'"Data4Help"data4help@mail.com',
                            to: this.email,
                            subject: 'You\'re successfully subscribed to Data4Help as a Business Customer' ,
                            text: 'Congratulation! You\'re now subscribed to Data4Help\nYour password is: '+
                            this.password+'\nAfter your registration is accepted, you can access and use our services\n\n' +
                            'TrackMe\n\n data4help.herokuapp.com'
                        },function (error,info) {
                            console.log("email sent: " + info)
                        });
                    }
                });

            }
            else {
                console.log("prova: "+res);
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
    static getPendingBusinessCustomersFromDb(callback){
        let sql = 'SELECT * FROM BusinessCustomers WHERE active = 0';
        db.con.query(sql,function (err,res) {
            if (err) {
                callback(false);
                throw err;
            }

            if(res.length === 0) {
                callback(false);
                return;
            }
            //mapping from tuple to object
            res.map(function (value,index) {
                return new BusinessCustomer(value);
            });
            callback(res);
        })

    }
    static setActiveStatus(email,value,callback){
        let sql = "UPDATE BusinessCustomers  SET active = ?  WHERE email = ? ;";
        db.con.query(sql,[value,email],function (err) {
            if (err) {
                callback(false);
                throw err;
            }
            if(value === 1){
                mailServer.sendMail({
                    from:'"Data4Help"data4help@mail.com',
                    to: email,
                    subject: 'You can access to our services!' ,
                    text: 'Congratulation! Now you can access to our site and our services! \n\n'+
                    'TrackMe\n\n data4help.herokuapp.com'
                },function (error,info) {
                    console.log("email sent: " + info)
                });
            }

            callback(true);
        })
    }
    setActiveStatus(value,callback){
        BusinessCustomer.setActiveStatus(this.email,value,callback);
    }

}
module.exports = BusinessCustomer;