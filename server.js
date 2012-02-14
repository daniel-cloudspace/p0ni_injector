var express = require('express')
  , socketio = require('socket.io')
  , eyes = require('eyes')
  , _ = require('underscore')
  , keys = require('./public/lib/keys.js')


var app = express.createServer(express.logger(), express.bodyParser())
app.use(app.router)
app.use(express.static(__dirname + '/public'))
app.listen(8001)
var io = socketio.listen(app)

var f00ls = {};
var admin;

function create_user(loc) {
  var user_data = {
      x: parseInt(Math.random()*500)
    , y: parseInt(Math.random()*500)
    , keys: {}
    , loc: loc
  }
  return user_data
}

io.sockets.on('connection', function(socket) {

  socket.on('set_f00l', function(f00l) {
    f00ls[socket.id] = create_user(f00l.loc)
    var me = f00ls[socket.id]
    me.id = socket.id
    
    console.log(eyes.inspect(me))
  
    /**
     *  Send Init Data To The f00l
     */

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
  
    socket.on('send_location', function(loc) {
    })
  
    socket.on('disconnect', function(){
      delete f00ls[socket.id] // remove the user from the list
    })


    /**
     *  Send Data To Admin
     */

    admin.emit('add_f00l', me)
  })

  socket.on('set_familabber', function(familabber) {
    admin = socket

    socket.emit('init_data', {
      f00ls: f00ls
    })

    socket.on('disconnect', function() {
      admin = undefined
    })
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
  _.each(f00ls, function(user) {
    
  })

  /**
   * Animation
   */

}, 50)
