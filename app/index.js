const Koa = require("koa")

const compose = require('koa-compose')
const MD = require('./middlewares/')


const app = new Koa()

const host = '0.0.0.0'
const port = '9000'

app.use(compose(MD))

app.listen(port, host, () => {
  console.log(`API server listening on ${host}:${port}`)
})
