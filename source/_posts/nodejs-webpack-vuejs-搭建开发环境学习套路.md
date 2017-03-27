---
title: nodejs+webpack+vuejs 搭建开发环境学习套路
date: 2017-03-27 18:02:52
tags: 
  - nodejs
  - vuejs
  - webpack
toc: true
reward: true
---

### 官方文档

[官方手册](http://vuejs.org/v2/guide/)

[中文官网](https://cn.vuejs.org/)

[vuejs 2.0 中文文档](https://vuefe.cn/v2/guide/)

以上是提供的一些官方资料，下面开始我们的套路吧：

<!-- more -->

### 环境构建

1.新建一个目录`vuepro`
2.初始化

```bash
$ cd vuepro

# 初始化的时候可以一路回车，在最后输入"yes"后会生成package.json文件
$ npm init
```

3.安装模块，先装这么多，有需要再安装

```bash
$ npm install vue webpack babel-loader babel-core babel-preset-env babel-cli babel-preset-es2015 html-webpack-plugin --save-dev
```

4.创建良好的目录层级

```bash
$ mkdir src
$ cd src && mkdir -p html jssrc webapp 
```

![](http://i.imgur.com/qkj7kJd.png)	

`html`放置模板文件，`jssrc`放置js文件，最终编译好的文件放置在`webapp`目录里，这个目录也就是我们网站的目录。

5.在项目根目录下创建webpack配置文件：`webpack.config.js`

```js
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack=require("webpack");
module.exports =
{
    entry:
    {
        //入口文件
        "index":__dirname+'/src/jssrc/index.js',
    },
    output: {
        path: __dirname+'/src/webapp/js',  //输出文件夹
        filename:'[name].js'   //最终打包生成的文件名(只是文件名，不带路径的哦)
    },
    /*resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },*/
    externals: {

    },
    module:{
        loaders:[
            {test:/\.js$/,loader:"babel-loader",query:{compact:true}},
            //这里肯定要加入n个loader 譬如vue-loader、babel-loader、css-loader等等
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename: __dirname+'/src/webapp/index.html',   //目标文件
            template: __dirname+'/src/html/index.html', //模板文件
            inject:'body',
            hash:true,  //代表js文件后面会跟一个随机字符串,解决缓存问题
            chunks:["index"]
        })

    ]
}
```

6.同样在根目录下创建babel配置文件：`.babelrc`

```text
{
    "presets" : ["es2015"]
} 
```

然后就可以在webpack里面配置loader，我们上面webpack配置中已经写了：

```js
 loaders:[
            {test:/\.js$/,loader:"babel-loader",query:{compact:true}},
   			// 经过测试旧版用的是loader:"babel",在新版中用的是loader:"babel-loader"
        ]
```

这句话意思就是：凡是 `.js` 文件都使用 `babel-loader` , 并且压缩。

### 学习vue最简单的一个套路

思考：数据如何渲染？

套路如下：

首先要有个数据块标记

vue里面可以像模板引擎一样写上 `{{name}}`

其中 `name` 就是变量名

### 接下来进行实战练习

![](http://i.imgur.com/UhW18FI.png)	

index.htm l如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
    <div id="me">
        我的年龄是{{age}}
    </div>
</body>
</html>
```

index.js 如下：

```js
import Vue from "vue"; //会去node_modules\vue\package.json

new Vue({
    el:"#me",
    data:{age:18}
})
```

至此，我们需要用 `webpack` 打包，打包到 `webapp` 目录下。 

需要修改2个地方： 

(1)因为我们的 `webpack` 不是全局安装的，所以不能直接执行 `webpack` 命令，我们这里借助 `npm` 来执行。所以需要修改项目根目录下的 `package.json` 文件，加入：

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
```

表示：执行build，就会去node_modules.bin\下去寻找webpack命令。`build` 这个名字是自定义的。

(2)还需要修改 webpack 配置文件：`webpack.config.js`

```js
resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
```

我们之前把这个注释掉了，现在打开。此处的意义是找到 `node_modules/vue/dist/vue.js`

最后，我们就来打包，看看结果是怎样的？ 

终端里还是cd到项目根目录下，执行：

```bash
$ npm run build
```

![](http://i.imgur.com/wmjrYdu.png)	

`index.html`  就是打包之后的模板文件，`js/index.js` 就是打包之后的js文件，在 `index.html` 被引用了。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
    <div id="me">
        我的年龄是{{age}}
    </div>
<script type="text/javascript" src="js/index.js?43c73980e35f1569ef72"></script></body>
</html>
```

预览一下index.html: 

![](http://i.imgur.com/6kHwB4L.png)

这样就完成了 `vueJS` 的一个简单案列
