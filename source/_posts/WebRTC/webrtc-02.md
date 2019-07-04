---
title: WebRTC（二）
tags: WebRTC
reward: true
categories: WebRTC
abbrlink: 39639
date: 2019-05-15 10:14:50
---

## 端对端1V1传输基本流程

### 媒体能力协商过程

WebRTC 端对端连接：

**RTCPeerConnection**：

- 基本格式

  ```js
  pc = new RTCPeerConnection([configuration]);
  ```

<!-- more -->

**RTCPeerConnection 方法分类**：

- 媒体协商
- Stream/Track
- 传输相关方法
- 统计相关方法

<img src="/images/imageWebRTC/媒体协商过程.png">

<img src="/images/imageWebRTC/协商状态变化.png">

**媒体协商方法**：

- createOffer
- createAnswer
- setLocakDescription
- setRemoteDescription

**createOffer**：

- 基本格式

  ```js
  aPromise = myPeerConnection.createOffer([options]);
  ```

**createAnswer**：

- 基本格式

  ```js
  aPromise = myPeerConnection.createAnswer([options]);
  ```

**setLocakDescription**：

- 基本格式

  ```js
  aPromise = myPc.setLocalDescription(sessionDescription);
  ```

**setRemoteDescription**：

- 基本格式

  ```js
  aPromise = myPc.setRemoteDescription(sessionDescription);
  ```

**Track 方法**：

- addTrack
- removeTrack

**addTrack**：

- 基本格式

  ```js
  rtpSender = myPc.addTrack(track, stream...);
  ```

- Parameters

  <img src="/images/imageWebRTC/addTrackParameters.png">

**removeTrack**：

- 基本格式

  ```js
  myPc.remoteTrack(rtpSender);
  ```

**重要事件**：

- onnegotiationneeded  - 协商的时候触发这个事件
- onicecandidate - 当收到 ICE 候选者的时候触发这个事件

### 1:1 连接的基本流程

<img src="/images/imageWebRTC/端对端连接的基本流程.png">

**A 与 B 通信，大的方向分为三部分**：

- 媒体协商部分
- ICE 候选者的交换、连接、检测部分
- 媒体数据流的通信部分

### 【实战】WebRTC 视频传输

TODO

### 【实战】显示通讯双方的 SDP 内容

TODO

## WebRTC核心之SDP详解

### 【协议规范】SDP 规范

**SDP 规范**：

- 会话层
- 媒体层

可以把会话层看做树根，媒体层看成树干。

**会话层**：

- 会话的名称与目的
- 会话的存活时间
- 会话中包含多个媒体信息

**SDP 媒体信息**：

- 媒体格式
- 传输协议
- 传输 IP 和 端口
- 媒体负载类型

**SDP 格式**：

- 由多个 `<type>=<value>` 组成
- 一个会话级描述
- 多个媒体级描述

**SDP 结构**：

- Session Description
- Time Description
- Media Description

<img src="/images/imageWebRTC/SessionDescription.png">

<img src="/images/imageWebRTC/TimeDescription.png">

<img src="/images/imageWebRTC/MediaDescription.png">

<img src="/images/imageWebRTC/字段含义-01.png">

<img src="/images/imageWebRTC/字段含义-02.png">

<img src="/images/imageWebRTC/字段含义-03.png">

<img src="/images/imageWebRTC/字段含义-04.png">

<img src="/images/imageWebRTC/字段含义-05.png">

<img src="/images/imageWebRTC/字段含义-06.png">

<img src="/images/imageWebRTC/字段含义-07.png">

### 【协议规范】WebRTC 中的 SDP

<img src="/images/imageWebRTC/WebRTC中的SDP.png">

### 【详解】WebRTC 中 Offer_Answer SDP

TODO

```js

```



## 实现1V1音视频实时互动直播系统

### STUN/TURN 服务器搭建

coTurn Download Address：<https://github.com/coturn/coturn>

ICE 测试地址：<https://webrtc.github.io/samples>

```shell
# 启动 turn server
$ turnserver -c /usr/local/coturn/etc/turnserver.conf
```

<img src="/images/imageWebRTC/STUNTURN服务器选型.png">

<img src="/images/imageWebRTC/coTurn服务器搭建与部署.png">

<img src="/images/imageWebRTC/coTurn服务器配置.png">

<img src="/images/imageWebRTC/测试turn服务.png">

### 【参数介绍】再论 RTCPeerConnection

<img src="/images/imageWebRTC/RTCPeerConnection-01.png">

<img src="/images/imageWebRTC/Configurations-01.png">

<img src="/images/imageWebRTC/Configurations-02.png">

<img src="/images/imageWebRTC/Configurations-03.png">

<img src="/images/imageWebRTC/Configurations-04.png">

<img src="/images/imageWebRTC/addIceCandidate.png">

### 直播系统中的信令及其逻辑关系

【实战】真正的音视频传输

**客户端信令消息**：

- join 加入房间
- leave 离开房间
- message 端到端消息

**端到端信令消息**：

- Offer 消息
- Answer 消息
- Candidate 消息

**服务端信令消息**：

- joined 已加入房间
- otherjoin 其它用户加入房间
- full 房间人数已满
- leaved 已离开房间
- bye 对方离开房间

<img src="/images/imageWebRTC/直播系统消息处理流程.png">

### 实现 1：1 音视频实时互动信令服务器

信令服务器改造

TODO

### 再论CreateOffer

<img src="/images/imageWebRTC/createOffer.png">

**CreateOffer 实战**：

- 接收远端音频
- 接收远端视频
- 静音检测
- ICE restart

### WebRTC 客户端状态机及处理逻辑

直播客户端的实现：

<img src="/images/imageWebRTC/客户端状态机.png">

<img src="/images/imageWebRTC/客户端流程图.png">

<img src="/images/imageWebRTC/客户端流程图-01.png">

<img src="/images/imageWebRTC/端对端连接的基本流程.png">

### WebRTC 客户端的实现

<img src="/images/imageWebRTC/注意要点.png">

### 共享远程桌面

<img src="/images/imageWebRTC/getDisplayMedia-01.png">

<img src="/images/imageWebRTC/需要注意的点.png">

## WebRTC核心之RTP媒体控制与数据统计

### RTPPReceiver 发送器

RTP Media

<img src="/images/imageWebRTC/Receiver和Sender.png">

<img src="/images/imageWebRTC/RTCRtpSender属性.png">

<img src="/images/imageWebRTC/RTCRtpReceiver.png">

### RTPSender 发送器

<img src="/images/imageWebRTC/RTCRtpSender.png">

<img src="/images/imageWebRTC/RTPMedia.png">

<img src="/images/imageWebRTC/RTCRtpTransceiver.png">

### 传输速率的控制

<img src="/images/imageWebRTC/RTPMedia-01.png">

<img src="/images/imageWebRTC/chromeWebRTC-internals.png">

chrome WebRTC 状态查询地址：<chrome://webrtc-internals>

### 【实战】WebRTC统计信息

TODO

## WebRTC非音视频数据传输

### 传输非音视频数据基础知识

<img src="/images/imageWebRTC/createDataChannel.png">

<img src="/images/imageWebRTC/option-01.png">

<img src="/images/imageWebRTC/option-02.png">

<img src="/images/imageWebRTC/使用Options.png">

<img src="/images/imageWebRTC/DataChannel事件.png">

<img src="/images/imageWebRTC/创建RTCDataChannel.png">

<img src="/images/imageWebRTC/非音视频数据传输方式.png">

- Reliability：可靠性
- Delivery：可达性
- Transmission：传输方式
- Flow control：流控
- Congestion control：拥塞控制

### 端到端文本聊天

TODO

### 文件实时传输

<img src="/images/imageWebRTC/知识点.png">

## WebRTC实时数据传输网络协议详解

### 【协议规范】RTP-SRTP协议头详解

<img src="/images/imageWebRTC/协议栈.png">

<img src="/images/imageWebRTC/传输协议.png">

<img src="/images/imageWebRTC/RTP协议.png">

<img src="/images/imageWebRTC/RTP字段说明.png">

### 【协议规范】RTCP 中的 SR 与 RR 报文

<img src="/images/imageWebRTC/RTCP包.png">

<img src="/images/imageWebRTC/RTCPPayloadType.png">

<img src="/images/imageWebRTC/RTCPHeader.png">

<img src="/images/imageWebRTC/RTCPHeader说明.png">

<img src="/images/imageWebRTC/RTCPSenderReport.png">

<img src="/images/imageWebRTC/SenderInfomationBlock.png">

<img src="/images/imageWebRTC/SenderInfo说明.png">

<img src="/images/imageWebRTC/ReportBlock.png">

<img src="/images/imageWebRTC/ReceiveReportBlock.png">

<img src="/images/imageWebRTC/RTCPReceiverReport.png">

<img src="/images/imageWebRTC/RTCPSR-RR发送时机.png">

<img src="/images/imageWebRTC/RTCPSDES.png">

<img src="/images/imageWebRTC/SDESitem.png">

<img src="/images/imageWebRTC/SDES说明.png">

<img src="/images/imageWebRTC/RTCPBYE.png">

<img src="/images/imageWebRTC/RTCPAPP.png">

<img src="/images/imageWebRTC/RTCPAPP字段说明.png">

### 【协议规范】DTSL

<img src="/images/imageWebRTC/DTLS.png">

<img src="/images/imageWebRTC/SRTP.png">

### wireshark 分析 rtp-rtcp 包

TODO

## Android端与浏览器互通

### Android 与浏览器互通

<img src="/images/imageWebRTC/主要内容.png">

<img src="/images/imageWebRTC/需要权限.png">

<img src="/images/imageWebRTC/Android权限管理.png">

<img src="/images/imageWebRTC/引入库.png">

<img src="/images/imageWebRTC/信令处理.png">

<img src="/images/imageWebRTC/AndroidSocketio.png">

<img src="/images/imageWebRTC/socketio接收消息.png">

### WebRTCNative 开发逻辑

<img src="/images/imageWebRTC/结构图.png">

<img src="/images/imageWebRTC/呼叫端时序图.png">

<img src="/images/imageWebRTC/被叫端时序图.png">

<img src="/images/imageWebRTC/关闭时序图.png">

<img src="/images/imageWebRTC/webrtc处理流程.png">

<img src="/images/imageWebRTC/重要类-01.png">

<img src="/images/imageWebRTC/重要类-02.png">

<img src="/images/imageWebRTC/两个观察者.png">

### 实战-权限申请-库的引入与界面

<img src="/images/imageWebRTC/权限库界面.png">

### 实战-通过 socket.io 实现信令收发

<img src="/images/imageWebRTC/收发信令.png">

### 实战-Android 与浏览器互通

创建 PeerConnection：

- 音视频数据采集
- 创建 PeerConnection

媒体能力协商：

- 协商媒体能力
- Candidate 连通
- 视频渲染

## iOS端与浏览器互通

### IOS权限获取

<img src="/images/imageWebRTC/主要内容-01.png">

<img src="/images/imageWebRTC/主要内容-02.png">

### IOS引入WebRTC库

<img src="/images/imageWebRTC/引入WebRTC库的方式.png">

<img src="/images/imageWebRTC/引入WebRTC库.png">

<img src="/images/imageWebRTC/Podfile.png">

### IOS端SocketIO的使用

<img src="/images/imageWebRTC/socketio的使用.png">

<img src="/images/imageWebRTC/连接服务器.png">

<img src="/images/imageWebRTC/发送消息.png">

<img src="/images/imageWebRTC/注册侦听消息.png">

### IOS界面布局

TODO

### IOS本地视频采集与展示

TODO

### IOS端RTCPeerConnection

TODO

### IOS媒体协商

<img src="/images/imageWebRTC/媒体协商.png">

<img src="/images/imageWebRTC/信令时序图.png">

### IOS远端视频渲染

<img src="/images/imageWebRTC/RTCPeerConnection委托.png">

## 课程总结

<img src="/images/imageWebRTC/小结.png">

<img src="/images/imageWebRTC/信令服务器.png">

<img src="/images/imageWebRTC/JS客户端实现.png">

<img src="/images/imageWebRTC/JS客户端实现-01.png">

<img src="/images/imageWebRTC/进阶.png">

<img src="/images/imageWebRTC/进阶-01.png">

<img src="/images/imageWebRTC/行业痛点.png">

## Reference

> [JavaScript 是如何工作的:WebRTC 和对等网络的机制！](<https://juejin.im/post/5c511219e51d45522c3066c9>)
>
> [深入理解WebRTC](https://segmentfault.com/a/1190000011403597)
>
> [WebRTC架构简介](https://blog.csdn.net/fishmai/article/details/69681595)
>
> [HTTPS证书生成原理和部署细节](<https://www.barretlee.com/blog/2015/10/05/how-to-build-a-https-server/>)
>
> [SSL证书生成流程](<https://www.jianshu.com/p/9091ebd439a0>)

> [Gradle官网](<https://gradle.org/install/>)
>
> [Gradle 包](<http://tools.android-studio.org/index.php/9-tools/109-android-tools-download>)
>
> [Mac下AndroidStudio中手动配置Gradle](<https://www.jianshu.com/p/36e569c1bb12>)

WebRTC的分层协议图：

<img src="/images/imageWebRTC/webrtc分层协议图.png">

信令，会话和协议：

<img src="/images/imageWebRTC/信令会话协议.png">

## 问题解决里程

node 启动 server 报错：

```shell
events.js:141
      throw er; // Unhandled 'error' event
      ^

Error: listen EACCES 0.0.0.0:443
    at Object.exports._errnoException (util.js:870:11)
    at exports._exceptionWithHostPort (util.js:893:20)
    at Server._listen2 (net.js:1224:19)
    at listen (net.js:1273:10)
    at net.js:1382:9
    at nextTickCallbackWith3Args (node.js:452:9)
    at process._tickCallback (node.js:358:17)
    at Function.Module.runMain (module.js:444:11)
    at startup (node.js:136:18)
    at node.js:966:3
[Solve]$ sudo setcap 'cap_net_bind_service=+ep' $(readlink -f $(which node))
```

查询端口是否别占用：

```shell
$ netstat -ntpl | grep 443
```





