var TachaModel = require('../models/tachaModel.js');
var logger = require('../controllers/loggerController.js');

module.exports = {

    list: function (req, res) {
        TachaModel.find(function (err, tachas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting tachas.',
                    error: err
                });
            }
            return res.json(tachas);
        });
    },
    near: function (req, res) {
        TachaModel.find().where('_geolocation').near({
            center: {
                type: 'Point',
                coordinates: req.body.loc
            },
            maxDistance: req.body.distance
        }).exec(
        function (err, tachas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting tachas.',
                    error: err
                });
            }
            return res.json(tachas);
        });
    },
    create: function (req, res) {
        var tacha = new TachaModel(req.body);
        tacha.dt_created = new Date();
        tacha._geolocation.coordinates = [0,0];
        tacha.save(function (err, tacha) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating tacha',
                    error: err
                });
            }
            logger.create(req.user,tacha,'CREACION DE TACHA');
            return res.status(201).json(tacha);
        });
    },
};