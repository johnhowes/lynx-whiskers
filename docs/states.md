Lynx Whiskers States
===========================

Design Goals
---------------------------

1. Each folder maps to a single URL/method.
1. Agnostic about how urls are bound to the template.
1. Agnostic about folder structure.
1. The following information should be easily extracted:
  - Route
  - HTTP Method
  - Sample Data by Scenario
  - HTTP Status by Scenario
  - Human Readable Feature Name
  - Human Readable Scenario/State Name
  - Trello Integration
    - Generate card
    - Generate checklist from scenarios
  
```
~post
  ~default.yml
  default.js
  invalid-first-name.js
```

```js

module.exports = function invalidFirstName(ctx) {
  require(".default.js")(ctx);
  ctx.name = "Invalid First Name";
  
  ctx.state.firstName.value = "";
  
  ctx.status = 400;
}

```

OR

```yaml
~name: Invalid First Name
~template: ../index
~include: ./default.yml
firstName:
  value: ""
  state: invalid
```

Example Card output

Add User
===================================

```yaml
Method: POST
Route: /users
```

## Success

```yaml
status: 201
```

## Invalid First Name

```yaml
status: 400
```

Data:

```yaml
firstName:
  value: ""
  state: invalid
```
