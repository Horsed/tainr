# Configuration

The configuration of tainr is done via a ```tainrfile.js``` file that is expected to be located in the current working directory if none is provided via the CLI. To explicitly provide a config file use the ```-c``` option:

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
  
  // the indicators that tainr will start
  indicators: [
    {
      // provide one of the following options:

      included: 'heartbeat',                  // default indicator
      local: '/path/to/my-indicator-bin.js',  // local custom indicator
      npm: 'my-indicator',                    // custom indicator fetched via npm
      child: true,                            // true: spawn als child process
                                              // false: require() and instantiate
    }
  ],

  // the handlers that tainr will start
  handlers: [
    {
      // provide one of the following options:

      included: 'heartbeat',                // default handler
      local: '/path/to/my-handler-bin.js',  // local custom handler
      npm: 'my-handler',                    // custom handler fetched via npm
      child: true,                          // true: spawn als child process
                                            // false: require() and instantiate
    }
  ],

};
```