var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema(
  {
    name: { type: String },
    lastname: { type: String },
    phone: { type: String, unique: true},
    agenda: { type: Array, default: [] },
    created: { type: Date, default: Date.now()}
  }
);

module.exports = mongoose.model('User', User);