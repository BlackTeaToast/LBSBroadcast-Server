/**
 * @param {Socket} io
 */
module.exports = function(io) {
    //var db = require('./db');
    setInterval(function(){
        var jsonString = JSON.stringify(taskList);
        var jsonObj = JSON.parse(jsonString);
        //console.log(tasks);
        io.emit('update task list table', jsonObj);
        //jsonString = JSON.stringify(db.getAllTask());
        //jsonObj = JSON.parse(jsonString);
        //
        
        db.getAllTask(function(res) {
            io.emit('update task history table', res);
        });
    },1000);
    
    return {
        tasks : queue.tasks,
        addNewTask : addNewTask
    }
}