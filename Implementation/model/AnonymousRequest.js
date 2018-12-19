const db = require('../database/Dbconnection');

class AnonymousRequest{

    constructor(timeOfsubmission,businessCustomer_email,serializedParameters,serializedResult,closed,periodical,nextUpdate,title,queryID){
        this._timeOfsubmission = timeOfsubmission;
        this._businessCustomer_email = businessCustomer_email;
        this._serializedParameters = serializedParameters;
        this._serializedResult = serializedResult;
        this._closed = closed? 1 : 0;
        this._periodical = periodical? 1 : 0;
        this._nextUpdate = nextUpdate;
        this._title = title;
        this._queryID = queryID;
    }

    commitToDb(callback){
        let sql = "INSERT INTO Queries(BusinessCustomers_email,serializedParameters,serializedResult,closed,periodical,nextUpdate,Title,QueryID) VALUES (?)";
        let values = [
            [
                this._businessCustomer_email,
                this._serializedParameters,
                this._serializedResult,
                this._closed,
                this._periodical,
                this._nextUpdate,
                this._title,
                this._queryID
            ]
        ];
        db.con.query(sql,values,(err) => {
            if (err) {
                callback(err);
                throw err;
            }
            else callback(true);
        });
    }

    static getAnonymousRequest(BCEmail,timeOfSub,callback){
        let sql = "SELECT * FROM Queries where BusinessCustomers_email = '"+BCEmail+"' and timeOfSubmission = '"+ timeOfSub +"'";
        db.con.query(sql,(err,res) =>{
            if(err) throw err;
            if(res.length) {
                let tuple = res[0];
                console.log("time: "+ tuple.timestamp);
                callback(new AnonymousRequest(
                    tuple.timeOfsubmission,
                    tuple.BusinessCustomers_email,
                    tuple.serializedParameters,
                    tuple.serializedResult,
                    tuple.closed,
                    tuple.periodical,
                    tuple.nextUpdate,
                    tuple.Title,
                    tuple.QueryID
                ));
            }else callback(false);
        })
    }
}
module.exports = AnonymousRequest;