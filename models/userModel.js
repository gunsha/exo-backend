
var mongoose = require('mongoose');
require('mongoose-moment')(mongoose);
var Schema   = mongoose.Schema;
var crypto = require('crypto');
var beautifyUnique = require('mongoose-beautiful-unique-validation');

var Pbkdf2 = require('nodejs-pbkdf2');
var jwt = require('jsonwebtoken');
var tokenSecret = '3x05m4rt94rk1n6-24725dac549b5d04dd9559f737b8c71daf815b3a033c4b9bd37c18cf20a15b54';

var config = {
  digestAlgorithm: 'sha1',
  keyLen: 64,
  saltSize: 64,
  iterations: 15000
};

var pbkdf2 = new Pbkdf2(config);

var UsuarioSchema = new Schema({
	'email' : { type: String, required: [true,'El email es obligatorio.'], unique: 'El email ya se encuentra registrado.' },
    'token' : { type: String},
    'nombre' : { type: String},
    'apellido' : { type: String},
	'fechaLogin' : { type: Date},
	'password' : { type: String, required: [true,'El password es obligatorio.'] },
	'fechaAlta' : { type: Date},
    'activo' : { type: Number},
    'rol' : { type: Number},
    'salt' : { type: String}
});

UsuarioSchema.plugin(beautifyUnique);

UsuarioSchema.pre('save', function(next) {
    var usuario = this;
    if (!usuario.isModified('password')) 
        return next();

    usuario.fechaAlta = new Date();
    
    pbkdf2.hashPassword(usuario.password, function(err, cipherText, salt) {
        usuario.password = cipherText;
        usuario.salt = salt;
        return next();
    });
});
var returnFunction = null;
UsuarioSchema.methods.comparePassword = function(candidatePassword,password, salt, cb) {
    returnFunction = cb;
      pbkdf2.isValidPassword(candidatePassword, password, salt).then(function(isValid,cb){
        returnFunction(null,isValid);
      });
};

UsuarioSchema.methods.getToken = function(cb){
    cb(jwt.sign({ user: this }, tokenSecret));
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
