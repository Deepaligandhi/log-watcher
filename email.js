var config = require("./config")
    , apiKey = config.get("mailgun:api_key")
    , domain = config.get("mailgun:domain")
    , mailgunFrom = config.get("mailgun:from")
    , mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain})
    , logger = require('nlogger').logger(module)
    , adminEmail = config.get("adminEmail");

var email = exports;
email.sendEmail = function(data, done) {
    var message = {
      from: mailgunFrom,
      to: adminEmail,
      subject: 'Server error',
      text: data
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
