---
title: WebRTC（一）
tags: WebRTC
reward: true
categories: WebRTC
abbrlink: 39639
date: 2019-05-14 10:14:50
password: Miaow
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---

> [WebRTC API](<https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API>)
>
> [Node.js v10.15.3 文档](<http://nodejs.cn/api/>)
>
> [廖雪峰 - nodejs](<https://www.liaoxuefeng.com/wiki/1022910821149312/1023025235359040>)
>
> [Webrtc笔记-获取源码](<https://www.jianshu.com/p/310c0d133c3c>)
>
> [WebRTC音频引擎实现分析](<https://www.jianshu.com/p/5a8a91cd84ef>)
>
> [实时通信RTC技术栈之：视频编解码](<http://www.52im.net/thread-1034-1-1.html>)
>
> [开源实时音视频技术WebRTC中RTP/RTCP数据传输协议的应用](<http://www.52im.net/thread-589-1-1.html>)
>
> [WebRTC项目源码在国内的镜像](<https://gitee.com/ibaoger/webrtc>)

## WebRTC 介绍

<!-- more -->

- Google 开源
- 跨平台
- 用于浏览器
- 实时传输
  - 100ms 延迟 通话质量非常好
  - 200ms 延迟 通话质量比较优质
  - 500ms 延迟 可以接受
  - 超过1s 非常迟滞
- 音视频引擎

WebRTC 应用：

<img src="/images/imageWebRTC/webrtc应用.png">

WebRTC 愿景：

<img src="/images/imageWebRTC/webrtc愿景.png">

学习 WebRTC 的难点：

<img src="/images/imageWebRTC/学习WebRTC的难点.png">

学习路线：

<img src="/images/imageWebRTC/学习路线.png">

学习内容：

<img src="/images/imageWebRTC/学习内容.png">

学习收获：

<img src="/images/imageWebRTC/学习收获.png">

WebRTC能做啥：

<img src="/images/imageWebRTC/WebRTC能做啥.png">

能学到什么：

<img src="/images/imageWebRTC/能学到什么.png">

google webrtc 示例：https://appr.tc/

## WebRTC 原理与架构

WebRTC 整体架构：

<img src="/images/imageWebRTC/webrtc架构.png">



WebRTC 的目录结构图：

<img src="/images/imageWebRTC/WebRTC目录结构-01.png">

<img src="/images/imageWebRTC/WebRTC目录结构-02.png">

<img src="/images/imageWebRTC/WebRTCModules目录-01.png">

<img src="/images/imageWebRTC/WebRTCModules目录-02.png">

WebRTC 两个基本概念：轨与流

- Track
- MediaStream

WebRTC重要类：

- MediaStream
- RTCPeerConnection
- RTCDataChannel

PeerConnection调用过程：

<img src="/images/imageWebRTC/PeerConnection调用过程.png">

调用时序图：

<img src="/images/imageWebRTC/调用时序图.png">

![PeerConnection连接建立流程图](/images/imageWebRTC/PeerConnection连接建立流程图.png)

对于上图中描述的PeerConnection建立的完整流程进行以下说明（上图是以ClientA主动向ClientB发起连接为例）：

- 首先 ClientA 和 ClientB 均通过双向通信方式如 WebSocket 连接到 Signaling Server 上；
- ClientA 在本地首先通 GetMedia 访问本地的 media 接口和数据，并创建 PeerConnection 对象，调用其 AddStream 方法把本地的 Media 添加到 PeerConnection 对象中。**对于 ClientA 而言，既可以在与 Signaling Server 建立连接之前就创建并初始化 PeerConnection 如阶段 1，也可以在建立 Signaling Server 连接之后创建并初始化 PeerConnection 如阶段 2；ClientB 既可以在上图的1阶段也可以在 2 阶段做同样的事情，访问自己的本地接口并创建自己的 PeerConnection 对象**。
- 通信由 ClientA 发起，所以 ClientA 调用 PeerConnection 的 CreateOffer 接口创建自己的 SDP offer，然后把这个 SDP Offer 信息通过 Signaling Server 通道中转发给 ClientB；
- ClientB 收到 Signaling Server 中转过来的 ClientA 的 SDP 信息也就是 offer 后，调用 CreateAnswer 创建自己的 SDP 信息也就是 answer，然后把这个 answer 同样通过 Signaling server 转发给 ClientA；
- ClientA 收到转发的 answer 消息以后，两个 peers 就做好了建立连接并获取对方 media streaming 的准备；
- ClientA 通过自己 PeerConnection 创建时传递的参数等待来自于 ICE server 的通信，获取自己的 candidate，当 candidate available 的时候会自动回掉 PeerConnection 的 OnIceCandidate；
- ClientA 通过 Signling Server 发送自己的 Candidate 给 ClientB，ClientB 依据同样的逻辑把自己的 Candidate 通过 Signaling Server 中转发给 ClientA；
- 至此 ClientA 和 ClientB 均已经接收到对方的 Candidate，通过 PeerConnection 建立连接。至此 P2P 通道建立。

> [WebRTC之PeerConnection的建立过程](https://www.cnblogs.com/cther/p/myPeerConnection.html)
>
> [WebRTC系列（3）：PeerConnection通信建立流程](<https://www.jianshu.com/p/43957ee18f1a>)

## Web服务器原理与Nodejs搭建

> [node.js基本工作原理及流程](<https://blog.csdn.net/xiangzhihong8/article/details/53954600>)
>
> [Nodejs的运行原理-架构篇](https://www.cnblogs.com/peiyu1988/p/8192066.html)
>
> [Node.js 原理简介](https://www.cnblogs.com/bingooo/p/6720540.html)
>
> [NodeJS 事件循环（第一部分）- 事件循环机制概述](<https://zhuanlan.zhihu.com/p/37427130>)

Web服务器选型：

- Nodejs
- Nginx
- Apache

Web服务工作原理：

<img src="/images/imageWebRTC/web服务工作原理.png">

Nodejs工作原理：

<img src="/images/imageWebRTC/Nodejs工作原理.png">

JavaScript解析：

<img src="/images/imageWebRTC/JavaScript解析.png">

Nodejs 事件处理：

<img src="/images/imageWebRTC/Nodejs事件处理.png">

两个V8引擎：

<img src="/images/imageWebRTC/两个V8引擎.png">

最简单的http服务：

- **require** 引入http模块
- 创建http服务
- 侦听端口

启动Nodejs服务：

- node app.js
- nohub node app.js
- forever start app.js
- pm2 start app.js

Https基本原理：

<img src="/images/imageWebRTC/https基本原理.png">

Nodejs 搭建 https 服务：

- 生成 HTTPS证书
- 引入 HTTPS模块
- 指定证书位置，并创建 HTTPS 服务

真正的Web服务：

- 引用 express 模块
- 引入 server-index 模块
- 指定发布目录

## JavaScript 必备知识回顾

基础知识：

- 变量与类型
- 基本运算
- `if/else`
- for循环
- 函数
- 日志打印

变量与类型：

<img src="/images/imageWebRTC/变量与类型.png">

基本运算：

<img src="/images/imageWebRTC/基本运算.png">

<img src="/images/imageWebRTC/ifelse.png">

<img src="/images/imageWebRTC/for循环.png">

<img src="/images/imageWebRTC/函数.png">

## WebRTC设备管理

enumerateDevices：

<img src="/images/imageWebRTC/enumerateDevices.png">

JavaScript中的Promise：

<img src="/images/imageWebRTC/JavaScript中的Promise.png">

## WebRTC音视频数据采集

音视频采集API：

<img src="/images/imageWebRTC/音视频采集API.png">

getUserMedia的不同实现：

<img src="/images/imageWebRTC/getUserMedia的不同实现.png">

适配置不同浏览器的方法：

<img src="/images/imageWebRTC/适配置不同浏览器的方法.png">

`https://webrtc.github.io/adapter/adapter-latest.js`

WebRTC音视频采集约束：

视频约束详解：

- width

- height

  宽高比例：`4:3`  `16:9`

- aspectRatio

- frameRate

- facingMode

  - user - 前置摄像头
  - environment - 后置摄像头
  - left - 前置左侧摄像头
  - right - 前置右侧摄像头

- resizeMode

音频约束详解：

- volume - `范围 0 - 1.0`
- sampleRate
- sampleSize -  一般16位
- echoCancellation - 回音消除
- autoGainControl - 是否在原有声音基础上增加音量
- noiseSuppression - 降噪
- latency - 延迟大小
- channelCount - 声道  乐器一般是双声道
- deviceID - 作用是多个设备切换
- groupID 

WebRTC约束例子：

```json
{
    audio: true,
    video: {
        width: {
            min: 300,
            max: 640,
        },
        height: {
            min: 300,
            max: 480,
        },
        frameRate: {
            min: 15,
            max: 30,
        }
    }
}
```

浏览器视频特效：

- CSS filter，`-webkit-filter/filter`
- 如何将 video 与 filter 关联
- OpenGL/Metal/...

支持的特效种类：

<img src="/images/imageWebRTC/支持的特效种类.png">

保存图片是实现滤镜效果，可以对 canvas.data 进行数据修改。

MediaStream API 获取视频约束：

<img src="/images/imageWebRTC/MediaStream.png">

<img src="/images/imageWebRTC/MediaStream事件.png">

## WebRTC音视频录制实战

### WebRTC录制基本知识

MediaRecoder类：

<img src="/images/imageWebRTC/MediaRecoder.png">

<img src="/images/imageWebRTC/MediaRecorder参数.png">

<img src="/images/imageWebRTC/MediaRecorderAPI-01.png">

<img src="/images/imageWebRTC/MediaRecorderAPI-02.png">

<img src="/images/imageWebRTC/MediaRecorder事件.png">

<img src="/images/imageWebRTC/JavaScript几种存储数据的方式.png">

### WebRTC 捕获桌面

<img src="/images/imageWebRTC/getDisplayMedia.png">

捕获桌面需要设置Chrome，具体 操作：<chrome://flags/#enable-experimental-web-platform-features>

- Experimental Web Platform features 设置为 enable

## WebRTC信令服务器实现

如果没有信令服务器WebRTC之间是不能通信的。

两个client之间通信必须有两个信息通过信令服务器的：

- 媒体信息， SDP
- 网络信息
- 具体的业务

<img src="/images/imageWebRTC/信令服务器的作用.png">

<img src="/images/imageWebRTC/为什么要使用socketio.png">

<img src="/images/imageWebRTC/socketio工作原理.png">

Socket.IO 发送消息：

- 给本次连接发送消息

  ```js
  socket.emit()
  ```

- 给某个房间内所有人发送消息

  ```js
  io.in(room).emit()
  ```

- 除本链接外，给某个房间内所有人发送消息

  ```js
  socket.to(room).emit()
  ```

- 除本链接外，给所有人发送消息

  ```js
  socket.broadcast.emit()
  ```

Socket.IO 客户端处理消息：

- 发送 action 命令

  ```js
  S: socket.emit('action');
  C: socket.on('action', function(){...});
  ```

- 发送了一个 action 命令，还有 data 数据

  ```js
  S: socket.emit('action', data);
  C: socket.on('action', function(data){...});
  ```

- 发送了 action 命令，还有两个数据

  ```js
  S: socket.emit('action', arg1, arg2);
  C: socket.on('action', function(arg1, arg2){...});
  ```

- 发送了一个 action 命令，在 emit 方法中包含回调函数

  ```js
  S: socket.emit('action', data, function(arg1, arg2){...};
  C: socket.on('action', function(data, fn){fn('a', 'b');});
  ```

### [实战] 通过 socket.io 实现信令服务器

改造服务端的基本流程：

- 安装 socket.io
- 引入 socket.io
- 处理 connection 消息

## WebRTC网络基础补充：P2P/STUN/TRUN/ICE知识

> [P2P通信原理与实现](<https://zhuanlan.zhihu.com/p/26796476>)

### WebRTC 网络传输基本知识

WebRTC 传输基本知识：

- NAT（Network Address Translator）
- STUN（Simple Traversal of UDP Through NAT）
- TURN（Travelsal Using Relays around NAT）
- ICE（Interactive Connectivity Establishment）

<img src="/images/imageWebRTC/NAT.png">

NAT 产生的原因：

- 由于IPv4的地址不够
- 处于网络安全的原因

NAT 的种类：

- 完全锥型 NAT（Full Cone NAT）
- 地址限制锥型 NAT（Address Restricted Cone NAT）
- 端口限制锥型 NAT（Port Restricted Cone NAT）
- 对称型 NAT（Symmetric NAT）

### NAT 打洞原理

<img src="/images/imageWebRTC/完全锥型NAT.png">

<img src="/images/imageWebRTC/地址限制锥型NAT.png">

<img src="/images/imageWebRTC/端口限制锥型NAT.png">

<img src="/images/imageWebRTC/对称型NAT.png">

NAT 穿越原理：

- C1，C2 向 STUN 发消息
- 交换公网 IP 及 端口
- C1 -> C2，C2 -> C1，甚至是端口猜测

<img src="/images/imageWebRTC/NAT穿越组合.png">

### NAT 类型检测

<img src="/images/imageWebRTC/NAT类型判断.png">

公网 IP：

<img src="/images/imageWebRTC/NAT类型检测-01.png">

如果 Client 收到的 IP 和第一次发出去的 IP 是不一样的，则是对称型 NAT，如果是一样的需要进一步判断：

<img src="/images/imageWebRTC/NAT类型检测-02.png">

Client 通过 Port2 发送消息到 STUN Port1，STUN Server 通过 Port2 给 Client 回消息，如果 Client 能收到消息，则说明是 IP 限制型的；如果不能收到，则说明是端口限制型的：

<img src="/images/imageWebRTC/NAT类型检测-03.png">

### 【协议规范】STUN 协议一

STUN 介绍：

- STUN 存在的目的就是进行 NAT 穿越
- STUN 是典型的客户端 / 服务器模式。客户端发送请求，服务端进行响应

RFC STUN 规范：

- **RFC3489/STUN**

  SImple Traversal of UDP Trough NAT

- **RFC5389/STUN** — 包含UDP和TCP

  Session Traversal Utilities for NAT

STUN 协议：

- 包括 20 字节的 STUN header
- Body 中可以有 0 个或多个 Attribute

STUN header（RFC3489）：

- 其中 2 个字节（16bit）类型
- 2 个字节（16bit）消息长度，不包括消息头
- 16 个字节（128bit）事物ID，请求与响应事物 ID 相同

STUN header（RFC5389）格式：

<img src="/images/imageWebRTC/STUNHeader格式.png">

<img src="/images/imageWebRTC/STUNMessageType.png">

M 代表请求值，C 代表分类：

<img src="/images/imageWebRTC/STUNMessageType-01.png">

<img src="/images/imageWebRTC/C0C1.png">

RFC5389 把私密类型去掉了：

<img src="/images/imageWebRTC/STUN消息类型.png">

### 【协议规范】STUN 协议二

Inter 机子都是小端模式：

<img src="/images/imageWebRTC/大小端模式.png">

<img src="/images/imageWebRTC/STUNMessageType-02.png">

<img src="/images/imageWebRTC/TransactionID.png">

<img src="/images/imageWebRTC/STUNMessageBody.png">

<img src="/images/imageWebRTC/TLV.png">

<img src="/images/imageWebRTC/RFC3489定义的属性.png">

<img src="/images/imageWebRTC/Attribute的使用.png">

### 【协议规范】TURN 协议

TURN 介绍：

- 其目的是解决对称 NAT 无法穿越的问题
- 其建立在 STUN 之上，消息格式使用 STUN 格式消息
- TURN Client 要求服务端分配一个公共 IP 和 Port 用于接受 或 发送数据

<img src="/images/imageWebRTC/TURN例子.png">

<img src="/images/imageWebRTC/TURN使用的传输协议.png">

<img src="/images/imageWebRTC/TURNAllocate.png">

TURN 发送机制：

- Send 和 Data
- Channel

<img src="/images/imageWebRTC/TURNSendAndData.png">

<img src="/images/imageWebRTC/TURNChannel.png">

<img src="/images/imageWebRTC/TURN的使用.png">

### 【协议规范】ICE 框架

<img src="/images/imageWebRTC/ICE.png">

<img src="/images/imageWebRTC/ICECandidate.png">

Candidate 类型：

- 主机候选者
- 反射侯选者
- 中继候选者

ICE 具体做些什么：

- 收集 Candidate
- 对 Candidate Pair 排序
- 连通性检查

<img src="/images/imageWebRTC/Candidate关系图.png">

收集 Candidate：

- Host Candidate：本机所有 IP 和指定端口
- Reflexive Candidate：STUN/TURN
- Relay Candidate：TURN

什么是 SDP：

- **SDP（Session Description Protocol）** 它只是一种信息格式的描述标准，本身不属于传输协议，但是可以被其他传输协议用来交换必要的信息。

<img src="/images/imageWebRTC/SDP例子.png">

形成 Candidate Pair：

- 一方收集到所有候选者后，通过信令传给对方
- 同样，另一方收到候选者后，也做收集工作
- 当双方拿到全部列表后，将侯选者形成匹配对儿

连通性检查：

- 对侯选者进行优先级排序
- 对每个侯选对进行发送检查
- 对每个侯选对进行接收检查

<img src="/images/imageWebRTC/连通性过程.png">

### 网络协议分析方法 tcpdump 与 wireshark讲解

常用工具：

- Linux 服务端用 tcpdump
- 其它端 WireShark

<img src="/images/imageWebRTC/tcpdump.png">

### 网络协议分析方法 tcpdump 与 wireshark 实战

vim 打开二进制数据：

```shell
：%！xxd
```

WireShark 中的逻辑运算：

- 与：and 或 &&
- 或：or 或 ||
- 非：not 或 ！

WireShark 中判断语句：

- 等于：eq 或 ==
- 小于：lt 或 <
- 大于：gt 或 >
- 小于等于：le 或 <=
- 大于等于：ge 或 >=
- 不等于：ne 或 !=

WireShark 按协议过滤：

- stun
- tcp
- udp

模拟STUN数据可以使用这个网站中的工具：<https://webrtc.github.io/samples>

Wireshark 按 IP 过滤：

```
ip.dst == 192.168.1.2
ip.src == 192.168.1.2
ip.addr == 192.168.1.2
```

WireShark 按 port 过滤：

```
tcp.port == 8080
udp.port == 3478
udp.dstport == 3478
udp.srcport == 3478
```

WireShark 过滤长度：

```
udp.length < 30
tcp.length < 30
http.content_length < 30
```

WireShark 过滤内容：

TODO

