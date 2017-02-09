/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

app.use(bodyParser());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var watson = require('watson-developer-cloud');

var alchemycreds = require('./config/credentials.json');

var alchemy_language = watson.alchemy_language({
    api_key: alchemycreds[0].credentials.apikey
});

var async = require('async');

var tones = ['anger', 'disgust', 'fear', 'joy', 'sadness'];

var EMOTION = 0;
var LANGUAGE = 1;
var SOCIAL = 2;

var latitude;
var longitude;

'use strict';

const yelp = require('yelp-fusion');

const token = yelp.accessToken('', '').then(response => {
    console.log(response.jsonBody.access_token);

    const client = yelp.client(response.jsonBody.access_token);

    client.search({
        term: 'vegan',
        //        location: 'ottawa',
        latitude: 45.3407962,
        longitude: -75.6906025
    }).then(response => {
        console.log(response.jsonBody);
    }).catch(e => {
        console.log(e);
    });

}).catch(e => {
    console.log(e);
});


console.log('token: ');

console.log(token);


var alchemycreds = require('./config/credentials.json');

var Twitter = require('twitter');

var twitterclient = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

var params = {
    screen_name: 'antonmc',
    count: 1000
};

var body = '';

var chatbot = require('./bot.js');

app.post('/outpost', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    console.log('called outpost');

    console.log(req.body);

    chatbot.sendMessage(req.body.text, req.body.context, function (response) {

        console.log(response);

        res.send(JSON.stringify(response, null, 3));

    });

    // ensure user policies are loaded
    //    if (!req.body.context || !req.body.context.system) {}
});


/* For setting the person's location */

app.post('/location', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    console.log('called location');

    console.log(req.body);

    latitude = req.body.latitude;
    longitude = req.body.longitude;

    res.send(JSON.stringify(response, null, 3));

});



twitterclient.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
        //        console.log(tweets.length);//
        //        console.log(tweets[0].text);
    }

    tweets.forEach(function (tweet) {

        var cleaned = tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

        body = body + cleaned;
    })

    //    console.log(body);

    var parameters = {
        text: body,
        knowledgeGraph: 1
    };

    var keywords = '';
    var concepts = '';
    var entities = '';

    //    alchemy_language.keywords(parameters, function (err, response) {
    //
    //        if (err) {
    //            console.log('error:', err);
    //        } else {
    //
    //            response.keywords.forEach(function (concept) {
    //                keywords = keywords + concept.text + '\n';
    //            });
    //
    //        }
    //
    //        console.log(keywords);
    //
    //    });
    //
    //
    //    alchemy_language.concepts(parameters, function (err, response) {
    //
    //        if (err) {
    //            console.log('error:', err);
    //        } else {
    //
    //            response.concepts.forEach(function (concept) {
    //                concepts = concepts + concept.text + '\n';
    //            });
    //
    //        }
    //
    //        console.log(concepts);
    //
    //    });
    //
    //    alchemy_language.entities(parameters, function (err, response) {
    //
    //        if (err) {
    //            console.log('error:', err);
    //        } else {
    //
    //            if (response.concepts) {
    //                response.concepts.forEach(function (concept) {
    //                    entities = entities + concept.text + '\n';
    //                });
    //            }
    //        }
    //
    //        console.log(concepts);
    //
    //    });

});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});