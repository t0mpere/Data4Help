const mysql = require('mysql');

let con = mysql.createConnection({
    host: "data4help.c7wcescuyowm.eu-west-2.rds.amazonaws.com",
    user: "user",
    password: "viacarnia",
    database: "Data4Help"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Data4Help's database!");
});
module.exports = {con:con};