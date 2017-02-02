/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

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

var alchemycreds = require('./config/credentials.json');

var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: 'T8eAr9Frhc0oPi6VnagQOEOur',
    consumer_secret: 'ASRuFAzn0b3VPmfo6mdGXYau4BSs9HOtdu2evHm5IcedK8qjat',
    access_token_key: '15673818-vUX8sLguRCL0NVtn4AQXB6gXVDP8Ni4LUOwl6U2z6',
    access_token_secret: 'sHJ1rQiukME7roJDmG333AT39rhn2AksnVxAbg3BGOeks'
});

var params = {
    screen_name: 'antonmc',
    count: 1000
};

var body = '';

app.post('/outpost', function (req, res) {

    console.log('called outpost');

    console.log(req.body);

    // ensure user policies are loaded
    if (!req.body.context || !req.body.context.system) {
        getUserPolicy(req, function (err, doc) {
            if (err) {
                res.status(err.code || 500).json(err);
            } else {
                //                processChatMessage(req, res);
            }
        });
    } else {
        //        processChatMessage(req, res);
    }
});


client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
        console.log(tweets.length);

        console.log(tweets[0].text);
    }

    tweets.forEach(function (tweet) {

        var cleaned = tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

        body = body + cleaned;
    })

    console.log(body);

    var parameters = {
        text: body,
        knowledgeGraph: 1
    };

    var keywords = '';
    var concepts = '';
    var entities = '';

    alchemy_language.keywords(parameters, function (err, response) {

        if (err) {
            console.log('error:', err);
        } else {

            response.keywords.forEach(function (concept) {
                keywords = keywords + concept.text + '\n';
            });

        }

        console.log(keywords);

    });


    alchemy_language.concepts(parameters, function (err, response) {

        if (err) {
            console.log('error:', err);
        } else {

            response.concepts.forEach(function (concept) {
                concepts = concepts + concept.text + '\n';
            });

        }

        console.log(concepts);

    });

    alchemy_language.entities(parameters, function (err, response) {

        if (err) {
            console.log('error:', err);
        } else {

            if (response.concepts) {
                response.concepts.forEach(function (concept) {
                    entities = entities + concept.text + '\n';
                });
            }
        }

        console.log(concepts);

    });


});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});