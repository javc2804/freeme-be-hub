const mongoose = require("mongoose"),
	Office = mongoose.model("Office"),
	Department = mongoose.model("Department"),
	Form = mongoose.model("Form"),
	Promotion = mongoose.model("Promotion"),
	Survey = mongoose.model("Survey"),
	Comunication = mongoose.model("Comunication"),
	Conciliation = mongoose.model("conciliation"),
	Satisfaction = mongoose.model("Satisfaction"),
	Linking = mongoose.model("Linking"),
	Works = mongoose.model("Works"),
	Proativity = mongoose.model("Proativity"),
	Profile = mongoose.model("Profile"),
	Nps = mongoose.model("Nps"),
	Rotation = mongoose.model("Rotation"),
	Customer = mongoose.model("Customer"),
	workerEvaluation = mongoose.model("workerEvaluation"),
	bossEvaluation = mongoose.model("bossEvaluation"),
	coworkerEvaluation = mongoose.model("coworkerEvaluation");
let ObjectID = require("mongodb").ObjectID;
const moment = require("moment");
const _generateFilter = async (info) => {
  if(info != null){
    return await  new Promise(async (resolve, reject) => {
      //console.log("########",info);
      const obj = JSON.parse(info);
      //console.log(obj);
      if(obj != null ){

        if(obj.type == undefined || obj.type == null ){
          resolve({})
        }
          switch (obj.type) {
            case "Oficina":
              //console.log("devolver promesa OFcina");
              resolve({office:ObjectID(obj.filter)});
              break;
            case "Departamento":
              //console.log("devolver promesa Departament");
              resolve({departament:ObjectID(obj.filter)});
            break;
            case "Trabajador":
              //console.log("devolver promesa");
              resolve({employee:ObjectID(obj.filter)});
              break;
            case "Cargo":
              //console.log("devolver promesa");
              resolve({position:ObjectID(obj.filter)});
              break;
            default:
              //console.log("CAE EN DEFAULT");
              resolve({})
              break;
        }
      }
   
      
    });
  }else{
   return {};
  }   
}
const _generateFilterCross = async (info) => {
  if(info != null){
  return await  new Promise(async (resolve, reject) => {
    const obj = JSON.parse(info);
    switch (obj.type) {
      case "Oficina":
        //console.log("devolver promesa OFcina");
        resolve({office:ObjectID(obj.filter)});
        break;
      case "Departamento":
        //console.log("devolver promesa Departament");
        resolve({departament:ObjectID(obj.filter)});
      break;
      case "Trabajador":  
        //console.log("devolver promesa");
        resolve({employeeRelation:ObjectID(obj.filter)});
        break;
      case "Cargo":
        //console.log("devolver promesa");
        resolve({position:ObjectID(obj.filter)});
        break;
      default:
        //console.log("CAE EN DEFAULT");
        resolve({})
        break;
    }
  });
  }else{
    return {};
  }  
}

module.exports = () => {
	return {
		generateFilter: _generateFilter,
		generateFilterCross: _generateFilterCross,
	};
};