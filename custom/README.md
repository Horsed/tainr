# Custom indicators and handlers

tainr offers three ways to...

## Starting indicators and handlers

As you saw in the example config file, tainr can start indicators and handlers for you. They can either be spawned as child processes or by ```require()```ing and instantiating them. In order to instantiate handlers and indicators they have to expose their functionality like this:

```js
module.exports = function MyIndicator() {
  // indicator stuff
};
```

Local custom indicators and handlers will be instantiated like this: ```require(config.indicators[0].local)```

## Connecting custom indicators and handlers to the tainr pub/sub broker

Here is a custom indicator stub:

```js
var util = require('util')
  , Indicator = require('tainr').Indicator;

util.inherits(MyIndicator, Indicator);

function MyIndicator() {

  setTimeout(function doStuff() {



  }, 60000);

};

module.exports = MyIndicator;
```

And a custom handler stub:

```js
var util = require('util')
  , Handler = require('tainr').Handler;

util.inherits(MyHandler, Handler);

function MyHandler() {
  // handler stuff
};

module.exports = MyHandler;
```

```Indicator``` and ```Handler``` will connect your custom indicator and handler to the tainr pub/sub broker.