#!/usr/bin/env node
/* jshint node: true */
/* jshint esversion: 6 */
"use strict";
var program = require('commander');
var opener = require("opener");
var fs = require("fs");
var path = require("path");
var glob = require("glob");
var whiskers = require("./index");
var YAML = require("yamljs");

var sourcePath;

program
 .version(require("./package.json").version)
 .arguments('[path]')
 .option('-c, --compile <path>', 'the glob')
 .option('-o, --output <dir>', 'the output directory')
 .option('-w, --watch', 'watch whiskers files for changes and automatically recompile')
 .option('-s, --serve', 'run a server with sample state data')
 .action(function(p) {
   sourcePath = p;
 })
 .parse(process.argv);
 
if (program.compile) sourcePath = program.compile;
 
function ensureDirectoryTree(filePath) {
  function getDirectories() {
    var directories = [];
    var dirname = path.dirname(filePath);
    while (dirname && dirname !== ".") {
      directories.unshift(dirname);
      dirname = path.dirname(dirname);
    }
    
    return directories;
  }
  
  for (let dir of getDirectories(filePath)) {
    try {
      fs.accessSync(dir);
    } catch(err) {
      fs.mkdirSync(dir);
    }
  }
}

function generateTemplate(filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) return console.error(err);
    
    var whiskersTemplate = whiskers.parse(YAML.parse(data.toString()));
    var handlebarsTemplate = whiskers.generators.handlebars(whiskersTemplate);
    
    var handlebarsFileName = filePath.replace(".whiskers", ".handlebars");
    var handlebarsPath = path.join(program.output || "", handlebarsFileName);
    var outputDirectory = path.dirname(handlebarsPath);
    
    ensureDirectoryTree(handlebarsPath);
    
    fs.writeFile(handlebarsPath, handlebarsTemplate, (err) => {
      if (err) console.error(err);
      else console.log("Generated template %s", handlebarsFileName);
    });
  });
}

glob(sourcePath, (err, files) => {
  for (let file of files) {
    generateTemplate(file);
  }
});

if (program.serve) {
  var server = require("./server").serve(4617);
  opener("http://localhost:4617");
  
  return server;
}
