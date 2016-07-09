var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../../");
var util = require("../util");
var YAML = require("yamljs");

describe("container", function () {
  var tests = [
    {
      whiskers: null,
      value: {},
      expected: [ "container" ]
    }, {
      whiskers: "~container",
      value: null,
      expected: [ "container" ]
    }, {
      whiskers: "~hint=section",
      value: {},
      expected: [ "section", "container" ]
    }, {
      whiskers: "~section",
      value: {},
      expected: [ "section", "container" ]
    }, {
      whiskers: "~complement",
      value: {},
      expected: [ "complement", "container" ]
    }, {
      whiskers: "~section~complement",
      value: {},
      expected: [ "complement", "section", "container" ]
    }, {
      whiskers: "~section~complement~marker",
      value: {},
      expected: [ "marker", "complement", "section", "container" ]
    }, {
      whiskers: "~section~complement~marker~card",
      value: {},
      expected: [ "marker", "card", "complement", "section", "container" ]
    }, {
      whiskers: "~header",
      value: {},
      expected: [ "header", "container" ]
    }, {
      whiskers: null,
      value: [],
      expected: [ "container" ]
    }
  ];
  
  tests.forEach(function (test, index) {
    var type;
    
    switch (test.value) {
      case null:
        type = "null";
        break;
      default:
        type = util.isArray(test.value) ? "array" : "object";
    }
    
    var doc = {};
    if (test.whiskers) doc[test.whiskers] = test.value;
    else doc = test.value;
    
    it("should map whiskers " + test.whiskers + " on a value of type " + type + " to hints [" + test.expected.join(",") + "]", function () {
      var result = whiskers.parse(doc);
      result.spec.hints.should.deep.equal(test.expected);
    });
  });
});
