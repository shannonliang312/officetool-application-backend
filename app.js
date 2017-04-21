let express = require('express');
let app = express();
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let jwt = require('jsonwebtoken');
let config = require('./src/config');

let apiRouter = express.Router();

let utils = require('./src/utils');
let admin = require('./src/admin');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(morgan('dev')); // use morgan to log requests to the console

mongoose.connect('mongodb://localhost/demo');

let db = mongoose.connection;
db.on('error', function (err) {
  console.log('connection error', err);
});
db.once('open', function () {
  console.log('connected.');
});

// 路由中间件，拦截所有请求，验证token 
apiRouter.use((req, res, next) => {
  let url = req.url;
  if (url === "/login") {
    next();
  } else {
    let token = req.headers['x-access-token'];
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        console.log(err.name);
        if (err.name == "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            errName: "TokenExpiredError",
            errMessage: '登录超时，请重新登录'
          });
        } else if (err.name == "JsonWebTokenError") {
          return res.status(401).json({
            success: false,
            errName: "JsonWebTokenError",
            errMessage: '身份验证失败，请重新登录'
          });
        }
      } else {
        if (url.substr(0, 6) === "/admin") {
          if (decoded.role == "admin") {
            req.decoded = decoded;
            next();
          } else {
            return res.status(401).json({
              success: false,
              errName: "JsonWebTokenError",
              errMessage: '您没有权限访问该接口'
            });
          }
        } else {
          req.decoded = decoded;
          next();
        }
      }
    });
  }

});

/* 登录 */
apiRouter.post('/login', utils.authenticate);

/* 办公用品管理接口 */
apiRouter.get('/admin/office-tool', admin.getOfficeTools);
apiRouter.put('/admin/office-tool', admin.updateOfficeTool);
apiRouter.post('/admin/office-tool', admin.addOfficeTool);
apiRouter.delete('/admin/office-tool', admin.deleteOfficeTool);

/* 生日礼物管理接口 */
apiRouter.get('/admin/birthday-gift', admin.getGifts);
apiRouter.put('/admin/birthday-gift', admin.updateGift);
apiRouter.post('/admin/birthday-gift', admin.addGift);
apiRouter.delete('/admin/birthday-gift', admin.deleteGift);

/* 用户管理接口 */
apiRouter.get('/admin/user', admin.getUsers);
apiRouter.get('/admin/name-repetition', admin.checkNameRepetition);
apiRouter.post('/admin/user', admin.addUser);
apiRouter.delete('/admin/user', admin.deleteUser);
apiRouter.put('/admin/user', admin.updateUser);


app.use('/api', apiRouter);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});