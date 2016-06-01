var mongoose = require('mongoose');
var url = 'mongodb://localhost';

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var Area = new Schema({
    name : String,
    createdTime : Date,
    vertices : [{
        lat : Number,
        lng : Number
    }]
});

mongoose.connect(url);

var AreaModel = mongoose.model('Areas', Area);

function addArea(area) {
    var post = new AreaModel();
    post.set(area);
    post.save(function (err) {
        if (!err) console.log('Success!');}
    );
}

function getAllArea(callback) {
    var query = AreaModel.find(null);
    query.exec(function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
        callback(res);
    })
}
function getAllTask(callback) {
    var query = TaskModel.find(null);
    query.sort({createdTime : -1});
    query.exec(function(err, res){
        if (err) {
            console.log(err);
            return;
        }
         callback(res);
    });
}
function getAreaById(id, callback) {
    var query = AreaModel.findById(id);
    query.exec(function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
        callback(res);
    });
}
function getTaskReportById(id, callback) {
    var query = TaskModel.findById(id);
    query.exec(function(err, res){
        if (err) {
            console.log(err);
            return;
        }
        callback(res);
    });
}

module.exports = exports = {
    addArea : addArea,
    getAllArea : getAllArea,
    getAreaById : getAreaById
}