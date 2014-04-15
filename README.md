tainr
=====

sketching an event-based hackable monitoring for Node.js apps

```tainr``` is ought to be a monitoring service that aims for high customizability. It will enable you to monitor anything from process metrics to business events. You can write your own monitoring indicators and handlers which are basically just Node.js modules that use the same interprocess ```EventEmitter```. Indicators are those parts that test/monitor something and send monitoring events. Handlers will listen for those events and send emails or log something or do whatever you want. ```tainr``` will provide a [socket.io](http://socket.io) integration so you can even write handlers that do something **in your frontend**. The underlying messaging is based on [zeromq](http://zeromq.org) so you can connect ```tainr``` to your existing zeromq based pub/sub infrastructure. This makes it easy to monitor all events going through your app. You can also let ```tainr``` use its own pub/sub infrastructure.

# Example

Suppose you've got a Node.js app or service that runs in it's own process and you want to monitor some process information like the CPU usage. There are tools for this like [pm2](https://github.com/Unitech/pm2). But suppose you want to monitor some business events that occur in your app/service and you want to send an email and pop up an alert in another app. Let's first setup this Node.js service:

> my-node-app.js

```js
var express = require('express')
  , app = express()
  
  , HeartbeatIndicator = require('tainr').Heartbeat
  , heartbeatIndicator = new Heartbeat({serviceId: 'my-node-app'}); // will periodically emit a heartbeat event;
 
app.post('/items', function(req, res) {
  res.send([{id: 'item1'}, {id: 'item2'}]);
});
 
app.listen(80);
console.log('my-node-app is running on port 80...');
```

This example REST service uses the *heartbeat indicator* to periodically emit a heartbeat event with the service's identifier. We will now look at a monitoring handler that **runs in another process** and logs the service id whenever it receives a heartbeat event.

> my-heartbeat-handler.js

```js
var Tainr = require('tainr').Tainr
  , tainr = new Tainr();
  
tainr.on('heartbeat', function(serviceId) {
  console.log(serviceId);
});

console.log('my-heartbeat-handler is running...');
```

As you can see, ```tainr``` exposes the ```EventEmitter``` API and is used to listen for ```heartbeat``` events that will be emitted by ```my-node-app.js```. Next we'll see how to connect the monitoring event system to the [socket.io](http://socket.io) backend of a simple status page:

> my-status-page.js

```js
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  
  , io = require('socket.io').listen(server)
  
  , Tainr = require('tainr').Tainr
  , tainr = new Tainr();

server.listen(3000);
console.log('my-status-page is running on port 3000...');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/my-status-page-frontend.html');
});

io.sockets.on('connection', function (socket) {
  tainr.wrap(socket);
});
```

In this example [express](http://expressjs.com) app, we're connection the socket.io socket to the ```tainr``` ```EventEmitter```. That means, all monitoring events emitted through ```tainr``` will be automagically emitted with this socket.io socket. Now we can write a monitoring handler for the browser:

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

This example socket.io frontend will alert you whenever the heartbeat event occours. While that is less useful, it shows you, how to write ```tainr``` monitoring handlers for a frontend. Let's just start all the services and apps for the sake of completeness:

    $ tainr start
    tainr is running...
    
    $ node ~/dev/my-heartbeat-handler.js
    my-heartbeat-handler is running...
    
    $ node ~/dev/my-node-app.js
    my-node-app is running on port 80...
    
    $ node ~/dev/my-status-page.js
    my-status-page is running on port 3000...

Note that ```my-heartbeat-handler``` doesn't have to be started manually. You can also configure ```tainr``` to start your handlers automatically when ```tainr``` starts.

# Configuration

The configuration of ```tainr``` is done via a ```tainrfile.js``` file that is expected to be located in the current working directory if none is provided via the CLI. To explicitly provide a config file use the ```-c``` option:

    $ tainr start -c /path/to/somefile.js

See the following example tainerfile.js to get to know the config options:

> tainrfile.js

```js
module.exports = {

  // the zeromq xpub/xsub broker that tainr will use
  broker: {
    xpub: 'tcp://127.0.0.1:3333',
    xsub: 'tcp://127.0.0.1:3338', // default = xpub port + 1 (e.g. tcp://127.0.0.1:3334)
    tainr: true,                  // true: tainr starts the broker
                                  // false: tainr will connect to an existing broker
  },
  
  // the indicators that tainr will start (you could also start and connect some the broker yourself)
  indicators: [
    {
      // provide one of the following options:

      included: 'heartbeat',                  // use one of the indicators that tainr brings
      local: '/path/to/my-indicator-bin.js',  // use a local custom indicator
      npm: 'my-indicator',                    // use a custom indicator fetched via npm
    }
  ],

  // the handlers that tainr will start (you could also start and connect some the broker yourself)
  handlers: [
    {
      // provide one of the following options:

      included: 'heartbeat',                // use one of the handlers that tainr brings
      local: '/path/to/my-handler-bin.js',  // use a local custom handler
      npm: 'my-handler',                    // use a custom indicator fetched via npm
    }
  ],

};
```