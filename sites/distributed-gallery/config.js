
/*jslint browser: true, devel: true, white: true */

/** CONFIG FILE FOR APP - e.g. herbarium @module

    TODO: This should be moved to a local (app) directory, not in the main DSL scripts directory
          Should this just be a JSON file? (maybe not - needs jQuery)

    Contains:

    - App ID
    - Message handlers (what happens if message X is received by Y?)
    - Membership
    - ID of slideshow container

    */

define(['jquery', 'distributed-gallery.js'], function ($, DG) {

  window.DG = DG;

  'use strict';

  return {
    id: 'dg-3',
    slideshowContainerId: 'slideshow',
    /* Message handlers - what happens if message <messageID> is received by <recipientRole> ?
     *    messageHandlers.recipientRole.messageID = <callback> 
     */

    'messageHandlers': {

      'wall': {
        'show_details': function (data) {
          console.log('Wall received signal to show details for: ' + data);
        },
        'change_choice': function (data) {
          document.getElementById('distributed-control')
                  .getElementsByClassName('distributed-control-background')[0]
                  .style.backgroundColor = data;
        }
      },

      // Controller - i.e. the touch panel at the wall
      'controller' : {
        'show_details': function (data) { 
          console.log('Controller received signal to show details for ' + data);
        }
      },

      // Viewer's personal device
      'mobile': {
        'show_details': function (data) { 
          console.log('Mobile received signal to show details for ' + data);
        } 
      }
    },

    // Define membership for messaging
    'membership': {
      'wall' : ['this', 'is', 'a', 'test'],
      'cart-1' : ['carts', 'secondary'],
      'cart-2' : ['carts', 'secondary'],
    },

    'preTransform': function (dsl, doTransform) {

      // This fires just before the standard DSL transformation

      if (dsl.clientRole === 'wall') {
        dsl.message.onReceive('current_presentation', function () {

          var ss = document.getElementById('slideshow').timing,
          currIndex = ss.currentIndex;

          dsl.message.send('goto', 'mobile', ss.timeNodes[currIndex].getNode().id);
        });
      }

      var ss = $('#' + dsl.config.slideshowContainerId), i;

      DG.getProgramHTML(3, function (html) {
        ss.append(html);

        // Delay the transform so that the DOM updates
        //  prior to TimesheetsJS doing its thing
        // (there's got to be a better way)
        window.setTimeout(doTransform, 8000);
      });

    },

    'postTransform': function (dsl) {
      // This fires just after the standard DSL transformation
      
      // START HACK FOR DISTRIBUTED GALLERY: get current presentation for mobile
      window.setTimeout(function() {
        if (dsl.clientRole === 'mobile') {
          dsl.message.send('current_presentation', 'wall', 0);
        };
      }, 1500);
      // END HACK FOR DISTRIBUTED GALLERY
    }
  };
});
