const Koa = require("koa")

const app = new Koa()

const host = '0.0.0.0'
const port = '9000'

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(port, host, () => {
  console.log(`API server listening on ${host}:${port}`)
})
