# koa-app koa 实战总结

## 1. 初始化项目 启动服务

```sh
mkdir koa-app
npm init -y
git init

yarn add koa -S
yarn add nodemon -D

mkdir app
cd app
touch index.js
vi index.js

cd.. to folder koa-app

vi package.json
add "scripts": "start": "nodemon app/index.js",

# 启动项目
yarn start ==> server on localhost:9000
```

## 2. 提交

### 2.1 提交规范 commitizen

```sh
yarn add commitizen -D

add "scripts": "commit": "git add . && git-cz"

add "config": { "commitizen": { "path": "node_modules/cz-conventional-changelog" }}
```

### 2.2 提交到 github & gitee

前提是：两个账户已分别绑定 git 权限

```sh
git remote add github git@github.com:xn213/koa-app.git
git remote add gitee git@gitee.com:xn213/koa-app.git

yarn commit

# 分别提交
git push github
git push gitee
```

升级省事： **同时提交**到 github 和 gitee

修改 .git/config

```sh
[remote "origin"]
	url = git@github.com:xn213/koa-app.git
	url = git@gitee.com:xn213/koa-app.git
	fetch = +refs/heads/*:refs/remotes/origin/*
```

这时第一次提交到 gitee, alias: gp == git push 会提示如下图,

![2021_06_06_git-push-to-both-github-gitee](https://cdn.jsdelivr.net/gh/xn213/img-hosting@master/code-tools/2021_06_06_git-push-to-both-github-gitee.4amz23xmcgc0.png)

由于上面分别提交到 github 和 gitee, 设置了 git remote gitee..., 要使用如下命令提交

```sh
git push --set-upstream origin master
```

此命令会在 .git/config 中添加如下字段

```sh
[branch "master"]
	remote = origin
	merge = refs/heads/master
```

## 3. 改造路由

### 3.1 抽离路由模块

```sh
yarn add koa-router -S

cd app
mkdir router
touch index.js
touch routes.js
```

## 4. 参数解析，抽离中间件

### 4.1 koa-compose 简化中间件引用

```sh
yarn add koa-compose koa-bodyparser -S
# 插件 koa-compose 简化引用中间件的写法。
# 插件 koa-bodyparser 处理 post 请求体中的参数
```

```js
// app/index.js
const compose = require('koa-compose')
const MD = require('./middlewares/')

const app = new Koa()

app.use(compose(MD))
```

```js
// controllers/test.js
ctx.body = ctx.request.body
```

这里 post 请求 拿不到 body 的参数，找轮子>插件

### 4.2 koa-bodyparser 处理 post 请求参数

```sh
// >app
mkdir middlewares
touch index.js

# 注意： koa-bodyparser 处理需放在路由前面
```

![koa-middleware-bodyparser](https://cdn.jsdelivr.net/gh/xn213/img-hosting@master/koa/koa-middleware-bodyparser.png)

![post-body](https://cdn.jsdelivr.net/gh/xn213/img-hosting@master/koa/post-body.png)

### 4.3 `formidable` 处理 `上传文件`

`koa-bodyparser` 插件只能解析 4 种数据 [ 'json', 'form', 'text', 'xml' ]，当上传文件的时候，是获取不到文件的.
这里借助插件 [formidable 文档](https://www.npmjs.com/package/formidable)

```sh
yarn add formidable -S
```

```js
// middlewares/formidable.js
const Formidable = require('formidable')

const { tempFilePath } = require('../config')

module.exports = () => {
  return async function (ctx, next) {
    const form = new Formidable({
      multiples: true,
      // 上传的临时文件保存路径 抽离到 config/base 一些配置
      // uploadDir: `${process.cwd()}/${tempFilePath}`
      uploadDir: tempFilePath,
    })

    await new Promise((reslove, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) {
          reject(err)
        } else {
          // 暂未设置请求头 忽略 请求中添加 二进制 content-type
          ctx.request.body = fields
          ctx.request.files = files
          reslove()
        }
      })
    })

    await next()
  }
}
```

```js
// middlewares/index.js 中引入 注册 暴露出去
const formidable = require('./formidable')
const mdFormidable = formidable()
module.exports = [mdFormidable, mdKoaBody, mdRoute, mdRouterAllowed]
```

注： [Koa Docs: content-type](https://koa.bootcss.com/)

![koa9000-upload-file-content-type--application--octet-stream](https://cdn.jsdelivr.net/gh/xn213/img-hosting@master/koa/koa9000-upload-file-content-type--application--octet-stream.png)

![koa-9000-upload-file-temp-folder](https://cdn.jsdelivr.net/gh/xn213/img-hosting@master/koa/koa-9000-upload-file.jpg)

另： 抽离配置文件，添加配置文件目录： `app/config`

```js
// config/index.js
const base = require('./base')
const dev = require('./dev')
const pre = require('./pre')
const pro = require('./pro')

const env = process.env.NODE_ENV || 'dev'

const configMap = {
  dev,
  pre,
  pro,
}

module.exports = Object.assign(base, configMap[env])
```

## 5. 工具函数和常量配置抽离 挂载到上下文

编写工具函数 `app/utils/index.js` & `test.js`

```sh
cd app
mkdir utils
cd utils
touch index.js
vi index.js i 编辑输入： :wq 保存退出
```

```js
// utils/index.js
const testUtils = require('./test')

module.exports = {
  testUtils,
}
```

```sh
touch test.js
vi test.js  i编辑输入
```

```js
// utils/test.js
const test = 'test utils string'

module.exports = testUtils = () => {
  return test
}
```

挂载到 App context 上下文

```js
// app/index.js
...
const config = require('./config')
const utils = require('./utils')

app.context.utils = config
app.context.utils = utils
...
```

## 6. 统一返回格式 & 错误处理

### 6.1 统一 成功 or 失败 返回格式

1. 成功

```js
// app/middlewares/response.js
const response = () => {
  return async (ctx, next) => {
    ctx.res.fail = ({ code, data, msg }) => {
      ctx.body = {
        code,
        data,
        msg,
      }
    }
    ctx.res.success = (msg) => {
      ctx.body = {
        code: 0,
        data,
        msg: msg || 'success',
      }
    }
    await next()
  }
}
module.exports = response
```

2. 失败

```js
// app/middlewares/error.js
const error = () => {
  return async (ctx, next) => {
    try {
      await next()
      if (ctx.status === 200) {
        ctx.res.success()
      }
    } catch (err) {
      if (err.code) {
        ctx.res.fail({ code: err.code, msg: err.message })
      } else {
        // 程序运行时错误
        ctx.app.emit('error', err, ctx)
      }
    }
  }
}
module.exports = error
```

3. 在 `middlewares/index.js` 中引入

```js
const response = require('./response')
const error = require('./error')

const mdResHandler = response()
const mdErrHandler = error()

module.exports = [mdFormidable, mdKoaBody, mdResHandler, mdErrHandler, mdRoute, mdRouterAllowed]
```

### 6.2 错误处理

1. 程序运行时错误使用 `koa` 的错误处理事件，需要在 `app/index.js` 配置

所有的返回值是在 `middlewares/error.js` 里拦截了一下，如果状态码是 `200`，用成功的工具函数包装返回，如果不是则又分为两种情况：一种是我们自己抛出的，包含业务错误码的情况(这种情况我们用失败的工具函数包装返回)；另一种是程序运行时报的错，这个往往是我们代码写的有问题(这种情况我们触发 `koa` 的错误处理事件去处理)，针对失败的第二种情况，我们还需要修改启动文件 `app/index.js`，添加如下代码:

```js
// 程序本身错误
app.on('error' (err, ctx) => {
  if(ctx) {
    ctx.body = {
      code: 9000,
      msg: `程序运行时错误： ${err.message}`
    }
  }
})
```

2. 测试一下： 在 `controllers/test.js` 添加如下代码：

2.1. 成功

```js
// controllers/test.js
const getList = async () => {
  ctx.body = '返回结果'
}
```

请求接口， 返回值如下，我们定义的 `controller` 成功返回

![koa-成功返回结果-controller-拦截到](https://cdn.jsdelivr.net/gh/xn213/img-hosting@master/koa/koa-成功返回结果-controller-拦截到.41wdq8ncjug0.png)

2.2. 业务抛出错误

```js
// controllers/test.js
const getList = async (ctx) => {
  const data = ''
  // 业务中抛出失败
  ctx.utils.assert(data, ctx.utils.throwError(10001, '验证码失效'))
  ctx.body = '返回结果'
}
```

![koa-业务中抛出错误10001](https://cdn.jsdelivr.net/gh/xn213/img-hosting@master/koa/koa-业务中抛出错误10001.20xr78fw08n4.png)

2.3. 程序本身报错

这时添加一行 `a = b`, 这里 `b` 未定义，则为程序本身错误， 触发 `koa error` 事件

```js
const getList = async (ctx) => {
  const a = b
  ctx.body = '返回结果'
}
```

![koa](https://cdn.jsdelivr.net/gh/xn213/img-hosting@master/koa/koa.on.error-程序运行时错误.png)
