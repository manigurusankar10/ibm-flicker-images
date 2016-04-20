var express = require('express');
var path    = require("path");

var app = express();


app.get('/', function  (req, res) {
	res.sendFile(path.join(__dirname+'/app/app.html'));
});

app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/js', express.static(__dirname + '/app/js'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});