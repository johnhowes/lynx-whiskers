var koa = require('koa');
var app = koa();

app.use(function *(){
  this.body = 'Hello World';
});

exports.serve = function (port) {
  return app.listen(port);
};
