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
      if (name === "message") return {
        data: new Buffer(message)
      };
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
      if (name === "message") return {
        data: new Buffer(message)
      };
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
      if (name === "message") return {
        data: new Buffer(message)
      };
    }
    
    whiskers.parse.resolvePartial = resolvePartial;
    var result = whiskers.parse(doc);
    result.value.should.equal("Hello, Jim");
    result.spec.hints[0].should.equal("text");
  });
  
  it("should apply ~~ parameters to a partial template", function () {
    var doc = {
      "~include=message": {
        name: "Jim"
      }
    };
    
    var message = "Hello, ~~name";
    
    function resolvePartial(name) {
      if (name === "message") return {
        data: new Buffer(message)
      };
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
      if (name === "greeting") return {
        data: new Buffer(greeting)
      };
      if (name === "welcome") return {
        data: new Buffer(YAML.stringify(welcome))
      }
    }
    
    whiskers.parse.resolvePartial = resolvePartial;
    var result = whiskers.parse(doc);
    result.value.should.equal("Welcome!");
    result.spec.hints[0].should.equal("text");
  });
  
  it("should include a layout partial with zones", function () {
    var doc = {
      "~include=site-layout": {
        "message": "Welcome"
      }
    };
    
    var siteLayout = {
      "header": "Site Layout",
      "message~zone": null
    };
    
    function resolvePartial(name) {
      if (name === "site-layout") return {
        data: new Buffer(YAML.stringify(siteLayout))
      };
    }
    
    whiskers.parse.resolvePartial = resolvePartial;
    var result = whiskers.parse(doc);
    result.value.header.value.should.equal("Site Layout");
    result.value.message.value.should.equal("Welcome");
  });
  
  it("should replace the zone spec with the container's spec for that zone", function () {
    var doc = {
      "~include=site-layout": {
        "main": {
          "header~header~label": "Welcome"
        }
      }
    };
    
    var siteLayout = {
      "header": "Site Layout",
      "main~zone": null
    };
    
    function resolvePartial(name) {
      if (name === "site-layout") return {
        data: new Buffer(YAML.stringify(siteLayout))
      };
    }
    
    whiskers.parse.resolvePartial = resolvePartial;
    var result = whiskers.parse(doc);
    result.value.header.value.should.equal("Site Layout");
    result.value.main.spec.hints[0].should.equal("container");
  });
  
  it("should allow multiple instances of the same partial in the same template", function () {
    var doc = {
      "hello~include=site-layout": {
        "main": "Hello"
      },
      "goodbye~include=site-layout": {
        "main": "Goodbye"
      }
    };
    
    var siteLayout = {
      "main~zone": null
    };
    
    function resolvePartial(name) {
      if (name === "site-layout") return {
        data: new Buffer(YAML.stringify(siteLayout))
      };
    }
    
    whiskers.parse.resolvePartial = resolvePartial;
    var result = whiskers.parse(doc);
    result.value.hello.value.main.value.should.equal("Hello");
    result.value.hello.name.should.equal("hello");
    result.value.hello.spec.name.should.equal("hello");
    result.value.goodbye.value.main.value.should.equal("Goodbye");
    result.value.goodbye.name.should.equal("goodbye");
    result.value.goodbye.spec.name.should.equal("goodbye");
  });
  
  it("should not generate a document spec for the partial", function () {
    var doc = {
      "hello~include=site-layout": {
        "main": "Hello"
      }
    };
    
    var siteLayout = {
      "main~zone": null
    };
    
    function resolvePartial(name) {
      if (name === "site-layout") return {
        data: new Buffer(YAML.stringify(siteLayout))
      };
    }
    
    whiskers.parse.resolvePartial = resolvePartial;
    var result = whiskers.parse(doc);
    should.not.exist(result.value.hello["~spec"]);
  });
});
