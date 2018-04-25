var RolModel = require('../models/rolModel.js');
var logger = require('../controllers/loggerController.js');
module.exports = {

    list: function (req, res) {
        RolModel.find(function (err, roles) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting roles.',
                    error: err
                });
            }
            return res.json(roles);
        });
    },

    show: function (req, res) {
        var id = req.params.id;
        RolModel.findOne({_id: id}, function (err, rol) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting rol.',
                    error: err
                });
            }
            if (!rol) {
                return res.status(404).json({
                    message: 'No such rol'
                });
            }
            return res.json(rol);
        });
    },

    create: function (req, res) {
        var Rol = new RolModel(req.body);
        
        Rol.save(function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating role',
                    error: err
                });
            }
            logger.create(req.user,null,'CREACION DE ROL '+ role.descripcion);
            return res.status(201).json(role);
        });
    },
    remove: function (req, res) {
        var id = req.params.id;
        RolModel.findByIdAndRemove(id, function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the role.',
                    error: err
                });
            }
            logger.create(req.user,null,'ELIMINACION DE USUARIO '+ role.descripcion);
            return res.status(204).json();
        });
    }
};
