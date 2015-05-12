
/*jslint browser: true, devel: true, white: true */

/** Define membership for message passing. @module

    Examples: ms.belongsTo(['cart1', 'cart2'], ['carts', 'ugly furniture']);
              ms.getMembershipListFor('cart1'); --> ["all", "carts", "ugly furniture"]

*/

define([], function () {

  'use strict';
  
  var membership = {},
      isAMemberOf = function (m, g) {
    
    var members = (m.constructor === Array ? m : [m]),
        groups =  (g.constructor === Array ? g : [g]);
    
    members.forEach(function (member) {
      groups.forEach(function (group) {
        if (membership[member] === undefined) {
          membership[member] = {'all': true};
        }
        if (membership[member][group] === undefined) {
          membership[member][group] = true;
        }
      });
    });
  };
  
  var getMembershipFor = function (member) {
    var groups = [], group;
    for (group in membership[member]) {
      groups.push(group);
    }
    return groups;
  };
  
  return { belongsTo: isAMemberOf, 
           getMembershipListFor: getMembershipFor };
});


