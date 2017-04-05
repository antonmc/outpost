# Outpost 

An experiment with Watson Conversation, Watson Natural Language and Yelp

Primarily, this is a Watson Conversation chatbot that you can ask questions about food and restauarants to. 

For instance: 'find me pizza', or 'I feel like steak'

Secondarily it is an app that uses a conversation model to understand mentions of food, and classifications of food from a twitter stream.

## Video overview

Click the image to see a video overview of the app

[![Video Overview of Outpost](https://i.vimeocdn.com/video/626944689.webp?mw=700&mh=560)](https://vimeo.com/211004490)

## Blogpost

You can [read more about the motivation for the app](https://www.ibm.com/blogs/bluemix/2017/04/conversation-models-business-assets-part-1/) in a couple of posts that I wrote for the IBM Blog 

## Run the app locally

1. [Install Node.js]: https://nodejs.org/en/download/
2. Clone this repo locally
3. cd into the outpost directory
4. Run `npm install` to install the app's dependencies
5. Create a service instance of [Watson Conversation](https://www.ibm.com/watson/developercloud/conversation.html)
6. Create a service instance of [Watson Natural Language Understanding](https://www.ibm.com/watson/developercloud/natural-language-understanding.html)
7. Create an API key for [Twitter](https://dev.twitter.com/overview/api)
8. Create an API key for [Yelp](https://www.yelp.ca/developers)
9. Create an API key for [Eventbrite](https://www.eventbrite.ca/developer/v3/)
10. Rename the credentials-template.json file to be credentials.json and update with the values from each of the services above
11. Upload the conversation/outpost.json file to the watson conversation workspace
12. Run `node app` to start the app
13. Access the running app in a browser at http://localhost:6001




