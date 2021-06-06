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

### 2.2 提交到github & gitee

前提是：两个账户已分别绑定 git 权限
```sh
git remote add github git@github.com:xn213/koa-app.git
git remote add gitee git@gitee.com:xn213/koa-app.git

yarn commit

# 分别提交
git push github
git push gitee
```

升级： 同时提交到 github 和 gitee

修改 .git/config

```sh
[remote "origin"]
	url = git@github.com:xn213/koa-app.git
	url = git@gitee.com:xn213/koa-app.git
	fetch = +refs/heads/*:refs/remotes/origin/*
```
