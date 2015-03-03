# node-smarthome

Code your smart home using node.js

## Example

You have a motion detector and lights in your living room. You want to turn the lights on when the motion is detected in the living room and turn them off when there is none for 5 minutes.

```js
home.get('motion/living-room').on('value', function(data) {
  // motion is detected
  if (data.value.status) {
    timer.stop('light-off');
    // turn lights on
    home.get('light/living-room/1').setValue({status: true});
    home.get('light/living-room/2').setValue({status: true});
  } else {
    // after 5 min
    timer.start('light-off', 5 * 60 * 1000).then(function() {
      // turn all lights in living room off (in a different way)
      home.get('light/living-room').visitLeaves(function(node) {
        node.setValue({status: false});
      });
    });
  }
});
```

## Design

It uses a tree data structure that supports event pubsub. It allows you publish an event in a leaf node and subscribe the events in any nodes in the middle. That is, you can subscribe all motion detect events in your living room using the path, 'motion/living-room', while each detector reports the event in the paths like 'motion/living-room/1'.

To make this work with real devices, it requires adpaters. For example, the adapters for lights and detector might look like this.

```js
// adapter for light 1.
home.get('light/living-room/1').on('value', function(data) {
  gpio.write(relayPin, data.value.status);
});

// adapter for detector.
// motion is detected.
home.get('motion/living-room/1').setValue({status: true});
// no motion.
home.get('motion/living-room/1').setValue({status: false});
```

## Hardware

As a proof of concept, I used a Raspberry Pi to host the controller and adapters. For lights, I use a relay, and for motion detector a PIR sensor.

<img src="https://lh5.googleusercontent.com/-joiVtc6rkiQ/VPVAhNrm2BI/AAAAAAAF0ik/NWRqPjeuwTs/w1264-h1684-no/IMG_20150302_210248.jpg" width="200px">

These are what I used.
 * [PIR Motion Sensor Module](http://www.amazon.com/gp/product/B008AESDSY/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1)
 * [2 Channel 5V Relay Shield Module](http://www.amazon.com/gp/product/B00E0NTPP4/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1)

## Control/monitoring

As you can see in the design, once the controller and adapters start their jobs, it is easy to create a control/monitoring system.

1. Local admin
   * You can build a simple web server using express and socket.io.
   * TBD: examples
   * TBD: framework
1. Global admin
   * I plan to make pubsub support global scope. An idea is that it uses other provider seamlessly. e.g. Firebase. Your controller doesn't have to be updated. You will just need to config it to use the provider.
   * TBD: examples
   * TBD: way to write one admin console and use it for local and global.
