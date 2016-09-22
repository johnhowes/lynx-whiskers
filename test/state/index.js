var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);

var whiskers = require("../../");

describe("state generation", function () {
  it("should convert relative URLs to state data", function () {
    var doc = whiskers.parse({
      href: "./order/item/"
    });
    var output = whiskers.generators.state(doc);
    
    output.orderItemURL.should.equal(doc.value.href.value);
  });
  
  it("should not convert absolute URLs to state data", function () {
    var doc = whiskers.parse({
      href: "http://example.com/order/item/"
    });
    var output = whiskers.generators.state(doc);
    
    output.should.deep.equal({});
  });
  
  it("should convert href relative URLs to state data", function () {
    var doc = whiskers.parse({
      href: "./customer-data/"
    });
    var output = whiskers.generators.state(doc);
    
    output.customerDataURL.should.equal(doc.value.href.value);
  });
  
  it("should convert action relative URLs to state data", function () {
    var doc = whiskers.parse({
      action: "./customer-data/"
    });
    var output = whiskers.generators.state(doc);
    
    output.customerDataURL.should.equal(doc.value.action.value);
  });
  
  it("should convert src relative URLs to state data", function () {
    var doc = whiskers.parse({
      src: "./order/item/"
    });
    var output = whiskers.generators.state(doc);
    
    output.orderItemURL.should.equal(doc.value.src.value);
  });
  
  it("should convert context relative URLs to state data", function () {
    var doc = whiskers.parse({
      context: "../order/",
      message: "Hello"
    });
    var output = whiskers.generators.state(doc);
    
    output.orderURL.should.equal(doc.context);
  });
  
  it("should convert a root URL to the data property rootURL", function () {
    var doc = whiskers.parse({
      href: "/"
    });
    var output = whiskers.generators.state(doc);
    
    output.rootURL.should.equal(doc.value.href.value);
  });
  
  it("should add a data property for a simple handlebars expression", function () {
    var doc = whiskers.parse("{{{name}}}");
    
    var output = whiskers.generators.state(doc);
    
    output.name.should.equal("Lorem ipsum dolor sit amet");
  });
  
  it("should add a data property for multiple simple handlebars expressions", function () {
    var doc = whiskers.parse("My name and serial number: {{{name}}} {{{serialNumber}}}");
    
    var output = whiskers.generators.state(doc);
    
    output.name.should.equal("Lorem ipsum dolor sit amet");
    output.serialNumber.should.equal("Lorem ipsum dolor sit amet");
  });
  
  it.only("should add an object context for a section", function () {
    var doc = whiskers.parse({
      "~#person": {
        "name": "{{{name}}}"
      }
    });
    
    var output = whiskers.generators.state(doc);
    output.person.name.should.equal("Lorem ipsum dolor sit amet");
  });
});
