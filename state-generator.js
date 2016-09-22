/* jshint node: true */
/* jshint esversion: 6 */
"use strict";

const utilities = require("./util");
const generateDataKeyFromRelativeURL = utilities.generateDataKeyFromRelativeURL;
const util = require("util");

function convertRelativeURLsToStateData(node, context) {
  if (!node.value) return;
  let relativeOrAbsoluteURL;
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
      context[key] = relativeOrAbsoluteURL;
    }
  }
}

function addSimpleExpressionsToContext(node, context) {
  const expressionPattern = /{{{([^}]*)}}}/g;
  
  if (typeof node.value !== "string") return;
  
  var match = expressionPattern.exec(node.value);
  while (match) {
    context[match[1]] = "Lorem ipsum dolor sit amet";
    match = expressionPattern.exec(node.value);
  }
}

function checkForNewContext(node, parentContext) {
  for (let whisker of node.whiskers) {
    if (whisker.key.startsWith("#")) {
      let context = {};
      parentContext[whisker.key.substr(1)] = context;
      return context;
    }
  }
}

function generate(doc) {
  var output = {};
  
  function processNode(node, context) {
    context = checkForNewContext(node, context) || context;
    convertRelativeURLsToStateData(node, context);
    addSimpleExpressionsToContext(node, context);
    
    //TODO: Don't forget about alternate templates.
    
    if (node.value && util.isObject(node.value)) {
      for (let p in node.value) {
        processNode(node.value[p], context);
      }
    }
  }
  
  processNode(doc, output);
  return output;
}

module.exports = exports = generate;
