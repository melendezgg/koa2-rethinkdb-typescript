Koa 2.0, TypeScript y RethinkDB (async/await)

```
# Node v6.2.0
tsc -t ES6 --module 'commonjs' server.ts
node server.js
```

Actualización a typings v1.0.4

En typings.json ambientDependencies -> globalDependencies.
https://github.com/typings/typings#updating-from-0x-to-10

```
typings install dt~koa dt~koa-bodyparser dt~koa-router dt~node dt~rethinkdb --global --save
```