let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/', (req, res) => {
    res.render('registration',{auth: req.isAuthenticated});
});
router.post('/', (req,res) =>{
    console.log(req.body);
    res.redirect("/");
});

module.exports = router;