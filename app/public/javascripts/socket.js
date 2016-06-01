var socket = io.connect(null, {'force new connection': true});
var sendMessageData;
var showAreaData;

socket.on('send message data', function(data) { 
    //console.log(data);
    if(JSON.stringify(sendMessageData) != JSON.stringify(data)) {
        sendMessageData = data;
        $('#send-message-select-area').empty();
        for(var i=0; i<data.length; i++) {
            var option = document.createElement('option');
            var id = data[i]._id;
            var value = data[i].name+' ('+data[i]._id+')';
            option.setAttribute('value', id);
            option.innerText = value;
            $('#send-message-select-area').append(option);
        }
    }
});

socket.on('show area data', function(data) { 
    //console.log(data);
    if(JSON.stringify(showAreaData) != JSON.stringify(data)) {
        showAreaData = data;
        $('#show-area-select-area').empty();
        for(var i=0; i<data.length; i++) {
            var option = document.createElement('option');
            var id = data[i]._id;
            var value = data[i].name+' ('+data[i]._id+')';
            option.setAttribute('value', id);
            option.innerText = value;
            $('#show-area-select-area').append(option);
        }
    }
});

socket.on('all user current position', function(data) {
    var users = data.users;
    clearAll();
    for(var i=0; i<users.length; i++) {
        addMarker(users[i].lat, users[i].lng);
    }
});

function addArea() {
    var name = $('#input-name').val();
    var markers = getMarkers();
    var vertices = [];
    for(var i=0; i<markers.length; i++) {
        vertices.push({
            lat : markers[i].position.lat(),
            lng : markers[i].position.lng()
        });
    };
    socket.emit('add new area', {
        area : {
            name : name,
            vertices : vertices
        }
    });
}

function showSendMessageModal() {
    socket.emit('get send message data', null);
    $('#sendMessageModal').modal('show');
}

function showShowAreaModal() {
    socket.emit('get show area data', null);
    $('#showAreaModal').modal('show');
}

function showAddAreaModal() {
    $('#addAreaModal').modal('show');
}

function sendMessage() {
    var id = $('#send-message-select-area').val();
    var msg = $('#input-message').val();
    //console.log(id + ' ' + msg);
    socket.emit('send message', {id : id, msg : msg});
}

function showArea() {
    clearAll();
    var id = $('#show-area-select-area').val();
    for(var i=0; i<showAreaData.length; i++) {
        if(showAreaData[i]._id == id) {
            var area = showAreaData[i];
            if(area.vertices.length>0) {
                moveToLocation(area.vertices[0].lat, area.vertices[0].lng);
                for(var j=0; j<area.vertices.length; j++) {
                    var vertex = area.vertices[j];
                    addMarker(vertex.lat, vertex.lng);
                }
                drawPolygon();
            }
            break;
        }
    }   
}

function showAllUserCurrentPosition() {
    socket.emit('get all user current position', null);
}