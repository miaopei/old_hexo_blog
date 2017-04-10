---
title: Webpack创建、运行vue.js项目及其目录结构详解
date: 2017-04-10 18:18:27
tags: vuejs webpack
reward: true
categories: Docker
toc: true
---

### 项目环境搭建：

1.安装node

进入[node官网]([https://nodejs.org/en/](https://nodejs.org/en/)进行下载。

版本查看：

```bash
$ node -v
v6.10.1
```

<p style="color:red;">**注意：**node版本最好新一点，推介6.0以上。 </p>



<!-- more -->



2.全局安装vue-cli

```bash
$ npm install -g vue-cli
```

**注意：** 如果安装失败可能需要root权限重新安装。

3.创建一个基于 `webpack` 模板的新项目

```bash
$ vue init webpack project-name	 	#(默认安装2.0版本)
$ vue init webpack#1.0 project-name #(安装1.0版本)
```

### 项目目录结构：

![](http://i.imgur.com/P64Q8uK.png)



![](http://i.imgur.com/beLRmUA.png)

- main.js是入口文件，主要作用是初始化vue实例并使用需要的插件

  ```js
  // The Vue build version to load with the `import` command
  // (runtime-only or standalone) has been set in webpack.base.conf with an alias.
  import Vue from 'vue'
  import App from './App'
  import router from './router'

  Vue.config.productionTip = false

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
  ```

- App.vue是我们的主组件，所有页面都是在App.vue下进行切换的。其实你也可以理解为所有的路由也是App.vue的子组件。所以我将router标示为App.vue的子组件。

  ```vue
  <template>
    <div id="app">
      <img src="./assets/logo.png">
      <router-view></router-view>
      <hello></hello>
    </div>
  </template>

  <script>
  export default {
    name: 'app',
    components: {
      Hello
    }
  }
  </script>

  <style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  </style>
  ```

- index.html文件入口

- src放置组件和入口文件

- node_modules为依赖的模块

- config中配置了路径端口值等

- build中配置了webpack的基本配置、开发环境配置、生产环境配置等

### 运行项目：

```bash
$ cd project-name
$ npm install
$ npm run dev
# 上述步骤都完成后在浏览器输入：localhost:8080
```

