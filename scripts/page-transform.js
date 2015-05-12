
/*jslint browser: true, devel: true, white: true */

/** Return a function to perform the transformation on the DOM prior to playing the show.
    This has the potential for having a clean input data structure that then gets translated for implementation.
    
    Return a function that will create a function to transform the page. 
    
    Why so convoluted? So that the CONFIG.preTransform function can do a callback without 
    the clientRole argument - e.g. doTransform(); - the clientRole is hard-baked into the function already
    
    So:
    
    - The module returns a function
    - You call that function with the clientRole
    - ... which returns a function that can be invoked without arguments - e.g. doTransform()
    
    @module */

define(['jquery'], function($) {

  'use strict';
  
  console.log('* page-transform loaded'); // TEMP
  
  return function (clientRole) {

    return function () {

      /* Filter slides according to role

         If role is defined, search for all elements that have a data-role attribute 
          that is NOT the same and erase them
         If there is a slide with content that has both default materials as well as specified role, 
          then erase the default-role content
         If not defined (clientRole = null), then we're in a default role: 
          do a search for all elements that have data-role attributes and erase them

         If there is content with the selected role, 
          and there is a sibling with no role, then erase that sibling
      
ORIGINAL: 

      var s = (clientRole === null) 
              ? '*[data-role][data-role != "wall"]' 
              : '#slideshow *[data-role][data-role != "' + clientRole + '"], ';
                + '#slideshow *:has(*[data-role][data-role = "' + clientRole + '"]) > *:not([data-role])';
*/
      var s;
      
      if (clientRole === null) {
        s = '*[data-role][data-role != "wall"]';
      } else {
        s = '#slideshow *[data-role][data-role != "' + clientRole + '"]';
      };
      
      console.log('Role detected: ' + clientRole);
      console.log('Removing ' + s);

      $(s).remove();

      /* Add role as classname on body 
          (if role is wall and it's a small screen, make it 'test')
         NOTE: this requires that browser zoom be set to 100% -- 
           if not, it will change window.innerWidth to something other than 7680px */

      document.body.className += ' ' + ((clientRole === 'wall' && window.innerWidth < 5000) ? 'test' : clientRole);

      // Apply fittext jQuery plugin to textpanel widgets

      require(['jquery.fittext'], function (x) {
        setTimeout(function() { // This can be fixed by turning off transitions during setup
          $('.textpanel').fitText();
          $('.fullscreen-textpanel').fitText();
        }, 2000);
      });
      
      // If an element is marked 'fullheight', make it the full height of display
      // (good for iframes) -- also onresize to handle changes

      $('.fullheight').css('height', $(window).height());
      
      $( window ).resize(function() {
        $('.fullheight').css('height', $(window).height());
      });
      
      // Set fullscreen textpanel heights

      setTimeout(function() { // This can be fixed by turning off transitions during setup

        var windowHeight = $(window).height(); // TODO: encorporate this below

        $('.textpanel > *').css('margin-top', function (i, v) { return -$(this).height() / 2; });

        /* For fullscreen textpanel display, make the container the full height of the viewport,
           then vertically center the inner span */

        $('.fullscreen-textpanel').css('height', windowHeight);
        $('.fullscreen-textpanel > *').css('margin-top', function (i, v) { 
          return -$(this).height() / 2;
        });

        $('.fullscreen-textpanel-2').css('height', windowHeight);
        $('.fullscreen-textpanel-2 > *').css('margin-top', function (i, v) { 
          return -$(this).height() / 2; 
        });
      }, 4000);

      console.log('* Page transformation complete'); // TEMP
    }
  };
});