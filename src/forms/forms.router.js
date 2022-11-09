const express = require("express")
var bcrypt = require("bcryptjs")
const router = express.Router()
const { iscUser } =  require('../modules/iscUser.module')

const mongoose = require("mongoose"),
  Form = mongoose.model("Form")

const _error = (res, status, er, m) => {
  return res.status(status).json({
    ok: false,
    message: m,
    errors: er,
  })
}

const _send = (res, status, er, m, d) => {
  return res.status(status).json({
    ok: true,
    msj: "Successfull "+m,
    data: d,
    errors: er,
  })
}

const isRequired = (req, res, next) => {
  if (
    !req.body.name ||
    !req.body.code ||
    !req.body.description ||
    !req.body.peso ||
    !req.body.bloque  ){
    return _error(res, 400, null, "Parameters are missing")
  }else{
    next()
  }
}



router.get("/", iscUser, (req, res) => {
  Form.find().where('status').equals(true).exec((err, data) => {
      if (err) {
	return _error(res, 500, err, "An error has occurred")
      }
      return _send(res, 200, err, "requests", data)
    })
})

router.post("/", isRequired,(req, res) => {
  let form = new Form({
    name: req.body.name,
    code: req.body.code,
    description: req.body.description,
    peso: req.body.peso,
    bloque: req.body.bloque
  })
  
  form.save((err, data) => {
    if(err){
      return _error(res, 500, err, "The form could not be saved")
    }
    return _send(res, 201, err, "Saved employee", data)
  })
})

router.get("/:id", iscUser, (req, res) => {
  let { id } = req.params

    if (!id) {
        return _error(res, 400, null, "Parameters are missing")
    }
    Form.find({ _id: id }).populate('fields').exec((err, data) => {
        if (err) {
          return _error(res, 500, err, "An error has occurred")
        }
        return _send(res, 200, err, "requests", data)
    })
})

router.put("/:id", (req, res) => {
  let { id } = req.params
  let { name, code, description } = req.body
  // res.send(name)
  if (!id) {
    return _error(res, 400, null, "Parameters are missing")
  }
  Form.findByIdAndUpdate(id, {
        name: name,
        code: code,
        description: description,
        updated_at: Date.now()
    }, (err, data) => {
        if (err) {
          return _error(res, 500, err, "An error has occurred")
        }
        // return _send(res, 200, err, "requests", data)
      res.sendStatus(204)
    })
})

router.patch("/:id", (req, res) => {
  let { id } = req.params
  let { name, code, description } = req.body
  if (!id) {
    return _error(res, 400, null, "Parameters are missing")
  }
  Form.findByIdAndUpdate(
    id,
    req.body,
    (err, data) => {
      if(err){
	return _error(res, 500, err, "An error has occurred")
      }
      	// return _send(res, 200, err, "updated status", {})
      res.sendStatus(204)
    }
  )

})

module.exports = router
