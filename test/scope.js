var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var whiskers = require("../");

var should = chai.should();
chai.use(chaiAsPromised);

describe("scope", function () {
  var tests = [
    {
      description: "should allow an absolute scope",
      source: {
        scope: "http://example.com/greeting/"
      },
      expected: "http://example.com/greeting/"
    }, {
      description: "should allow a relative scope from the root realm",
      source: {
        scope: "/greeting/",
        message: "Hello"
      },
      rootRealm: "http://example.com/root/",
      expected: "http://example.com/root/greeting/"
    }, {
      description: "should resolve a scope relative to the document realm",
      source: {
        scope: "./message/"
      },
      rootRealm: "http://example.com/root/",
      location: "/greeting/index.whiskers",
      expected: "http://example.com/root/greeting/message/"
    }
  ];
  
  tests.forEach(function (test, index) {
    it (test.description, function () {
      var doc = whiskers.parse(test.source, {
        rootRealm: test.rootRealm,
        location: test.location
      });
      doc.value.scope.value.should.equal(test.expected);
    });
  });
});
