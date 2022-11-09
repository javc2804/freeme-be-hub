const debug = require("debug")("BQ360::Log::Auth");

const express = require("express");
const router = express.Router();
const bqConfig = require("../config/configuration");
const _ = require("lodash");

const crypto = require("crypto-js");

const mongoose = require("mongoose"),
  User = mongoose.model("User");
  const ObjectId = require("mongodb").ObjectID;
const ensureAuthorized = async (req, res, next) => {
  // console.log('Verificar token');
  
  if (req.headers.aat) {    
    try {
      //console.log('Header AAT' , req.headers.aat );
      let login_result = await User.findOne({ token: req.headers.aat });
      if (login_result) {
        //console.log("Pasa");
        req.user = login_result;
        next();
        return;
      } else {
        res.status(403);
        res.send({});
        return;
      }
    } catch (error) {
      res.status(500);
      res.send(error);
      //console.log("Error login via Header/AAT: %o", error);
      return;
    }
  } else if (req.query.aat) {
    try {
      //console.log("Query AAT", req.headers.aat);
      let login_result = await User.findOne({ tokenSesion: req.query.aat });
      if (login_result) {

        req.user = login_result;
        next();
        return;
      } else {
        res.status(403);
        res.send({});
        return;
      }
    } catch (error) {
      res.status(500);
      res.send(error);
      //console.log("Error login via Query/AAT: %o", error);
      return;
    }
  } else if (req.headers.ipctoken) {
    let allowedIPC = bqConfig().allowedIPC;
    let found = allowedIPC.indexOf(req.headers.ipctoken);
    if (found >= 0) {
      next();
      return;
    } else {
      res.status(403);
      //console.log("IPC Token not found!");
      res.send({});
      return;
    }
  } else if (req.headers.aap) {
    console.log("es un AAP", req.headers.aap);
    try {
      let srv_result = await Survey.findOne({ _id: ObjectId(req.headers.aap)  });
      console.log(srv_result)
      console.log('00000000000000000000000')
      if (srv_result) {
        req.survey = srv_result;
        next();
        return;
      } else {
        res.status(403);
        res.send({});
        return;
      }
    } catch (error) {
      res.status(403);
      res.send(error);
      console.log("Error login via Header/AAP: %o", error);
      return;
    }
  } else if (req.headers.eat) {
    try {
      let trb = await Employees.findOne({ _id: req.headers.eat });
      if (trb) {
        let login_result = {
          tokenUser: trb._id,
          company: [trb.company],
          metadata: JSON.stringify(trb),
          canDownload:false,
          canSensibleData:true,
          filterLevel: 0,
          isAdmin:false,
          surveyModule:false,
          canPermison:false
        }
        console.log("Pasa");
        console.log(login_result)
        req.user = login_result;
        next();
        return;
      } else { 
        res.status(403);
        res.send({});
        return;
      }
    } catch (error) {
      res.status(500);
      res.send(error);
      //console.log("Error login via Header/AAT: %o", error);
      return;
    }
  } else {
    console.log(" nose econtro anda");
    res.status(403);
    //console.log("Token not found!");
    res.send({});
    return;
  }
};
module.exports = ensureAuthorized;
