var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../");

describe("multiple templates for a single value", function () {
  it("should store alternate templates for a value", function () {
    var source = {
      "~#name": "{{{name}}}",
      "~^name": null
    };
    
    var output = whiskers.parse(source);
    
    output.value.should.equal("{{{name}}}");
    output.templates[0].isTemplate.should.be.true;
    should.not.exist(output.templates[0].value);
  });
});
