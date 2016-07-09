var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
chai.use(chaiAsPromised);
var whiskers = require("../../");
var Handlebars = require("handlebars");

describe("dynamic lynx generation with handlebars", function () {
  
  var tests = [
    {
      description: "inline text template",
      source: "{{{message}}}",
      data: {
        message: "Hello, World!"
      },
      expected: {
        value: "Hello, World!",
        spec: {
          hints: [ "text" ]
        }
      }
    }, {
      description: "boolean literal template",
      source: {
        "~literal": "{{{isSomething}}}"
      },
      data: {
        isSomething: true
      },
      expected: {
        value: true,
        spec: {
          hints: [ "text" ]
        }
      }
    }, {
      description: "boolean literal property",
      source: {
        "isSomething~literal": "{{{isSomething}}}"
      },
      data: {
        isSomething: true
      },
      expected: {
        isSomething: true,
        spec: {
          hints: [ "container" ],
          children: [
              {
                name: "isSomething",
                hints: [ "text" ]
              }
          ]
        }
      }
    }, {
      description: "numeric literal",
      source: {
        "~literal": "{{{number}}}"
      },
      data: {
        number: 123.45
      },
      expected: {
        value: 123.45,
        spec: {
          hints: [ "text" ]
        }
      }
    }
    // }, {
    //   description: "section",
    //   source: {
    //     "~#name": "Hello, {{{.}}}"
    //   },
    //   data: {
    //     name: "Bill"
    //   },
    //   expected: {
    //     value: "Hello, Bill",
    //     spec: {
    //       hints: [ "text" ]
    //     }
    //   }
    // }
    // }, {
    //   description: "section inverse",
    //   source: {
    //     "~#name": "{{{.}}}",
    //     "~^name": null
    //   },
    //   data: {
    //     name: null
    //   },
    //   expected: {
    //     value: null,
    //     spec: {
    //       hints: [ "text" ]
    //     }
    //   }
    // }, {
    //   description: "section with a dynamic spec",
    //   source: {
    //     "~#name~hints=personal-greeting,greeting": "Hello, {{{.}}}!",
    //     "~^name~hint=greeting~inline": "Hello, friend!"
    //   },
    //   data: {
    //     name: "Bill"
    //   },
    //   expected: {
    //     value: "Hello, Bill!",
    //     spec: {
    //       hints: [ "personal-greeting", "greeting", "text" ]
    //     }
    //   }
    // }, {
    //   description: "section inverse overriding a default spec",
    //   source: {
    //     greeting: {
    //       "~#name~hints=personal-greeting,greeting": "Hello, {{{.}}}",
    //       "~^name~hint=greeting~inline": "Hello, friend!"
    //     }
    //   },
    //   data: {
    //     name: null
    //   },
    //   expected: {
    //     greeting: {
    //       value: "Hello, friend!",
    //       spec: {
    //         hints: [ "greeting", "text" ]
    //       }
    //     },
    //     spec: {
    //       hints: [ "container" ],
    //       children: [
    //         {
    //           name: "greeting",
    //           hints: [ "personal-greeting", "greeting", "text" ]
    //         }
    //       ]
    //     }
    //   }
    // }, {
    //   description: "section inverse using a default spec",
    //   source: {
    //     greeting: {
    //       "~#name~hints=greeting": "Hello, {{{.}}}",
    //       "~^name": "Hello, friend!"
    //     }
    //   },
    //   data: {
    //     name: null
    //   },
    //   expected: {
    //     greeting: "Hello, friend!",
    //     spec: {
    //       hints: [ "container" ],
    //       children: [
    //         {
    //           name: "greeting",
    //           hints: [ "greeting", "text" ]
    //         }
    //       ]
    //     }
    //   }
    // }, {
    //   description: "section object",
    //   source: {
    //     "~#people": {
    //       firstName: "{{{firstName}}}",
    //       lastName: "{{{lastName}}}"
    //     }
    //   },
    //   data: {
    //     people: {
    //       firstName: "Bill",
    //       lastName: "Murray"
    //     }
    //   },
    //   expected: {
    //     firstName: "Bill",
    //     lastName: "Murray",
    //     spec: {
    //       hints: [ "container" ],
    //       children: [
    //         {
    //           name: "firstName",
    //           hints: [ "text" ]
    //         }, {
    //           name: "lastName",
    //           hints: [ "text" ]
    //         }
    //       ]
    //     }
    //   }
    // }, {
    //   description: "section object with alternate template",
    //   source: {
    //     "~#people": {
    //       firstName: "{{{firstName}}}",
    //       lastName: "{{{lastName}}}"
    //     }, "~^people": {
    //       firstName: "None",
    //       lastName: "None"
    //     }
    //   },
    //   data: {
    //     people: null
    //   },
    //   expected: {
    //     firstName: "None",
    //     lastName: "None",
    //     spec: {
    //       hints: [ "container" ],
    //       children: [
    //         {
    //           name: "firstName",
    //           hints: [ "text" ]
    //         }, {
    //           name: "lastName",
    //           hints: [ "text" ]
    //         }
    //       ]
    //     }
    //   }
    // }
  ];
  
  tests.forEach(function (test) {
    it("should generate a " + test.description, function () {
      var whiskersTemplate = whiskers.parse(test.source);
      var handlebarsTemplate = whiskers.generators.handlebars(whiskersTemplate);
      // console.log(handlebarsTemplate);
      var output = Handlebars.compile(handlebarsTemplate)(test.data);
      // console.log(output);
      
      var lynx = JSON.parse(output);
      lynx.should.deep.equal(test.expected);
    });
  });
});
