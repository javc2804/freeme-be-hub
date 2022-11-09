const express = require("express");
const router = express.Router();
const bqConfig = require("./config/configuration");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var request = require('request');
var params = {
  'user-id': 'javc',
  'api-key': 'IE2FB49PMoHp9I9v33dVC3WCHXLGCeLTrzp1acuEPrUtHYGc',
  'ip': '62.32.128.0'
};

const moment = require("moment");

const mongoose = require("mongoose"),
  User = mongoose.model("User");



router.post("/", async (req, res) => {
  console.log('aqui')

  var body = req.body;
 
  var user = new User({
    name: body.name,
    lastname: body.lastname,
    phone: body.phone
  });

  if(body.name === undefined || body.name === '' || body.lastname === undefined || body.lastname === '' || body.phone === undefined || body.phone === '' ) {
    return res.status(500).json({
      ok: false,
      msj: "No pueden haber campos vacios",
    });
    return
  }

  let validaciontlf = await neutrino(body.phone)
  if(validaciontlf.valid){
    user.save((err, userSaved) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          msj: "Error al guardar usuario",
          errors: err,
        });
      }
      res.status(201).json({
        ok: true,
        user: userSaved,
      });
    });
  }else{
    return res.status(500).json({
      ok: false,
      msj: "El número de teléfono no es valido",
    });
    return
  }
});

router.post("/agendas", async (req, res) => {
  var body = req.body;
  var agenda = {
    contactName: body.contactName,
    phone: body.phone
  };

  if(body.contactName === undefined || body.contactName === '' ||  body.phone === undefined || body.phone === '' ) {
    return res.status(500).json({
      ok: false,
      msj: "No pueden haber campos vacios",
    });
    return
  }

  let validaciontlf = await neutrino(body.phone)
  if(validaciontlf.valid){
    User.findOne({name:body.nameClient})
    .then((resp)=>{
      console.log(resp.name)
      if(resp === null){
        return res.status(400).json({
          ok: false,
          msj: "Contacto no existe",
        });
      }
      // console.log(resp.agenda)
      if(resp.agenda.length === 0){
        console.log('entro')
        User.updateOne({name:body.nameClient},{$set:{agenda}})
        .then((r)=>{
          console.log(r)
          return res.status(200).json({
            ok: true,
            msj: "Contacto agregado",
          });
        })
      }else{
        let agendaActualizada = []
        let estadoActualizado = false
        for(let a of resp.agenda){
          // console.log(a)
          if(a.contactName === agenda.contactName){
            a.phone = agenda.phone
            estadoActualizado = true
          }
          agendaActualizada.push(a)
        }
        console.log(agendaActualizada)
        console.log(estadoActualizado)
        if(!estadoActualizado){
          agendaActualizada.push(agenda)
        }
        User.updateOne({name:body.nameClient},{$set:{agenda:agendaActualizada}})
        .then((r)=>{
          console.log(r)
          return res.status(200).json({
            ok: true,
            msj: "Contacto agregado",
          });
        })
      }
    })
  }else{
    return res.status(500).json({
      ok: false,
      msj: "El número de teléfono no es valido",
    });
    return
  }
});

router.get("/lista-agenda/", (req, res) => {
  User.findOne({name:req.body.name})
  .then((resp)=>{
    if(resp === null){
      return res.status(400).json({
        ok: false,
        msj: "Contacto no existe",
      });
    }else{
      
      return res.status(400).json({
        ok: true,
        datos: resp.agenda,
      });
    }
  });
});

router.get("/comunes/", async (req, res) => {
  // console.log(req.body)
  let users = []
  let agenda1 = await getUser(req.body.userId1)
  let agenda2 = await getUser(req.body.userId2)
  for(let a1 of agenda1){
    for(let a2 of agenda2){
      if(a1.contactName === a2.contactName){
        await User.findOne({name:a2.contactName})
        .then((resp)=>{
          if(resp !== null){
            console.log(resp.name)
            users.push(resp.name)
            console.log(users)
          }
        })
      }
    }
  }
  return res.status(200).json({
    ok: true,
    msj: "usuarios en comun",
    datos:users
  });
});


const neutrino = async (number) => {
  return await new Promise(async (resolve, reject) => {
    var options = {
      'method': 'POST',
      'url': 'https://neutrinoapi.net/phone-validate?user-id=javc&api-key=IE2FB49PMoHp9I9v33dVC3WCHXLGCeLTrzp1acuEPrUtHYGc&ip=62.32.128.0',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        'number': number
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      resolve(JSON.parse(response.body)) 
    });
  });
}

const getUser = async (user) => {
  return await new Promise(async (resolve, reject) => {
    User.findOne({name:user})
    .then((resp)=>{
      resolve(resp.agenda)
    })
  })
}
module.exports = router;