# Custom drones

You can provide your drones as Node.js modules directly from the local filesystem or as npm modules.

## Writing drones

Here is an example drone that both emits and handles a monitoring event:

```js
var util = require('util')
  , Drone = require('tainr').Drone;

util.inherits(MyDrone, Drone);

function MyDrone() {
  MyDrone.call(this);

  var self = this;

  this.on('my-monitoring-event', function(data) {
    console.log(data);  // 'some-data'
  })

  setTimeout(function doStuff() {
    self.emit('my-monitoring-event', 'some data');
  }, 60000);

};

module.exports = MyDrone;
```

In order for tainr to instantiate drones with ```require()``` they'll have to expose a constructor function. To connect them to the tainr pub/sub broker they have to inherit from ```require('tainr').Drone```. The connection will be done for you.