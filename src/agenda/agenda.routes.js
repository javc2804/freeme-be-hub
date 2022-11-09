const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"),
  User = mongoose.model("User");
  Agenda = mongoose.model("Agenda");

  // router.post("/sss", (req, res) => {
  //   var body = req.body;
  //   var agenda = new Agenda({
  //     contactName: body.contactName,
  //     phone: body.phone
  //   });

  //   console.log(agenda)
  
  //   if(body.contactName === undefined || body.contactName === '' ||  body.phone === undefined || body.phone === '' ) {
  //     return res.status(500).json({
  //       ok: false,
  //       msj: "No pueden haber campos vacios",
  //     });
  //     return
  //   }
  
  //   agenda.save((err, agendaSaved) => {
  //     if (err) {
  //       return res.status(500).json({
  //         ok: false,
  //         msj: "Error al guardar usuario",
  //         errors: err,
  //       });
  //     }
  //     res.status(201).json({
  //       ok: true,
  //       user: agendaSaved,
  //     });
  //   });
  // });

  module.exports = router;