var YAML = require("yamljs");
var util = require("util");

module.exports = exports = util;

exports.logWhiskers = function (obj) {
  console.log(YAML.stringify(obj));
};
