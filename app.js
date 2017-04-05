/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------
var x = 1;
var y = 1;

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

var config = require('./config/credentials.json');

var understandingcreds = config.nlu.credentials;

var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var nlu = new NaturalLanguageUnderstandingV1({
    username: understandingcreds.username,
    password: understandingcreds.password,
    version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2016_01_23
});

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

var yelpCredentials = config.yelp;

const token = yelp.accessToken(yelpCredentials.clientId, yelpCredentials.secret).then(response => {

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


var eventbriteAPI = require('node-eventbrite');

var eventbriteCredentials = config.eventbrite;

var ebtoken = 'BA42Z5JFDVCJQZFL3BGT';

var location = {}
location.latitude = '45.3407962';
location.longitude = '-75.6906025';

var paramaters = {
    q: 'ux',
    location: location
}

try {
    var api = eventbriteAPI({
        token: eventbriteCredentials.token,
        version: 'v3'
    });
} catch (error) {
    console.log(error.message); // the options are missing, this function throws an error.
}

api.search(paramaters, function (error, data) {
    if (error)
        console.log(error.message);
    else

        data.events.forEach(function (event) {
        console.log(event.name.text);
    })


    //    console.log(JSON.stringify(data)); // Do something with your data!
});




/* - - - - - - - - - - */

var config = require('./config/credentials.json');

var Twitter = require('twitter');

var twitterCredentials = config.twitter;

var twitterclient = new Twitter(twitterCredentials);

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

        switch (response.intents[0].intent) {

        case 'cuisine':
            console.log('case statement - cuisine');
            break;
                                          

        case 'interest':
            console.log('case statement - interest');

            var location = {}
            location.latitude = latitude;
            location.longitude = longitude;

            var paramaters = {
                q: response.intents[0].intent,
                location: location
            }

            api.search(paramaters, function (error, data) {
                if (error)
                    console.log(error.message);
                else
                    console.log(data.events[0]);
            });

            break;

        default:
            console.log('case statement - default - ' + response.intents[0].intent);
            break;
        }


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

        } else if (response.intents[0].intent === 'interest') {
            console.log('this is where to call eventbrite');

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

function createNode(id, label, x, y, size, color) {

    var node = {
        "id": id,
        "label": label,
        "x": x,
        "y": y,
        "size": size,
        color: color
    }

    console.log(node);

    return node;
}


function addChartContent(map, xcoord, ycoord, entities, rawinput, reportedinput, list) {
    if (entities.length > 0) {
        console.log(entities[0].value);

        list.push(entities[0].value);

        x = x + 10;
        y = y + 10;

        var input = createNode(reportedinput, reportedinput, x, y, 8, "#555");

        map.nodes.push(input);

        var edge = {
            "id": "edge-" + reportedinput,
            "source": entities[0].value,
            "target": reportedinput
        };

        map.edges.push(edge);
    }
}


function analyze(id, callback) {

    var person = {
        screen_name: id,
        count: 1000
    };

    twitterclient.get('statuses/user_timeline', person, function (error, tweets, response) {
        var body = '';
        
        var mindmap = {
            nodes: [],
            edges: []
        };
        
        console.log(tweets);
        
        if(tweets.errors ){ 
            var root = createNode("root", 'NOT A WORKING TWITTER ID - TRY AGAIN', 0, 0, 8, "#CF413C");
            mindmap.nodes.push(root);
            callback(mindmap);  
            return;
        }
        
        tweets.forEach(function (tweet) {

            var cleaned = tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

            body = body + cleaned;
        })

        var keywords = '';
        var concepts = '';
        var entities = '';

        var cuisine = [];
        var interest = [];

        var edges = [];

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

                    var input = keyword.text;

                    if (input === 'taco' || input === 'tacos') {
                        input = 'mexican';
                    }

                    chatbot.sendMessage(input, null, function (response) {

                        if (response.intents[0].intent === 'cuisine') {
                            addChartContent(mindmap, x, y, response.entities, input, response.input.text, cuisine);
                        }

                        if (response.intents[0].intent === 'interest') {
                            addChartContent(mindmap, x, y, response.entities, input, response.input.text, interest);
                        }
                    });
                })

                console.log('');
                console.log('concepts');
                console.log('--------');

                var responseCount = 0;

              

                var root = createNode("root", person.screen_name, 0, 0, 8, "#CF413C");

                mindmap.nodes.push(root);

                var food = createNode("food", "food", 3, 0, 8, "#84a0a5");

                mindmap.nodes.push(food);

                var interests = createNode("interest", "interest", -3, 0, 8, "#84a0a5");

                mindmap.nodes.push(interests);

                var connection = {
                    "id": "e0",
                    "source": "root",
                    "target": "food"
                };

                mindmap.edges.push(connection);

                var interstconnection = {
                    "id": "i0",
                    "source": "root",
                    "target": "interest"
                };

                mindmap.edges.push(interstconnection);

                concepts.forEach(function (concept) {

                    var input = concept.text;

                    if (input === 'taco' || input === 'tacos') {
                        input = 'mexican';
                    }

                    chatbot.sendMessage(input, null, function (response) {

                        if (response.intents[0].intent === 'cuisine') {
                            addChartContent(mindmap, x++, y++, response.entities, input, response.input.text, cuisine);
                        }

                        if (response.intents[0].intent === 'interest') {
                            addChartContent(mindmap, x++, y++, response.entities, input, response.input.text, interest);
                        }

                        responseCount++;

                        var uniquecuisine = cuisine.filter(function (item, i, ar) {
                            return ar.indexOf(item) === i;
                        });

                        var uniqueinterest = interest.filter(function (item, i, ar) {
                            return ar.indexOf(item) === i;
                        });

                        if (responseCount === concepts.length) {

                            /* This block sorts out the high level entities of food or interests */

                            uniquecuisine.forEach(function (item) {

                                x = x + 10;
                                y = y + 10;

                                var newnode = createNode(item, item, x, y, 8, "#84a546");

                                mindmap.nodes.push(newnode);

                                var edge = {
                                    "id": "edge-" + item,
                                    "source": "food",
                                    "target": item
                                };

                                mindmap.edges.push(edge);
                            })

                            uniqueinterest.forEach(function (item) {

                                x = x + 10;
                                y = y + 10;

                                var newnode = createNode(item, item, x, y, 8, "#84a546");

                                mindmap.nodes.push(newnode);

                                var edge = {
                                    "id": "edge-" + item,
                                    "source": "interest",
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