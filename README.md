# node-smarthome

Code your smart home using node.js

## Example

You have a motion detector and lights in your living room. You want to turn the lights on when the motion is detected in the living room and turn them off when there is none for 5 minutes.

```js
pubsub('detector/living_room').
  on('value', function(data) {
    var detected = data.value.status;
    if (detected) {  // motion is detected.
      // turn on all lights in living room.
      pubsub('light/living_room').visitDescendants(function(node) {
        node.setValue({status: true});
      });
      timer('light_off').stop();
    } else {  // no motion.
      timer('light_off').start(function() {
        // turn off all lights in living room.
        pubsub('light/living_room').visitDescendants(function(node) {
          node.setValue({status: false});
        });
      }, 5 * 60 * 1000);  // after 5 minutes.
    }
  });
```

## Design

It uses [pubsub](https://github.com/iwongu/node-pubsub) package as its hierarchical event tree. It can subscribe all events from motion detectors in living room using 'detector/living_room'. The detector will publish an event in 'detector/living_room/1'. The format for the event types is 'type/location/id', which is good enough for now.

Beyond this, we need to turn on the lights and detect the motion. To do these, it needs adapters. For example, the adapters for lights and detector might look like this.

```js
// adapter for light 1.
pubsub('light/living_room/1').
  on('value', function(data) {
    if (data.value.status) {
      // turn on the light.
    } else {
      // turn off the light.
    }
  });

// adapter for detector.
// motion is detected.
pubsub('detector/living_room/1').setValue({status: true});
// no motion.
pubsub('detector/living_room/1').setValue({status: false});
```

## Hardware

As a proof of concept, I will use Raspberry Pi to host the controller and adapters. For lights, I'll use a relay. For motion detector, a PIR sensor.

TBD: photos

TBD: videos

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
