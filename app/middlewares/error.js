const error = () => {
  return async (ctx, next) => {
    try {
      await next()
      if (ctx.status === 200) {
        ctx.res.success()
      }
    } catch (err) {
      if (err.code) {
        // 主动抛出错误
        ctx.res.fail({
          code: err.code,
          msg: err.message
        })
      } else {
        // 运行时错误
        ctx.app.emit('error', err, ctx)
      }
    }
  }
}

module.exports = error
