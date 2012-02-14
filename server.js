var express = require('express')
  , socketio = require('socket.io')
  , eyes = require('eyes')
  , _ = require('underscore')
  , keys = require('./public/lib/keys.js')


var app = express.createServer(express.logger(), express.bodyParser())
app.use(app.router)
app.use(express.static(__dirname + '/public'))
app.listen(8000)
var io = socketio.listen(app)

var users = {};

function create_user() {
  var user_data = {
      x: parseInt(Math.random()*500)
    , y: parseInt(Math.random()*500)
    , keys: {}
  }
  return user_data
}

io.sockets.on('connection', function(socket) {
  users[socket.id] = create_user()
  var me = users[socket.id]

  socket.emit('init_data', { 
      my_id: socket.id
    , x: me.x
    , y: me.y
  })

  socket.on('keystroke', function(keystroke) {
    me.keys[keystroke.keyCode] = keystroke.pressed
    keystroke['socket_id'] = socket.id
    console.log(keystroke)
    socket.broadcast.emit('keystroke', keystroke) // broadcast keystrokes
  })

  socket.on('disconnect', function(){
    delete users[socket.id] // remove the user from the list
  })
})

/**
 * Game Loop
 *
 * The game simulation is run on each client as well as on the server. The 
 * server holds the master game loop, and updates the clients semi-frequently. 
 * The client and server should share this code. The client should include 
 * drawing functions. 
 */
setInterval(function() {
  /**
   * Move elements based on keystrokes
   */
  _.each(users, function(user) {
    
  })

  /**
   * Animation
   */

}, 50)
