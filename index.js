var Tail = require('tail').Tail
  , config = require('./config')
  , email = require('./email.js')
  , logger = require('nlogger').logger(module);
  , fileToTail = config.get("logFile");
  , blackList = config.get("blackList");
  , whiteList = config.get("whiteList");

tail = new Tail(fileToTail);
logger.info("tail initialized");

tail.on("line", function(data) {
  var blackListRegex = new RegExp(blackList.join('|'));
  var whiteListRegex = new RegExp(whiteList.join('|'));
  var errFound = data.match(blackListRegex);
  var allowed = data.match(whiteListRegex);
  if(errFound && !allowed){
      email.sendEmail(data, function(err, body){
        if(err){
          logger.error("Error sending email!")
        }
      });
    logger.info("Found error messages: ", data);
  }
});

tail.on("error", function(err) {
  logger.error(err.message);
});
