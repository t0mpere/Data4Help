const db = require('../database/Dbconnection');
const mailServer = require('../Controller/MailServer').mailServer;

class AnonymousRequest{

    constructor(BCEmail,args){
        this.timeOfSubmission = args.timeOfSubmission;
        this.BusinessCustomer_email = BCEmail;
        this.title = args.title;
        this.periodical = args.periodical;
        this.closed = args.closed? 1 : 0;
        this.date_from = args.date_from;
        this.date_to = args.date_to;
        this.lat_ne = args.lat_ne;
        this.long_ne = args.long_ne;
        this.lat_sw = args.lat_sw;
        this.long_sw = args.long_sw;
        this.age_from = args.age_from;
        this.age_to = args.age_to;
        this.id = args.id;
        this.next_update = (args.next_update !== undefined) ? args.next_update : new Date();
    }

    calculateNextUpdate(){
        let today = new Date();
        switch (this.periodical){
            case 0:
                this.closed = 1;
                break;
            case 1:
                this.next_update.setDate(today.getDate() + 1);
                break;
            case 2:
                this.next_update.setDate(today.getDate() + 7);
                break;
            case 3:
                this.next_update.setDate(today.getDate() + 30);
                break;
        }
    }
    updateNextUpdate(callback){
        let sql = 'UPDATE Queries SET next_update = ? , closed = ? where BusinessCustomer_email = ? and id = ?';
        db.con.query(sql,[[this.next_update],[this.closed],[this.BusinessCustomer_email],[this.id]],(err, res)=>{
            if(err){
                callback(false);
                throw err;
            }else callback(true);
        })
    }


    commitToDb(callback){
        let sql = "INSERT INTO Queries(BusinessCustomer_email,title,periodical,closed,date_from,date_to,lat_ne,long_ne,lat_sw,long_sw,age_from,age_to,next_update) VALUES (?)";
        let values = [
            [
                this.BusinessCustomer_email,
                this.title,
                this.periodical,
                this.closed,
                this.date_from,
                this.date_to,
                this.lat_ne,
                this.long_ne,
                this.lat_sw,
                this.long_sw,
                this.age_from,
                this.age_to,
                this.next_update
            ]
        ];
        AnonymousRequest.isInDb(this.BusinessCustomer_email,this,(res) =>{
            if(res) callback(false);
            else {
                db.con.query(sql,values,(err) => {
                    if (err) {
                        callback(false);
                        throw err;
                    }
                    else callback(true);
                });
            }
        })

    }


    static getAnonymousRequestsByBC(BCEmail,callback){
        let sql = "SELECT * FROM Queries WHERE BusinessCustomer_email = ?";
        db.con.query(sql,[[BCEmail]],(err,res) =>{

            if(err) {
                callback(false);
                throw err;
            }
            if(res.length) {
                let tuple = res.map((value) => {
                    return new AnonymousRequest(value.BusinessCustomer_email,value)
                });
                //console.log(tuple);
                callback(tuple)
            }else callback(false);
        })
    }

    static isInDb(BCEmail, params, callback){
        AnonymousRequest.getAnonymousRequestsByBC(BCEmail, (res) => {
            if(!res) {
                callback(false);
            }
            else {
                let tmp = new AnonymousRequest(BCEmail,params);
                let result = false;
                res.map((value) => {
                    if(value.title === tmp.title) result = true;
                });
                callback(result);
            }
        });
    }

    isInDb(BCEmail, callback){
        AnonymousRequest.isInDb(BCEmail, this, callback);
    }
    getQueryData(callback){
        let sql = "SELECT * FROM QueriesData WHERE bc_email = ? and id = ?";
        db.con.query(sql,[[this.BusinessCustomer_email],[this.id]],(err,res) =>{
            if(err) throw err;
            if(res.length) {
                let tuple = res.map((value) => {
                    if(value.num <= 1000){
                        value.avg_bp_max = 0;
                        value.avg_bp_min = 0;
                        value.avg_bpm = 0;
                    }
                    return value;
                });
                //console.log(tuple);
                callback(tuple)
            }else callback(false);
        })
    }

    compute(){
        let sql = 'SELECT avg (maxBloodPressure), avg(minBloodPressure),avg (hearthRate),count(*)\n' +
            'FROM UserData\n' +
            'WHERE\n' +
            '    (lat >= ?) AND (lat <= ?) AND (`long` >= ?) AND (`long` <= ?) and\n' +
            '    (datediff(CURRENT_DATE,(SELECT dateOfBirth from PrivateCustomers where PrivateCustomers_email = email)) / 365.265 ) >= ? and\n' +
            '    (datediff(CURRENT_DATE,(SELECT dateOfBirth from PrivateCustomers where PrivateCustomers_email = email)) / 365.265 ) <= ?\n'
            '    (datediff(?,timeOfAcquisition) <= 0) and (datediff(timeOfAcquisition,?) <= 0)\n';
        db.con.query(sql,[[this.lat_sw],[this.lat_ne],[this.long_sw],[this.long_ne],[this.age_from],[this.age_to],[this.date_to === undefined ? this.next_update : this.date_to],[this.date_from]],(err, res)=>{
            let values = [
                [
                    this.id,
                    this.BusinessCustomer_email,
                    Object.values(res[0])[0],
                    Object.values(res[0])[1],
                    Object.values(res[0])[2],
                    Object.values(res[0])[3],
                    new Date()
                ]
            ];
            db.con.query('INSERT into QueriesData values (?)',values,(error,result)=>{
                if (error) throw error;
                else {
                    console.log(this.BusinessCustomer_email);
                    mailServer.sendMail({
                        from:'data4help@mail.com',
                        to: this.BusinessCustomer_email,
                        subject: 'Your query '+this.title+ ' has been processed.',
                        text: Object.values(res[0])[3] >= 1000 ? 'Result has been anonymized successfuly': 'Unfortunately Data4Help could not anonymize data acquired by your query'
                    },function (error,info) {
                        console.log(info.result)
                    })
                }
            })
        })

    }

    static getAnonymousRequestByBC(BCEmail,title, callback) {
        console.log('title:',title);
        let sql = "SELECT * FROM Queries WHERE BusinessCustomer_email = ? AND title = ?";
        db.con.query(sql,[[BCEmail],[title]],(err,res) =>{
            if(err) {
                callback(false);
                throw err;
            }
            if(res !== undefined) {
                let result = new AnonymousRequest(res[0].BusinessCustomer_email,res[0]);
                //console.log(tuple);
                callback(result)
            }else callback(false);
        })
    }
}
module.exports = AnonymousRequest;

