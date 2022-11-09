const debug = require('debug')('BQ360::Log::Daemon::Mailing');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
const rp = require('request-promise');

const bqDB = require('./src/modules/db.module');
const bqConfig = require('./src/config/configuration');

const redis = require('redis'),
  client = redis.createClient();

const mongoose = require('mongoose'),
  EmailQueue = mongoose.model('EmailQueue');

const nodemailer = require('nodemailer');
const inlineBase64 = require('nodemailer-plugin-inline-base64');

const __lockFile = '/tmp/ecm360-mailing.lock';
const MAX_EMAIL_COUNT = 10;

const __relayEmail = async () => { };

const processQueue = async () => {
  //console.log("Proceso de enviar EMployer");
  EmailQueue.find({
    sended: false,
  })
    // .populate('client')
    // .limit(MAX_EMAIL_COUNT)
    .then(async emails => {
      console.log(emails,'sssssssss')
      let pendingQueue = await EmailQueue.count({
        sended: false,
        // discarded: { $ne: true },
        // success: { $ne: true },
      });
      debug('Total emails remaining in queue: ' + pendingQueue);
      console.log('Total emails remaining in queue: ' + pendingQueue);
      let emailRelay = bqConfig().emailRelay;
      client.set('evm360::mailing-queue-size', emails.length);
      let pending = emails.length;
      if (!emails || emails.length === 0) {
        removeLockFileAndExit();
        return;
      }
      for (let email of emails) {
        let mailOptions = {
          from: bqConfig().smtp.username,
          to: email.to,
          // cco: 'cuponesworten@bqrc.es',
          subject: email.subject,
          text: email.html,
          html: email.html,
        };
        //console.log(email.client);
        let transportOptions
        // if(email.client.smtp){
        //   console.log(email.client.smtp);
        // transportOptions = {
        //   host: email.client.smtp.server,
        //   port: email.client.smtp.port,
        //   secure: email.client.smtp.security,
        //   auth: {
        //     user: email.client.smtp.username,
        //     pass: email.client.smtp.password,
        //   },
        // }
        // confi gofit
        transportOptions = {
          host: bqConfig().smtp.server,
          port: bqConfig().smtp.port,
          secure: false,
          auth: {
            user: bqConfig().smtp.username,
            pass: bqConfig().smtp.password,
          },
          tls: {
            ciphers: 'SSLv3'
          },

        }
        // transportOptions = {
        //   host: bqConfig().smtp.server,
        //   port: bqConfig().smtp.port,
        //   secure: bqConfig().smtp.tls,
        //   auth: {
        //     user: bqConfig().smtp.username,
        //     pass: bqConfig().smtp.password,
        //   },
        // }


        let transporter = nodemailer.createTransport(transportOptions);

        transporter.use(
          'compile',
          inlineBase64({
            cidPrefix: 'bqqr_',
          }),
        );

        email.sended = true;

        if (bqConfig().emailDryRun) {


          email.dryRun = true;
          email.success = true;
          email.sendLog.push({
            timestamp: Date(),
            log: '[DEVELOPER][ NOTSEND ] Email sended to ' + email.to,
          });
        } else {
          try {
            let emailResult = await transporter.sendMail(mailOptions);
            console.log("resultado de envio", emailResult)
            email.success = true;
            email.sendLog.push({
              timestamp: Date(),
              log:
                'Email sent: ' +
                emailResult.messageId +
                ' to address: ' +
                email.to,
            });
            debug(
              'Email sent: ' +
              emailResult.messageId +
              ' to address: ' +
              email.to,
            );
          } catch (e) {
            email.success = false;
            email.sendLog.push({
              timestamp: Date(),
              log:
                'Error sending email: ' +
                e.message +
                ' to address: ' +
                email.to,
            });
            email.sendLog.push({
              timestamp: Date(),
              log: JSON.stringify(e),
            });
          }
        }

        try {
          let saveRes = await email.save();
          if (--pending <= 0) {
            debug('All emails has been processed');
            //console.log('All emails has been processed');
            removeLockFileAndExit();
          }
        } catch (sErr) {
          debug('Error saving email!');
          //console.log('Error saving email!');

          if (--pending <= 0) {
            debug('All emails has been processed, some with errors!');
            removeLockFileAndExit();
          }
        }
      }
    });
    console.log("🚀 ~ file: evm360-mailing-daemon.js ~ line 167 ~ processQueue ~ emails", emails)
    console.log("🚀 ~ file: evm360-mailing-daemon.js ~ line 167 ~ processQueue ~ emails", emails)
};

const removeLockFileAndExit = async () => {
  fs.unlinkSync(__lockFile);
};

module.exports = async () => {
  console.log('init funcion')
  fs.readFile(__lockFile, async (err, result) => {
    if (err && err.code === 'ENOENT') {
      fs.writeFile(__lockFile, '', err => {
        if (err) {
          debug('Error saving lock file!');
          //console.log('Error saving lock file!');
        }
      });
    } else {
      setTimeout(async () => {
        debug('Process not ended in 5 minutes, closing and releasing lock.');
        console.log('Process not ended in 5 minutes, closing and releasing lock.');
        await removeLockFileAndExit();
      }, 5 * 60 * 1000);

      if (result) {
        let fInfo = fs.statSync(__lockFile);
        let timeDiff = moment().diff(moment(fInfo.ctime), 'minutes');

        if (timeDiff >= 1) {
          debug('An older lock file is present, removing it!');
          console.log('An older lock file is present, removing it!');
          await removeLockFileAndExit();
        } else {
          debug('Another cron is running, exiting!');
          console.log('Another cron is running, exiting!');
          return;
        }
      }
    }

    await processQueue();
  });
};
