/*! js13k-breaker-panel - v0.0.5 - 2015-09-12 */

define([],function(){"use strict";var a,b,c;return a=function(b,c){var d,e,f;e=Object.prototype.toString,c=c||{};for(d in b)b.hasOwnProperty(d)&&(f=b[d],"object"==typeof f?(c[d]=Array.isArray(f)?[]:{},a(f,c[d])):c[d]=b[d]);return c},b=function(){var a;return a=function(){},function(b,c){a.prototype=c.prototype,b.prototype=new a,b.superior=c.prototype,b.prototype.constructor=b}},c=function(){var a,b,c,d,e;for(e={},a=0,c=arguments.length;c>a;a+=1){b=arguments[a];for(d in b)b.hasOwnProperty(d)&&(e[d]=b[d])}return e},{extendDeep:a,inherit:b,mix:c}});
//# sourceMappingURL=utils.js.map