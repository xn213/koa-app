const Koa = require("koa")

const router = require('./router')

const app = new Koa()

const host = '0.0.0.0'
const port = '9000'

app.use(router.routes())

// 原来当路由存在，请求方式不匹配时， 会报 404
// 加上如下中间件，会报请求方式不被允许
app.use(router.allowedMethods())

app.listen(port, host, () => {
  console.log(`API server listening on ${host}:${port}`)
})
