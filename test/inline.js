var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);

var whiskers = require("../index");

describe("~inline", function () {
  it("should mark the node as having an inline spec", function () {
    var doc = {
      "inlineValue~inline": null
    };
    
    var result = whiskers.parse(doc);
    
    result.value.inlineValue.inlineSpec.should.be.true;
  });
});
