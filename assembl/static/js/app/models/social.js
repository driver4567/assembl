'use strict';

var $ = require('../shims/jquery.js'),
    Base = require('./base.js'),
    Ctx = require('../common/context.js'),
    i18n = require('../utils/i18n.js'),
    Agents = require('./agents.js');

var FacebookAccessToken = Base.Model.extend({
    urlRoot: Ctx.getApiV2Url('/FacebookAccessTokens'),

    defaults: {
        user_id: null,
        token: null,
        expiration: null,
        token_type: null,
        object_name: null,
        '@view': null,
        '@type': null
    }    
});

var FacebookAccessTokens = Base.Collection.extend({
    //Things to add: Promise function to get the agent model
    //represented by this model.
    model: FacebookAccessToken
});

module.exports = {
  Facebook: {
    Token: {
        Model: FacebookAccessToken,
        Collection: FacebookAccessTokens
    } 
  }
}


