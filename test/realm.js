var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var whiskers = require("../");

var should = chai.should();
chai.use(chaiAsPromised);

describe("realm", function () {
  var tests = [
    {
      description: "should allow an absolute document realm",
      source: {
        realm: "http://example.com/greeting/",
        message: "Hello"
      },
      expected: "http://example.com/greeting/"
    }, {
      description: "should allow an absolute realm specified on the value",
      source: {
        "~section": {
          realm: "http://example.com/greeting/",
          message: "Hello"
        }
      },
      expected: "http://example.com/greeting/"
    }, {
      description: "should allow a realm on a text document",
      source: {
        realm: "http://example.com/greeting/",
        "value~label": "Hello"
      },
      expected: "http://example.com/greeting/"
    }, {
      description: "should allow a relative realm from the root",
      source: {
        realm: "/greeting/",
        message: "Hello"
      },
      rootRealm: "http://example.com/root/",
      expected: "http://example.com/root/greeting/"
    }, {
      description: "should infer a relative realm from a default template folder",
      source: {
        message: "Hello"
      },
      rootRealm: "http://example.com/root/",
      location: "/greeting/index.whiskers",
      expected: "http://example.com/root/greeting/"
    }, {
      description: "should infer a relative realm from an alternate template location",
      source: {
        message: "Hello"
      },
      rootRealm: "http://example.com/root/",
      location: "/greeting/error.whiskers",
      expected: "http://example.com/root/greeting/error/"
    }
  ];
  
  tests.forEach(function (test, index) {
    it (test.description, function () {
      var doc = whiskers.parse(test.source, {
        rootRealm: test.rootRealm,
        location: test.location
      });
      doc.realm.should.equal(test.expected);
    });
  });
});
