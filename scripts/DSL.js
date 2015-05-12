
/*jslint browser: true, devel: true, white: true */

/** Defines the DSL object, which is the main application interface 
    @module */

define(['message', 'page-transform', 'jquery', 'slide-factory', 'config.js'], 
       function(getMessageObject, getPageTransformFunction, $, slideFactory, CONFIG) {

  'use strict';
  
  var returnObject = {}; // What eventually gets returned as public methods
                         // CURRENTLY NOT USED - but maybe it should be ...
  
  /** Look for the client role in the following places 
      1. from the page URL (role=<role name>)
      2. from the page URL directory (e.g. /tiger/index.html --> 'tiger')
      3. Defaults to 'wall' if unspecified 
      
      NOTE: This doesn't work as a method, because what about /diesel/sites/demo/index.html ?
            'demo' is NOT the role in this case ...
            
            
      ALL THIS NEEDS TO GET RE-THOUGHT ....
      
      */
      
  // Parse URL Queries
  // adapted from http://www.kevinleary.net/jquery-parse-url/
  
  function getUrlQuery(query) {
  
    var queryEscapedBrackets = query.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]'),
        expr = '[\\?&]' + queryEscapedBrackets + '=([^&#]*)',
        regex = new RegExp(expr),
        results;
    
    results = regex.exec(window.location.href);
    
    return (results !== null) ? results[1] : false;
  }

  
  function getClientRole () { // CHANGE AND TEST THIS
    
    /* VERSION 2
    var role,
        pathHeirarchy,
        match1 = /role=([^&#]*)/.exec(window.location.search);
    
    if (match1 !== null) { 
      role = match1[1]; 
    } else {      
      // TEMP - just grab filename
      pathHeirarchy = window.location.pathname.split('/')
                            .filter(function (x) { return x !== ''; });
      role = (/^(\w+)(?:\.\w{3,4})?$/.exec(pathHeirarchy.pop()))[1];
      
    } 
    */
    
    /******** VERSION 1
    
    else if (false) { // FIX THIS - else if ... what?
      
      var pathHeirarchy = window.location.pathname.split('/'),
          pathEnd;
      
      pathHeirarchy.filter(function (x) { return (x !== ''); });
      pathEnd = pathHeirarchy.pop();
      
      if (pathEnd.indexOf('index') === 0) {
        role = pathHeirarchy.pop(); 
      } else {
        role = (/^(\w+)(?:\.\w{3,4})?$/.exec(pathEnd))[1];
      }
    } else {
      
      role = 'wall'; // magic value - - hmm
    }
    *********/
    
    var role = getUrlQuery('role') || 'wall';
    console.log('* Role identified as ' + role);
    return role;
  }
  
  // You should be able to run several instances of the same site;
  //  e.g. for testing, for running on different displays, etc.
  
  function getSiteInstance () {    
    var role = getUrlQuery('instance') || 'default_instance';
    console.log('* Instance identified as ' + role);
    return role;
  }
  
  /** Add role name as classname on body
      If role is 'wall' but the screen is small, then add 'test' class to body */
  
  function updateContainerClass (clientRole) {
    document.body.className += ' ' + clientRole;
    if (clientRole === 'wall' && window.innerWidth < 5000) {
      document.body.className += ' test';
    }
  }
  
  /** Initialize message handlers 
      (called once DOM is loaded, timesheetsjs is loaded, and transformations are done) */

  function initMessageHandlers (clientRole, messageObject, CONFIG) {

    var roleMessageHandlers, messageName, slideShowContainer, 
        containerIdToIndex = {};
    
    console.log('* Initializing message handlers'); // TEMP
    
    /* GLOBAL (DieSeL) HANDLERS */ 
    
    /* 'goto' : jump to slide id - NOTE: goto should be overrideable by non-timesheet pages */
    
    slideShowContainer = document.getElementById(CONFIG.slideshowContainerId);
    
    if (slideShowContainer !== null) {

      /* Build hash of goto targets and their indeces 
         (timesheetsjs only seems to jump to index numbers) */

      $('#slideshow > *[data-timecontainer][id]').each(function (index, timeContainer) {
        containerIdToIndex[timeContainer.id] = index;
      });

      messageObject.onReceive('goto', function (data) {
        if (containerIdToIndex[data] !== undefined) {
          console.log('* Moving to slide: ' + data);
          console.log('  slideShowContainer.timing.selectIndex(' + containerIdToIndex[data] + ');');
          slideShowContainer.timing.selectIndex(containerIdToIndex[data]); 
        }
      });
      
      // TEMP FOR DEBUGGING (although maybe this should be a method off of DSL object?)
      
      window.dslGoToSlide = function (slideId) {
        if (containerIdToIndex[slideId] !== undefined) {
          slideShowContainer.timing.selectIndex(containerIdToIndex[slideId]); 
        }
      };
      
      // ALSO TEMP
      
      window.dslSlideShowContainer = slideShowContainer;
    }

    /* APP HANDLERS (defined in config.js) */

    roleMessageHandlers = CONFIG.messageHandlers[clientRole];

    for (messageName in roleMessageHandlers) {
      messageObject.onReceive(messageName, roleMessageHandlers[messageName]);
    }
  }
  
  // Create a drop down menu for navigating (mostly for debugging)
  // At the non-container level, this filters for items with either id or a title attribute
  // Otherwise, teh list gets very long ...
  
  function addOnScreenNavigator() {
    
    var navDropdown = $('<select></select>'),
        navContainer = $('<div id="dsl-navigator">Go to slide:<hr /> </div>'),
        slideShowContainer = document.getElementById(CONFIG.slideshowContainerId).timing;
    
    function getOnScreenNavigatorList(timeContainer) {
      
      var heading;
      
      console.log(timeContainer.getNode());
      
      if (timeContainer.getNode().title !== undefined &&
          timeContainer.getNode().title !== '') {
        heading = timeContainer.getNode().title;
      } else if (timeContainer.getNode().id !== undefined &&
                 timeContainer.getNode().id !== '') {
        heading = timeContainer.getNode().id;
      } else { heading = null; }
      
      if (heading !== null) {

        var containingListItem = $('<li>' + heading + '</li>');

        containingListItem.click(function () {
          timeContainer.parentNode.selectItem(timeContainer);
        });

        if (timeContainer.timeNodes !== undefined && 
            timeContainer.timeNodes.length > 0) {
          var subList = $('<ul></ul>');
          timeContainer.timeNodes.forEach(function(childTimeNode) {
            subList.append(getOnScreenNavigatorList(childTimeNode));
          });
          
          // If this is the 'root' TimeContainer, then just show the sublist
          // Otherwise, append to listing
          
          if (timeContainer.parentNode !== undefined) {
            containingListItem.append(subList);
          } else {
            containingListItem = subList;
          }
        }

        return containingListItem;
      }
    }
    
    navContainer.append(getOnScreenNavigatorList(slideShowContainer));
    $('body').append(navContainer);
  }
  
  
  /** Set up the following once DOM is loaded:
  
      - run pre-transform scripts (defined in config.js) -- TODO
      - run transformation of DOM
      - run post-transform scripts (defined in config.js) -- TODO
      - run timesheets routine against DOM
      - initialize message handlers 
      
  */
  
  function setupOnloadEvents (getPageTransformFunction, clientRole, messageObject, CONFIG) {
    
    if (document.getElementById(CONFIG.slideshowContainerId) !== null) {
      
      var transformPage = getPageTransformFunction(clientRole);
      
      $(document).ready(function () {

        // Generate and/or transform DOM (model)

        require(['DSL'], function (dsl) {

          // Pre-transform is the place to dynamically generate a presentation
          
          if (CONFIG.preTransform !== undefined) {
            
            /* If there is a second argument to the preTransform function,
               then this is a callback for the main transformation
               (first argument by default is the DSL object) */
            
            if (CONFIG.preTransform.length > 1) {
              CONFIG.preTransform(dsl, transformPage);
            } else {
              CONFIG.preTransform(dsl);
              transformPage();
            }
          } else {
            transformPage();
          }

          // Post-transform hook
          
          if (CONFIG.postTransform !== undefined) {
            CONFIG.postTransform(dsl);
          }
        });

        // Run timesheets
/*
        require(['timesheets-main'], function () { 
          initMessageHandlers(clientRole, messageObject, CONFIG);
        });*/
        
        window.setTimeout(function () {
          console.log('RRRRRRRRRRRRRRR');
          console.log(document.getElementById('slideshow').innerHTML);
          require(['timesheets-main'], function () { 
            initMessageHandlers(clientRole, messageObject, CONFIG);
          });
        }, 1000);
      });
    }
  }

  /* Load additional jQuery plugins - doesn't really need to be a function ... */
  
  function loadjQueryPlugins (pluginsArray) {
    require(pluginsArray, function () {
      console.log('* Loaded jQ plugins fittext and qrcode'); // TEMP
    });
  }
  
  console.log('* Loaded DSL module');  // TEMP
  
  /* Main routine */
  
  function init(getMessageObject, getPageTransformFunction, CONFIG) {
    
    var clientRole = getClientRole(),
        siteInstance = getSiteInstance(),
        messageObject = getMessageObject(clientRole, siteInstance, CONFIG);
    
    updateContainerClass(clientRole);
    loadjQueryPlugins(['jquery.fittext', 'jquery.qrcode.min']);
    setupOnloadEvents(getPageTransformFunction, clientRole, messageObject, CONFIG);
    
    // DSL object's public members
    
    return {
      clientRole: clientRole,
      siteInstance: siteInstance,
      message: messageObject,
      getSlide: slideFactory,
      config: CONFIG,
      addNav: addOnScreenNavigator
    };
  }

  return init(getMessageObject, getPageTransformFunction, CONFIG);
});