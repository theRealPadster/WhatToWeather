var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser')
var url = require('url'); // built-in utility
var app = express();


var bodyParser = require('body-parser');

// Define the port to run on
app.set('port', process.env.PORT || parseInt(process.argv.pop()) || 5100);

// Define the Document Root path
var sPath = path.join(__dirname, '.');

app.use(express.static(sPath));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.get('/', function(req, res) {
    
    // console.log(req.cookies);
    if (req.cookies['preferencesSet']) {
        res.redirect('/app');
    }
    else {
        res.redirect('/setup');
    }
    
});

app.get('/setup', function(req, res) {
    res.sendFile('pages/setup.html', { root: __dirname });
});

app.get('/app', function(req, res) {
    res.sendFile('pages/index.html', { root: __dirname });
});

// Listen for requests
var server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('Listening on localhost:' + port);
    console.log("Document Root is " + sPath);
});
