var Koa = require('koa');
require("babel-polyfill");
const app = new Koa();
const whiskers = require("../../index.js");

const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
const url = require("url");
const YAML = require("yamljs");
require("babel-register");
const decache = require("decache");

app.use(async (ctx, next) => {
  var requestPath = url.parse(ctx.request.url).pathname;
  const directory = ctx.directory = path.join(process.cwd(), requestPath);
  
  ctx.read = async file => {
    return await new Promise((resolve, reject) => {
      fs.readFile(path.join(directory, file), (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };
  
  ctx.readData = async file => {
    var content = await ctx.read(path.join("~state", file));
    return YAML.parse(content.toString());
  };
  
  await next();
});

app.use(async (ctx, next) => {
  ctx.type = "application/lynx+json";
  
  var state = ctx.query.state ? ctx.query.state + ".js" : "default.js";
  var stateModule = path.join(ctx.directory, "~state", state);
  var data;
  try {
    data = await require(stateModule)(ctx);
  } catch (e) {
    data = {};
  }
  decache(stateModule);
  
  var templateData = await ctx.read(ctx.template || "index.whiskers");
  var whiskersTemplate = whiskers.parse(YAML.parse(templateData.toString()), {
    location: path.join(ctx.directory, ctx.template || "index.whiskers")
  });
  var handlebarsTemplate = whiskers.generators.handlebars(whiskersTemplate);
  
  ctx.body = Handlebars.compile(handlebarsTemplate)(data);
  
  await next();
});

exports.serve = function (port) {
  return app.listen(port);
};
