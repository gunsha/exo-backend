var LoggerModel = require('../models/loggerModel.js');

module.exports = {

    list: function (req, res) {
        LoggerModel.find().deepPopulate(['usuario','tacha']).exec(function (err, logs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting logs.',
                    error: err
                });
            }
            return res.json(logs);
        });
    },
    create: function (u,t,a) {
        var log = new LoggerModel({fecha:new Date(),tacha:t,accion:a,usuario:u.user});

        log.save(function (err, log) {
            if (err) {
                console.log(err)
            }
            console.log(log);
            return log;
        });
    },
};