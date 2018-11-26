const db = require('../database/DbConnection');
const Customer = require('./Customer');

class BusinessCustomer extends Customer{

    constructor(email, password) {
        super(email, password);
    }
}