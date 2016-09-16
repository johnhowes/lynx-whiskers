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
});
