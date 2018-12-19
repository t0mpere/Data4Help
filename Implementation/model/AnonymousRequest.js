const db = require('../database/Dbconnection');

class AnonymousRequest{

    constructor(BCEmail,args){
        this.timeOfSubmission = args.timeOfSubmission;
        this.BusinessCustomer_email = BCEmail;
        this.title = args.title;
        this.periodical = args.update;
        this.closed = args.closed? 1 : 0;
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



    commitToDb(callback){
        let sql = "INSERT INTO Queries(BusinessCustomer_email,title,periodical,closed,lat_ne,long_ne,lat_sw,long_sw,age_from,age_to,avg_bp_max,avg_bp_min,avg_bpm,num,next_update) VALUES (?)";
        let values = [
            [
                this.BusinessCustomer_email,
                this.title,
                this.periodical,
                this.closed,
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
        db.con.query(sql,values,(err) => {
            if (err) {
                callback(false);
                throw err;
            }
            else callback(true);
        });
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

}

module.exports = AnonymousRequest;

