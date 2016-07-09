var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../");
var util = require("./util");

describe("property whiskers", function () {
  it("should describe property value with whiskers shorthand", function () {
    var doc = {
      "label~label": "Hello, World!"
    };
    
    var result = whiskers.parse(doc);
    result.value.label.spec.hints.should.deep.equal(["label", "text"]);
  });
  
  it("should describe a property value with a whisker property", function () {
    var doc = {
      "label": {
        "~label": "Hello, World!"
      }
    };
    
    var result = whiskers.parse(doc);
    result.value.label.spec.hints.should.deep.equal(["label", "text"]);
    result.value.label.value.should.equal("Hello, World!");
  });
});
