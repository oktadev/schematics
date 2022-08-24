var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.userContext) {
    res.render('index', { title: 'Express', user: req.userContext });
  } else {
    res.render('login', { title: 'Express' })
  }
});

module.exports = router;
