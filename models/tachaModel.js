var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var tachaSchema = new Schema({
    'dt_update': { type: Date },
    'dt_create': { type: Date },
    '_geolocation': {
        'type': { type: String },
        'coordinates': [{ type: Number }]
    }
});

tachaSchema.index({_geolocation: '2dsphere'});
module.exports = mongoose.model('Parkings', tachaSchema);
