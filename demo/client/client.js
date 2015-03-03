var light = false;

/*
home.define(
  'light/sunnyvale/living-room/1',
  'motion/sunnyvale/living-room/1'
);

home.get('motion/sunnyvale/living-room').on('value', function(data) {
  if (data.value) {
    $('#motion').text(data.value.status ? 'motion detected' : 'no motions');
  }
});

home.get('light/sunnyvale/living-room/1').on('value', function(data) {
  light = data.value.status;
  if (light) {
    $('#light').addClass('turnedon');
  } else {
    $('#light').removeClass('turnedon');
  }
});

$('#light').bind('click', function() {
  home.get('light/sunnyvale/living-room/1').setValue({status: !light});
});
*/

var lightRef = new Firebase('https://raspberry-pi.firebaseio.com/' + 'light/sunnyvale/living-room/1');
var motionRef = new Firebase('https://raspberry-pi.firebaseio.com/' + 'motion/sunnyvale/living-room/1');

motionRef.on('value', function(snapshot) {
  var value = snapshot.val();
  console.dir(value);
  if (value) {
    $('#motion').text(value.status ? 'motion detected' : 'no motions');
  }
});

lightRef.on('value', function(snapshot) {
  var value = snapshot.val();
  if (value) {
    light = value.status;
    if (light) {
      $('#light').addClass('turnedon');
    } else {
      $('#light').removeClass('turnedon');
    }
  }
});

$('#light').bind('click', function() {
  lightRef.set({status: !light});
});
