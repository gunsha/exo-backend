var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var loggerSchema = new Schema({
    'fecha': { type: Date },
    'usuario':{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
   },
    'tacha':{
        type: Schema.Types.ObjectId,
        ref: 'Tacha'
   },
    'accion':{type: String}
});
loggerSchema.plugin(deepPopulate);
module.exports = mongoose.model('Logs', loggerSchema);
