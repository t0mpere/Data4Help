const AnonRequest = require('../model/AnonymousRequest');
const db = require('../database/Dbconnection').con;


function schedule() {
    db.query('Select * from Queries where datediff(current_date ,next_update) >= 0 and closed = 0', (err,res)=>{
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
