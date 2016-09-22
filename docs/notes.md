Getting Started with Whiskers
====================================

```bash
$ mkdir my-app && cd my-app

$ echo 'Hello, World!' > default.whiskers

$ whiskers serve --port 3000
> Whiskers is waiting on port 3000...
```

```YAML
Hello, {{{name}}}!
```

```bash
$ whiskers state -d ./default.whiskers
$ whiskers state ./result
```

This will generate a data file based on the template values defined in `./default.whiskers` and a corresponding handler in the root ~states folder:

```YAML
name: Lorem ipsum dolor sit amet
```

```js
module.exports = async ctx => {
  ctx.template = "./default.whiskers";
  ctx.data = await ctx.readData("default.yml");
};
```
