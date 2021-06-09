const koaBody = require('koa-bodyparser')
const cors = require('@koa/cors')

// 跨域处理 @koa/cors
const mdCors = cors({
  origin: '*',
  credentials: true,
  allowMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH']
})

const router = require('../router')
const formidable = require('./formidable')
const response = require('./response')
const error = require('./error')
const log = require('./log')

const mdFormidable = formidable()
// 参数解析 koajs/bodyparser
const mdKoaBody = koaBody({
  enableTypes: ['json', 'form', 'text', 'xml'],
  formLimit: '56kb',
  jsonLimit: '1mb',
  textLimit: '1mb',
  xmlLimit: '1mb',
  strict: true
})

const mdResHandler = response()
const mdErrHandler = error()
const mdLogger = log()

// 路由处理
const mdRoute = router.routes()
const mdRouterAllowed = router.allowedMethods()

module.exports = [
  mdFormidable,
  mdKoaBody,
  mdCors,
  mdLogger,
  mdResHandler,
  mdErrHandler,
  mdRoute,
  mdRouterAllowed
]
