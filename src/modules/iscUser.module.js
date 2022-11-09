const iscUser = (req, res, next) => {
  const cUser = req.user;
  if (!cUser) {
    //console.log("error");
    return res.status(403).json({
      // result: !result,
      message: "No se ha encontrado un usuario logueado",
      errors: null,
    });
  }else{
    next()
  }

}


module.exports = {
    iscUser,
}
