let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let config = require('./config');

let Schema = mongoose.Schema;
let userSchema = new Schema({
  name: String,
  psw: String,
  role: String
});

let user = mongoose.model('users', userSchema);

exports.authenticate = function (req, res) {
  let name = req.body.name;
  let psw = req.body.psw;

  user.findOne({
    name: name
  }, (err, doc) => {
    if (err) {
      throw err;
    }

    if (!doc) {
      res.status(401).json({
        success: false,
        message: "认证失败,用户未找到",
      });
    } else {
      let verify_psw = bcrypt.compareSync(psw, doc.psw);
      
      if (!verify_psw) {
        res.status(401).json({
          success: false,
          message: "认证失败,密码错误",
        });
      } else {
        let payload = {
          id: doc._id,
          role: doc.role
        };

        let token = jwt.sign(payload, config.secret, {expiresIn: "10s"});
        
        res.json({
          success: true,
          role: doc.role,
          token: token
        });
      }
      
    }
  });


}