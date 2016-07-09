var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../../");
var util = require("../util");
var YAML = require("yamljs");

describe("submit", function () {
  var tests = [
    {
      whiskers: null,
      value: {
        "action": "http://example.com"
      },
      expected: [ "submit" ],
      description: "value with action"
    }, {
      whiskers: "~card",
      value: {
        "action": "http://example.com"
      },
      expected: [ "card", "submit" ],
      description: "value with action"
    }, {
      whiskers: "~submit",
      value: null,
      expected: [ "submit" ],
      description: "null value"
    }, {
      whiskers: "~submit",
      value: {},
      expected: [ "submit" ],
      description: "object without action"
    } 
  ];
  
  tests.forEach(function (test, index) {
    var doc = {};
    if (test.whiskers) doc[test.whiskers] = test.value;
    else doc = test.value;
    
    it("should map whiskers " + test.whiskers + " on a " + test.description + " to hints [" + test.expected.join(",") + "]", function () {
      var result = whiskers.parse(doc);
      result.spec.hints.should.deep.equal(test.expected);
    });
  });
});
