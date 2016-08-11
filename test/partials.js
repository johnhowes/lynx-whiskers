var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../");
var util = require("./util");
var YAML = require("yamljs");

describe("partial templates", function () {
  it("should replace a value with a partial template", function () {
    var doc = {
      "~include=message": null
    };
    
    var message = "Hi";
    
    function resolvePartial(name) {
      if (name === "message") return message;
    }
    
    whiskers.parse.resolvePartial = resolvePartial;
    var result = whiskers.parse(doc);
    result.value.should.equal("Hi");
    result.spec.hints[0].should.equal("text");
  });
  
  it("should replace a property value with a partial template", function () {
    var doc = {
      "message~include=message": null
    };
    
    var message = "Hi";
    
    function resolvePartial(name) {
      if (name === "message") return message;
    }
    
    whiskers.parse.resolvePartial = resolvePartial;
    var result = whiskers.parse(doc);
    result.value.message.value.should.equal("Hi");
    result.value.message.spec.hints[0].should.equal("text");
  });
  
  it("should apply ~~ parameters to a partial template", function () {
    var doc = {
      "~include=message": {
        name: "Jim"
      }
    };
    
    var message = "Hello, ~~name";
    
    function resolvePartial(name) {
      if (name === "message") return message;
    }
    
    whiskers.parse.resolvePartial = resolvePartial;
    var result = whiskers.parse(doc);
    result.value.should.equal("Hello, Jim");
    result.spec.hints[0].should.equal("text");
  });
  
  it("should include a nested partial", function () {
    var doc = {
      "~include=welcome": null
    };
    
    var greeting = "~~greeting";
    var welcome = {
      "~include=greeting": {
        greeting: "Welcome!"
      }
    };
    
    function resolvePartial(name) {
      if (name === "greeting") return greeting;
      if (name === "welcome") return YAML.stringify(welcome);
    }
    
    whiskers.parse.resolvePartial = resolvePartial;
    var result = whiskers.parse(doc);
    result.value.should.equal("Welcome!");
    result.spec.hints[0].should.equal("text");
  });
});
