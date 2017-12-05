var express = require('express');
var path = require('path');
var app = express();

var bodyParser = require('body-parser');
var oConnections = {};

var defaultState = {
    // "fCurState": fBeginning,
    "bleedingStatus": 0,
    "hasRat": false,
    "hasMushroom": false,
    "hasSlime": false,
    "hasAxe": false,
    "hasCandle": false,
    "hasRecipe": false,
    "isInvincible": false
};

// Define the port to run on
app.set('port', process.env.PORT || parseInt(process.argv.pop()) || 5100);

// Define the Document Root path
var sPath = path.join(__dirname, '.');

app.use(express.static(sPath));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

function resetGame(sFrom) {
    oConnections[sFrom] = JSON.parse(JSON.stringify(defaultState));
    oConnections[sFrom].fCurState = fOutside;
}

function fEndGame(req, res) {
    var sFrom = req.body.From;
    var sAction = req.body.Body;
    var msg = "";

    if (sAction.toLowerCase().search(/drink|potion/) != -1) {
        msg += "The potion tastes fowl, but you feel the strength of a thousand men flow through your veins and know that right now, you are invincible. ";
        oConnections[sFrom].isInvincible = true;
        msg += oConnections[sFrom].hasAxe ? "Take out the axe " : "Stay ";
        msg += "and fight, or run like a coward?";
    }
    else if (sAction.toLowerCase().search(/axe|fight/) != -1) {
        msg += "You drop the bowl to the floor with a clatter and ";
        if (oConnections[sFrom].hasAxe) {
            msg += "pull out the axe. The beast rounds the corner as you raise the axe above your head for a strike. ";
        }
        else {
            msg += "realise you really should have taken that axe. ";
        }

        if (oConnections[sFrom].isInvincible && oConnections[sFrom].hasAxe) {
            msg += "Gaahrhgfushgsg!! It howls as you cleave its head in two. ";
            msg += "Now, feeling weak, as though the effort has sapped your strength, you head back outside. ";
            msg += "You have defeated the monster. You win. Now go have a nap. ";
            resetGame(sFrom);
        }
        else {
            msg += TOO_SLOW_YOU_DIE;
            resetGame(sFrom);
        }
    }
    else if (sAction.toLowerCase().search(/run|leave|exit|flee/) != -1) {
        if (oConnections[sFrom].isInvincible) {
            msg += "Gogogogogogogo! You book it through the old house and burst through the front door. The monster follows you and chases you down the street. ";
            msg += "Eventually you will tire, and then you will be eaten. The massacre of the town will be on your hands. ";
            msg += "I hope you're proud of yourself.";
            resetGame(sFrom);
        }
        else {
            msg += TOO_SLOW_YOU_DIE;
            resetGame(sFrom);
        }
    }
    else {
        msg += TOO_SLOW_YOU_DIE;
        resetGame(sFrom);
    }

    var twiml = new twilio.twiml.MessagingResponse();
    twiml.message(msg)
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(twiml.toString());
}



//define a method for the twilio webhook
app.post('/sms', function(req, res) {
    var sFrom = req.body.From;
    console.log("hit, sFrom:" + sFrom);
    if (!oConnections.hasOwnProperty(sFrom)) {
        resetGame(sFrom);
    }

    var sAction = req.body.Body;

    if (sAction.toLowerCase().search("status") != -1) {
        var status = "You have: \n";
        if (oConnections[sFrom].hasCandle) {
            status += "- a candle\n";
        }
        if (oConnections[sFrom].hasRat) {
            status += "- a dead rat\n";
        }
        if (oConnections[sFrom].hasSlime) {
            status += "- some nasty slime\n";
        }
        if (oConnections[sFrom].hasMushroom) {
            status += "- a moldy mushroom\n";
        }
        if (oConnections[sFrom].hasAxe) {
            status += "- an axe\n";
        }
        if (oConnections[sFrom].hasRecipe) {
            status += "- a potion recipe memorised (rat skull, mushroom, slime)\n";
        }
        status += "- a deep fear twisting in your gut";
        if (oConnections[sFrom].bleedingStatus > 0) {
            status += "...oh, and you're bleeding\n";
        }

        status += "Now just resume where you left off..."

        var twiml = new twilio.twiml.MessagingResponse();
        twiml.message(status);
        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });
        res.end(twiml.toString());
    } else {
        oConnections[sFrom].fCurState(req, res);
    }

});

// Listen for requests
var server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('Listening on localhost:' + port);
    console.log("Document Root is " + sPath);
});
