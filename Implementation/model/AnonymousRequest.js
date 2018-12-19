const db = require('../database/Dbconnection');

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
        this.avg_bp_max = args.avg_bp_max === 'true' ? 1 : 0;
        this.avg_bp_min = args.avg_bp_min === 'true' ? 1 : 0;
        this.avg_bpm = args.avg_bpm === 'true' ? 1 : 0;
        this.id = args.id;
        this.num = args.num;
        this.nextUpdate = (args.nextUpdate instanceof Date) ? args.nextUpdate : new Date();
    }

    calculateNextUpdate(){
        switch (this.periodical){
            case 0:
                //do nothing
                break;
            case 1:
                this.nextUpdate.setDate(this.nextUpdate.getDate() + 1);
                break;
            case 2:
                this.nextUpdate.setDate(this.nextUpdate.getDate() + 7);
                break;
            case 3:
                this.nextUpdate.setDate(this.nextUpdate.getDate() + 30);
                break;
        }
    }
    updateNextUpdate(callback){
        let sql = 'UPDATE Queries SET next_update = ?'
        db.con.query(sql,[[this.nextUpdate]],(err,res)=>{
            if(err){
                callback(false);
                throw err;
            }else callback(true)
        })
    }


    commitToDb(callback){
        let sql = "INSERT INTO Queries(BusinessCustomer_email,title,periodical,closed,date_from,date_to,lat_ne,long_ne,lat_sw,long_sw,age_from,age_to,avg_bp_max,avg_bp_min,avg_bpm,num,next_update) VALUES (?)";
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
                this.avg_bp_max,
                this.avg_bp_min,
                this.avg_bpm,
                this.num,
                this.nextUpdate
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
            if(err) throw err;
            if(res.length) {
                let tuple = res.map((value) => {
                    return new AnonymousRequest(value.BusinessCustomer_email,value)
                });
                console.log(tuple);
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

    compute(){
        let sql = 'SELECT avg (maxBloodPressure), avg(minBloodPressure),avg (hearthRate),count(*)\n' +
            'FROM UserData\n' +
            'WHERE\n' +
            '    (lat >= ?) AND (lat <= ?) AND (`long` >= ?) AND (`long` <= ?) and\n' +
            '    (datediff(CURRENT_DATE,(SELECT dateOfBirth from PrivateCustomers where PrivateCustomers_email = email)) / 365.265 ) >= ? and\n' +
            '    (datediff(CURRENT_DATE,(SELECT dateOfBirth from PrivateCustomers where PrivateCustomers_email = email)) / 365.265 ) <= ?\n'
            '    (datediff(?,timeOfAcquisition) <= 0) and (datediff(timeOfAcquisition,?) <= 0)\n';
        db.con.query(sql,[[this.lat_sw],[this.lat_ne],[this.long_sw],[this.long_ne],[this.age_from],[this.age_to],[this.date_to],[this.date_from]],(err,res)=>{
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
            })
        })

    }

}
module.exports = AnonymousRequest;

