process.env.NODE_ENV = 'test';

let assert = require('assert');
let PrivateCustomer = require('../model/PrivateCustomer');
let UserServices = require("../Controller/UserServices");
let db = require("../database/DbConnection");


describe("Test of UserServices functions in Controller", function () {

    //just to avoid timeout exceeded exception
    this.timeout(15000);
/*
    after(function (done) {
        db.con.end(function(err) {
            if(err) {
                console.log(err);
            }
            done();
        });
    });*/

    let pcs = ['abatemaurizio_81@mail.it', 'abbateludovico_99@mail.it', 'cami.231298@gmail.com',
        'tanifabrizia_59@mail.it', 'terzijesse_89@mail.it'];


    describe('Test of getPersonalData', function () {

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
    });


    describe('Test of registerPrivateCustomer', function () {

        it("it should try a register a private customer with wrong codiceFiscale", function (done) {
            let pc = {
                email:'xyz@mail.com',
                password: 'psw',
                name:'Trevis',
                surname: 'Paoletti',
                sex: 'M',
                placeOfBirth: 'Bovalino',
                dateOfBirth: new Date(1966,1,5),
                codiceFiscale:'wrongcd1245dr56b'
            };

            UserServices.registerPrivateCustomer(pc, (res) => {
                assert.equal(res, false);
                PrivateCustomer.isPrivateCustomerInDb(pc.email, pc.codiceFiscale, (res) => {
                    assert.equal(res, false);
                    done();
                })
            });
        });

        it("it should register a new private customer", function (done) {
            let pc = {
                email:'xyz@mail.com',
                password: 'psw',
                name:'Trevis',
                surname: 'Paoletti',
                sex: 'M',
                placeOfBirth: 'Bovalino',
                dateOfBirth: new Date(1966,1,5),
                codiceFiscale:'PLTTVS66B05B098J'
            };

            UserServices.registerPrivateCustomer(pc, (res) => {
                assert.equal(res, true);
                UserServices.isCustomerRegistered(pc.email, (res) => {
                    assert.equal(res, true);
                    done();
                });

            });
        });

        after(function (done) {
            let sql = "DELETE FROM PrivateCustomers WHERE email = ?";
            db.con.query(sql, [['xyz@mail.com']], (err) => {
                if(err)
                    throw err;
                done();
            })
        });
    });


    describe('Test of authPrivateCustomer', function () {

        it("it should authenticate private customer", function (done){

            let pc_email = "abatemaurizio_81@mail.it";
            let pc_psw = "0tx8hr";

            UserServices.authPrivateCustomer(pc_email, pc_psw, (res) => {
                assert.equal(res, true);
                done();
            });
        });

        it("it should refuse wrong password of private customer", function (done){

            let pc_email = "abatemaurizio_81@mail.it";
            let pc_psw = "wrong_psw";

            UserServices.authPrivateCustomer(pc_email, pc_psw, (res) => {
                assert.equal(res, false);
                done();
            });
        });

        it("it should refuse wrong email of private customer", function (done){

            let pc_email = "wrong@mail.it";
            let pc_psw = "wrong_psw";

            UserServices.authPrivateCustomer(pc_email, pc_psw, (res) => {
                assert.equal(res, false);
                done();
            });
        });
    });


    describe('Test of registerBusinessCustomer/getPendingBusinessCustomers', function () {

        it("it should try a register a wrong business customer", function (done) {
            let bc = {
                email:'',
                password: 'psw',
                name:'Trevis',
                partitaIva: '12345678910',
                address: 'via Pirelli, 13',
                comune: 'Milano',
                nazione: 'Italia',
                active: 0
            };

            UserServices.registerBusinessCustomer(bc, (res) => {
                assert.equal(res, false);
                UserServices.isCustomerRegistered(bc.email, (res) => {
                    assert.equal(res, false);
                    done();
                });
            })
        });

        it("it should register a new business customer", function (done) {
            let bc = {
                email:'xyz@mail.com',
                password: 'psw',
                name:'Trevis',
                partitaIva: '50505050505',
                address: 'via Pirelli, 13',
                comune: 'Milano',
                nazione: 'Italia',
                active: 0
            };

            UserServices.registerBusinessCustomer(bc, (res) => {
                assert.equal(res, true);
                UserServices.isCustomerRegistered(bc.email, (res) => {
                    assert.equal(res, true);
                    done();
                });
            })
        });

        it('it should return all pending business customer', function (done) {

            UserServices.getPendingBusinessCustomers((res) => {
                let isPresent = false;
                for(let i = 0; i < res.length; i++){
                    if(res[i].email === "xyz@mail.com")
                        isPresent = true;
                    if(i === res.length - 1)
                        if(isPresent)
                            done();
                        else throw Error('wrong insertion');
                }
            })
        });

        after(function (done) {
            let sql = "DELETE FROM BusinessCustomers WHERE email = ?";
            db.con.query(sql, [['xyz@mail.com']], (err) => {
                if(err)
                    console.log(err);
                done();
            })
        });
    });

});