const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',// upgrade later with STARTTLS
    auth: {
        user: 'data4help.info@gmail.com',
        pass: 'viacarnia'
    }
});
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Mail Server is ready to send messages');
    }
});

module.exports = {mailServer:transporter};
