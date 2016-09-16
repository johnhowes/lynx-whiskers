require("./hints");
require("./properties");
require("./arrays");
require("./realm");
require("./scope");
require("./for");
require("./shorthand-spec-properties");
require("./build-spec");
require("./data-properties");
require("./templates");
require("./handlebars");
require("./state");

require("./partials");

describe("TODO", function () {
  it("should decide what to do about turning hint inference off");
  it("should describe markdown shorthand");
  it("should allow templated property names");
  it("should allow easy creation of container inputs");
  it("should make it easy to pull a partial into a data uri to optimize links");
  it("should describe the server");
  it("should allow longhand value/spec declaration");
  it("should support relative URLs in templates and generate data according to the relative path");
  it("should use default instead of index for the default template");
  // href: "../order/" -> {{{orderURL}}}
  // href: "./availability/" -> {{{availabilityURL}}}
  // href: "../order/line/" -> {{{orderLineURL}}}
  // allow generation of data (and use that as the default if no data exists). 
  // Include { orderURL: "../order/" } in that data
  // if the template exists at a different location (form) the url would need to be adjusted.
  // Maybe always set them relative to the root to simplify.
  // Also allow relative URLs for scope, for, etc.
  //  scope: "./availability/"
  //  These would not need to be data bound. They could be generated based on template location.
});
