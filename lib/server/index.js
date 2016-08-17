"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var Koa = require('koa');
require("babel-polyfill");
var app = new Koa();
var whiskers = require("../../index.js");
var Handlebars = require("handlebars");
var path = require("path");
var fs = require("fs");
var YAML = require("yamljs");

app.use(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
    var index, data, whiskersTemplate, handlebarsTemplate;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx.type = "application/lynx+json";

            index = path.join(process.cwd(), "index.whiskers");
            _context.next = 4;
            return new Promise(function (resolve, reject) {
              fs.readFile(index, function (err, data) {
                if (err) return reject(err);else resolve(data);
              });
            });

          case 4:
            data = _context.sent;
            whiskersTemplate = whiskers.parse(YAML.parse(data.toString()));
            handlebarsTemplate = whiskers.generators.handlebars(whiskersTemplate);

            ctx.body = Handlebars.compile(handlebarsTemplate)({});

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

exports.serve = function (port) {
  return app.listen(port);
};