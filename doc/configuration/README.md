# Configuration

The configuration of tainr is done via a ```tainrfile.js``` that is expected to be located in the current working directory if none is provided via the CLI. To explicitly provide a config file use the ```-c``` option:

    $ tainr start -c /path/to/somefile.js

See the following example tainrfile.js to get to know the config options:

> tainrfile.js

```js
module.exports = {

  // the zeromq xpub/xsub broker that tainr will use
  broker: {
    xpub: 'tcp://127.0.0.1:3333',
    xsub: 'tcp://127.0.0.1:3338', // default: xpub port + 1
    tainr: true,                  // true: tainr starts the broker itself
                                  // false: tainr will connect to a broker
  },
  
  // the indicator/handler drones that tainr will start
  drones: [
    {  included: 'heartbeat-indicator',  },
    {  included: 'heartbeat-handler',  },

    {  local: '/path/to/my-indicator.js',  },
    {  local: '/path/to/my-handler.js',  },
    
    {  npm: 'my-indicator',  },
    {  npm: 'my-handler@1.0.1',  },
  ],

};
```