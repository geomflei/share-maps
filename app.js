const express = require("express");

const app =  express();

const http = require("http").createServer(app);



app.use(express.static(__dirname + "/public"));




app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/index.html");
})



//Socket

let all_listUsersConnected=[]
const io = require("socket.io")(http)

io.on("connection",(socket)=>{
    console.log("connected...");
    socket.on('message',(msg)=>{
        socket.broadcast.emit('message',msg);
        // console.log(msg);
    })
    socket.on('messageText',(msg)=>{
        
        socket.broadcast.emit('messageText',msg);
        console.log(msg);
    })

    // listConnectUsers
    socket.on('listConnectUsers',(listUsersConnected)=>{
        
        socket.broadcast.emit('listConnectUsers',listUsersConnected);
        all_listUsersConnected=[]
        all_listUsersConnected.push(listUsersConnected)
        console.log('All listUsersConnected : ',all_listUsersConnected);
    })
})




http.listen(process.env.PORT || 6800 , ()=>{
    console.log("Server is running on port 6800");
})




