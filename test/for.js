var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var whiskers = require("../");

var should = chai.should();
chai.use(chaiAsPromised);

describe("marker for", function () {
  var tests = [
    {
      description: "should allow an absolute for",
      source: {
        "~marker": {
          for: "http://example.com/greeting/"
        }
      },
      expected: "http://example.com/greeting/"
    }, {
      description: "should allow a relative for from the root realm",
      source: {
        "~marker": {
          for: "/greeting/"
        }
      },
      rootRealm: "http://example.com/root/",
      expected: "http://example.com/root/greeting/"
    }, {
      description: "should resolve a for relative to the document realm",
      source: {
        "~marker": {
          for: "./message/"
        }
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
      doc.value.for.value.should.equal(test.expected);
    });
  });
});
