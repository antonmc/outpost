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

var understandingcreds = alchemycreds[2]["natural-language-understanding"][0].credentials;

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var nlu = new NaturalLanguageUnderstandingV1({
    username: understandingcreds.username,
    password: understandingcreds.password,
    version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2016_01_23
});


console.log(understandingcreds);

var async = require('async');

var tones = ['anger', 'disgust', 'fear', 'joy', 'sadness'];

var EMOTION = 0;
var LANGUAGE = 1;
var SOCIAL = 2;

var latitude;
var longitude;

var yelptoken;

'use strict';

const yelp = require('yelp-fusion');

const token = yelp.accessToken('lQtWce8qF1uBCGBgJSf72g', 'QL0CaFA8j8rC8zzCqxZw3Vzi8nzlR3fG2Ou3IPPS60KuD5Mw3hJVW8yQAahe26Fd').then(response => {
    //    console.log(response.jsonBody.access_token);

    yelptoken = response.jsonBody.access_token;

    const client = yelp.client(response.jsonBody.access_token);

    client.search({
        term: 'vegan',
        //        location: 'ottawa',
        latitude: 45.3407962,
        longitude: -75.6906025
    }).then(response => {
        //        console.log(response.jsonBody);    }).catch(e => {
        console.log(e);
    });

}).catch(e => {
    console.log(e);
});


//var PDK = require('node - pinterest ');
//var pinterest = PDK.init('AXEjA8iP2yLXX6grRfiunleNylq5FKZVAxy3wWlDz9DhgEBDvwAAAAA');
//
////pinterest.api('antonmc').then(console.log); 
//
//var options = {
//    qs: {
//        fields: "antonmc,Anton",
//        limit: 10
//    }
//};
//
//pinterest.api('antonmc/pins', options).then(console.log);

/* - - - - - - - - - - */

var alchemycreds = require('./config/credentials.json');



var Twitter = require('twitter');

var twitterclient = new Twitter({
    consumer_key: 'T8eAr9Frhc0oPi6VnagQOEOur',
    consumer_secret: 'ASRuFAzn0b3VPmfo6mdGXYau4BSs9HOtdu2evHm5IcedK8qjat',
    access_token_key: '15673818-vUX8sLguRCL0NVtn4AQXB6gXVDP8Ni4LUOwl6U2z6',
    access_token_secret: 'sHJ1rQiukME7roJDmG333AT39rhn2AksnVxAbg3BGOeks'
});

var params = {
    screen_name: 'johnsmithwords',
    count: 1000
};

var body = '';

var chatbot = require('./bot.js');

app.post('/social', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    console.log('called social');

    var socialid = req.body.socialid;

    console.log(socialid);

    var outcome = {
        "outcome": "success"
    };

    var result = analyze(socialid, function (data) {
        outcome.result = data;
        res.send(JSON.stringify(outcome, null, 3));
    });

})


app.post('/outpost', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    console.log('called outpost');

    chatbot.sendMessage(req.body.text, req.body.context, function (response) {

        if (response.intents[0].intent === 'cuisine') {

            console.log('this is where to call Yelp');

            const client = yelp.client(yelptoken);

            client.search({

                term: response.input.text,
                latitude: latitude,
                longitude: longitude

            }).then(out => {

                response.yelp = out.jsonBody;

                res.send(JSON.stringify(response, null, 3));

            }).catch(e => {
                console.log(e);
            });

        } else {
            res.send(JSON.stringify(response, null, 3));
        }
    });
});


/* For setting the person's location */

app.post('/location', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    latitude = req.body.latitude;
    longitude = req.body.longitude;

    res.send(JSON.stringify({
        outcome: "success"
    }, null, 3));

});

app.get('/recommendations', function (req, res) {

    const client = yelp.client(yelptoken);

    client.search({
        term: 'vegan',
        //        location: 'ottawa',
        latitude: latitude,
        longitude: longitude
    }).then(response => {
        console.log(response.jsonBody);
    }).catch(e => {
        console.log(e);
    });
});


function analyze(id, callback) {

    var person = {
        screen_name: id,
        count: 1000
    };

    twitterclient.get('statuses/user_timeline', person, function (error, tweets, response) {
        if (!error) {
            //        console.log(tweets.length);//
            //        console.log(tweets[0].text);
        }

        var body = '';

        tweets.forEach(function (tweet) {

            var cleaned = tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

            body = body + cleaned;
        })

        var keywords = '';
        var concepts = '';
        var entities = '';

        var cusine = []

        nlu.analyze({
            'text': body, // Buffer or String
            'features': {
                'concepts': {},
                'keywords': {},
                'entities': {}
            }
        }, function (err, response) {
            if (err) {
                console.log('error:', err);
            } else {

                console.log('natural language output');

                var keywords = response["keywords"];
                var concepts = response["concepts"];
                var entities = response["entities"];
                var categories = response["categories"];

                console.log('');
                console.log('keywords');
                console.log('--------');

                keywords.forEach(function (keyword) {
                    //                    console.log(keyword.text);

                    var input = keyword.text;

                    if (input === 'taco' || input === 'tacos') {
                        input = 'mexican';
                    }

                    chatbot.sendMessage(input, null, function (response) {

                        if (response.intents[0].intent === 'cuisine') {

                            if (response.entities.length > 0) {
                                console.log(response.entities[0].value);

                                cusine.push(response.entities[0].value);
                            }
                        }
                    });
                })

                console.log('');
                console.log('concepts');
                console.log('--------');

                var responseCount = 0;

                var mindmap = {
                    nodes: [],
                    edges: []
                };

                var root = {
                    "id": "root",
                    "label": person.screen_name,
                    "x": 0,
                    "y": 0,
                    "size": 8,
                    color: "#CF413C"
                }

                mindmap.nodes.push(root);

                var food = {
                    "id": "food",
                    "label": "food",
                    "x": 3,
                    "y": 0,
                    "size": 8,
                    color: "#84a0a5"
                };

                mindmap.nodes.push(food);


                var connection = {
                    "id": "e0",
                    "source": "root",
                    "target": "food"
                };

                mindmap.edges.push(connection);

                concepts.forEach(function (concept) {
                    //                    console.log(concept.text);

                    var input = concept.text;

                    if (input === 'taco' || input === 'tacos') {
                        input = 'mexican';
                    }

                    var x = 1;
                    var y = 1;


                    chatbot.sendMessage(input, null, function (response) {

                        if (response.intents[0].intent === 'cuisine') {

                            if (response.entities.length > 0) {
                                console.log(response.entities[0].value);
                                cusine.push(response.entities[0].value);
                            }
                        }

                        responseCount++;

                        var unique = cusine.filter(function (item, i, ar) {
                            return ar.indexOf(item) === i;
                        });

                        if (responseCount === concepts.length) {

                            unique.forEach(function (item) {

                                var newnode = {
                                    "id": item,
                                    "label": item,
                                    "x": x++,
                                    "y": y++,
                                    "size": 8,
                                    color: "#84a546"
                                };

                                mindmap.nodes.push(newnode);


                                var edge = {
                                    "id": "edge-" + item,
                                    "source": "food",
                                    "target": item
                                };

                                mindmap.edges.push(edge);
                            })

                            console.log(mindmap);

                            callback(mindmap);
                        }
                    });
                })
            }
        });
    });
}

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});