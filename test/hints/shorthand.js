var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../../");
var util = require("../util");

describe("shorthand", function () {
  var tests = [
    {
      whiskers: "~text",
      value: null,
      expected: "text"
    }, {
      whiskers: "~container",
      value: null,
      expected: "container"
    }, {
      whiskers: "~link",
      value: null,
      expected: "link"
    }, {
      whiskers: "~submit",
      value: null,
      expected: "submit"
    }, {
      whiskers: "~content",
      value: null,
      expected: "content"
    }, {
      whiskers: "~image",
      value: null,
      expected: "image"
    }, {
      whiskers: "~form",
      value: null,
      expected: "form"
    }, {
      whiskers: "~section",
      value: null,
      expected: "section"
    }, {
      whiskers: "~complement",
      value: null,
      expected: "complement"
    }, {
      whiskers: "~marker",
      value: null,
      expected: "marker"
    }, {
      whiskers: "~card",
      value: null,
      expected: "card"
    }, {
      whiskers: "~header",
      value: null,
      expected: "header"
    }, {
      whiskers: "~label",
      value: null,
      expected: "label"
    }, {
      whiskers: "~line",
      value: null,
      expected: "line"
    }
  ];
  
  tests.forEach(function (test, index) {
    var doc = {};
    doc[test.whiskers] = test.value;
    
    it("should map whiskers " + test.whiskers + " to the hint " + test.expected, function () {
      var result = whiskers.parse(doc);
      result.spec.hints.should.contain(test.expected);
    });
  });
});
