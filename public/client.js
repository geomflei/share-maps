// const { json } = require("express");

const socket = io();

let textarea = document.querySelector("#textarea");
let myName;
let messageArea = document.querySelector(".message_area");




do {
    myName = prompt("Enter Your myName..")
} while (!myName);



mapboxgl.accessToken = 'pk.eyJ1IjoiYW1lemlhbmVnaXMiLCJhIjoiY2t6bW9kdXkyMnIwODJ1b2M3cHViYmljOCJ9.3Qf9Qmomwm1raTlf_YDfqg';
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.5, 40], // starting position
    zoom: 9 // starting zoom
});

let lastZoom

map.on('zoom', () => {
  currentZoom = map.getZoom();
  console.log(currentZoom);
  if (currentZoom > lastZoom) {
    // zoom in
  } else {
    // zoom out
  }

  lastZoom = currentZoom;
});

map.on('mousemove', (e) => {

    let points=`[${e.lngLat.wrap().lng},${e.lngLat.wrap().lat}]`
    sendMessage(points);
});


function sendMessage(message){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var message_time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    let msg ={
        user : myName,
        message : message.trim(),
        zoom:lastZoom
    }

    socket.emit('message',msg);
}

//Receive Message

socket.on('message',(msg)=>{
    let pointCoordinates=JSON.parse(msg.message);
    let pointZoomLevel=JSON.parse(msg.zoom);
    console.log(pointCoordinates);
    map.flyTo({
        center: pointCoordinates,
        zoom: pointZoomLevel
    });

    // appendMessage(msg,'incoming')
    // scrollToBottom();
})


