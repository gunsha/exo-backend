var express = require('express');
var router = express.Router();
var LoggerController = require('../controllers/loggerController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    LoggerController.list(req, res);
});

module.exports = router;