/*jslint browser: true, devel: true, white: true */
// Main loader for DieSeL application

var DSL, BDR, x;
console.log('* Entering main.js');


(function () {

  'use strict';

  require(['DSL', 'BDR'], function(dsl, dg, bdr) {
    DSL = dsl;
    BDR = bdr;
  });
})();
