---
title: WebRTC 流媒体服务器（三）
tags:
  - WebRTC
categories:
  - WebRTC
reward: true
abbrlink: 6958
date: 2019-10-21 10:07:32
---

## 各流媒体服务器的比较

### 多人互动架构方案

<!-- more -->

多人音视频架构：

- Mesh 方案
- MCU（Multipoint Conferencing Unit） 方案
- SFU（Selective Forwarding Unit） 方案

### Mesh架构模型详解

![1对1的通信模型](/images/imageWebRTC/mediaserver/121通信模型.png)

![Mesh通信模型](/images/imageWebRTC/mediaserver/Mesh通信模型.png)

### MCU架构模型详解

![MCU通信模型](/images/imageWebRTC/mediaserver/MCU通信模型.png)

### SFU架构模型详解

![SFU通信模型](/images/imageWebRTC/mediaserver/SFU通信模型.png)

### Licode架构

Licode 属于 MCU 的一种架构模型

![Licode架构](/images/imageWebRTC/mediaserver/Licode架构.png)

### Janus流媒体服务器的架构及特点

![Janus SFU架构.png](/images/imageWebRTC/mediaserver/JanusSFU架构.png)

### Medooze流媒体服务器架构及特点

Medooze可以作为MCU也可以作为SFU

![Medooze架构.png](/images/imageWebRTC/mediaserver/Medooze架构.png)

### Mediasoup流媒体服务器架构及特点

![Mediasoup整体结构](/images/imageWebRTC/mediaserver/Mediasoup整体结构.png)

## mediasoup服务器的部署与使用

### Mediasoup的运行环境

服务器环境：

- Ubuntu 18.04
- Nodejs 10.0 以上
- npm 6.4.1
- gulp 2.2.0

Nodejs的安装方式：

- 二进制库安装
- 源码安装

二进制库安装步骤：

```shell
$ apt/brew/yum install nodejs
$ apt/brew/yum install npm
```

源码安装：

- 下载 Nodejs 源码
- 生成 Makefile
- make -j 4 && sudo make install

### Mediasoup Demo的部署

下载Demo源码：

```shell
$ git clone https://github.com/versatica/mediasoup-demo.git
$ cd mediasoup-demo
$ git checkout v3
```

配置服务：

```shell
$ cd server
$ npm install
$ cp config.example.js config.js
```

测试：

```shell
# server
$ npm start
# app
$ npm install -g gulp-cli
$ gulp live
```

### 通过Nodejs实现HTTP服务

最简单的http服务：

- require 引入 http 模块
- 创建 http 服务
- 侦听端口

```javascript
// server.js
'use strict'

const http = require('http');

const express = require('express');
const app = express();

const http_server = http.createServer(app);
http_server.listen(9999, '0.0.0.0');
```

启动Nodejs服务：

```shell
$ node server.js
$ nohup node server.js &
$ forever start server.js
# macos 查看端口状态
$ netstat -an | grep 9999
# 测试服务是否正常
$ telnet 127.0.0.1 9999
```

### HTTPS基本知识

nodejs搭建HTTPS服务：

- 生成HTTPS证书
- 引入HTTPS模块
- 指定证书位置，并创建HTTPS服务

### 通过WWW服务发布mediasoup客户端代码

真正的web服务：

- 引入 express 模块
- 引入 server-index 模块
- 指定发布目录

```javascript
// server.js
'use strict'

const https = require('https');
const express = require('express');
const server_index = require('server-index');
const fs = require('fs');

const options = {
    key : fs.readFileSync('./cert/xxx'),
    cert : fs.readFileSync('./cert/xxx')
}

const app = express();
app.use(server_index('./public'));
app.use(express.static('./public'));

const https_server = https.createServer(options, app);
https_server.listen(443, '0.0.0.0');
```

```shell
$ netstat -ntpl | grep 443
```

### 作业 - 客户端是如何与信令服务建立连接的

TODO

app 443端口 是如何和 server 4443端口通信的？

如何知道信令服务器的地址？

## mediasoup的信令系统

![](/images/imageWebRTC/mediaserver/)

## mediasoup源码分析

![](/images/imageWebRTC/mediaserver/)

## 总结

![](/images/imageWebRTC/mediaserver/)

## Reference

> [mediasoup介绍](https://zhuanlan.zhihu.com/p/33618940)
>
> [Mediasoup官网V3设计文档](https://mediasoup.org/documentation/v3/mediasoup/design/)
>
> [Mediasoup官网V3 API文档](https://mediasoup.org/documentation/v3/mediasoup/api/)

> [Ubuntu中安装部署Mediasoup](https://blog.csdn.net/cgs1999/article/details/89703995)
>
> [Mediasoup源码分析（1）——架构分析](https://blog.csdn.net/cgs1999/article/details/100133917)
>
> [基于mediasoup的多方通话研究（一）](https://blog.csdn.net/gupar/article/details/83788934)
>
> [mediasoup-demo解析-客户端](https://www.cnblogs.com/jixiaohua/p/11573957.html)

> [WebRTC网关服务器搭建：开源技术 vs 自行研发](https://yq.aliyun.com/articles/625996)
>
> [基于webrtc多人音视频的研究（一）](https://blog.csdn.net/gupar/article/details/53101435)
>
> [如何打造自己的WebRTC 服务器](https://kuaibao.qq.com/s/20180524G1DQ7P00?refer=spider)
>
> [webrtc学习: 部署stun和turn服务器](https://blog.csdn.net/gupar/article/details/52782897)

> [C++ 技术面试基础知识总结](https://github.com/huihut/interview)
>
> [K6K4 笔试面试网](http://www.k6k4.com/simple_question/qlist)

> [Opengrok的安装及配置](https://luomuxiaoxiao.com/?p=56)
>
> [代码阅读工具之 ----- Opengrok的安装及使用](https://zhuanlan.zhihu.com/p/47533369)

> [如何阅读开源项目](https://zhijianshusheng.github.io/2017/06/07/2017/6/%E5%A6%82%E4%BD%95%E9%98%85%E8%AF%BB%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/)

<details><summary></summary>

```c++

```

</details>

