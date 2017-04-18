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

let Tool = mongoose.model('assets', toolsSchema);

module.exports.getOfficeTools = function(req, res) {
  Tool.find((err, docs) => {
    res.json(docs);
  })
};

module.exports.updateOfficeTool = function(req, res) {
  // console.log(req.body);
  let data = req.body; 

  /* 如果Schema中的_id类型定义为String，则此处以_id为条件的查找将会失败
   * 下文addOfficeTool方法中，在保存doc时必须传入一个自定义的_id属性，否则将会报错
   */
  Tool.findOneAndUpdate({_id: mongoose.Types.ObjectId(data._id)}, {price: data.price}, (err, doc) => {
    if(err) {
      console.log(err);
      res.status(500).json({
        success: false,
        errName: "错误！",
        errMessage: err
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
      console.log(err);
      res.status(500).json({success: false, errName: "错误！", errMessage: err});
    } else {
      res.json({success: true, message: "添加成功！"});
    }
  });  
}

module.exports.deleteOfficeTool = function(req, res) {
  console.log(req.query);
  let _id = req.query._id;
  Tool.findOneAndRemove({_id: mongoose.Types.ObjectId(_id)}, (err, doc) => {
    if(err) {
      res.status(500).json({success: false, message: err});
    } else {
      res.json({success: true, message: "删除成功！"})
    }
  });
}