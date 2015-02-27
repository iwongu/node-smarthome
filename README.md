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
