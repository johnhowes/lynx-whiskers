"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var Koa = require('koa');
require("babel-polyfill");
var app = new Koa();
var whiskers = require("../../index.js");

var Handlebars = require("handlebars");
var path = require("path");
var fs = require("fs");
var url = require("url");
var YAML = require("yamljs");
require("babel-register");
var decache = require("decache");

app.use(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, next) {
    var requestPath, directory;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            requestPath = url.parse(ctx.request.url).pathname;
            directory = ctx.directory = path.join(process.cwd(), requestPath);


            ctx.read = function () {
              var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(file) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return new Promise(function (resolve, reject) {
                          fs.readFile(path.join(directory, file), function (err, data) {
                            if (err) return reject(err);
                            resolve(data);
                          });
                        });

                      case 2:
                        return _context.abrupt("return", _context.sent);

                      case 3:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }();

            ctx.readData = function () {
              var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(file) {
                var content;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return ctx.read(path.join("~state", file));

                      case 2:
                        content = _context2.sent;
                        return _context2.abrupt("return", YAML.parse(content.toString()));

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }();

            _context3.next = 6;
            return next();

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

app.use(function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx, next) {
    var state, stateModule, data, templateData, whiskersTemplate, handlebarsTemplate;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            ctx.type = "application/lynx+json";

            state = ctx.query.state ? ctx.query.state + ".js" : "default.js";
            stateModule = path.join(ctx.directory, "~state", state);
            _context4.next = 5;
            return require(stateModule)(ctx);

          case 5:
            data = _context4.sent;

            decache(stateModule);

            _context4.next = 9;
            return ctx.read(ctx.template || "index.whiskers");

          case 9:
            templateData = _context4.sent;
            whiskersTemplate = whiskers.parse(YAML.parse(templateData.toString()), {
              location: path.join(ctx.directory, ctx.template || "index.whiskers")
            });
            handlebarsTemplate = whiskers.generators.handlebars(whiskersTemplate);


            ctx.body = Handlebars.compile(handlebarsTemplate)(data);

            _context4.next = 15;
            return next();

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}());

exports.serve = function (port) {
  return app.listen(port);
};