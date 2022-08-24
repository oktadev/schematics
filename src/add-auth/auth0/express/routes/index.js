var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.oidc.user) {
    res.render('index', { title: 'Express', user: req.oidc.user });
  } else {
    res.render('login', { title: 'Express' })
  }
});

module.exports = router;
