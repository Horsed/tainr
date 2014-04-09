tainr
=====

sketching an event-based hackable monitoring for Node.js apps

```tainr``` is ought to be a monitoring service that aims for high customizability. You can write your own monitoring indicators and handlers which are basically just Node.js modules that use the same interprocess ```EventEmitter```. Indicators are those parts that test/monitor something and send monitoring events. Handlers will listen for those events and send emails or log something or do whatever you want. ```tainr``` will provide a [socket.io](http://socket.io) integration so you can even write handlers that do something in **your frontend**.

# Example

> my-node-service.js

```js
var HeartbeatIndicator = require('tainr').Heartbeat
  , heartbeatIndicator = new Heartbeat({serviceId: 'my-node-service'}); // will periodically emit a heartbeat event
```

> my-heartbeat-handler.js

```js
var Tainr = require('tainr').Tainr
  , tainr = new Tainr();
  
tainr.on('heartbeat', function(serviceId) {
  console.log(serviceId);
});
```

> my-monitoring-backend.js

```js
var Tainr = require('tainr').Tainr
  , tainr = new Tainr();

io.sockets.on('connection', function (socket) {
  tainr.wrap(socket);
});
```

> my-monitoring-frontend.html

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect('http://localhost/my-monitoring');
  socket.on('heartbeat', function (serviceId) {
    alert('service ' + serviceId + ' is alive!');
  });
</script>
```
