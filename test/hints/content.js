var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../../");
var util = require("../util");
var YAML = require("yamljs");

describe("content", function () {
  var tests = [
    {
      whiskers: null,
      value: {
        "src": "http://example.com"
      },
      expected: [ "content" ],
      description: "value with src"
    }, {
      whiskers: "~image",
      value: {
        "src": "http://example.com"
      },
      expected: [ "image", "content" ],
      description: "value with src"
    }, {
      whiskers: "~content",
      value: null,
      expected: [ "content" ],
      description: "null value"
    }, {
      whiskers: null,
      value: {
        "data": "test"
      },
      expected: [ "content" ],
      description: "value with data"
    }, {
      whiskers: "~image",
      value: {
        "data": "http://example.com"
      },
      expected: [ "image", "content" ],
      description: "value with data"
    }, {
      whiskers: "~content",
      value: null,
      expected: [ "content" ],
      description: "null value"
    }, {
      whiskers: "~content",
      value: {},
      expected: [ "content" ],
      description: "object without src or data"
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
