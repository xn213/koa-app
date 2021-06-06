const { test } = require('../controllers')

const routes = [
  {
    // 测试
    method: 'get',
    path: '/a',
    controller: test.list
  }
]

module.exports = routes
