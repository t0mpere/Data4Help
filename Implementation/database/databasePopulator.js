const request = require('request');
const CodiceFiscale = require("codice-fiscale-js");
const PrivateCustomer = require("../model/PrivateCustomer");
const cheerio = require('cheerio');
const fs = require('fs');



getCfs(1000);

//decoding email
function cfDecodeEmail(encodedString) {
    var email = "", r = parseInt(encodedString.substr(0, 2), 16), n, i;
    for (n = 2; encodedString.length - n; n += 2){
        i = parseInt(encodedString.substr(n, 2), 16) ^ r;
        email += String.fromCharCode(i);
    }
    return email;
}

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