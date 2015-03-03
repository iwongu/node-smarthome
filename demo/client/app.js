var express = require('express');
var app = express();
var server = require('http').Server(app);

var config = {
  port: 3000
};

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use('/build', express.static(__dirname + '/build'));

server.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});

