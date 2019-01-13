const db = require('../database/DbConnection');
class UserData {
    constructor(email,hearthRate,minBloodPressure,maxBloodPressure,lat,long,timestamp,timeOfAcquisition) {
        this._email = email;
        this._hearthRate = hearthRate;
        this._minBloodPressure = minBloodPressure;
        this._maxBloodPressure = maxBloodPressure;
        this._lat = lat;
        this._long = long;
        //time of insert into db
        this._timestamp = timestamp;
        //time of acquisition of data on smartphone
        this._timeOfAcquisition = timeOfAcquisition;
    }

    /*
    *
    *   This function return all the User Data belonging to a specific Private Customer, given its email
    *
     */
    static getUserDataFromEmail(email,callback){
        let sql = "SELECT * FROM UserData where PrivateCustomers_email = ?";
        db.con.query(sql,email,(err,res) =>{
            if(err) throw err;
            if(res.length) {
                let userData = [];
                let tuple;
                for(let i = 0; i < res.length ; i++){
                    tuple = res[i];
                    userData.push(new UserData(
                        tuple.PrivateCustomers_email,
                        tuple.hearthRate,
                        tuple.minBloodPressure,
                        tuple.maxBloodPressure,
                        tuple.lat,
                        tuple.long,
                        new Date(tuple.timestamp),
                        new Date(tuple.timeOfAcquisition)
                    ));
                }

                callback(userData);
            }else callback(false);
        })
    }



    commitToDb(callback){
        let values = [
            [
                this._email,
                this._hearthRate,
                this._minBloodPressure,
                this._maxBloodPressure,
                parseFloat(this._lat),
                parseFloat(this._long),
                new Date(this._timeOfAcquisition)
            ]
        ];
        new Promise((resolve,reject)=>{
            db.con.query("select * from UserData where PrivateCustomers_email = ? and timeOfAcquisition = ?",[[this._email],[new Date(this._timeOfAcquisition)]],(error,result)=>{
                if(error){
                    resolve(false);
                    throw error;
                }
                if(result.length === 0){
                    resolve(true)
                }
            });
        }).then((value) => {
            db.con.query("insert into UserData(PrivateCustomers_email, hearthRate, minBloodPressure, maxBloodPressure, lat, `long`, timeOfAcquisition) values (?)", values, (err) => {
                if(value){
                    if (err) {
                        callback(false);
                        throw err;
                    } else callback(true)
                }
            })
        });

    }

}

module.exports = UserData;
