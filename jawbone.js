/*
 * Module dependencies
 */
var express 	= require('express'),
    bodyParser 	= require('body-parser'),
    request		= require('request');

var app    	= express(),
    http  	= require('http').createServer(app);
   

//var authentication = require('./helpers/authentication');

// JSON support on POSTs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set /public as root for serving static files
app.use(express.static(__dirname + '/public'));

// Start server
var port = process.env.PORT || 3000;
http.listen(port, function(){
	console.log('> Started server on *:'+port);
});

// Set the base route
app.get('/', function(req, res){
  res.render('index.html');
});
app.get('/jawbone', function(req, res) {
	if (req.param('path')) {
		getJawboneData( req.param('path'), res );
	} else {
		getJawboneData( 'nudge/api/v.1.1/users/@me/moves', res );
	}
});




function getJawboneData( path, res ) {
	var access_token = 'b6_3pfGGwEi3Q2vrLdoIRfFK59dIENPZEcqJqnkeCcki7I-52Pt9BTfIFIOkmkrE8EvaJSumcI0GoYT-V9UbpVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP';
	var options = {
		url: 'https://jawbone.com/' + path,
		headers: {
		  'Authorization': 'Bearer ' + access_token,
		  'Accept': 'application/json'
		}
	};

	request( options, function (error, response, body) {
		if (error) {
			console.log('got error:');
			console.log(error)
			return;
		}

		var data = JSON.parse(body);

		console.log( 'StatusCode: ' + response.statusCode);
		console.log(data.data[0]);
		res.send( data );
	});
}