var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../");
var util = require("./util");
var YAML = require("yamljs");

describe("data properties", function () {
  it("should not create a spec for a value described by ~data", function () {
    var doc = {
      "id~data": 4
    };
    
    var result = whiskers.parse(doc);
    should.not.exist(result.value.id.spec);
  });
  
  it("should treat link properties href and type as data properties", function () {
    var doc = {
      href: "http://example.com",
      type: "application/lynx+json"
    };
    
    var result = whiskers.parse(doc);
    should.not.exist(result.value.href.spec);
    should.not.exist(result.value.type.spec);
  });
  
  it("should treat submit properties action, method, and enctype as data properties", function () {
    var doc = {
      action: "http://example.com",
      method: "POST",
      enctype: "multipart/form-data"
    };
    
    var result = whiskers.parse(doc);
    should.not.exist(result.value.action.spec);
    should.not.exist(result.value.method.spec);
    should.not.exist(result.value.enctype.spec);
  });
  
  it("should treat content properties src, data, and type as data properties", function () {
    var doc = {
      src: "http://example.com",
      data: null,
      type: "text/html"
    };
    var result = whiskers.parse(doc);
    should.not.exist(result.value.src.spec);
    should.not.exist(result.value.data.spec);
    should.not.exist(result.value.type.spec);
  });
  
  it("should treat image properties width and height as data properties", function () {
    var doc = {
      "~image": {
        src: "http://example.com",
        width: 100,
        height: 100
      }
    };
    
    var result = whiskers.parse(doc);
    should.not.exist(result.value.width.spec);
    should.not.exist(result.value.height.spec);
  });
  
  it("should treat marker property for as a data property", function () {
    var doc = {
      "~marker": {
        for: "http://example.com/"
      }
    };
    
    var result = whiskers.parse(doc);
    should.not.exist(result.value.for.spec);
  });
  
  it("should specify any property with ~data=false", function () {
    var doc = {
      "href~data=false": "http://example.com"
    };
    
    var result = whiskers.parse(doc);
    should.exist(result.value.href.spec);
  });
  
  it("should treat a document realm property as a data property");
});
