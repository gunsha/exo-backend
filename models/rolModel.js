var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var rolSchema = new Schema({
    'descripcion':{type: String}
});
rolSchema.plugin(deepPopulate);
module.exports = mongoose.model('Roles', rolSchema);
