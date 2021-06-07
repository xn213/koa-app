const getList = async ctx => {
  ctx.body = '路由改造后 get请求'
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
