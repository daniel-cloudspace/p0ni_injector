var includes = [ 'http://j.maxmind.com/app/geoip.js', 
                 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
                 '/socket.io/socket.io.js' ]
for (var i=0; i<includes.length; i++) {
  var script_tag = document.createElement('script')
  script_tag.type = 'text/javascript'
  script_tag.src = includes[i]
  document.head.appendChild(script_tag) 
}


/**
 * Global constants
 */
var used_keycodes = [   DOM_VK.W
                      , DOM_VK.A
                      , DOM_VK.S
                      , DOM_VK.D ]


console.log('first one')

/**
 * Initialize
 */
var x, y, my_id
var f00ls;
window.addEventListener('load', function() {
  console.log('second one')
  var socket = new io.connect()
    
  /**
   * Event handlers for misc messages!
   */
  socket.on('disconnect', function(){ 
    /* something related to disconnect! */ 
  })

  /**
   * Event handlers for server->client messages!
   */
  socket.on('init_data', function(init_data) {
    my_id = init_data.my_id
    x = init_data.x // sets global ‘a’ variable from data sent by Socket.io
    y = init_data.y // sets global ‘b’ variable
  })

  socket.on('keystroke', function(keystroke) {
    
  })
    
  /**
   * Event handers for client->server messages!
   **/
  function handleKeyEvent(type, e) {
    if (!_.include(used_keycodes, e.keyCode)) return; // return early if we're not using this keycode
    
          e.preventDefault() // disable the default keystroke, like up/down moving the page
          socket.emit('keystroke', { // send the keycode 
            keyCode: e.keyCode, pressed: (type == 'keydown') // set to keyup as default
          })
  }
  document.addEventListener('keydown', function(e) { handleKeyEvent('keydown', e) }, false)
  document.addEventListener('keyup',   function(e) { handleKeyEvent('keyup', e)   }, false)


  socket.emit('set_f00l', { 
    loc: { 
      country_code: geoip_country_code(),
      country: geoip_country_name(),
      city: geoip_city(),
      region_code: geoip_region(),
      region: geoip_region_name(),
      postal_code: geoip_postal_code(),
      latitude: geoip_latitude(), 
      longitude: geoip_longitude() 
    }
  })


  var myOptions = {
    center: new google.maps.LatLng(28.703052,-81.338401),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.HYBRID
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions)
})
