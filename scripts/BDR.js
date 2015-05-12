/*jslint browser: true, devel: true, white: true */
/** An object to encapsulate BDR functionality
    @module
 */

define(['jquery'], function ($) {

  'use strict';
  
  var ROOT = 'https://repository.library.brown.edu/',
      URL = { 
        root:  ROOT, 
        image: ROOT + 'adore-djatoka/resolver/',
        itemMetadata: function (id) { return ROOT + 'api/items/' + id; } 
      },
      getImageUrl, 
      getImageDomNode, 
      getItemMetadata;
  
  /** Given a BDR ID and (optional) options, return the URL of the image 
  
      @public
      @param {Number} id PID of image object in BDR
      @param {Object} options Options for the image
      @param {Number} options.width Width of image in px
      @param {Number} options.height Height of image in px
      @return {String} URL of image
  */

  getImageUrl = function (id, options) {
    
    var width  = (options !== undefined && options.width)  ? options.width  : 1000,
        height = (options !== undefined && options.height) ? options.height : 0;
    
    return URL.image +
           '?svc_id=info:lanl-repo/svc/getRegion&svc_val_fmt=info:ofi/fmt:kev:mtx:jpeg2000&svc.level=4' +
           '&rft_id=' + URL.root + '/fedora/objects/bdr:394327/datastreams/JP2/content&svc.rotate=0&url_ver=Z39.88-2004' +
           '&svc.format=image/jpeg&' +
           '&svc.scale=' + width + ',' + height;
  };
  
  /** Given a BDR ID and (optional) options, return the image itself. (try image 395263)
  
      @public
      @param {Number} id PID of image object in BDR
      @param {Object} options Options for the image
      @param {Number} options.width Width of image in px
      @param {Number} options.height Height of image in px
      @return {Object} DOM node of img tag
  */
  
  getImageDomNode = function (id, options) {
    var image = document.createElement('img');
    image.src = getImageUrl(id, options);
    return image;
  };
  
  /** Given an ID, return the metadata associated with that item */
  
  getItemMetadata = function (pid, fn) {
    
    var bdrId;
    
    if (typeof pid === 'string' && pid.indexOf('bdr:') === 0) {
      bdrId = pid;
    } else {
      bdrId = 'bdr:' + pid;
    }
    
    $.getJSON(URL.itemMetadata(bdrId) + '?callback=?', fn);
  };
  
  // TODO: ANOTHER FUNCTION
  /*
   * Get an image that's been auto-cropped to take out the cruft at the top and bottom
   * suitable for thumbnails
   */
  
  console.log('BDR module loaded'); // TEMP
  
  return {
    getImageUrl: getImageUrl,
    getImageDomNode: getImageDomNode,
    getItemMetadata: getItemMetadata
  };
});
