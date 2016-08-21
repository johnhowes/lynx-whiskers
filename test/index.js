require("./hints");
require("./properties");
require("./arrays");
require("./shorthand-spec-properties");
require("./build-spec");
require("./data-properties");
require("./templates");
require("./handlebars");
require("./partials");

describe("TODO", function () {
  it("should decide what to do about turning hint inference off");
  it("should be sure a null inverse is the default for handlebars sections");
  it("should describe markdown shorthand");
  it("should allow templated property names");
  it("should allow easy creation of container inputs");
  it("should describe emphasis");
  it("should make it easy to pull a partial into a data uri to optimize links");
  it("should allow me to specify another template based on a state (e.g. the form on 400 error)");
  it("should describe the server");
  it("should parse index.whiskers when there are no state docs");
  // Let the state drive the template selection rather than vice-versa
  // folder ~states
    // ~states/default.yml
    //    .template: "default" (optional)
    //    .template: "../default" (form at another level)
});
