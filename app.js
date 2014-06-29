var express = require('express')
  , app     = express()
  , http  = require('http')
  , MongoClient = require('mongodb').MongoClient
  , reload = require('reload')
  , mongoose = require("mongoose")
  , swig = require('swig')
  , user = require('./routes/user')
  , index = require('./routes/index')
  , bodyParser = require('body-parser')
  , flash = require('connect-flash')
  , session = require('express-session')

/* CONNECT TO THE DB */
mongoose.connect('mongodb://localhost/pulse', function(err) {
  if (!err) {
    console.log("connected to mongodb");
  } else {
    throw err;
  }
});

app.use(express.static( __dirname + '/public' ));
app.use(bodyParser());

//set up the sockets
app.set('port', process.env.PORT || 3000);
var server = http.createServer(app);
var io = require('socket.io').listen(server, { log: false });
reload(server, app)
server.listen(app.get('port'), function() {
  console.log("Web server listening on port " + app.get('port'));
}); 

//set up the swig
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


app.use(require("cookie-parser")());
app.use(require('body-parser')());
app.use(session({ secret: 'picklepickle'}))

app.use(flash());

app.get('/', index.home);
app.post('/register', user.register_post);
app.post('/delete/:email',  user.delete_post);

//socket stuff
io.sockets.on('connection', function(socket) {
  socket.current_room = 'default'  
  socket.emit('ping', {'id': socket.id})
  console.log('connected established with client id of: ' + socket.id + ' part of room: ' + socket.current_room);

  socket.on('show room', function() {
    socket.emit('show current room', {'room': socket.current_room});
  })

  socket.on('get cookie', function() {
    
  })

  socket.on('join room', function(data) {
    console.log('joining room: ' + data.room);
    socket.current_room = data.room;
    console.log(socket.current_room)
  });

  socket.on('test', function() {
    console.log(socket.current_room)
  })

  socket.on('update location', function(data) {
    console.log(data);
  });

  socket.on('new user', function(data) {
    console.log('creating a user with name: ' + data.username);
    User.newUser(data.username, [data.lon, data.lat]);
  });

});

