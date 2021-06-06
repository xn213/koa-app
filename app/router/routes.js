const { test } = require('../controllers')

const routes = [
  {
    // 测试
    method: 'get',
    path: '/a',
    controller: test.getList
  },
  {
    method: 'post',
    path: '/post',
    controller: test.postList
  }
]

module.exports = routes
