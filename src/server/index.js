var Koa = require('koa');
require("babel-polyfill");
const app = new Koa();
const whiskers = require("../../index.js");

const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
const url = require("url");
const YAML = require("yamljs");
require("babel-register")({
  "presets": [ 
    "es2015"
  ],
  "plugins": [
    "transform-async-to-generator"
  ]
});
const decache = require("decache");
const util = require("util");

const readFile = async filePath => {
  return await new Promise((resolve, reject) => {
    fs.readFile(path.join(process.cwd(), filePath), (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

app.use(async (ctx, next) => {
  var requestPath = url.parse(ctx.request.url).pathname;
  const directory = ctx.directory = requestPath;
  
  ctx.read = async file => {
    return await readFile(path.join(directory, file));
  };
  
  ctx.readData = async file => {
    var content = await ctx.read(path.join("~state", file));
    return YAML.parse(content.toString());
  };
  
  await next();
});

app.use(async (ctx, next) => {
  try {
    var config = await readFile(".whiskers");
    ctx.settings = YAML.parse(config.toString());
  } catch(e) {
    console.error(e);
    ctx.settings = {};
  }
  
  await next();
});

app.use(async (ctx, next) => {
  ctx.type = "application/lynx+json";
  
  var templateData = await ctx.read(ctx.template || "default.whiskers");
  var whiskersTemplate = whiskers.parse(YAML.parse(templateData.toString()), {
    location: path.join(ctx.directory, ctx.template || "default.whiskers"),
    rootRealm: ctx.settings.realm
  });
  var handlebarsTemplate = whiskers.generators.handlebars(whiskersTemplate);
  
  var state = ctx.query.state ? ctx.query.state + ".js" : "default.js";
  var stateModule = path.join(process.cwd(), ctx.directory, "~state", state);
  console.log(stateModule);
  var data;
  try {
    data = await require(stateModule)(ctx);
    console.log("Data", data);
  } catch (e) {
    data = whiskers.generators.state(whiskersTemplate);
    console.error(e);
    console.log("Default data", data);
  }
  decache(stateModule);
  
  var lynx = JSON.parse(Handlebars.compile(handlebarsTemplate)(data));
  ctx.body = JSON.stringify(lynx);
  
  await next();
});

exports.serve = function (port) {
  return app.listen(port || 0);
};
