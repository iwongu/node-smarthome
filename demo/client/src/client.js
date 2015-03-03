var home = new SmartHome();

home.deftype(
  'light', {
    value: {
      status: 'boolean'
    }
  });
home.deftype(
  'motion', {
    value: {
      status: 'boolean'
    }
  });

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
  if (data.value.status) {
    $('#light').addClass('turnedon');
  } else {
    $('#light').removeClass('turnedon');
  }
});

$('#light').bind('click', function() {
  home.get('light/sunnyvale/living-room/1').setValue({
    status: !$('#light').hasClass('turnedon')
  });
});
