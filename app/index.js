const Koa = require("koa")

const compose = require('koa-compose')
const MD = require('./middlewares/')
const config = require('./config')
const utils = require('./utils')

const app = new Koa()

const host = '0.0.0.0'
const port = '9000'

app.context.config = config
app.context.utils = utils

// console.log(app.context.config.tempFilePath) //?! D:\koa\koa-app/app/public/temp
// console.log(app.context.utils.testUtils()) // test utils string

app.use(compose(MD))

app.on('error', (err, ctx) => {
  if(ctx) {
    ctx.body = {
      code: 9999,
      message: `程序运行时错误： ${err.message}`
    }
  }
})

app.listen(port, host, () => {
  console.log(`API server listening on ${host}:${port}`)
})
