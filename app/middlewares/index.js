const koaBody = require('koa-bodyparser')

const router = require('../router')

// 参数解析 koajs/bodyparser
const mdKoaBody = koaBody({
  enableTypes: ['json', 'form', 'text', 'xml'],
  formLimit: '56kb',
  jsonLimit: '1mb',
  textLimit: '1mb',
  xmlLimit: '1mb',
  strict: true
})

// 路由处理
const mdRoute = router.routes()
const mdRouterAllowed = router.allowedMethods()

module.exports = [
  mdKoaBody,
  mdRoute,
  mdRouterAllowed
]
