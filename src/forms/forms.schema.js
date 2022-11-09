let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let form = new Schema({
    name: String,
    code: String,
    description: String,
    peso: String,
    bloque: String,
    status: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Form', form)
