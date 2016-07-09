var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../../");
var util = require("../util");
var YAML = require("yamljs");

describe("link", function () {
  var tests = [
    {
      whiskers: null,
      value: {
        "href": "http://example.com"
      },
      expected: [ "link" ],
      description: "value with href"
    }, {
      whiskers: "~card",
      value: {
        "href": "http://example.com"
      },
      expected: [ "card", "link" ],
      description: "value with href"
    }, {
      whiskers: "~link",
      value: null,
      expected: [ "link" ],
      description: "null value"
    }, {
      whiskers: "~link",
      value: {},
      expected: [ "link" ],
      description: "object without href"
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
