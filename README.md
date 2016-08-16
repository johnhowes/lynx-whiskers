Lynx Whiskers
=======================================================

Lynx Whiskers is a template language for writing [lynx](./lynx-spec.pdf) 
documents. Whiskers templates are [YAML](http://yaml.org/) documents that 
compile to [Handlebars](http://handlebarsjs.com/) templates, so they're 
supported on every platform that supports Handlebars.

Installation
------------------------------------------------------

To install the `whiskers` command-line tool:

```
npm install -g lynx-whiskers
```

To install locally:

```
npm install lynx-whiskers --save-dev
```

Templates
-----------------------------------------------------

### Hello, World!

This is a simple text document.

```YAML
Hello, World!
```

The result:

```JSON
{
  "value": "Hello, World!",
  "spec": {
    "hints": [ "text" ]
  }
}
```

We know that this is a text value because it's a string, but that's about all we
know. To describe it, we use a whisker. Whiskers begin with a `~` and provide
a shorthand notation for describing any lynx value.

### Hints

There are a few ways to describe a value with hints. The most basic is by
inference:

```YAML
Hello, World!
```

> Here a `text` hint is inferred based on the fact that the value is a string.
>
> In general, `text`, `container`, `link`, `submit`, and `content` hints can be
> inferred based on value and need not be specified.

Hints may also be added with a shorthand whisker:

```YAML
# With a single hint:
~hint=label: Hello, World!
```

```YAML
# With a list of hints:
~hints=label,text: Hello, World!
```

```YAML
# With a shorthand whisker name:
~label: Hello, World!
```

All three of these examples result in identical output:

```JSON
{
  "value": "Hello, World!",
  "spec": {
    "hints": [ "label", "text" ]
  }
}
```

#### Hint Inference

##### Text

A string, number, `true`, `false`, or `null` value implies a `text` hint:

```YAML
true
```

The result:

```JSON
{
  "value": true,
  "spec": {
    "hints": [ "text" ]
  }
}
```

##### Container

Unless another base hint is specified or inferred, an object or array value 
implies a `container` hint:

```YAML
message: "Hello, World!"
```

The result:

```JSON
{
  "message": "Hello, World!",
  "spec": {
    "hints": [ "container" ],
    "children": [
      {
        "name": "message",
        "hints": [ "text" ]
      }
    ]
  }
}
```

##### Link

A value with an `href` property implies a `link` hint:

```YAML
href: http://example.com
```

The result:

```JSON
{
  "href": "http://example.com",
  "spec": {
    "hints": [ "link" ]
  }
}
```

##### Submit

A value with an `action` property implies a `submit` hint:

```YAML
action: http://example.com
```

The result:

```JSON
{
  "action": "http://example.com",
  "spec": {
    "hints": [ "submit" ]
  }
}
```

##### Content

A value with an `src` or `data` property implies a `content` hint:

```YAML
src: http://example.com
```

The result:

```JSON
{
  "src": "http://example.com",
  "spec": {
    "hints": [ "content" ]
  }
}
```

##### Shorthand for Common Hints

Other common lynx hints may be specified with shorthand whisker names:

```YAML
~image: # This is the equivalent of ~hint=image
  src: "http://example.com/logo.svg",
  width: 300,
  height: 50
```

The result:

```JSON
{
  "src": "http://example.com/logo.svg",
  "width": 300,
  "height": 50,
  "spec": {
    "hints": [ "image", "content" ]
  }
}
```

> The following hints have shorthand names: `text`, `container`, `link`, 
> `submit`, `content`, `image`, `form`, `section`, `complement`, `marker`, 
> `card`, `header`, `label`, and `line`.

### Properties

Properties can be described by whiskers:

```YAML
message:
  ~hint=greeting: Hello, World!
```

Or you can just append the whisker to the property name like this:

```YAML
message~hint=greeting: Hello, World!
```

The result, in either case:

```JSON
{
  "message": "Hello, World!",
  "spec": {
    "hints": [ "container" ],
    "children": [
      {
        "name": "message",
        "hints": [ "greeting", "text" ]
      }
    ]
  }
}
```

#### Data Properties

Describe a data property (a property with no lynx specification)
with the `~data` whisker:

```YAML
id~data: 1
label~label: A Thing
```

The result:

```JSON
{
  "id": 1,
  "label": "A Thing",
  "spec": {
    "hints": [ "container"],
    "children": [
      {
        "name": "label",
        "hints": [ "label", "text" ]
      }
    ]
  }
}
```

Well-known properties defined by the lynx specification as data properties 
are treated as such by convention.

These links are equivalent:

```YAML
href: http://example.com
type: application/lynx+json
```

```YAML
href~data: http://example.com
type~data: application/lynx+json
```
  
As are these submits:

```YAML
action: http://example.com
method: POST
```

```YAML
action~data: http://example.com
method~data: POST
```
  
As are these images:

```YAML
~image:
  src: http://example.com
  width: 100
  height: 100
  type: image/jpeg
```

```YAML
~image:
  src~data: http://example.com
  width~data: 100
  height~data: 100
  type~data: image/jpeg
```

As are these markers:

```YAML
~marker:
  for: "http://example.com/place-to-be/"
```

```YAML
~marker:
  for~data: "http://example.com/place-to-be/"
```

##### ~data=false

If you need to specify a normally unspecified property, you can use ~data=false:

```YAML
~image:
  src~data=false: "http://example.com",
  width: 100,
  height: 100
```

### Array Values

Array values can be described by whiskers as well:

```YAML
- ~hint=color: Red
- Green
- Blue
```

> Since all the values share the same spec, the hint need only be added to the
> first item. If all the values do not share the same `spec`, all but one spec
> needs to be marked `~inline` as described below.

The result:

```JSON
{
  "value": [ "Red", "Green", "Blue" ],
  "spec": {
    "hints": [ "container" ],
    "children": {
      "hints": [ "color", "text" ]
    }
  }
}
```

### Input

Describe an `input` value with the `~input` whisker:

```YAML
~form:
  firstName~line~input: ""
```

> This can also be expressed as `~input=true` or `~input=firstName`.

The result:

```JSON
{
  "firstName": "",
  "spec": {
    "hints": [ "form" ],
    "children": [
      {
        "name": "firstName",
        "hints": [ "line", "text" ],
        "input": true
      }
    ]
  }
}
```

### Visibility

Describe visibility with the `~visibility` whisker:

```YAML
~visibility=hidden: "hidden value"
```

Or with shorthand:

```YAML
~hidden: "hidden value"
```

```YAML
~concealed: "secret"
```

### Emphasis

Describe emphasis with the `~emphasis` whisker:

```YAML
~emphasis=3: "This is Important!"
```

Or with the shorthand values `~em` and `~strong`:

```YAML
~em: "This is slightly emphatic"
```

```YAML
~strong: "This is very emphatic"
```

> `~em` maps to `~emphasis=1` and `~strong` maps to `~emphasis=2`.

### Options

Reference input options with the `~options` and `~option` whiskers:

```YAML
~form:
  color~input~hidden~hint=color~options=colorOptions: "#FF0000"
  colorOptions:
    - ~option:
      label: Red
      code~hint=color: "#FF0000"
    - label: Green
      code: "#00FF00"
    - label: Blue
      code: "#0000FF"
```

### Labels

Reference a label with the `~labeledBy` whisker:

```YAML
firstNameLabel~label: First Name
firstName~input~labeledBy=firstNameLabel: Bob
```

The result:

```JSON
{
  "firstNameLabel": "First Name",
  "firstName": "Bob",
  "spec": {
    "hints": [ "container" ],
    "children": [
      {
        "name": "firstNameLabel",
        "hints": [ "label", "text" ]
      },
      {
        "name": "firstName",
        "hints": [ "text" ],
        "input": true,
        "labeledBy": "firstNameLabel"
      }
    ]
  }
}
```

### Follow

Describe an auto-follow link with the `~follow` whisker:

```YAML
~follow:
  href: http://example.com
```

> This is the same as `~follow=0`. You can specify any number of milliseconds 
> like this: `~follow=1000`.

### Spec Longhand

Specs can also be expressed longhand:

```YAML
~form:
  firstName:
    value: ""
    spec:
      input: true
      validation:
        required:
          invalid: firstNameRequiredMessage
  firstNameRequiredMessage: "Please provide a first name."
```

Or you can use a mix of longhand and shorthand:

```YAML
~form:
  firstName~input~line:
    value: ""
    spec:
      validation:
        required: 
          invalid: firstNameRequiredMessage
  firstNameRequiredMessage: "Please provide a first name."
```

In either case, the result:

```JSON
{
  "firstName": "",
  "spec": {
    "hints": [ "form" ],
    "children": [
      {
        "name": "firstName",
        "spec": {
          "hints": [ "text" ],
          "input": true,
          "validation": {
            "required": {
              "invalid": "firstNameRequiredMessage"
            }
          }
        }
      }, {
        "name": "firstNameRequiredMessage",
        "hints": [ "text" ]
      }
    ]
  }
}
```

### Inline Specs

In many cases, a single lynx `spec` can describe an entire document, can be referenced 
by URL, and can even be cached indefinitely. But in some cases (when the spec itself is
dynamic, or when the items in an array are described by different specs), 
a value must be marked with the `~inline` whisker to include its `spec` inline.

#### Mixed Arrays

```YAML
~:
  - ~header~inline: Colors
  - ~hint=color: Red
  - Green
  - Blue
```

The result:

```JSON
{
  "value": [
    {
      "value": "Colors",
      "spec": {
        "hints": [ "header", "label", "text" ]
      }
    },
    "Red",
    "Green",
    "Blue"
  ],
  "spec": {
    "hints": [ "container" ],
    "children": {
      "hints": [ "color", "text" ]
    }
  }
}
```

### Handlebars

#### Hello, {{{name}}}

Whiskers templates can use simple inline Handlebars expressions:

The template:

```YAML
"Hello, {{{name}}}"
```

The data:

```YAML
name: Bob
```

The result:

```JSON
{
  "value": "Hello, Bob",
  "spec": {
    "hints": [ "text" ]
  }
}
```

#### Literals

To generate a boolean or numeric literal value (without quotes), use the `~literal` whisker.

The template:

```YAML
~literal: "{{{isSomething}}}"
```

The data:

```YAML
isSomething: true
```

The result:

```JSON
{
  "value": true,
  "spec": {
    "hints": [ "text" ]
  }
}
```

#### Sections and Inverted Sections

The whiskers Handlebars generator provides support for 
sections and inverted sections.

The template:

```YAML
~#name: "Hello, {{{.}}}"
~^name: "Hello, World!"
```

The data:

```YAML
name: null
```

The result:

```JSON
{
  "value": "Hello, World!",
  "spec": {
    "hints": [ "text" ]
  }
}
```

#### Array Sections

You can iterate over array data using a section and an `~array` whisker:

```YAML
- ~header~inline: "People"
- ~#people~array: 
    firstName: "{{{firstName}}}"
    lastName: "{{{lastName}}}"
```

The data:

```YAML
people:
  - firstName: Bob
    lastName: Smith
  - firstName: Jim
    lastName: Smith
```

The result:

```JSON
{
  "value": [
    {
      "value": "People",
      "spec": {
        "hints": [ "header", "label", "text" ]
      }
    },
    {
      "firstName": "Bob",
      "lastName": "Smith"
    },
    {
      "firstName": "Jim",
      "lastName": "Smith"
    }
  ],
  "spec": {
    "hints": [ "container" ],
    "children": {
      "hints": [ "container" ],
      "children": [
        {
          "name": "firstName",
          "hints": [ "text" ]
        },
        {
          "name": "lastName",
          "hints": [ "text" ]
        }
      ]
    }
  }
}
```

### Partial Templates

The following template references the `input-group` partial:

```YAML
~form~labeledBy=header:
  header~header~label: Edit User Information
  firstNameGroup~include=input-group:
    label: First Name
    name: firstName
  middleNameGroup~include=input-group:
    label: Middle Name
    name: middleName
  lastNameGroup~include=input-group:
    label: Last Name
    name: lastName
```

The `label` and `name` values are parameters passed to the partial. In the
partial template, these parameters are identified with a `~~` prefix and will
be replaced with the parameter values.

```YAML
# ~partials/~input-group.whiskers
~#~~name~section~labeledBy=label:
  label~header~label: ~~label
  ~~name: 
    value: "{{{value}}}"
    spec:
      validation:
        required~#required:
          invalid: requiredInvalidMessage
        text~#constraints:
          minLength~#minLength: "{{{minLength}}}"
          maxLength~#maxLength: "{{{maxLength}}}"
          pattern~#pattern: "{{{pattern}}}"
          format~#format: "{{{format}}}"
          invalid: textInvalidMessage
  requiredInvalidMessage~#required: Required
  textInvalidMessage~#constraints: Invalid
```

The result:

```YAML
~form~labeledBy=header:
  header~header~label: Edit User Information
  firstNameGroup~#firstName~section~labeledBy=label:
    label~header~label: First Name
    firstName: 
      value: "{{{value}}}"
      spec:
        validation:
          required~#required:
            invalid: requiredInvalidMessage
          text~#constraints:
            minLength~#minLength: "{{{minLength}}}"
            maxLength~#maxLength: "{{{maxLength}}}"
            pattern~#pattern: "{{{pattern}}}"
            format~#format: "{{{format}}}"
            invalid: textInvalidMessage
    requiredInvalidMessage~#required: Required
    textInvalidMessage~#constraints: Invalid
  middleNameGroup~#middleName~section~labeledBy=label:
    label~header~label: Middle Name
    middleName: 
      value: "{{{value}}}"
      spec:
        validation:
          required~#required:
            invalid: requiredInvalidMessage
          text~#constraints:
            minLength~#minLength: "{{{minLength}}}"
            maxLength~#maxLength: "{{{maxLength}}}"
            pattern~#pattern: "{{{pattern}}}"
            format~#format: "{{{format}}}"
            invalid: textInvalidMessage
    requiredInvalidMessage~#required: Required
    textInvalidMessage~#constraints: Invalid
  lastNameGroup~#lastName~section~labeledBy=label:
    label~header~label: Last Name
    lastName: 
      value: "{{{value}}}"
      spec:
        validation:
          required~#required:
            invalid: requiredInvalidMessage
          text~#constraints:
            minLength~#minLength: "{{{minLength}}}"
            maxLength~#maxLength: "{{{maxLength}}}"
            pattern~#pattern: "{{{pattern}}}"
            format~#format: "{{{format}}}"
            invalid: textInvalidMessage
    requiredInvalidMessage~#required: Required
    textInvalidMessage~#constraints: Invalid
```

#### Partial Naming and Location

Partial files have a `~` prefix and live in a `~partials` folder anywhere in the 
app file system. Referenced by name, they're found in the 
nearest `~partials` folder (starting in the referencing template directory 
and searching all ancestors until a match is found).

> In the previous example, we would have searched through the template's ancestor 
> tree looking for the file `~partials/~input-group.whiskers`.

#### Partials as Layouts

Partial templates can also be used for document layout. The following partial 
includes three zones: a banner, a main content zone, and a footer.

```YAML
# /~partials/~site-layout.whiskers
banner~zone: Lynx Whiskers
main~zone: null
footer~zone: Copyright © John Howes, 2016
```

The following template includes the `site-layout` and replaces its `main`
zone, leaving the default banner and footer intact.

```YAML
~include=site-layout:
  main~section: 
    header~header~label: Welcome
```

The result:

```YAML
banner: Lynx Whiskers
main~section: 
  header~header~label: Welcome
footer: Copyright © John Howes, 2016
```
