var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('contents/mapViewer', { title: 'About' });
});

module.exports = router;
