const SCOPES = ["https://www.googleapis.com/auth/plus.business.manage"];
//   const TOKEN_PATH = 'src/config/WRT/credentials.json'; 
//   const CLIENT_SECRET_PATH = 'src/config/WRT/client_secret.json';
module.exports = function () {
  var configObj = {
    disableEmailSending: false,
    apiVersion: 0.1,
    port: 3313,
    listenAddress: "127.0.0.1",
    npsURL: "https://dev.api.onboarding.bqrc.es/",
    ecmURL: "https://dev.api.onboarding.bqrc.es/",
    evmURL: "https://evm.chanel.farmashopper.360bvm.net/",
    maxNPSMails: 40,
    modules: {
      gmb: false,
    },
    sessionClientSecret:
      "0usad09jf0saf09ujas09fnsa09f78hbas098hf09sa7f089as7f0987ga0f97as",
    maintenanceMode: false,
    hpAPKVersion: 10034,
    publicDownloads: "https://worten-api.360cvm.net/",
    apkName: "bq360-worten-esp-latest",
    deviceCheckTimeout: 5,
    minPasswordLength: 8,
    randomPasswordLength: 12,
    openssl: {
      privateKey: "",
      publicKey: "",
    },
    directorys: {
      base: "/ara/manager",
      keystorage: "/storage/keys",
    },

    smtp: {
      server: "smtp.serviciodecorreo.es",
      port: 465,
      tls: true,
      username: "noreply@bqrc.es",
      password: "Temporal01",
      from: "Test",
    },
    environment: "PROD",
    dbUri: "mongodb://localhost:27017/freeme",
    SEED: "este-es-un-seed-dificil-BQ-Sh3k1m1r5",
    db: {
      user: 'dc_user',
      host: 'fresh.crir0qopkmb2.eu-west-1.rds.amazonaws.com',
      database: 'fresh',
      password: 'p0s31d0n',
      port: 5432,
    }
  };
  return configObj;
};
