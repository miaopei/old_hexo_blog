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

## Mediasoup服务器的部署与使用

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

## Mediasoup的信令系统

### Mediasoup-demo整体分析

![Mediasoup Demp](/images/imageWebRTC/mediaserver/mediasoup-demp.png)

![Demo目录的作用](/images/imageWebRTC/mediaserver/Demo目录的作用.png)

### JavaScript 基本语法

**Nodejs基本语法**

基础知识：

- 变量与类型
- 基本运算
- if/else
- for循环
- 函数
- 日志打印

![变量与类型](/images/imageWebRTC/mediaserver/变量与类型.png)

![基本运算](/images/imageWebRTC/mediaserver/基本运算.png)

![if else](/images/imageWebRTC/mediaserver/ifelse.png)

![for循环](/images/imageWebRTC/mediaserver/for循环.png)

![函数](/images/imageWebRTC/mediaserver/函数.png)

### JavaScriptES6高级特性

![ES6语法](/images/imageWebRTC/mediaserver/ES6语法.png)

![ES6语法](/images/imageWebRTC/mediaserver/ES6语法-01.png)

### Promise与EventEmitter详解

![Promise](/images/imageWebRTC/mediaserver/Promise.png)

![EventEmitter](/images/imageWebRTC/mediaserver/EventEmitter.png)

### 剖析serverjs

TODO

阅读源码

### 剖析roomjs

mediasoup基本概念：

- Room/Router
- Transport/WebRTCTransport
- Produce/Consume

Room 的主要逻辑：

- 创建房间
- 信令处理

![Demo支持的信令](/images/imageWebRTC/mediaserver/Demo支持的信令.png)

### 如何调试MediasoupDemo

Nodejs调试方法：

- `node --inspect-brk server.js`
- `chrome://inspect`
- 设置断点

### 运行时查看Mediasoup的核心信息

Demo Dump工具：

- 方法一：`export INTERACTIVE=1; ndoe server.js`  -- 调试的时候使用
- 方法二：`node connect.js` -- 查看线上内容的时候使用

## Mediasoup源码分析

### Mediasoup 库的架构讲解

Mediasoup基本概念：

- Worker
- Router
- Producer - 生产者
- Consumer - 消费者
- Transport

![mediasoup v3 architecture](/images/imageWebRTC/mediaserver/mediasoup-v3-architecture-01.svg)

Mediasoup包括的特性（一）

- 支持 IPv6
- ICE / DTLS / RTP / RTCP / over UDP and TCP
- 支持 Simulcast 和 SVC

Mediasoup包括的特性（二）

- 支持拥塞控制
- 带宽评估 
- 支持STCP协议 - 通过修改 TCP的窗口增加和减少参数来调整[发送窗口](https://baike.baidu.com/item/发送窗口/9032560)大小 ,以适应高速网络的环境。

Mediasoup包括的特性（三）

- 多流使用同一个 ICE + DTLS 传输通道
- 极其强大的性能 - 进程 + libuv，linux下一般使用epoll

### Mediasoup_JS_的作用

```shell
Mr.Miaow mediasoup git:(v3) $ tree lib                     
lib
├── AudioLevelObserver.js	-- 用于检测声音的
├── Channel.js				-- 与 C++ 部分进行信令通信
├── Consumer.js				-- 消费者
├── DataConsumer.js		
├── DataProducer.js
├── EnhancedEventEmitter.js	-- 向C++层抛事件
├── errors.js
├── index.js				-- 整个mediasoup库的索引，通过nodejs引入的时候第一个导入的就是indexjs
├── Logger.js
├── ortc.js					-- 与SDP相对应，以对象方式描述SDP信息
├── PipeTransport.js		-- worker之间不同route流的转发
├── PlainRtpTransport.js	-- 普通RTP数据，不使用webrtc传输协议的，比如与ffmpeg通信
├── Producer.js				-- 生产者
├── Router.js				-- 一个房间或路由器
├── RtpObserver.js			-- RTP的一个观察者，回调用的
├── scalabilityModes.js
├── supportedRtpCapabilities.js	-- 媒体协商一些相关的内容
├── Transport.js			-- 基类
├── utils.js				-- 常用的工具函数
├── WebRtcTransport.js		-- 浏览器的传输协议
└── Worker.js				-- 一个节点或进程
```

![MediasoupJS类关系图](/images/imageWebRTC/mediaserver/MediasoupJS类关系图.png)

Mediasoup JS 的作用：

- 起到管理的作用
- 生成 json 字符串，传给 C++

![createRouter](/images/imageWebRTC/mediaserver/createRouter.png)

### WebRTC中的C++类关系图

![Mediasoup核心类图](/images/imageWebRTC/mediaserver/Mediasoup核心类图.png)

![Mediasoup类图](/images/imageWebRTC/mediaserver/Mediasoup类图.png)

### Mediasoup启动详解

```shell
$ fg --切回到代码
```

```c++
[mediasoup-demo/server/] server.js (runMediasoupWorkers->createWorker) --> 
    [mediasoup/lib/] index.js (createWorker->new Worker) -- >
    [mediasoup/lib/] worker.js (constructor()->spawn()) -->
    [mediasoup/worker/src/] main.cpp
```

### 匿名管道进程间通信的原理

常见的进程间通信方式（IPC）

- 管道：匿名管道，有名管道
- socket：unixsocket，普通socket
- 共享内存
- 信号

### 实战通过socketpair进行进程间通信

![socketpair真实情况](/images/imageWebRTC/mediaserver/socketpair真实情况.png)

```c++
// testsocketpair.c
#include<stdio.h>
#include<sys/socket.h>
#include<string>
#include<unistd.h>

int main(int argc, char* argv[])
{
    int sv[2];
    if (socketpair(AF_UNIX, SOCK_STREAM, 0, sv[]) < 0) {
        perror("socketpair error\n");
        return -1;
    }
    pid_t id = fork();
    
    if (id == 0) { // subprocess
        char *msg = "I'm children!\n";
        char buffer[1024] = {0, };
        
        close(sv[1]);
        
        while(1) {
            write(sv[0], msg, strlen(msg));
            sleep(1);
            
            ssize_t len = read(sv[0], buffer, sizeof(buffer));
            if (len > 0) {
                buffer[len] = '\0';
                printf("children, recv from parent: %s \n", buffer);
            }
        }
    } else if (id > 0) { // parent process
        char *msg = "I'm father!\n";
        char buffer[1024] = {0, };
        
        close(sv[0]);
        
        while(1) {
            ssize_t len = read(sv[1], buffer, sizeof(buffer));
            if (len) {
                buffer[len] = '\0';
                printf("father, recv from children: %s \n", buffer);
                sleep(1);
            }
            
            write(sv[1], msg, strlen(msg));
        }
    } else {
        perror("Failed to create process\n");
    }
    
    return 0;
}
```

```shell
$ clang -g -o testsocketpair testsocketpair.c
```

### Mediasoup下channel创建的详细过程

```c++
[mediasoup/lib/] index.js (createWorker->new Worker) -- >
    [mediasoup/lib/] worker.js (constructor()->new channel()) -->
    [mediasoup/lib/] Channel.js (socket)
    
[mediasoup/worker/src/] main.cpp (new Channel::UnixStreamSocket(ChannelFd)) -->
    [mediasoup/worker/src/Channel/] UnixStreamSocker.cpp (::UnixStreamSocket::UnixStreamSocket(fd, NsMessageMaxLen)) -->
    [mediasoup/worker/src/handles/] UnixStreamSocker.cpp (static_cast<uv_read_cb>(onRead))) -->
    [mediasoup/worker/src/handles/] UnixStreamSocker.cpp (onRead()) --> 
    [mediasoup/worker/src/handles/] UnixStreamSocker.cpp (OnUvRead() --> UserOnUnixStreamRead()-->调用子类中的实现) -->
    [mediasoup/worker/src/Channel/] UnixStreamSocker.cpp (UserOnUnixStreamRead() --> new Channel::Request()) -->
    [mediasoup/worker/src/Channel/] Request.cpp(this 对象数据返回给创建者) -->
    [mediasoup/worker/src/Channel/] UnixStreamSocker.cpp (this->listener->OnChannelRequest(this, request)) -->
    [mediasoup/worker/src/] Worker.cpp (OnChannelRequest())
```

### Mediasoup中消息的确认与事件通知

返回信令确认消息：

```c++
...
request->Accept(data);
...
```

例子：

```c++
[mediasoup/worker/src/] Worker.cpp (OnChannelRequest(中使用request->Accept(data)情景))
    [mediasoup/worker/src/Channel/] Request.cpp (Accept(data) -- > this->channel->Send(jsonResponse)) -->
    [mediasoup/worker/src/Channel/] UnixStreamSocker.cpp (Send() --> Write() --> 向管道写数据给 js 端)
```

创建Notifier：

```c++
...
main{
    ...
    Channel::Notifier::ClassInit(channel);
    ...
}
```

向上层发送通知：

```c++
...
Channel::Noetifier::Emit(this->id, "icestatechange", data);
...
```

### Mediasoup主业务流程

![主业务的创建](/images/imageWebRTC/mediaserver/主业务的创建.png)

```c++
[mediasoup/worker/src/] Worker.cpp (OnChannelRequest()) --> 
    [mediasoup/worker/src/] Worker.cpp (new RTC::Router(routerId))
    
[mediasoup/worker/src/] Worker.cpp (OnChannelRequest( default )) --> 
    [mediasoup/worker/src/] Worker.cpp (router->HandleRequest(request)) --> 
    [mediasoup/worker/src/RTC] Router.cpp (HandleRequest(Channel::Request* request)) -->
    [mediasoup/worker/src/RTC] Router.cpp (new RTC::WebRtcTransport(transportId, this, request->data)) 
    
[mediasoup/worker/src/RTC] Router.cpp (HandleRequest( default )) -->
    [mediasoup/worker/src/RTC] Router.cpp (transport->HandleRequest(request)) -->
    [mediasoup/worker/src/RTC] WebRtcTransport.cpp (WebRtcTransport::HandleRequest( TRANSPORT_CONNECT )) 
    
[mediasoup/worker/src/RTC] Router.cpp (HandleRequest( default )) -->
    [mediasoup/worker/src/RTC] Transport.cpp (HandleRequest(TRANSPORT_PRODUCE)) -->
    [mediasoup/worker/src/RTC] Transport.cpp (new RTC::Producer(producerId, this, request->data)) -->
    [mediasoup/worker/src/RTC] Producer.cpp (Producer()) -->
    [mediasoup/worker/src/RTC] Transport.cpp (HandleRequest(TRANSPORT_PRODUCE) --> this->rtpListener.AddProducer(producer) --> this->listener->OnTransportNewProducer(this, producer))
    
[mediasoup/worker/src/RTC] Router.cpp (HandleRequest( default )) -->
    [mediasoup/worker/src/RTC] Transport.cpp (HandleRequest(TRANSPORT_CONSUME)) -->
    [mediasoup/worker/src/RTC] Transport.cpp (new RTC::SimpleConsumer())
```

### Mediasoup连接的创建

基础知识回顾：

- 用户身份的认证
- DTLS证书的认证
- ice-ufrags
- ice-password
- ice-role   -- 服务端和客户端的选择
- fingerprint

各模块初始化：

```c++
...
DepOpenSSL::ClassInit();
DepLibSRTP::ClassInit();
Utils::Crypto::ClassInit();
RTC::DtlsTransport::ClassInit();
RTC::SrtpSession::ClassInit();
...
```

```c++
[mediasoup/worker/src] main.cpp (main()) -->
    [mediasoup/worker/src] main.cpp (各个模块的初始化部分) -->
    [mediasoup/worker/src] main.cpp (RTC::DtlsTransport::ClassInit()) -->
    	[mediasoup/worker/src/RTC] DtlsTransport.cpp (ClassInit()) -->
    		ReadCertificateAndPrivateKeyFromFiles() --> CreateSslCtx() --> GenerateFingerprints()
    [mediasoup/worker/src] main.cpp (RTC::SrtpSession::ClassInit()) -->
    	[mediasoup/worker/src/RTC] SrtpSession.cpp () -->
    		srtp_install_event_handler() --> OnSrtpEvent()
```

再论创建WebRtcTransport命令：

```c++
[mediasoup/worker/src/RTC] WebRtcTransport.cpp () -->
    TODO
```

详解创建CONNECT命令：

```c++
[mediasoup/worker/src/RTC] WebRtcTransport.cpp (HandleRequest( TRANSPORT_CONNECT )) -->
    TODO
```

### Mediasoup数据流转

![Mediasoup时序图](/images/imageWebRTC/mediaserver/Mediasoup时序图.png)

![Mediasoup时序图](/images/imageWebRTC/mediaserver/Mediasoup时序图-01.png)

```c++
[mediasoup/worker/src/RTC] WebRtcTransport.cpp (WebRtcTransport()) -->
    (new RTC::UdpSocket(this, listenIp.ip)) -->
    TODO
```

### WebRTC大规模部署方案

![WebRTC大规模部署方案-01](/images/imageWebRTC/mediaserver/WebRTC大规模部署方案-01.png)

![WebRTC大规模部署方案-02](/images/imageWebRTC/mediaserver/WebRTC大规模部署方案-02.png)

![WebRTC大规模部署方案-03](/images/imageWebRTC/mediaserver/WebRTC大规模部署方案-03.png)

![WebRTC大规模部署方案-04](/images/imageWebRTC/mediaserver/WebRTC大规模部署方案-04.png)

## 总结

小结：

- C/C++ 服务器开发
- 编写高性能的网络服务器
- 各种传输协议详解
- Mediasoup的使用与详解

C/C++ 服务器开发：

- 如何实现一个最简单的服务器
- Linux信号的处理
- fork子进程
- 基础网络编程

编写高性能的网络服务器：

- 网络异步I/O事件处理
- epoll + fork实现高性能网络服务器
- Libevent/libuv实现高性能网络服务器

各种传输协议详解：

- TCP/IP 详解
- UDP/RTP/RTCP 详解
- WebRTC协议详解
- SDP协议与媒体协商

Mediasoup的使用与详解：

- 各种WebRTC流媒体服务器的比较
- Mediasoup服务器的部署与使用
- Mediasoup的信令系统
- Mediasoup源码分析

进阶：

- 大规模WebRTC流媒体服务器的实现 -- 路由器 路由表
- WebRTC源码分析
- 如何评测和提升音视频服务质量
- OpenCV / 人工智能
- OpenGL / Metal 视频特效

行业痛点：

- 如何通过mediasoup实现自有网络
- 如何更好的利用好网络
- 3A 问题
- 如何将 AI 引入到直播系统中搞服务质量

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



