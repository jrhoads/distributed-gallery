
/*jslint browser: true, devel: true, white: true */
/** Function that creates an object that handles websocket communications @module
    Opens a connection and returns functions to send/receieve messages.
    TODO: subscribe to multiple channels based on role membership heirarchy */

define(['https://js.pusher.com/2.0/pusher.min.js', 'jquery'], function (p, $) {

  'use strict';

  var SEND_URL = require.toUrl('send-message');

  /** Given role name, get message membership - 
      TEMP - see membership.js for a more complicated approach.

      TODO: Should this be elsewhere? The role mechanism is kind of specific to 
      DieSeL, and this limits modularity. */

  function getRoleMembership(clientRole, CONFIG) {

    var roleMembership,
        configSetting = CONFIG.membership[clientRole];

    if (configSetting === undefined || configSetting.length === 0) {
      roleMembership = [clientRole, 'all'];
    } else {
      roleMembership = configSetting.concat([clientRole, 'all']);
    }

    return roleMembership;
  }

  /** function that is returned from module */
  /* TODO: CONFIG is not a good parameter to pass because it limits
      the reusability of this module. It would be nice to just be able to
      drop this in to any app to get communication happening.

      Better than CONFIG would be to generalize the production of the channel
      names according to a provided parameter.

      */

  return function (clientRole, CONFIG) {

    var pusher, channels, onReceive, send,
        pusherId = 'ccd0e24bbd911bcef19d',
        channelName = CONFIG.id, // only dealing with app, not individual clients (yet)
        getFullRecipientId = function (role) { return role + '-' + CONFIG.id; };

    // Enable pusher logging - don't include this in production

    Pusher.log = function (message) {
      if (console && console.log) {
        console.log(message);
      }
    };

    // Set up pusher object and channels
    // TODO: fill in all the memberships using getRoleMembership() function above
    //  for now, this role and 'all' should suffice ...

    pusher  = new Pusher(pusherId);
    channels = getRoleMembership(clientRole, CONFIG).map(function (recipient) {
      console.log('* Registering to channel ' + getFullRecipientId(recipient));
      return pusher.subscribe(getFullRecipientId(recipient));
    });

    /** Set a function to be called when a message has been received */

    // TODO: register for all the membership channels ...
    // use getRoleMembership function above

    onReceive = function (messageName, fn) {
      channels.forEach(function (channel) {
        channel.bind(messageName, fn);
      });
    };

    /** Send a message */
    // TEST WITH DSL.message.send('show_details', 'wall','33');
    // cURL: http://localhost/DieSeL/send-message/?recipient=wall-herbarium&name=show_detail&data=789

    send = function (messageName, recipientRole, messageContent) {

      var url = SEND_URL + '?recipient=' + getFullRecipientId(recipientRole) + 
                '&name=' + messageName + 
                '&data=' + messageContent;

      console.log('* Send message: ' + messageName + 
                  ' to ' + getFullRecipientId(recipientRole) +
                  ' with payload: ' + messageContent);
      console.log('URL: ' + url);

      return $.get(url);
    };

    console.log('* message.js loaded - clientRole = ' + clientRole); // TEMP

    return {
      onReceive: onReceive,
      send: send,
      clientRole: clientRole
    };
  };
});

