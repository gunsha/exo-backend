var UserModel = require('../models/userModel.js');

module.exports = {

    list: function (req, res) {
        UserModel.find(function (err, Admins) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            return res.json(Admins);
        });
    },

    show: function (req, res) {
        var id = req.params.id;
        UserModel.findOne({_id: id}, function (err, Admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            if (!Admin) {
                return res.status(404).json({
                    message: 'No such Admin'
                });
            }
            return res.json(Admin);
        });
    },

    create: function (req, res) {
        var User = new UserModel(req.body);
        
        User.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating User',
                    error: err
                });
            }
            logger.create(req.user,null,'CREACION DE USUARIO '+ user.nombre +' '+ user.apellido);
            return res.status(201).json(user);
        });
    },

    update: function (req, res) {
        var id = req.params.id;
        UserModel.findOne({_id: id}, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User',
                    error: err
                });
            }
            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }

			User.id_usuario = req.body.id_usuario ? req.body.id_usuario : User.id_usuario;
			User.email = req.body.email ? req.body.email : User.email
            User.nombre = req.body.nombre ? req.body.nombre : User.nombre
            User.apellido = req.body.apellido ? req.body.apellido : User.apellido
            User.activo = req.body.activo ? req.body.activo : User.activo
            User.rol = req.body.rol ? req.body.rol : User.rol
			
            User.save(function (err, User) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating User.',
                        error: err
                    });
                }
                logger.create(req.user,null,'MODIFICACION DE USUARIO '+ User.nombre +' '+ User.apellido);
                return res.json(User);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;
        UserModel.findByIdAndRemove(id, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the User.',
                    error: err
                });
            }
            logger.create(req.user,null,'ELIMINACION DE USUARIO '+ User.nombre +' '+ User.apellido);
            return res.status(204).json();
        });
    },

    login: function(req, res) {
        var self = this;
        var email = req.body.email.toLowerCase();
        var rpassword = req.body.password;
        UserModel.findOne({
            email: email
        }, function(err, usuario) {
            if (err) {
                return res.status(406).json({
                    message: 'Error al loguear el usuario.',
                    error: err
                });
            }
            if (!usuario) {
                return res.status(406).json({
                    message: 'El email/password no se encuentra registrado.'
                });
            }
            if (usuario.activo != 1) {
                return res.status(406).json({
                    message: 'El usuario no se encuentra activo.'
                });
            }
            usuario.comparePassword(rpassword,usuario.password, usuario.salt, function(err, isMatch) {
                if (err || !isMatch) {
                    return res.status(406).json({
                        message: 'El email/password no se encuentra registrado.',
                        error: err
                    });
                } else {

                    usuario.salt = null;
                    usuario.password = null;
                    usuario.getToken(function(token){
                        console.log("token",token);
                        res.status(200).json({jwt:token});
                        //return token;
                    });
                }
            });

        });
    }
};
