process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../webApp');
let assert = require('assert');
const BusinessCustomer = require('../model/BusinessCustomer');
let UserServices = require("../Controller/UserServices");
let db = require("../database/DbConnection");


describe("User services controller", function () {

    //just to avoid timeout exceeded exception
    this.timeout(15000);

    after(function (done) {
        db.con.end(function(err) {
            if(err) {
                console.log(err);
            }
            done();
        });
    });

    let pcs = ['abatemaurizio_81@mail.it', 'abbateludovico_99@mail.it', 'cami.231298@gmail.com',
        'tanifabrizia_59@mail.it', 'terzijesse_89@mail.it'];

    it("it should return personal private date", function (done){

        pcs.forEach(function (email) {
            UserServices.getPersonalData(email, (res) => {
                if(res) {
                    res.forEach(function (data) {
                        assert.equal(email, data._email);
                    });
                }
                if(email === pcs[pcs.length - 1])
                    done();
            });
        });
    });

    it("it should register a new private customer", function (done) {
        let pc = {
            email:'tommy96@gmail.com',
            password: 'psw',
            name:'Tommaso',
            surname: 'Peresson',
            sex: 'M',
            placeOfBirth: 'Udine',
            dateOfBirth: new Date(1996,5,11),
            cf:'PRSTMS96H11L483L'
        };

        UserServices.registerPrivateCustomer(pc, (res) => {

        })
    });

    /*
    it("it should return private requests from business customer", function (done){

        pcs.forEach(function (email) {
            UserServices.getPrivateRequests(email, (res) => {
                if(res) {
                    res.forEach(function (request) {
                        assert.equal(email, request.PrivateCustomers_email);
                    });
                }
            });
            if(email === pcs[pcs.length - 1])
                done();
        });
    });*/

});