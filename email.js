var config = require("./config");
var apiKey = config.get("mailgun:api_key");
var domain = config.get("mailgun:domain");
var mailgunFrom = config.get("mailgun:from");
var mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});
var logger = require('nlogger').logger(module);
var adminEmail = config.get("adminEmail");

var email = exports;
email.sendEmail = function(data, done) {
    var body = data;
    var message = {
      from: mailgunFrom,
      to: adminEmail,
      subject: 'Server error',
      text: body
    };
    mailgun.messages().send(message, function (err, body) {
      if(err) {
        logger.info(err);
        return done(err);
      }
      logger.info(body);
      return done(null, body);
    });
}
