process.env.NODE_ENV = 'test';

let chai = require('chai');
let should = chai.should();
let assert = require('assert');
const request = require("supertest");
let expect = chai.expect;
let RequestServices = require("../Controller/RequestServices");
let db = require("../database/DbConnection");




describe('Request services controller', function () {

    //just to avoid timeout exceeded exception
    this.timeout(10000);

    let bc_emails = ['acme@corp.com', 'alpha@beta.it', 'cami@mail.it', 'e@e.it',
        'famiglia.peresson@gmail.com', 'giackosparrow@hotmail.it', 'tompere.registrazioni@gmail.com'];

    after(function (done) {
        db.con.end(function(err) {
            if(err) {
                console.log(err);
            }
            done();
        });
    });


    it('it should return query of a business customer', function (done) {

        for(let i = 0; i < bc_emails.length; i++){
            RequestServices.getQueries(bc_emails[i], (res) => {
               if(res){
                   res.forEach(function (query) {
                       assert.equal(query.BusinessCustomer_email, bc_emails[i]);
                   })
               }
               if(i === bc_emails.length - 1 ){
                   done();
               }
            });
        }
    });


    it('it should return query data', function (done) {

        let bc = 'tompere.registrazioni@gmail.com';
        let query_title = ['Dati lambrate', 'Prova', 'Nuova query', 'Non anonym'];

        for(let i = 0; i < query_title.length; i++){
            RequestServices.getQueryData(bc, query_title[i], (res) => {
                if(res) {
                    for(let j = 0; j < res.length; j++){
                        if(res[j].avg_bp_min > '0' || res[j].avg_bp_max > '0' || res[j].avg_bpm > '0')
                            assert(res[j].num > 1000, "request not anonymized");
                        assert.equal(res[j].bc_email, bc);
                    }
                }
                if(i === query_title.length - 1 ){
                    done();
                }
            });
        }
    });


    it('it should return private requests', function (done) {
        bc_emails.forEach(function (email) {
            RequestServices.getPrivateRequests(email, (res) => {
                if(res) {
                    res.forEach(function (request) {
                        assert.equal(request.BusinessCustomers_email, email);
                    })
                }
            });
            if(email === bc_emails[bc_emails.length - 1])
                done();
        });
    });


    it('it should return private request data', function (done) {
        let bc = 'giackosparrow@hotmail.it';
        let pcs = ['abatemaurizio_81@mail.it', 'abbateludovico_99@mail.it', 'cami.231298@gmail.com',
        'tanifabrizia_59@mail.it', 'terzijesse_89@mail.it'];

        for(let i = 0; i < pcs.length; i++){
            RequestServices.getPrivateData(bc, pcs[i], (res) => {
               if(res){
                   res.forEach(function (data){
                       assert.equal(data._email, pcs[i]);
                   });
               }
                if(i === pcs.length - 1){
                    done();
                }
            });
        }
    });

    it('it should return false because this anonymous request already exist', function(done) {
       let bc = 'giackosparrow@hotmail.it';
       let title = 'Update stagione 18/19';

       RequestServices.makeAnonRequest(bc, {title: title}, (res) => {
           assert.equal(res, false);
           done();
       })
    });

    it('it should try to create an already existing private request', function (done) {
        let bc = 'giackosparrow@hotmail.it';
        let pc = 'cami.231298@gmail.com';

        RequestServices.makePrivateRequest(bc, pc, (res) => {
            assert.equal(res, false);
            done();
        });
    });

    it('it should return private requests of a private customer', function (done) {
        let pc = 'cami.231298@gmail.com';

        RequestServices.getPrivateRequestsByPc(pc, (res) => {
            res.forEach(function (request) {
                assert.equal(request.PrivateCustomers_email, pc);
            });
            done();
        });
    });


    describe('testing set functions', function () {

        let bc = 'giackosparrow@hotmail.it';
        let pc = 'nelo@levi.it';

        before(function (done) {
            RequestServices.getPrivateRequests(bc, (res) => {
                res.forEach(function (request) {
                    console.log(request.PrivateCustomers_email);
                    if(request.PrivateCustomers_email === pc)
                        throw new Error('invalid request existing')
                });
                done();
            });
        });

        it('it should create a new private request', function (done) {


            RequestServices.makePrivateRequest(bc, pc, (res) => {
                assert.equal(res, true);
                RequestServices.getPrivateRequests(bc, (res) => {
                    res.forEach(function (request) {
                        if (request.PrivateCustomers_email === pc)
                            assert.equal(request.accepted, 0);
                    });
                    RequestServices.setPrivateRequestStatus(pc, bc, 1, () => {
                        RequestServices.getPrivateRequests(bc, (res) => {
                            res.forEach(function (request) {
                                if (request.PrivateCustomers_email === pc)
                                    assert.equal(request.accepted, 1);
                            });
                            done();
                        });
                    });
                });
            });

        });

        after(function (done) {
            let sql = "DELETE FROM PrivateRequest WHERE BusinessCustomers_email = ? AND PrivateCustomers_email = ?";
            db.con.query(sql, [['giackosparrow@hotmail.it'],['nelo@levi.it']], (err) => {
                if(err)
                    console.log(err);
                done();
            })
        });

    });


});
