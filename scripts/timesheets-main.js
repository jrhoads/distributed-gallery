/** Loader for all the timesheets libraries @module */

define(['timesheets'], function(ts) {
  'use strict';
  
  console.log('* Timesheets.js loaded'); // TEMP
  console.log('DOM at time of timesheets: ');
  console.log(document.getElementById('slideshow').innerHTML);
  require(['timesheets-controls', 'timesheets-navigation'], function () {
    console.log('* Timesheets-controls and -navigation loaded'); // TEMP
  });
});
