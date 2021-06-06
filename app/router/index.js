const koaRouter = require('koa-router')

const router = new koaRouter()

router.get('/a', ctx => {
  ctx.body = 'router /a'
})
router.get('/b', ctx => {
  ctx.body = 'router /b'
})
router.get('/c', ctx => {
  ctx.body = 'router /c'
})

module.exports = router
