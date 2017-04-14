let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let config = require('./config');

let Schema = mongoose.Schema;
let toolsSchema = new Schema({
  _id: String,
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