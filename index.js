Tail = require('tail').Tail;
var config = require('./config');
var email = require('./email.js');
var logger = require('nlogger').logger(module);

var fileToTail = config.get("logFile");
var blackList = ["ERROR", "WARN"];
var whiteList = ["INFO", "Config"];

tail = new Tail(fileToTail);
logger.info("tail initialized");

tail.on("line", function(data) {
  var blackListRegex = new RegExp(blackList.join('|'));
  var whiteListRegex = new RegExp(whiteList.join('|'));
  var errFound = data.match(blackListRegex);
  var allowed = data.match(whiteListRegex);
  if(!allowed){
    if (errFound){
      email.sendEmail(data, function(err, body){
        if(err){
          logger.error("Error sending email!")
        }
      });
    }
    logger.info("Found error messages: ", data);
  }
});

tail.on("error", function(err) {
  logger.error(err.message);
});
