const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.mail.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: 'data4help@mail.com',
        pass: 'viacarnia'
    }
});
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});
var mailOptions = {
    from: 'data4help@mail.com',
    to: 'giacomo.ziffer@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});