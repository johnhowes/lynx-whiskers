#!/usr/bin/env node

/* jshint node: true */
/* jshint esversion: 6 */
"use strict";

var program = require("commander");

program.version(require("../../package.json").version).command('serve', 'launch a whiskers development server').parse(process.argv);