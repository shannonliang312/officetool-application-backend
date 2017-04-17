let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let config = require('./config');

let Schema = mongoose.Schema;
let toolsSchema = new Schema({
  _id: Object,
  item: String,
  unit: String,
  price: Number
});

let tools = mongoose.model('assets', toolsSchema);

module.exports.getOfficeTools = function(req, res) {
  tools.find((err, docs) => {
    res.json(docs);
  })
};

module.exports.updateOfficeTools = function(req, res) {
  // console.log(req.body);
  let data = req.body; 

  tools.findOneAndUpdate({_id: mongoose.Types.ObjectId(data._id)}, {price: data.price}, (err, doc) => {
    if(err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: err
      });
    } else {
      res.json({
        success: true, 
        message: "修改成功！",
        payload: data
      });
    }
  });
};