#!/usr/bin/env node


/* jshint node: true */
/* jshint esversion: 6 */
"use strict";

var program = require("commander");

program.option("-p, --port", "specify a port").parse(process.argv);

if (program.port) console.log("PORT", program.port);