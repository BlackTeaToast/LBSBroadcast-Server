var io = require('socket.io')();
var area = require('../models/area');
var inside = require('point-in-polygon');
var db = require('./db');

var clients = [];

io.on('connection', function(socket) {
    
    //初始化座標
    socket.position = {
        lat : null,
        lng : null
    }
    
    clients.push(socket);
    
    console.log('A user connected');
    console.log('Current clients num: ' + clients.length);
    
    /**
     * 監聽網頁增加新Area要求
     */
    socket.on('add new area', function(data) {
        console.log('add new area');
        if(data.area) {
            data.area.createdTime = Date.now();
            db.addArea(data.area);
        }
    });
    
    /**
     * 監聽用戶端傳送的座標並更新用戶座標
     */
    socket.on('sendLocation', function(data) {
        console.log('update user position: ' + JSON.stringify(data));
        clients[clients.indexOf(socket)].position = {
            lat : data.latitude,
            lng : data.longitude
        };
        //console.log(Date.now());
        //socket.emit('recvMsg', {Msg : '你好嗎 我很好 謝謝!'});
    });
    
    /**
     * 監聽網頁發出傳送訊息請求，並傳送訊息給區域內的用戶
     */
    socket.on('send message', function(data) {
        console.log('get send message');
        db.getAreaById(data.id, function(res) {
            //console.log('get area by id: '+res);
            var vertices = res.vertices;
            var polygon = [];
            for(var i=0; i<vertices.length; i++) {
                polygon.push([vertices[i].lat, vertices[i].lng]);
            }
            for(var i=0; i<clients.length; i++) {
                var position = [clients[i].position.lat, clients[i].position.lng];
                console.log(inside(position, polygon));
                if(inside(position, polygon)) {
                    if(io.sockets.connected[clients[i].id]) {
                        io.sockets.connected[clients[i].id].emit('recvMsg', { Msg : data.msg});
                        console.log('send message to clinet of ' + i);
                    } 
                }
            }
        });
    });
    
    /**
     * 監聽網頁要求取得發送訊息表單需要的資料
     */
    socket.on('get send message data', function(data){
        console.log('get all areas');
        socket.emit(db.getAllArea(function(res) {
            //console.log(res);
            socket.emit('send message data', res);
        }));
    });
    
    /**
     * 監聽網頁要求取得顯示Area表單需要的資料
     */
    socket.on('get show area data', function(data){
        console.log('get all areas');
        socket.emit(db.getAllArea(function(res) {
            //console.log(res);
            socket.emit('show area data', res);
        }));
    })
    
    socket.on('get all user current position', function () {
        var users = []
        for(var i=0; i<clients.length; i++) {
            if(clients[i].position.lat && clients[i].position.lng) {
                users.push(clients[i].position);
            }
        }
        socket.emit('all user current position', {users : users});
    });
    
    /**
     * 監聽離線
     */
    socket.on('disconnect', function() {
        console.log('Got disconnect!');

        var i = clients.indexOf(socket);
        clients.splice(i, 1);
        console.log('Current clients num: ' + clients.length);
        
    });

});

module.exports = io;