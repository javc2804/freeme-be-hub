/** DEBUGS */
const debug = require("debug")("BVM::Log::Main");
const traceAuth = require("debug")("BVM::TRACE::Auth");
const cronDebug = require("debug")("BVM::Log::Cron");
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redis = require("redis"),
  client = redis.createClient();
const bqDB = require("./src/modules/db.module");
const bqConfig = require("./src/config/configuration");
const bqAuth = require("./src/modules/auth.module");

const mongoose = require("mongoose");
const moment = require("moment");
const cors = require("cors");
const app = express();
const bqDefault = require("./src/default.routes");
// const bqUsers = require("./src/users/users.routes");
// const bqAgenda = require("./src/agenda/agenda.routes");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use(
  session({
    store: new RedisStore({
      client: client,
    }),
    secret: bqConfig().sessionClientSecret,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cors());

app.use((req, res, next) => {
  traceAuth(
    "[ New Request ] IP: %s - ADT: %s - AAT: %s - IPC: %s - URL: %s",
    req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    req.headers.adt ? req.headers.adt : false,
    req.headers.aat ? req.headers.aat : false,
    req.headers.ipctoken ? req.headers.ipctoken : false,
    req.url
  );
  next();
});




app.use("/", bqDefault);
app.use(bqAuth);
// app.use("/users", bqUsers);
// app.use("/agenda", bqAgenda);
const server = http.createServer(app);

server.listen(bqConfig().port, bqConfig().listenAddress, function listening() {
  // console.log("Listening on %s:%d", bqConfig().listenAddress, bqConfig().port);
});

console.log()

process.on("uncaughtException", (err) => {
  console.log("[Unhandled CRASH] %o", err);
  // server.close(() => process.exit(1));
});