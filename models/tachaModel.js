var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var tachaSchema = new Schema({
    'dt_update': { type: Date },
    'dt_create': { type: Date },
    'UID': {type: String},
    '_geolocation': {
        'type': { type: String, default: 'Point' },
        'coordinates': [{ type: Number }]
    }
});

tachaSchema.index({_geolocation: '2dsphere'});
module.exports = mongoose.model('Tacha', tachaSchema);
