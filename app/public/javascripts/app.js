
var latitude = 24.184782;
var longitude = 130.655192;
var map;
var markers = [];
var polygons = [];

function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            callback();
        });
    } else { 
        console.log('Geolocation is not supported by this browser.');
        callback();
    }
}
function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}
function moveToLocation(lat, lng){
    var center = new google.maps.LatLng(lat, lng);
    // using global variable:
    map.panTo(center);
}
function getLocationAndMove() {
    getLocation(function() {
        moveToLocation(latitude, longitude);
        addMarker(latitude, longitude);
    });
    
}
function addMarker(lat, lng) {
    var center = new google.maps.LatLng(lat, lng);
    var marker=new google.maps.Marker({
        position: center,
        map: map
    });
    //marker.setMap(map);
    markers.push(marker);
}
function addPolygon(path) {
    //var myTrip=[stavanger,amsterdam,london,stavanger];
    var polygon = new google.maps.Polygon({
        path:path,
        strokeColor:"#0000FF",
        strokeOpacity:0.8,
        strokeWeight:2,
        fillColor:"#0000FF",
        fillOpacity:0.4,
        map: map
    });
    polygons.push(polygon)
}
// Sets the map on all markers in the array.
function setMapOnAllMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAllMarkers(map);
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAllMarkers(null);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}
function setMapOnAllPolygons(map) {
    for (var i = 0; i < polygons.length; i++) {
        polygons[i].setMap(map);
    }
}
function showPolygons() {
    setMapOnAllPolygons(map);
}
function clearPolygons() {
    setMapOnAllPolygons(null);
}
function deletePolygons() {
    clearPolygons();
    polygons = [];
}
function drawPolygon() {
    var path = [];
    for (var i = 0; i < markers.length; i++) {
        path.push(markers[i].position);
    }
    addPolygon(path);
}
function clearAll() {
    deleteMarkers();
    deletePolygons();
}
function getMarkers() {
    return markers;
}
function initMap() {
    
    var mapProp = {
        center:new google.maps.LatLng(latitude, longitude),
        zoom:15,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map'), mapProp);
    getLocation(function() {
        moveToLocation(latitude, longitude);
    });
    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng.lat(), event.latLng.lng());
    });
    
}