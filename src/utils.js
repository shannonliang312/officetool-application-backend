let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let config = require('./config');

let Schema = mongoose.Schema;
let userSchema = new Schema({
  _id: String,
  name: String,
  psw: String,
  role: String
});

let user = mongoose.model('users', userSchema);

module.exports.authenticate = function (req, res) {
  let name = req.body.name;
  let psw = req.body.psw;

  user.findOne({
    name: name
  }, (err, doc) => {
    let docObj = {};

    if (err) {
      throw err;
    }

    if (!doc) {
      res.status(401).json({
        success: false,
        message: "认证失败,用户未找到",
      });
    } else {
      docObj = doc.toObject();
      let verify_psw = bcrypt.compareSync(psw, docObj.psw);
      
      if (!verify_psw) {
        res.status(401).json({
          success: false,
          message: "认证失败,密码错误",
        });
      } else {
        let payload = {
          id: docObj._id,
          role: docObj.role
        };

        delete docObj.psw;
        if(docObj.assets) {
          delete docObj.assets;
        }

        let token = jwt.sign(payload, config.secret, {expiresIn: "1h"});
        let resData = {
          success: true,
          token: token,
          payload: docObj
        };

        res.json(resData);
      }
      
    }
  });


}