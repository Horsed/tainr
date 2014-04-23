tainr
=====

[![intro](https://raw.github.com/Horsed/tainr/master/doc/assets/intro-tainr.png)](https://raw.github.com/Horsed/tainr/master/doc/assets/intro-tainr.png)

*tainr* will be an event-based hackable Node.js monitoring toolkit that aims for high customizability. It will enable you to monitor anything that you can code in JavaScript.

Write your own monitoring indicators and handlers (called drones) and connect them to the tainr service. Indicator drones test/monitor something and send monitoring events. Handler drones will listen for those events and send emails or log something or do whatever you want.

tainr will provide a [socket.io](http://socket.io) integration so you can even write drones for **your frontends**. The underlying messaging is based on [zeromq](http://zeromq.org) so you can connect tainr to your existing zeromq based xpub/xsub infrastructure. This makes it easy to monitor backend and frontend events going through your app. You can also let tainr use its builtin xpub/xsub infrastructure.