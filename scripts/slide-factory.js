/*jslint browser: true, devel: true, white: true */

define(['jquery'], function ($) {

  'use strict';
  
  var CLASSNAME = {
        fullscreenTextpanel: 'fullscreen-textpanel'
      },
      getSlide,
      getSlideContainer,
      getTextPanel,
      getFullscreenTextpanel;

  /** options: {  role: <string>, 
                  onbegin: <function>, 
                  onend: <function>, 
                  text: <string>,
                  
                  column: <int>,
                  row: <int>,
                  numberOfRows: <int>,
                  numberOfColumns: <int>,
                  style: <string>
                } 
                
                */
  
        /*
      <div id="geometry" data-timecontainer="par" style="background-color:black">
        <div data-timecontainer="par" class="c1 r1 w4 h3" data-role="wall">
          <div class="c1 r1 w1 h2" style="background-color: #f00">&nbsp;</div>
          <div class="c1 r1 w4 h3 textpanel"><span>Wall Geometry</span></div>
        </div>  */
  
  getSlideContainer = function (containerElementName, className, opt) {
    
    var node = $('<' + containerElementName + ' />');

    node.attr('data-role', opt.role || null)
      .attr('data-timecontainer', opt.parOrSeq || 'par')
      .addClass(className)
      .attr('data-onbegin', opt.onbegin || null)
      .attr('data-onend', opt.onend || null)
      .attr('style', opt.style || null);
    
    if (opt.role === 'wall' || opt.role === undefined) {
      if (opt.column !== undefined) { 
        node.addClass('c' + parseInt(opt.column, 10)); 
      }
      if (opt.row !== undefined) { 
        node.addClass('r' + parseInt(opt.row, 10)); 
      }
      if (opt.numberOfRows !== undefined) { 
        node.addClass('h' + parseInt(opt.numberOfRows, 10)); 
      }
      if (opt.numberOfColumns !== undefined) { 
        node.addClass('w' + parseInt(opt.numberOfColumns, 10)); 
      }
    }
    
    return node;
  };
  
  getTextPanel = function (opt) {

    var node = getSlideContainer('div', CLASSNAME.fullscreenTextpanel, opt);    
    $('<span />').text(opt.text || '').appendTo(node);

    return node;
  };
  
  getFullscreenTextpanel = function (opt) {};
          
  getSlide = function (slideType, options) {
    var html;
    switch (slideType) {
      case 'textpanel' :
        html = getTextPanel(options); break;
      case 'fullscreen-textpanel' :
        html = getFullscreenTextpanel(options); break;
    }
    
    return html;
  };
  
  return getSlide;
});

/*

$("<li/>", { 
  click: function(){}, 
  id: "test", // mix ids and jQuery methods 
  addClass: "clickable" 
});

$("<li><a></a></li>") // li 
  .find("a") // a 
    .attr("href", "http://ejohn.org/") // a 
    .html("John Resig") // a 
  .end() // li 
  .appendTo("ul");

*/