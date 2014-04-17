# Example

Suppose you've got a Node.js app or service that runs in it's own process and you want to monitor some process information like the CPU usage. There are tools for this like [pm2](https://github.com/Unitech/pm2). But suppose you want to monitor some business events that occur in your app/service and you want to send an email and pop up an alert in another app. Let's first setup this Node.js service:

> my-node-app.js

```js
var express = require('express')
  , app = express()
  
  , HeartbeatIndicator = require('tainr').Heartbeat
  , heartbeatIndicator = new Heartbeat(
      'tcp://127.0.0.1:6666',
      'tcp://127.0.0.1:6667',
      {serviceId: 'my-node-app'});
 
app.post('/items', function(req, res) {
  res.send([{id: 'item1'}, {id: 'item2'}]);
});
 
app.listen(80);
console.log('my-node-app is running on port 80...');
```

This example REST service uses the **heartbeat indicator** to periodically emit a heartbeat event with the service's identifier. It gets connected to a zeromq xpub/xsub broker running at ```tcp://127.0.0.1:6666, tcp://127.0.0.1:6667```. We will now look at a monitoring handler that **runs in another process** and logs the service id whenever it receives a heartbeat event.

> my-heartbeat-handler.js

```js
var Drone = require('tainr').Drone
  , drone = new Drone('tcp://127.0.0.1:6666', 'tcp://127.0.0.1:6667');
  
drone.on('heartbeat', function(serviceId) {
  console.log(serviceId);
});

console.log('my-heartbeat-handler is running...');
```

As you can see, this tainr drone is a Node.js [```EventEmitter```](http://nodejs.org/api/events.html#events_class_events_eventemitter) listening for ```heartbeat``` events that will be emitted by ```my-node-app.js```. Next we'll see how to connect the monitoring event system to the [socket.io](http://socket.io) backend of a simple status page:

> my-status-page.js

```js
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  
  , io = require('socket.io').listen(server)
  
  , Drone = require('tainr').Drone
  , drone = new Drone('tcp://127.0.0.1:6666', 'tcp://127.0.0.1:6667');

server.listen(3000);
console.log('my-status-page is running on port 3000...');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/my-status-page-frontend.html');
});

io.sockets.on('connection', function (socket) {
  drone.wrap(socket);
});
```

In this example [express](http://expressjs.com) app, we're connecting the socket.io socket to the tainr ```EventEmitter```. That means, all monitoring events emitted through tainr will be automagically emitted with this socket.io socket. Now we can write a monitoring handler for the browser:

> my-status-page-frontend.html

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect('http://localhost');
  socket.on('heartbeat', function (serviceId) {
    alert('service ' + serviceId + ' is alive!');
  });
</script>
```

This example socket.io frontend will alert you whenever the heartbeat event occours. While that is less useful, it shows you, how to write tainr monitoring handlers for a frontend. Let's just start all the services and apps for the sake of completeness:

    $ tainr start
    tainr is running...
    
    $ node ~/dev/my-heartbeat-handler.js
    my-heartbeat-handler is running...
    
    $ node ~/dev/my-node-app.js
    my-node-app is running on port 80...
    
    $ node ~/dev/my-status-page.js
    my-status-page is running on port 3000...

Note that ```my-heartbeat-handler``` doesn't have to be started manually. You can also configure tainr to start your handlers automatically when tainr starts.