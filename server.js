
// const express = require('express')
// const app = express()
// const server = require('http').Server(app)
// const io = require('socket.io')(server)
// const { v4: uuid_v4 } = require('uuid')

// var PeerServer = require('peer').PeerServer;
// var serverPeer = new PeerServer({port: 3001, path: '/'});

// app.set('view engine','ejs')
// app.use(express.static('public'))
  
// app.get('/',(req, res)=>{
//        res.redirect(uuid_v4())})
 
// app.get('/:room', (req, res) => {
//     res.render('room',{ roomId: req.params.room })})
// io.on('connection', socket =>{
//    socket.on('join-room', (roomId, userId)=> {
//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected',userId)
//     socket.on("message", (message) => {
//       io.to(roomId).emit("createMessage", message);
//     });
//    }) 
// })
// server.listen(3000)  
const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
// Peer

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, rsp) => {
  rsp.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

server.listen(process.env.PORT || 3030);