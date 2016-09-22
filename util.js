/* jshint node: true */
/* jshint esversion: 6 */
"use strict";

const url = require("url");
const path = require("path");
const urlDataPattern = /[\w]+/g;

exports.nodesAndTemplates = function* nodesAndTemplates(doc) {
  for (let node of doc) {
    yield node;
    
    for (let template of node.templates) {
      yield template;
    }
  }
};

exports.generateDataKeyFromRelativeURL = function generateDataKeyFromRelativeURL(relativeOrAbsoluteURL) {
  var parsedURL = url.parse(relativeOrAbsoluteURL);
  if (parsedURL.host) return null;
  
  var output = [];
  // To leave extensions out of the key...
  var parsedPath = path.parse(relativeOrAbsoluteURL);
  var fullName = path.join(parsedPath.dir, parsedPath.name);
  var match = urlDataPattern.exec(fullName);
  while (match) {
    let part = match[0];
    
    if (output.length) {
      part = part.charAt(0).toUpperCase() + part.slice(1);
    }
    
    output.push(part);
    match = urlDataPattern.exec(fullName);
  }
  
  if (output.length === 0 && relativeOrAbsoluteURL === "/") {
    output.push("root");
  }
  
  if (output.length === 0) return null;
  
  output.push("URL");
  
  return output.join("");
};
