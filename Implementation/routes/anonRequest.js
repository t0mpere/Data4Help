let express = require('express');
let router = express.Router();
let passport = require('passport');

//da sistemare, era solo per fare una prova
router.get('/',(req,res) => {
    res.render('anonRequest')
});

module.exports = router;