const AnonRequest = require('../model/AnonymousRequest');
const db = require('../database/DbConnection');

/*
*
*   This function calculates the update, for the subscriptions, and notifies to the Business Customer
*
 */
function schedule() {
    db.con.query('Select * from Queries where datediff(current_date ,next_update) >= 0 and closed = 0', (err,res)=>{
        if(err) {
            throw err;
        }
        if(res.length === 0){

        }else{
            console.log('Something to schedule...');
            res.map((value,index) =>{
                let x = new AnonRequest(value.BusinessCustomer_email,value);
                x.compute();
                x.calculateNextUpdate();
                x.updateNextUpdate((res)=>{
                    if(!res) console.log('ERROR: something bad happened during scheduling');
                    console.log(res);
                });
            });
        }



    })

}
module.exports ={schedule:schedule};
