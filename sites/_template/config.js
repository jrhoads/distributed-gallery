/*jslint browser: true, devel: true, white: true */

/** CONFIG FILE FOR A SINGLE SITE

    Contains:
    
    - App ID
    - Message handlers (what happens if message X is received by Y?)
    - Membership
    - ID of slideshow container
    
    */

define(['jquery'], function ($) {

  'use strict';

  return {

    id: 'whatever_you_like',
    slideshowContainerId: 'slideshow',

    /* Message handlers - what happens if message <messageID> is received by <recipientRole> ?
     *    messageHandlers.recipientRole.messageID = <callback>
     */

    'messageHandlers': {

      'wall': {
        'do_something': function (data) {
          // Something is done here
        }
      },

      // Controller - i.e. the touch panel at the wall

      'another_monitor': {
        'do_something': function (data) {
          // Something is done here
        }
      }
    },

    // Define membership for messaging

    'membership': {
      'wall': [],
      'another_monitor': ['not_wall'],
      'yet_another_monitor': ['not_wall']
    },

    'preTransform': function (dsl) {
      // This fires just before the standard DSL transformation
    },

    'postTransform': function (dsl) {
      // This fires just after the standard DSL transformation
    }
  };
});