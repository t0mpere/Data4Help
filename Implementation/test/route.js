process.env.NODE_ENV = 'test';
let express = require('express');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let app = require('../webApp');
let should = chai.should();
let assert = require('assert');
const request = require("supertest")(express);
let utils = require("../routes/utils");
let db = require("../database/DbConnection");
let passport = require('passport');

chai.use(chaiHttp);

// Allows the middleware to think we're already authenticated.
app.request.isAuthenticated = function() {
    console.log(1);
    return true;
};


utils.isBusinessCustomer = function () {
    console.log(2);
    return true;
};
/*
const loginWithDefaultUser = async () => {
    return request.post("/login")
        .send({ "username": "giackosparrow@hotmail.it", "password": "psw" })
        .expect(200);
};
*/


//CREARE NUOVO BUSINESS CUSTOMER PERCHE ALTRIMENTI NON PUO LEGGERE LA PARTITA IVA
/*
describe('/POST private requests', function () {

    this.timeout(20000);


    after(function (done) {
        db.con.end(done);
    });

    it('login with right credentials', function (done) {
        chai.request(server)
            .post('/login')
            .send({email:"giackosparrow@hotmail.it", password:"psw"})
            .end((err, res) => {
                expect(res).to.redirectTo('http://127.0.0.1:3000/');
                done();
            })
    });
/*
    it('login with wrong credentials', function (done) {
        chai.request(server)
            .post('/login')
            .send({email:"giackosparrow@hotmail.it", password:"wrong_password"})
            .end((err, res) => {
                expect(res).to.redirectTo('http://127.0.0.1:3000/login');
                console.log(res);
                done();
            })
    });*/
/*
    it('access to private request', function (done) {

        before(function (done) {
            passport.authenticate('local');
            done();
        });
        chai.request(server)
            .post('/bc/accessRequest')
            //.send({email:"giackosparrow@hotmail.it", password:"psw"})
            .end((err, res) => {
                if(err)
                    console.log(err);
                console.log(res);
                done();
            })


    });
*/



/*
    it('it should return 302', (done) => {

        request(app)
            .post('/bc/accessRequest')
            .expect(302)
            .expect(res => {
                console.log(res);
            })
            .end(done)
        });

        chai.request(server)
            .post('/bc/accessRequest')
            .end((err, res) => {
                assert.equal(res.unauthorized, true);
                res.should.have.status(401);
                done();
            });

    });

    it('it should return 200', (done) => {

        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('it should do some test', (done) => {

        chai.request(server)
            .post('/bc/accessRequest')
            .addAttribute(user, {
                _email: '"giackosparrow@hotmail.it"'
            })
            .send({email:"giackosparrow@hotmail.it"})
            .end((err, res) => {
                if(err)
                    console.log(err);
                console.log(res.text);
                done();
            });

    });

});*/
