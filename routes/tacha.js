var express = require('express');
var router = express.Router();
var TachaController = require('../controllers/tachaController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
    TachaController.list(req, res);
});

router.post('/near', function (req, res) {
    TachaController.near(req, res);
});

/*
 * GET
 */
router.get('/:id', function (req, res) {
    TachaController.show(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
    TachaController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function (req, res) {
    TachaController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
    TachaController.remove(req, res);
});

module.exports = router;