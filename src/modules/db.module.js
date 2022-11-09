const dbDebug = require("debug")("BVM::Log::MongoDB");
const bqConfig = require("../config/configuration");

// Bring Mongoose into the app
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

// Create the database connection
mongoose.connect(bqConfig().dbUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useMongoClient: true,
});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", function () {
  dbDebug("Mongoose default connection open to " + bqConfig().dbUri);
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  dbDebug("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  dbDebug("Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    dbDebug("Mongoose default connection disconnected through app termination");
    process.exit(0);
  });
});

// require('../server/server.schema');
// require("../users/role.schema");
require("../users/users.schema");
// require("../agenda/agenda.schema");