const request = require('request');
const CodiceFiscale = require("codice-fiscale-js");
const fs = require('fs');



getCfs(10000);
function getCfs(n) {
    for(let i = 0; i<=n;i++){
        let url = 'http://farsoldifacili.altervista.org/fakegenerator.php?sesso=';
        if(i%2 === 0)url += 'f';
        else url += 'm';
        console.log(url);
        request(url, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            body = body.split("Codice Fiscale:</span> ").pop();
            body = body.split("<br/>")[0];
            try {
                console.log(body);
                console.log(CodiceFiscale.check(body));
                console.log(CodiceFiscale.computeInverse(body));
                fs.appendFileSync('cfs.txt', body + '\n');
            }catch (e) {
                console.log(e);
            }


        });
    }
}