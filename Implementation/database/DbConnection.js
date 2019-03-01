const mysql = require('mysql');

let con = mysql.createConnection({
    host: "INSERT_HOST",
    user: "INSERT_USER",
    password: "INSERT_PASSWORD",
    database: "INSERT_NAME_DB"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Data4Help's database!");
});
module.exports = {con:con};