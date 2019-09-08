# Simple Node with Express Server with REST API

An easy way to get started with a Express server offering a REST API with Node.js.

## Features
* Mongoose
* Express
* REST API
* Windston logger
* Body-parser for Json

## Requirements
* [node & npm](https://nodejs.org/en/)
* [git](https://www.robinwieruch.de/git-essential-commands/)

## Installation
* `install npm package manager`
* `git clone git@github.com:rwieruch/node-express-server-rest-api.git`
* `cd api-server`
* `npm install`
* `start mongodb service (mongod)`
* `npm start`
* optional: include *.env* in your *.gitignore*

### POST Routes
* visit http://localhost:3000/postMessage

#### CURL

* Create a message with:
  * `curl -X POST -H "Content-Type:application/json" http://localhost:3000/messages -d '{"text":"Hi again, World"}'`

#### Postman

* Install [Postman](https://www.getpostman.com/apps) to interact with REST API
* Create a message with:
  * URL: http://localhost:3000/postMessage
  * Method: POST
  * Body: raw + JSON (application/json)
  * Body Content: `{ "text": "Hi again, World" }`
