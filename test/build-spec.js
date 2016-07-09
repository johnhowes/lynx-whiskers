var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../");

describe("building a document spec", function () {
  it("should include properties", function () {
    var doc = {
      one: "One",
      two: "Two",
      three: "Three"
    };
    
    var result = whiskers.parse(doc);
    
    result["~spec"].children[0].name.should.equal("one");
    result["~spec"].children[1].name.should.equal("two");
    result["~spec"].children[2].name.should.equal("three");
  });
  
  it("should not include ~data properties", function () {
    var doc = {
      "id~data": 4
    };
    
    var result = whiskers.parse(doc);
    should.not.exist(result["~spec"].children);
  });
  
  it("should only include a name for properties with ~inline", function () {
    var doc = {
      one: "One",
      "two~inline": "Two",
      three: "Three"
    };
    
    var result = whiskers.parse(doc);
    
    result["~spec"].children[0].hints[0].should.equal("text");
    result["~spec"].children[1].name.should.equal("two");
    should.not.exist(result["~spec"].children[1].hints);
    result["~spec"].children[2].hints[0].should.equal("text");
  });
  
  it("should build a spec for properties with ~inline", function () {
    var doc = {
      one: "One",
      "two~inline": "Two",
      three: "Three"
    };
    
    var result = whiskers.parse(doc);
    
    should.exist(result.value.two['~spec']);
  });
  
  it("should include the first array item spec, minus the name", function () {
    var doc = [
      "one",
      "two",
      "three"
    ];
    
    var result = whiskers.parse(doc);
    
    result["~spec"].children.hints[0].should.equal("text");
    should.not.exist(result["~spec"].children.name);
  });
});
