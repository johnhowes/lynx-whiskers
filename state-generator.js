/* jshint node: true */
/* jshint esversion: 6 */
"use strict";

const generateDataKeyFromRelativeURL = require("./util").generateDataKeyFromRelativeURL;

function generate(doc) {
  var output = {};
  
  var relativeOrAbsoluteURL;
  
  for (let node of doc) {
    if (!node.value) continue;
    
    if (node.value.href) {
      relativeOrAbsoluteURL = node.value.href.value;
    } else if (node.value.action) {
      relativeOrAbsoluteURL = node.value.action.value;
    } else if (node.value.src) {
      relativeOrAbsoluteURL = node.value.src.value;
    } else if (node.context) {
      relativeOrAbsoluteURL = node.context;
    }
    
    if (relativeOrAbsoluteURL) {
      let key = generateDataKeyFromRelativeURL(relativeOrAbsoluteURL);
        
      if (key) {
        output[key] = relativeOrAbsoluteURL;
      }
    }
  }
  
  return output;
}

module.exports = exports = generate;
