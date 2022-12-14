// const { json } = require("express");

const socket = io();

let textarea = document.querySelector("#textarea");
let myName;
let messageArea = document.querySelector(".message_area");



do {
    myName = prompt("Enter Your Name..")
    $('#nameUser').text(myName)
    socket.emit('listConnectUsers',myName);

} while (!myName);

// function allUsersList(listConnectUsers){

//     socket.emit('listConnectUsers',message);
// }

textarea.addEventListener('keyup',(e)=>{
    if(e.key === 'Enter'){
        sendTextMessage(e.target.value);
    }
})

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1lemlhbmVnaXMiLCJhIjoiY2t6bW9kdXkyMnIwODJ1b2M3cHViYmljOCJ9.3Qf9Qmomwm1raTlf_YDfqg';
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-6.5, 34], // starting position
    zoom: 3 // starting zoom
});

map.addControl(
    new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true
    })
    );

let lastZoom

map.on('zoom', () => {
  currentZoom = map.getZoom();
  console.log(currentZoom);
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


    textarea.value = '';

    socket.emit('message',msg);
}


function sendTextMessage(messageText){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var message_time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    let message ={
        user : myName,
        message : messageText.trim(),
        zoom:lastZoom
    }
    // console.log(message.user);
   

    //Append
    appendMessage(message,'outgoing');
    scrollToBottom();

    textarea.value = '';

    socket.emit('messageText',message);
}

function appendMessage(msg,type){
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className,'message');

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup;
    

    messageArea.appendChild(mainDiv);
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
})

socket.on('messageText',(msg)=>{

    console.log(msg);
    appendMessage(msg,'incoming')
    scrollToBottom();
})

function scrollToBottom (){
    messageArea.scrollTop = messageArea.scrollHeight
}


$('#close_chat_section').off().on('click',()=>{
    // $('#chat_section').hide()
    console.log($('#chat_section').css('height'));
    
    if($('#chat_section').css('height') == '50px') {
        $('#chat_section').css('height', '408px')
    }else{
        $('#chat_section').css('height', '50px')
    }
})