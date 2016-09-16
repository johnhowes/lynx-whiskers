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
    }, {
      description: "section",
      source: {
        "~#name": "Hello, {{{.}}}"
      },
      data: {
        name: "Bill"
      },
      expected: {
        value: "Hello, Bill",
        spec: {
          hints: [ "text" ]
        }
      }
    }, {
      description: "section inverse",
      source: {
        "~#name": "{{{.}}}",
        "~^name": null
      },
      data: {
        name: null
      },
      expected: {
        value: null,
        spec: {
          hints: [ "text" ]
        }
      }
    }, {
      description: "section with a default spec",
      source: {
        greeting: {
          "~#name~hints=personal-greeting,greeting": "Hello, {{{.}}}!",
          "~^name~hint=greeting~inline": "Hello, friend!"
        }
      },
      data: {
        name: "Bill"
      },
      expected: {
        greeting: "Hello, Bill!",
        spec: {
          hints: [ "container" ],
          children: [
            {
              name: "greeting",
              hints: [ "personal-greeting", "greeting", "text" ]
            }
          ]
        }
      }
    }, {
      description: "section inverse overriding a default spec",
      source: {
        greeting: {
          "~#name~hints=personal-greeting,greeting": "Hello, {{{.}}}!",
          "~^name~hint=greeting~inline": "Hello, friend!"
        }
      },
      data: {
        name: null
      },
      expected: {
        greeting: {
          value: "Hello, friend!",
          spec: {
            hints: [ "greeting", "text" ]
          }
        },
        spec: {
          hints: [ "container" ],
          children: [
            {
              name: "greeting",
              hints: [ "personal-greeting", "greeting", "text" ]
            }
          ]
        }
      }
    }, {
      description: "section inverse using a default spec",
      source: {
        greeting: {
          "~#name~hints=greeting": "Hello, {{{.}}}",
          "~^name": "Hello, friend!"
        }
      },
      data: {
        name: null
      },
      expected: {
        greeting: "Hello, friend!",
        spec: {
          hints: [ "container" ],
          children: [
            {
              name: "greeting",
              hints: [ "greeting", "text" ]
            }
          ]
        }
      }
    }, {
      description: "section object",
      source: {
        "~#people": {
          firstName: "{{{firstName}}}",
          lastName: "{{{lastName}}}"
        }
      },
      data: {
        people: {
          firstName: "Bill",
          lastName: "Murray"
        }
      },
      expected: {
        firstName: "Bill",
        lastName: "Murray",
        spec: {
          hints: [ "container" ],
          children: [
            {
              name: "firstName",
              hints: [ "text" ]
            }, {
              name: "lastName",
              hints: [ "text" ]
            }
          ]
        }
      }
    }, {
      description: "section object with an inverse",
      source: {
        "~#people": {
          firstName: "{{{firstName}}}",
          lastName: "{{{lastName}}}"
        }, "~^people": {
          firstName: "None",
          lastName: "None"
        }
      },
      data: {
        people: null
      },
      expected: {
        firstName: "None",
        lastName: "None",
        spec: {
          hints: [ "container" ],
          children: [
            {
              name: "firstName",
              hints: [ "text" ]
            }, {
              name: "lastName",
              hints: [ "text" ]
            }
          ]
        }
      }
    }, {
      description: "section object with a null inverse",
      source: {
        "~#people": {
          firstName: "{{{firstName}}}",
          lastName: "{{{lastName}}}"
        }, "~^people": null
      },
      data: {
        people: null
      },
      expected: {
        value: null,
        spec: {
          hints: [ "container" ],
          children: [
            {
              name: "firstName",
              hints: [ "text" ]
            }, {
              name: "lastName",
              hints: [ "text" ]
            }
          ]
        }
      }
    }, {
      description: "section object with an implicit null inverse",
      source: {
        "~#people": {
          firstName: "{{{firstName}}}",
          lastName: "{{{lastName}}}"
        }
      },
      data: {
        people: null
      },
      expected: {
        value: null,
        spec: {
          hints: [ "container" ],
          children: [
            {
              name: "firstName",
              hints: [ "text" ]
            }, {
              name: "lastName",
              hints: [ "text" ]
            }
          ]
        }
      }
    }, {
      description: "inline section object with an inline inverse",
      source: {
        "~#people~inline": {
          firstName: "{{{firstName}}}",
          lastName: "{{{lastName}}}"
        }, "~^people~inline": "Person not found!"
      },
      data: {
        people: null
      },
      expected: {
        value: "Person not found!",
        spec: {
          hints: [ "text" ]
        }
      }
    }, {
      description: "section: array of objects",
      source: [
        {
          "~#people~array": {
            firstName: "{{{firstName}}}",
            lastName: "{{{lastName}}}"
          }
        }
      ],
      data: {
        people: [
          {
            firstName: "Bill",
            lastName: "Murray"
          }, {
            firstName: "Chubby",
            lastName: "Checker"
          }
        ]
      },
      expected: {
        value: [
          {
            firstName: "Bill",
            lastName: "Murray"
          },
          {
            firstName: "Chubby",
            lastName: "Checker"
          }
        ],
        spec: {
          hints: [ "container" ],
          children: {
            hints: [ "container" ],
            children: [
              {
                name: "firstName",
                hints: [ "text" ]
              }, {
                name: "lastName",
                hints: [ "text" ]
              }
            ]
          }
        }
      }
    }, {
      description: "section: array of text",
      source: [
        {
          "~#people~array": "{{{firstName}}}"
        }
      ],
      data: {
        people: [
          {
            firstName: "Bill",
            lastName: "Murray"
          }, {
            firstName: "Chubby",
            lastName: "Checker"
          }
        ]
      },
      expected: {
        value: [ "Bill", "Chubby" ],
        spec: {
          hints: [ "container" ],
          children: {
            hints: [ "text" ]
          }
        }
      }
    }, {
      description: "section: array of array",
      source: [
        {
          "~#people~array": [
            "{{{firstName}}}",
            "{{{lastName}}}"
          ]
        }
      ],
      data: {
        people: [
          {
            firstName: "Bill",
            lastName: "Murray"
          }, {
            firstName: "Chubby",
            lastName: "Checker"
          }
        ]
      },
      expected: {
        value: [
          [ "Bill", "Murray" ],
          [ "Chubby", "Checker" ]
        ],
        spec: {
          hints: [ "container" ],
          children: {
            hints: [ "container" ],
            children: {
              hints: [ "text" ]
            }
          }
        }
      }
    }, {
      description: "section: inline array of text",
      source: [
        {
          "~#people~array~inline": "{{{firstName}}}"
        }
      ],
      data: {
        people: [
          {
            firstName: "Bill",
            lastName: "Murray"
          }, {
            firstName: "Chubby",
            lastName: "Checker"
          }
        ]
      },
      expected: {
        value: [
          {
            value: "Bill",
            spec: { hints: ["text"] }
          },
          {
            value: "Chubby",
            spec: { hints: ["text"] }
          }
        ],
        spec: {
          hints: [ "container" ]
        }
      }
    }, {
      description: "section: inline array of object",
      source: [
        {
          "~#people~array~inline": {
            firstName: "{{{firstName}}}",
            lastName: "{{{lastName}}}"
          }
        }
      ],
      data: {
        people: [
          {
            firstName: "Bill",
            lastName: "Murray"
          }, {
            firstName: "Chubby",
            lastName: "Checker"
          }
        ]
      },
      expected: {
        value: [
          {
            firstName: "Bill",
            lastName: "Murray",
            spec: { 
              hints: ["container"],
              children: [
                {
                  name: "firstName",
                  hints: [ "text" ]
                }, {
                  name: "lastName",
                  hints: [ "text" ]
                }
              ]
            }
          }, {
            firstName: "Chubby",
            lastName: "Checker",
            spec: { 
              hints: ["container"],
              children: [
                {
                  name: "firstName",
                  hints: [ "text" ]
                }, {
                  name: "lastName",
                  hints: [ "text" ]
                }
              ]
            }
          }
        ],
        spec: {
          hints: [ "container" ]
        }
      }
    }
  ];
  
  tests.forEach(function (test) {
    it("should generate a " + test.description, function () {
      var whiskersTemplate = whiskers.parse(test.source);
      var handlebarsTemplate = whiskers.generators.handlebars(whiskersTemplate);
      var output = Handlebars.compile(handlebarsTemplate)(test.data);
      var lynx = JSON.parse(output);
      lynx.should.deep.equal(test.expected);
    });
  });
  
  it("should convert static relative URLs to handlebars expressions", function () {
    var source = {
      context: "../order",
      link: {
        href: "../order/line"
      },
      submit: {
        action: "../../orders"
      },
      content: {
        src: "../productImage.png"
      }
    };
    
    var data = {
      orderURL: "/orders/order/1/",
      orderLineURL: "/orders/order/1/line/2/",
      ordersURL: "/orders/",
      productImageURL: "/images/product-12345.png"
    };
    
    var whiskersTemplate = whiskers.parse(source);
    var handlebarsTemplate = whiskers.generators.handlebars(whiskersTemplate);
    var output = Handlebars.compile(handlebarsTemplate)(data);
    var lynx = JSON.parse(output);
    lynx.context.should.equal(data.orderURL);
    lynx.link.href.should.equal(data.orderLineURL);
    lynx.submit.action.should.equal(data.ordersURL);
    lynx.content.src.should.equal(data.productImageURL);
  });
});
