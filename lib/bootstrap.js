'use strict';

var path = require('path');

var _ = require('lodash');
var Promise = require('bluebird');

var fecom = require('./fecom');
var getProfile = require('./profile/getProfile');
var getConfig = require('./component/getConfig');
var Fecom = fecom.constructor;

module.exports = function (env, userProfile, userConfig) {
  var profilePromise = (userProfile ? fecom.async(userProfile) : getProfile());
  Fecom.defaults.config = _.assign({}, Fecom.defaults.config, userConfig);

  fecom.root = env.cwd;

  Promise
    .try(function () {
      return Promise
        .props({
          userProfile: profilePromise,
          userConfig: getConfig()
        });
    })
    .then(function (results) {
      var profile = results.userProfile;
      var config = results.userConfig;
      fecom.initialize({
        cwd: env.cwd
      }, config, profile);
    })
    .catch(fecom.errorHandler);

};