var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../");
var util = require("./util");

describe("shorthand", function () {
  var tests = [
    {
      whiskers: "~input",
      value: null,
      expectation: (node) => node.spec.input === true,
      expected: "spec.input=true"
    }, {
      whiskers: "~input=true",
      value: null,
      expectation: (node) => node.spec.input === true,
      expected: "spec.input=true"
    }, {
      whiskers: "~input=firstName",
      value: null,
      expectation: (node) => node.spec.input === "firstName",
      expected: "spec.input=firstName"
    }, {
      whiskers: "~visibility=hidden",
      value: null,
      expectation: (node) => node.spec.visibility === "hidden",
      expected: "spec.visibility=hidden"
    }, {
      whiskers: "~hidden",
      value: null,
      expectation: (node) => node.spec.visibility === "hidden",
      expected: "spec.visibility=hidden"
    }, {
      whiskers: "~visibility=concealed",
      value: null,
      expectation: (node) => node.spec.visibility === "concealed",
      expected: "spec.visibility=concealed"
    }, {
      whiskers: "~concealed",
      value: null,
      expectation: (node) => node.spec.visibility === "concealed",
      expected: "spec.visibility=concealed"
    }, {
      whiskers: "~visibility=visible",
      value: null,
      expectation: (node) => node.spec.visibility === "visible",
      expected: "spec.visibility=visible"
    }, {
      whiskers: "~visible",
      value: null,
      expectation: (node) => node.spec.visibility === "visible",
      expected: "spec.visibility=visible"
    }, {
      whiskers: "~emphasis=1",
      value: null,
      expectation: (node) => node.spec.emphasis === 1,
      expected: "spec.emphasis=1"
    }, {
      whiskers: "~em",
      value: null,
      expectation: (node) => node.spec.emphasis === 1,
      expected: "spec.emphasis=1"
    }, {
      whiskers: "~strong",
      value: null,
      expectation: (node) => node.spec.emphasis === 2,
      expected: "spec.emphasis=2"
    }, {
      whiskers: "~labeledBy=firstNameLabel",
      value: null,
      expectation: (node) => node.spec.labeledBy === "firstNameLabel",
      expected: "spec.labeledBy=firstNameLabel"
    }, {
      whiskers: "~options=colorOptions",
      value: null,
      expectation: (node) => node.spec.options === "colorOptions",
      expected: "spec.options=colorOptions"
    }, {
      whiskers: "~option",
      value: null,
      expectation: (node) => node.spec.option === true,
      expected: "spec.option=true"
    }, {
      whiskers: "~follow",
      value: null,
      expectation: (node) => node.spec.follow === 0,
      expected: "spec.follow=0"
    }, {
      whiskers: "~follow=1000",
      value: null,
      expectation: (node) => node.spec.follow === 1000,
      expected: "spec.follow=1000"
    }
  ];
  
  tests.forEach(function (test, index) {
    var doc = {};
    doc[test.whiskers] = test.value;
    
    it("should map whiskers " + test.whiskers + " to " + test.expected, function () {
      var result = whiskers.parse(doc);
      test.expectation(result).should.be.true;
    });
  });
});
