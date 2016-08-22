var express = require('express'),
app = express(),
server = require('http').createServer(app),
mongoose = require("mongoose"),
bodyParser = require('body-parser'),

io = require('socket.io').listen(server);
mongoose.connect('mongodb://stigerman:deeznutz1@ds031203.mlab.com:31203/chatterbug');
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));


var msgSchema = mongoose.Schema({
    msg:String,
    time:{type: Date, default: Date.now}
});

var Chat = mongoose.model("Message", msgSchema);
var users = [];
var connections =[];
io.sockets.on("connection", function(socket){
    connections.push(socket);
    console.log('Connected:' + connections.length +' sockets connected ' );
    
    //send message
    socket.on('send msg', function(data){
        console.log(data);
        var newMsg = new Chat({msg: data});
        newMsg.user = data.user;
        newMsg.save(function(err){
            if (err)
                throw err;
            else
                io.sockets.emit('get msg', {data, user:socket.username});

        });
    });
    
    //Disconnect
    socket.on('disconnect', function(data){
        socket.username = data;
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected', connections.length);
    });
    
    
    //New User
    socket.on('create user', function(data){
        socket.username = data;
        users.push(socket.username);
        console.log(data);
        io.sockets.emit('get users', {data});
        });
    
    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
});




server.listen(process.env.PORT || 1738, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});

