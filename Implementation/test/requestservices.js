process.env.NODE_ENV = 'test';

let assert = require('assert');
let RequestServices = require("../Controller/RequestServices");
let db = require("../database/DbConnection");



describe('Test of RequestServices functions in Controller', function () {

    //just to avoid timeout exceeded exception
    this.timeout(10000);

    //some business customer email useful to test following functions
    let bc_emails = ['acme@corp.com', 'alpha@beta.it', 'cami@mail.it', 'e@e.it',
        'famiglia.peresson@gmail.com', 'giackosparrow@hotmail.it', 'tompere.registrazioni@gmail.com'];

/*
    after(function (done) {
        db.con.end(function(err) {
            if(err) {
                console.log(err);
            }
            done();
        });
    });*/


    describe('Test of getQueries', function () {

        it('it should return queries of a business customer', function (done) {

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
    });


    describe('Test of getQueryData', function () {

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
    });


    describe('Test of getPrivateRequests', function () {

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
    });


    describe('Test of getPrivateData', function () {

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
    });


    describe('Test of makeAnonRequest', function () {

        it('it should return false because this anonymous request already exist', function(done) {
           let bc = 'giackosparrow@hotmail.it';
           let title = 'Update stagione 18/19';

           RequestServices.makeAnonRequest(bc, {title: title}, (res) => {
               assert.equal(res, false);
               done();
           })
        });


        describe('Test makeAnonRequest with invalid parameters', function () {

            let bc = 'giackosparrow@hotmail.it';

            it('it should try to make anonymous request with invalid title', function (done) {

                let request = {
                    title: '',
                    periodical: '0',
                    age_from: '12',
                    age_to: '100',
                    date_from: '2017-01-05',
                    date_to: '2019-01-02',
                    lat_ne: '45.5130838',
                    long_ne: '9.275551199999995',
                    lat_sw: '45.420383',
                    long_sw: '9.09084299999995'
                };

                RequestServices.makeAnonRequest(bc, request, (res) => {
                    assert.equal(res, false);
                    done();
                })
            });

            it('it should try to make anonymous request with invalid age', function (done) {

                let request = {
                    title: 'test',
                    periodical: '0',
                    age_from: 'a',
                    age_to: '100',
                    date_from: '2017-01-05',
                    date_to: '2019-01-02',
                    lat_ne: '45.5130838',
                    long_ne: '9.275551199999995',
                    lat_sw: '45.420383',
                    long_sw: '9.09084299999995'
                };

                RequestServices.makeAnonRequest(bc, request, (res) => {
                    assert.equal(res, false);
                    done();
                })
            });

            it('it should try to make anonymous request with invalid date order', function (done) {

                let request = {
                    title: 'test',
                    periodical: '0',
                    age_from: '5',
                    age_to: '100',
                    date_from: '2019-01-02',
                    date_to: '2017-01-05',
                    lat_ne: '45.5130838',
                    long_ne: '9.275551199999995',
                    lat_sw: '45.420383',
                    long_sw: '9.09084299999995'
                };
                RequestServices.makeAnonRequest(bc, request, (res) => {
                    assert.equal(res, false);
                    done();
                })
            });
        });

        describe('Test makeAnonRequest with right parameters', function () {

            let request = {
                title: 'test_anonymous_request',
                periodical: '0',
                age_from: '5',
                age_to: '100',
                date_from: '2016-01-02',
                date_to: '2019-01-05',
                lat_ne: '45.5130838',
                long_ne: '9.275551199999995',
                lat_sw: '45.420383',
                long_sw: '9.09084299999995'
            };

            let bc = 'giackosparrow@hotmail.it';

            it('it should create a new anonymous request', function (done) {
                RequestServices.makeAnonRequest(bc, request, (res) => {
                    //assert.equal(res, true);
                    console.log(res);
                    done();
                })
            });

            after(function (done) {
                let sql = "DELETE FROM Queries WHERE BusinessCustomer_email = ? AND title = ?";
                db.con.query(sql, [[bc],[request.title]], (err) => {
                    if(err)
                        console.log(err);
                    done();
                })
            });

        });

    });


    describe('Test of getPrivateRequestsByPc', function () {

        it('it should return private requests of a private customer', function (done) {
            let pc = 'cami.231298@gmail.com';

            RequestServices.getPrivateRequestsByPc(pc, (res) => {
                res.forEach(function (request) {
                    assert.equal(request.PrivateCustomers_email, pc);
                });
                done();
            });
        });
    });


    describe('Test of makePrivateRequests', function () {

        let bc = 'giackosparrow@hotmail.it';
        let pc = 'nelo@levi.it';

        before(function (done) {
            RequestServices.getPrivateRequests(bc, (res) => {
                res.forEach(function (request) {
                    if(request.PrivateCustomers_email === pc)
                        throw new Error('invalid request existing')
                });
                done();
            });
        });

        it('it should try to create an already existing private request', function (done) {

            let bc_email = 'giackosparrow@hotmail.it';
            let pc_email = 'cami.231298@gmail.com';

            RequestServices.makePrivateRequest(bc_email, pc_email, (res) => {
                assert.equal(res, false);
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
            db.con.query(sql, [[bc],[pc]], (err) => {
                if(err)
                    console.log(err);
                done();
            })
        });

    });

});
