#!/usr/bin/env node

/* jshint node: true */
/* jshint esversion: 6 */
"use strict";

var program = require("commander");
var server = require("../server");

program.option("-p, --port [port]", "specify a port").option("-H, --happy [happy]", "serve the default state of each resource").parse(process.argv);

var runningApp = server.serve(program.port || 0, program.happy);
var address = runningApp && runningApp.address();
if (address) {
  console.log("Whiskers is waiting on port " + address.port + "...");
}