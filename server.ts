/// <reference path="typings/main.d.ts" />

// # Node v6.2.0
// tsc -t ES6 --module 'commonjs' server.ts
// node server.js

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as r from 'rethinkdb';

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

async function obtenerPosts(ctx) {
  try {
    let con = await r.connect(config);
    let query = await r.db('blog').table('posts').orderBy(r.desc('fecha')).run(con);
    let posts = await query.toArray();    

    ctx.body = posts;
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      status: ctx.status,
      error: e.message
    }
  }
}

async function crearPost(ctx) {  
  try {    
    let { titulo, texto } = ctx.request.body;    
    let con = await r.connect(config);
        
    let post = await r.db('blog').table('posts').insert({
      titulo: titulo,
      fecha: r.now(),
      texto: texto
    }).run(con);
    
    ctx.body = {
      post_id: post.generated_keys[0] 
    }
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      status: ctx.status,
      error: e.message
    }
  }
}

app.listen(3000, () => console.log('Esperando en puerto 3000'));