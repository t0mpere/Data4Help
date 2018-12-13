const request = require('request');
const CodiceFiscale = require("codice-fiscale-js");
const PrivateCustomer = require("../model/PrivateCustomer");
const db = require("../database/DbConnection").con;
const cheerio = require('cheerio');
const fs = require('fs');



function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

//getCfs(500);
//normal distribution rand generator
function hearthRateGen() {
    let max = 170;
    let min = 30;
    return Math.floor((((((( Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 4)/4)+1)/2)*(max - min) ) + min);
}
//normal distribution rand generator
function bloodPressureGen(min,max) {
    return Math.floor((((((( Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 4)/4)+1)/2)*(max - min) ) + min);
}
function coordGenerator(){
    //boundaries of milan
    //top
    //9.090843 long
    //45.5130838 lat
    //bottom
    //9.2755512 long
    //45.420383 lat
    var long = (Math.random() * (9.090843 - 9.2755512) + 9.2755512).toFixed(7);
    var lat = (Math.random() * (45.420383 - 45.5130838) + 45.5130838).toFixed(7);
    return {long: long, lat:lat}
}
generateUserData();
function generateUserData() {
    db.query("select email from PrivateCustomers where email like '%' order by email asc  ",(err,res)=>{
        if(err) throw err;
        for(let i = 0; i < res.length; i++){
            for(let v = 0; v < 10;v++){
                let minBP = 1;
                let maxBP = 0;
                while (minBP >= maxBP){
                    minBP = bloodPressureGen(20,100);
                    maxBP = bloodPressureGen(60,140);
                }
                let coord = coordGenerator();
                let date = randomDate(new Date(2016,0,1),new Date());
                date = date.getUTCFullYear() + '-' +
                    ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
                    ('00' + date.getUTCDate()).slice(-2) + ' ' +
                    ('00' + date.getUTCHours()).slice(-2) + ':' +
                    ('00' + date.getUTCMinutes()).slice(-2) + ':' +
                    ('00' + date.getUTCSeconds()).slice(-2);
                let values = [
                    [
                        res[i].email,
                        hearthRateGen(),
                        minBP,
                        maxBP,
                        parseFloat(coord.lat),
                        parseFloat(coord.long),
                        date,
                        date
                    ]
                ];
                db.query("insert into UserData values (?)",values,(err2,res2)=>{
                    console.log(v + res[i].email);
                });
            }
        }
    })

}

//decoding email
function cfDecodeEmail(encodedString) {
    var email = "", r = parseInt(encodedString.substr(0, 2), 16), n, i;
    for (n = 2; encodedString.length - n; n += 2){
        i = parseInt(encodedString.substr(n, 2), 16) ^ r;
        email += String.fromCharCode(i);
    }
    return email;
}



//scraper codice brutto.
function getCfs(n) {
    for (let i = 0; i < n; i++) {
        let url = 'http://farsoldifacili.altervista.org/fakegenerator.php?sesso=';
        if (i % 2 === 0) url += 'f';
        else url += 'm';
        console.log(url);
        request(url, {json: true}, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            let codiceF = body.split('Codice Fiscale:</span> ').pop();
            codiceF = codiceF.split('<br/>')[0];
            let email = body.split('data-cfemail="').pop();
            email = email.split('">')[0];
            let password = Math.random().toString(36).substring(7);
            email = cfDecodeEmail(email);
            let name = cheerio('.nome', body).text();
            let surname = cheerio('.cognome', body).text();
            let sex = cheerio('.sesso', body).text();
            let dateOfBirth = body.split('Data di nascita:</span> ').pop();
            dateOfBirth = dateOfBirth.split("<")[0];
            dateOfBirth = new Date(dateOfBirth.split("/")[2], dateOfBirth.split("/")[1] - 1, dateOfBirth.split("/")[0]);
            let comune = cheerio('.comune', body).text();
            try {
                console.log(dateOfBirth);
                if (CodiceFiscale.check(codiceF) && CodiceFiscale.computeInverse(codiceF)&& validateEmail(email)) {
                    new PrivateCustomer(email, password, name, surname, sex, codiceF, dateOfBirth, comune).commitToDb();
                    console.log("committing: "+email);
                }else {
                    console.log("something went wrong")
                }

            } catch (e) {
                console.log(e);
            }

        });
    }
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}