const AnonRequest = require('../model/AnonymousRequest');
const db = require('../database/Dbconnection').con;


function schedule() {
    db.query('Select * from Queries where datediff(current_date ,next_update) >= 0', (err,res)=>{
        console.log(res);
        res.map((value,index) =>{
            let x = new AnonRequest(value.BusinessCustomer_email,value);
            x.compute();
            x.calculateNextUpdate();
            x.updateNextUpdate((res)=>{
               if(!res) console.log('bad happened in scheduling');
            });
            console.log(x);
        });


    })

}
schedule();

