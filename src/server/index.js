var Koa = require('koa');
require("babel-polyfill");
const app = new Koa();
const whiskers = require("../../index.js");
const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
const YAML = require("yamljs");

app.use(async (ctx) => {
  ctx.type = "application/lynx+json";
  
  var index = path.join(process.cwd(), "index.whiskers");
  
  var data = await new Promise((resolve, reject) => {
    fs.readFile(index, function (err, data) {
      if (err) return reject(err);
      else resolve(data);
    });
  });
  
  var whiskersTemplate = whiskers.parse(YAML.parse(data.toString()));
  var handlebarsTemplate = whiskers.generators.handlebars(whiskersTemplate);
  ctx.body = Handlebars.compile(handlebarsTemplate)({});
});

exports.serve = function (port) {
  return app.listen(port);
};
