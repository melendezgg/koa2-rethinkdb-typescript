/// <reference path="typings/main.d.ts" />
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments)).next());
  });
};
// # Node v6.2.0
// tsc -t ES6 --module 'commonjs' server.ts
// node server.js
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const r = require('rethinkdb');
const config = {
  host: 'localhost',
  port: 28015
};
const app = new Koa();
app.use(bodyParser());
const router = new Router();
router.get('/posts', obtenerPosts);
router.post('/posts', crearPost);
app.use(router.routes());
function obtenerPosts(ctx) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      let con = yield r.connect(config);
      let query = yield r.db('blog').table('posts').orderBy(r.desc('fecha')).run(con);
      let posts = yield query.toArray();
      ctx.body = posts;
    }
    catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: ctx.status,
        error: e.message
      };
    }
  });
}
function crearPost(ctx) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      let { titulo, texto } = ctx.request.body;
      let con = yield r.connect(config);
      let post = yield r.db('blog').table('posts').insert({
        titulo: titulo,
        fecha: r.now(),
        texto: texto
      }).run(con);
      ctx.body = {
        post_id: post.generated_keys[0]
      };
    }
    catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: ctx.status,
        error: e.message
      };
    }
  });
}
app.listen(3000, () => console.log('Esperando en puerto 3000'));
