'use strict';
const mongoose = require('mongoose');
const config = require('../app/config');
require('colors');


/**
 * Check initial configurations like db connection, log folder existance, etc...
 * @returns {Promise}
 */
var initialize = function () {
  return connectIdeaBoxDB()
};

var connectIdeaBoxDB = function () {
  return new Promise((resolve, reject) => {
      mongoose.connect(config.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
      });
      var IdeaBoxDB = mongoose.connection;

      IdeaBoxDB.once('connected', function connectionSuccess() {
          console.log('Internal Database Connection Establishement. '.bold.cyan + '[ ' + 'OK'.bold.green + ' ]');
          resolve();
      });

      IdeaBoxDB.once('reconnected', function connectionSuccess() {
          console.log('Internal Database Reconnection Establishement. '.bold.cyan + '[ ' + 'OK'.bold.green + ' ]');
          resolve();
      });

      IdeaBoxDB.on('disconnected', () => {
          console.log('Internal Database Disconnected'.bold.red);
      });

      IdeaBoxDB.on('error', function connectionError(err) {
          console.log('Internal Database Connection Establishement. '.bold.cyan + '[ ' + 'X'.bold.red + ' ]\n');
          console.log('Error connecting Internal Database.\nDetails: ' + err.toString().bold.red);
          process.exit(0);
      });
  });
};

process.on('SIGINT', () => {
  mongoose.connection.close()
      .then(() => {
          process.exit(0);
      });
});

module.exports.initialize = initialize;
