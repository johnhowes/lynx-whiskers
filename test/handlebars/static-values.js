var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../../");

describe("static lynx generation", function () {
  var tests = [
      {
        description: "a document with a string value",
        source: "Hello, World!",
        expected: {
          value: "Hello, World!",
          spec: {
            hints: [ "text" ]
          }
        }
      }, {
        description: "a document with a numeric value",
        source: 10.2,
        expected: {
          value: 10.2,
          spec: {
            hints: [ "text" ]
          }
        }
      }, {
        description: "a document with a true value",
        source: true,
        expected: {
          value: true,
          spec: {
            hints: [ "text" ]
          }
        }
      }, {
        description: "a document with a false value",
        source: false,
        expected: {
          value: false,
          spec: {
            hints: [ "text" ]
          }
        }
      }, {
        description: "a document with a null value",
        source: null,
        expected: {
          value: null,
          spec: {
            hints: [ "text" ]
          }
        }
      }, {
        description: "an object document",
        source: {
          message: "Hello, World!",
          href: "http://example.com"
        },
        expected: {
          message: "Hello, World!",
          href: "http://example.com",
          spec: {
            hints: [ "link" ],
            children: [
              {
                name: "message",
                hints: [ "text" ]
              }
            ]
          }
        }
      }, {
        description: "an array document",
        source: [
          "one", "two"
        ],
        expected: {
          value: [
            "one", "two"
          ],
          spec: {
            hints: [ "container" ],
            children: {
              hints: [ "text" ]
            }
          }
        }
      }
  ];
  
  tests.forEach(function (test) {
    it("should generate " + test.description, function () {
      var whiskersTemplate = whiskers.parse(test.source);
      var output = whiskers.generators.handlebars(whiskersTemplate);
      
      var lynx = JSON.parse(output);
      lynx.should.deep.equal(test.expected);
    });
  });
});
