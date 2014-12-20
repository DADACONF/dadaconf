/*
 * uifaces.js
 *
 * GET A BUNCH OF RANDOM UI FACES AND LET RANDOM PEOPLE
 * TAKE THE CREDIT FOR YOUR WORK
 *
 */

var lodash = require("lodash");
var http = require("http");
var https = require("https");
var fs = require("fs");

var UI_FACES_ENDPOINT = "http://uifaces.com/api/v1/random";
var FACES_TO_DOWNLOAD = 50;

// define http wrapper
var httpGet = function(endpoint, callback){
  http.get(endpoint, function(response){
    var body = "";
    response.on("data", function(d){
      body += d;
    });
    response.on("end", function(){
      var res = JSON.parse(body);
      return callback(res);
    });
  });
};

// download 50 of these bad boy programmers
for (var i = 0; i < FACES_TO_DOWNLOAD; i++) {
  httpGet(UI_FACES_ENDPOINT, function(res){
    var epicUrl = res.image_urls.epic;
    var context = this;

    https.get(epicUrl, function(response){
      response.pipe(fs.createWriteStream("../assets/images/faces/ui_face" + context + ".jpg"));
    });
  }.bind(i));
}

