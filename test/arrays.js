var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../");
var util = require("./util");

describe("property whiskers", function () {
  it("should describe an array item value with a whisker property", function () {
    var doc = [
      {"~hint=message": "ABC"},
      {"~hint=message": "123"}
    ];
    
    var result = whiskers.parse(doc);
    result.value[0].spec.hints.should.deep.equal(["message", "text"]);
    result.value[0].value.should.equal("ABC");
    result.value[1].spec.hints.should.deep.equal(["message", "text"]);
    result.value[1].value.should.equal("123");
  });
});
