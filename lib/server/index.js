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
var util = require("util");

var readFile = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(filePath) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new Promise(function (resolve, reject) {
              fs.readFile(path.join(process.cwd(), filePath), function (err, data) {
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

  return function readFile(_x) {
    return _ref.apply(this, arguments);
  };
}();

app.use(function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx, next) {
    var requestPath, directory;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            requestPath = url.parse(ctx.request.url).pathname;
            directory = ctx.directory = requestPath;


            ctx.read = function () {
              var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(file) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return readFile(path.join(directory, file));

                      case 2:
                        return _context2.abrupt("return", _context2.sent);

                      case 3:
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

            ctx.readData = function () {
              var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(file) {
                var content;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return ctx.read(path.join("~state", file));

                      case 2:
                        content = _context3.sent;
                        return _context3.abrupt("return", YAML.parse(content.toString()));

                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x5) {
                return _ref4.apply(this, arguments);
              };
            }();

            _context4.next = 6;
            return next();

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}());

app.use(function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx, next) {
    var config;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return readFile("whiskers-config.yml");

          case 3:
            config = _context5.sent;

            ctx.settings = YAML.parse(config.toString());
            _context5.next = 11;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);

            console.error(_context5.t0);
            ctx.settings = {};

          case 11:
            _context5.next = 13;
            return next();

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[0, 7]]);
  }));

  return function (_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}());

function addStateLinks(lynxNode) {
  var value = lynxNode.value || lynxNode;

  if (!util.isObject(value)) return;

  if (value.href) {
    value["~state"] = {
      value: "Here be your states!",
      spec: {
        hints: ["text"]
      }
    };
  }

  for (var p in value) {
    if (!value[p]) continue;
    console.log("Here", p);
    addStateLinks(value[p]);
  }
}

app.use(function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(ctx, next) {
    var templateData, whiskersTemplate, handlebarsTemplate, state, stateModule, data, lynx;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            ctx.type = "application/lynx+json";

            _context6.next = 3;
            return ctx.read(ctx.template || "index.whiskers");

          case 3:
            templateData = _context6.sent;
            whiskersTemplate = whiskers.parse(YAML.parse(templateData.toString()), {
              location: path.join(ctx.directory, ctx.template || "index.whiskers"),
              rootRealm: ctx.settings.rootRealm
            });
            handlebarsTemplate = whiskers.generators.handlebars(whiskersTemplate);
            state = ctx.query.state ? ctx.query.state + ".js" : "default.js";
            stateModule = path.join(process.cwd(), ctx.directory, "~state", state);
            _context6.prev = 8;
            _context6.next = 11;
            return require(stateModule)(ctx);

          case 11:
            data = _context6.sent;
            _context6.next = 17;
            break;

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6["catch"](8);

            data = whiskers.generators.state(whiskersTemplate);

          case 17:
            decache(stateModule);

            lynx = JSON.parse(Handlebars.compile(handlebarsTemplate)(data));

            addStateLinks(lynx);
            ctx.body = JSON.stringify(lynx);

            _context6.next = 23;
            return next();

          case 23:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[8, 14]]);
  }));

  return function (_x8, _x9) {
    return _ref6.apply(this, arguments);
  };
}());

exports.serve = function (port) {
  return app.listen(port);
};