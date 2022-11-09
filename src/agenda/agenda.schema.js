var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Agenda = new Schema(
  {
    contactName: { type: String },
    phone: { type: String, unique: true},
    created: { type: Date, default: Date.now()}
  }
);

module.exports = mongoose.model('Agenda', Agenda);