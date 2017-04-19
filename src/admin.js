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

let giftSchema = new Schema({
  _id: Object,
  item: String,
  comment: String
});

let Tool = mongoose.model('assets', toolsSchema);
let Gift = mongoose.model('gifts', giftSchema);//collection名称最好为复数

module.exports.getOfficeTools = function(req, res) {
  Tool.find((err, docs) => {
    res.json(docs);
  })
};

module.exports.updateOfficeTool = function(req, res) {
  // console.log(req.body);
  let data = req.body; 
  let _id = data._id;

  delete data._id;

  /* 如果Schema中的_id类型定义为String，则此处以_id为条件的查找将会失败
   * 下文addOfficeTool方法中，在保存doc时必须传入一个自定义的_id属性，否则将会报错
   */
  Tool.findOneAndUpdate({_id: mongoose.Types.ObjectId(_id)}, data, {new: true}, (err, doc) => {//new: true, 表示返回的doc是update后的数据，否则为原始数据
    if(err) {
      res.status(500).json({
        success: false,
        errName: "错误！",
        errMessage: err
      });
    } else {
      res.json({
        success: true, 
        message: "修改成功！",
        payload: doc
      });
    }
  });
};

module.exports.addOfficeTool = function(req, res) {
  let newData = req.body; 
  let newDoc = new Tool({
    _id: mongoose.Types.ObjectId(),//手动定义_id
    item: newData.item,
    price: newData.price,
    unit: newData.unit,
    comment: newData.comment
  });

  newDoc.save((err, doc) => {
    if(err) {
      res.status(500).json({success: false, errName: "错误！", errMessage: err});
    } else {
      res.json({success: true, message: "添加成功！"});
    }
  });  
}

module.exports.deleteOfficeTool = function(req, res) {
  let _id = req.query._id;
  Tool.findOneAndRemove({_id: mongoose.Types.ObjectId(_id)}, (err, doc) => {
    if(err) {
      res.status(500).json({success: false, errName: err.name, errMessage: err.message});
    } else {
      res.json({success: true, message: "删除成功！"})
    }
  });
}

module.exports.getGifts = function(req, res) {
  Gift.find((err, docs) => {
    if(err) {
      res.status(500).json({
        success: false,
        errName: "错误！",
        errMessage: "获取数据失败"
      });
    } else {
      res.json(docs);
    }
  });
}

module.exports.updateGift = function(req, res) {
  let data = req.body;
  let _id = data._id; 

  delete data._id;

  Gift.findOneAndUpdate({_id: mongoose.Types.ObjectId(_id)}, data, {new: true}, (err, doc) => { //new: true, 表示返回的doc是update后的数据，否则为原始数据
    if(err) {
      res.status(500).json({
        success: false,
        errName: err.name,
        errMessage: err.message
      });
    } else {
      res.json({
        success: true, 
        message: "修改成功！",
        payload: doc
      });
    }
  });
}

module.exports.addGift = function(req, res) {
  let newData = req.body; 
  let newDoc = new Gift({
    _id: mongoose.Types.ObjectId(),//手动定义_id
    item: newData.item,
    comment: newData.comment
  });

  newDoc.save((err, doc) => {
    if(err) {
      res.status(500).json({success: false, errName: err.name, errMessage: err.message});
    } else {
      res.json({success: true, message: "添加成功！"});
    }
  }); 
}

module.exports.deleteGift = function(req, res) {
  let _id = req.query._id;
  Gift.findOneAndRemove({_id: mongoose.Types.ObjectId(_id)}, (err, doc) => {
    if(err) {
      res.status(500).json({success: false, errName: err.name, errMessage: err.message});
    } else {
      res.json({success: true, message: "删除成功！"})
    }
  });
}