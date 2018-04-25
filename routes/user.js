var express = require('express');
var router = express.Router();
var UserController = require('../controllers/userController.js');
var RolController = require('../controllers/rolController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    UserController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    UserController.show(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    UserController.create(req, res);
});
/*
 * POST
 */
router.post('/rol/', function (req, res) {
    RolController.create(req, res);
});
/*
 * POST
 */
router.post('/login', function (req, res) {
    UserController.login(req, res);
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    UserController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    UserController.remove(req, res);
});

module.exports = router;