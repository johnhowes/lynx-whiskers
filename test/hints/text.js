var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../../");
var util = require("../util");

describe("text", function () {
  var tests = [
    {
      whiskers: "~hint=greeting",
      value: "Hello, World!",
      expected: [ "greeting", "text" ]
    }, {
      whiskers: "~hints=greeting,message",
      value: "Hello, World!",
      expected: [ "greeting", "message", "text" ]
    }, {
      whiskers: "~text",
      value: "Hello, World!",
      expected: [ "text" ]
    }, {
      whiskers: "~label",
      value: "Hello, World!",
      expected: [ "label", "text" ]
    }, {
      whiskers: null,
      value: "Hello, World!",
      expected: [ "text" ]
    }, {
      whiskers: null,
      value: true,
      expected: [ "text" ]
    }, {
      whiskers: null,
      value: false,
      expected: [ "text" ]
    }, {
      whiskers: null,
      value: null,
      expected: [ "text" ]
    }, {
      whiskers: null,
      value: 12.2,
      expected: [ "text" ]
    }
  ];
  
  tests.forEach(function (test, index) {
    var type;
    switch (test.value) {
      case true:
        type = "true";
        break;
      case false:
        type = "false";
        break;
      case null:
        type = "null";
        break;
      default:
        type = typeof test.value;
    }
    
    var doc = {};
    if (test.whiskers) doc[test.whiskers] = test.value;
    else doc = test.value;
    
    it("should map whiskers " + test.whiskers + " on a " + type + " value to hints [" + test.expected.join(",") + "]", function () {
      var result = whiskers.parse(doc);
      result.spec.hints.should.deep.equal(test.expected);
    });
  });
});
