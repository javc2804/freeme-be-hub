const express = require("express");
var bcrypt = require("bcryptjs");
const router = express.Router();
const bqConfig = require("../config/configuration");
var jwt = require("jsonwebtoken");
const { put } = require("request");
const mongoose = require("mongoose"),
  // Role = mongoose.model("Role"),
  User = mongoose.model("User");

router.post("/", (req, res) => {
  const cUser = req.user;
  if (!cUser) {
    return res.status(401).json({
      msj: 'Inicie sesion'
    });
  }
  var body = req.body;
  console.log(body.nombre)
  console.log(body.familias)
  console.log(body.temporalidad)
  console.log(body.rango)
  var user = new User({
    pwd: bcrypt.hashSync(body.pwd, 10),
    email: body.email,
    nombre: body.nombre,
    apellido: body.apellido,
    familias: body.familias,
    temporalidad: body.temporalidad,
    rango: body.rango,
  });

  // console.log(user)

  var token = jwt.sign(
    {
      user: user._id,
    },
    bqConfig().SEED,
    {
      expiresIn: 14400,
    }
  ); // cuatro horas

  user.token = token;

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
});

router.post("/update", (req, res) => {
  const cUser = req.user;
  if (!cUser) {
    return res.status(401).json({
      msj: 'Inicie sesion'
    });
  }
  var body = req.body;
  console.log(body);

  if (body.pwd !== '' && body.pwd !== undefined) {
    body.pwd = bcrypt.hashSync(body.pwd, 10)
  } else {
    delete body.pwd
  }

  console.log(body, 'EDIIIIIIT');
  User.updateOne({ _id: body._id },
    {
      $set: body
    }).then((r) => {
      console.log(r);
      res.send(r)
    })
});
router.put("/estado", (req, res) => {
  const cUser = req.user;
  if (!cUser) {
    return res.status(401).json({
      msj: 'Inicie sesion'
    });
  }
  var body = req.body;
  console.log(body);
  User.updateOne({ _id: body.id },
    {
      $set: { activate: body.bandera }
    }).then((r) => {
      console.log(r);
      res.send(r)
    })
});

router.delete("/:id", (req, res) => {
  const cUser = req.user;
  const body = req.params;
  if (!cUser) {
    return res.status(401).json({
      msj: "Inicie sesion",
    });
  }
  //console.log(body.id);
  User.remove({ _id: body.id }).then((data) => {
    //console.log(data);
    return res.status(200).json({
      ok: true,
    });
  });
});

router.get("/busqueda/:termino", (req, res) => {

  console.log("devolver todos los usuarios");
  const cUser = req.user;

  if (!cUser) {
    return res.status(401).json({
      msj: 'Inicie sesion'
    });
  }
  var termino = req.params.termino;
  var regex = new RegExp(termino, 'i');
  console.log(termino)
  var promesa;
  promesa = searchUser(termino, regex);

  promesa.then(data => {
    res.status(200).json({
      ok: true,
      res: data
    });
  });
});

router.get("/all", (req, res) => {
  const cUser = req.user;

  if (!cUser) {
    return res.status(401).json({
      msj: 'Inicie sesion'
    });
  }
  //console.log("devolver todos los usuarios");
  User.find({})
    .exec((err, users) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          msj: "Error al consultar usuarios",
          errors: err,
        });
      }
      res.status(200).json({
        ok: true,
        users
      });
    });
});

router.get("/:id", (req, res) => {

  let { id } = req.params;
  console.log(id);
  User.find({ _id: id })
    .exec((err, users) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          msj: "Error al consultar usuarios",
          errors: err,
        });
      }

      res.status(200).json({
        result: true,
        message: "Successfully requests users",
        data: users,
      });
    });
});





function searchUser(busqueda, regex) {

  return new Promise((resolve, reject) => {
    User.find({})
      .or([{ 'name': regex }, { 'email': regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject('Error al cargar usuarios', err);
        } else {
          resolve(usuarios);
        }
      });
  });
}


module.exports = router;
