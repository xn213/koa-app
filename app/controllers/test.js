const getList = async ctx => {
  const data = ''
  // next-line b is not defined 程序本身报错
  // const a = b

  // 业务中抛出失败
  ctx.utils.assert(data, ctx.utils.throwError(10001, '验证码失效'))
  ctx.body = '返回结果'
}

const postList = async ctx => {
  // const { method, url, body } = ctx.request
  // ctx.body = {
  //   method,
  //   url,
  //   body
  // }
  ctx.body = ctx.request.files
}

module.exports = {
  getList,
  postList
}
