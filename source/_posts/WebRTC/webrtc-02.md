---
title: WebRTC（二）
tags: WebRTC
reward: true
categories: WebRTC
abbrlink: 39639
password: Miaow
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
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

<details><summary>SDP报文内容</summary>

```shell
v=0
o=- 2584450093346841581 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE audio video data
a=msid-semantic: WMS 616cfbb1-33a3-4d8c-8275-a199d6005549
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 110 112 113 126
c=IN IP4 0.0.0.0 
a=rtcp:9 IN IP4 0.0.0.0
a=ice-ufrag:sXJ3
a=ice-pwd:yEclOTrLg1gEubBFefOqtmyV
a=fingerprint:sha-256 22:14:B5:AF:66:12:C7:C7:8D:EF:4B:DE:40:25:ED:5D:8F:17:54:DD:88:33:C0:13:2E:FD:1A:FA:7E:7A:1B:79
a=setup:actpass
a=mid:audio
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=sendrecv
a=rtcp-mux
a=rtpmap:111 opus/48000/2
a=rtcp-fb:111 transport-cc
a=fmtp:111 minptime=10;useinbandfec=1
a=rtpmap:103 ISAC/16000
a=rtpmap:104 ISAC/32000
a=rtpmap:9 G722/8000
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:106 CN/32000
a=rtpmap:105 CN/16000
a=rtpmap:13 CN/8000
a=rtpmap:110 telephone-event/48000
a=rtpmap:112 telephone-event/32000
a=rtpmap:113 telephone-event/16000
a=rtpmap:126 telephone-event/8000
a=ssrc:120276603 cname:iSkJ2vn5cYYubTve
a=ssrc:120276603 msid:616cfbb1-33a3-4d8c-8275-a199d6005549 1da3d329-7399-4fe9-b20f-69606bebd363
a=ssrc:120276603 mslabel:616cfbb1-33a3-4d8c-8275-a199d6005549
a=ssrc:120276603 label:1da3d329-7399-4fe9-b20f-69606bebd363
m=video 9 UDP/TLS/RTP/SAVPF 96 98 100 102 127 97 99 101 125
c=IN IP4 0.0.0.0
a=rtcp:9 IN IP4 0.0.0.0
a=ice-ufrag:sXJ3
a=ice-pwd:yEclOTrLg1gEubBFefOqtmyV
a=fingerprint:sha-256 22:14:B5:AF:66:12:C7:C7:8D:EF:4B:DE:40:25:ED:5D:8F:17:54:DD:88:33:C0:13:2E:FD:1A:FA:7E:7A:1B:79
a=setup:actpass
a=mid:video
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:4 urn:3gpp:video-orientation
a=extmap:5 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
a=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
a=sendrecv
a=rtcp-mux
a=rtcp-rsize
a=rtpmap:96 VP8/90000
a=rtcp-fb:96 ccm fir
a=rtcp-fb:96 nack
a=rtcp-fb:96 nack pli
a=rtcp-fb:96 goog-remb
a=rtcp-fb:96 transport-cc
a=rtpmap:97 rtx/90000
a=fmtp:97 apt=96
a=rtpmap:98 VP9/90000
a=rtcp-fb:98 ccm fir
a=rtcp-fb:98 nack
a=rtcp-fb:98 nack pli
a=rtcp-fb:98 goog-remb
a=rtcp-fb:98 transport-cc
a=rtpmap:100 H264/90000
a=rtcp-fb:100 ccm fir
a=rtcp-fb:100 nack
a=rtcp-fb:100 nack pli
a=rtcp-fb:100 goog-remb
a=rtcp-fb:100 transport-cc
a=fmtp:100 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f
a=rtpmap:102 red/90000
a=rtpmap:127 ulpfec/90000
a=rtpmap:97 rtx/90000
a=fmtp:97 apt=96
a=rtpmap:99 rtx/90000
a=fmtp:99 apt=98
a=rtpmap:101 rtx/90000
a=fmtp:101 apt=100
a=rtpmap:125 rtx/90000
a=fmtp:125 apt=102
a=ssrc-group:FID 2580761338 611523443
a=ssrc:2580761338 cname:iSkJ2vn5cYYubTve
a=ssrc:2580761338 msid:616cfbb1-33a3-4d8c-8275-a199d6005549 bf270496-a23e-47b5-b901-ef23096cd961
a=ssrc:2580761338 mslabel:616cfbb1-33a3-4d8c-8275-a199d6005549
a=ssrc:2580761338 label:bf270496-a23e-47b5-b901-ef23096cd961
a=ssrc:611523443 cname:iSkJ2vn5cYYubTve
a=ssrc:611523443 msid:616cfbb1-33a3-4d8c-8275-a199d6005549 bf270496-a23e-47b5-b901-ef23096cd961
a=ssrc:611523443 mslabel:616cfbb1-33a3-4d8c-8275-a199d6005549
a=ssrc:611523443 label:bf270496-a23e-47b5-b901-ef23096cd961
m=application 9 DTLS/SCTP 5000
c=IN IP4 0.0.0.0
a=ice-ufrag:sXJ3
a=ice-pwd:yEclOTrLg1gEubBFefOqtmyV
a=fingerprint:sha-256 22:14:B5:AF:66:12:C7:C7:8D:EF:4B:DE:40:25:ED:5D:8F:17:54:DD:88:33:C0:13:2E:FD:1A:FA:7E:7A:1B:79
a=setup:actpass
a=mid:data
a=sctpmap:5000 webrtc-datachannel 1024
```

</details>

## 实现1V1音视频实时互动直播系统

### STUN/TURN 服务器搭建

> [webrtc进阶-信令篇-之三：信令、stun、turn、ice](<https://blog.csdn.net/fireroll/article/details/50780863>)
>
> [webRTC+coturn穿透服务器的安装与搭建](<https://blog.csdn.net/lamb7758/article/details/77045735>)
>
> [WebRTC的信令服务器Collider和Turn服务器搭建](<https://my.oschina.net/andywang1988/blog/848645>)
>
> [AppRTC(WebRTC)服务器搭建](<https://www.jianshu.com/p/a19441034f17>)

coTurn Download Address：<https://github.com/coturn/coturn>

ICE 测试地址：<https://webrtc.github.io/samples>

coturn 编译安装

```shell
$ git clone https://github.com/coturn/coturn 
$ cd coturn 
$ ./configure 
$ make 
$ make install
```

安装sqlite

```shell
$ sudo atp-get install sqlite
```

生成认证用户

```shell
$ turnadmin -A –u 用户名 -r beijing -p 密码 
$ turnadmin -a –u 用户名 -r beijing -p 密码 
# A 是添加管理员
```

然后生成md5码

```shell
$ turnadmin -k –u 用户名 -r beijing -p 密码
```

生成证书

```shell
$ openssl req -x509 -newkey rsa:2048 -keyout /etc/turn_server_pkey.pem -out /etc/turn_server_cert.pem -days 99999 -nodes 
# 一路回车就好
```

创建配置文件

```shell
$ vi /usr/local/etc/turnserver.conf 
listening-device=eth1 
relay-device=eth1 
listening-port=3478 
listening-ip=YOU_IP 
listening-ip=YOU_IP2 
# (stun 需要两个公网ip，只有一个公网ip只能作文turn服务器) 
tls-listening-port=5349 
lt-cred-mech 
min-port=59000 
max-port=65000 
realm=beijing 
no-loopback-peers 
no-multicast-peers 
mobility 
no-cli 
cert=/etc/turn_server_cert.pem 
pkey=/etc/turn_server_pkey.pem 
fingerprint 
stale-nonce=600
```

启动 coturn

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

RTP Media 里边两个重要的类：Receiver 和 Sender

<img src="/images/imageWebRTC/Receiver和Sender.png">

Receiver 和 Sender 共有的三个属性

<img src="/images/imageWebRTC/RTCRtpSender属性.png">

<img src="/images/imageWebRTC/RTCRtpReceiver.png">

- getParameters  - 编解码器相关参数
- getSynchronizationSources - 获取共享源（同步源），每一个媒体流都一个唯一的共享源
- getContributingSources - 贡献来源，最主要用于混音和混频的情况
- getStats - 获取统计信息
- getCapabilities - 获取协商后的媒体能力

### RTPSender 发送器

<img src="/images/imageWebRTC/RTCRtpSender.png">

<img src="/images/imageWebRTC/RTPMedia.png">

RTCRtpTransceiver 可以同时处理 sender 和 receiver

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

- ordered - udp包不保证包是有序的（传输非音视频数据的时候包是否是按顺序到达的），webrtc传输音视频的时候使用的是udp，webrtc在upd之上做了一层协议可以保证消息是按顺序到达（底层如果包是乱序的对包进行排序）
- maxPacketLifeTime/maxRetransmits - 包存活时间（包最大的存活时间/最大的传输次数），这两个参数是二选一，不能同时使用

<img src="/images/imageWebRTC/option-02.png">

- negotiated - 协商，在创建datachannel的时候可以进行协商

<img src="/images/imageWebRTC/使用Options.png">

<img src="/images/imageWebRTC/DataChannel事件.png">

- onmessage - 当对方有数据过来的时候触发
- onopen - 当创建好 datachannel 的时候触发

<img src="/images/imageWebRTC/创建RTCDataChannel.png">

<img src="/images/imageWebRTC/非音视频数据传输方式.png">

- SCTP - stream control transport 流控
- configurable - 可配置的

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

> [浅析TCP字节流与UDP数据报的区别](<https://blog.csdn.net/oshirdey/article/details/38467391>)

**tcp是流式传输， 这是什么意思？** 

假设A给B通过TCP发了200字节， 然后又发了300字节， 此时B调用recv（设置预期接受1000个字节）， 那么请问B实际接受到多少字节？  根据我们之前讲得tcp粘包特性，可知， B端调用一次recv, 接受到的是500字节。

所谓流式传输， 说白了， 就是管道中的水， 第一次给你发了200斤的水， 第二次给你发了300斤的水， 然后你在对端取的时候， 这200斤和300斤的水， 已经粘在一起了， 无法直接分割， 没有界限了。

**udp是数据报传输，  什么意思？**  

假设A给B通过udp发了200字节， 然后又发了300字节， 此时B调用recvfrom（设置预期接受1000个字节）， 那么请问B实际接受到多少字节？   写了个程序测了一下， 发现B调用recvfrom接收到的是200自己， 另外的300字节必须再次调用recvfrom来接收。

所谓的数据报传输， 说白了， 就有消息和消息之间有天然的分割， 对端接收的时候， 不会出现粘包。 发10次， 就需要10次来接收。

### 【协议规范】RTP-SRTP协议头详解

<img src="/images/imageWebRTC/协议栈.png">

<img src="/images/imageWebRTC/传输协议.png">

- DTLS - 证书检测，加密算法协商

<img src="/images/imageWebRTC/RTP协议.png">

- contributing source - 贡献源，CC - 表示贡献者一共有多少个（最多可以表示16个贡献者）

<img src="/images/imageWebRTC/RTP字段说明.png">

> [RTP报文头中的SSRC和CSRC](<https://blog.csdn.net/zhushentian/article/details/79804742>)
>
> [RTP/RTCP协议详解](https://www.cnblogs.com/foxmin/archive/2012/03/13/2393349.html)
>
> [RTP 有效负载(载荷)类型，RTP Payload Type](https://www.cnblogs.com/x_wukong/p/6391611.html)

- 最大的 RTP 包包含的字节是1400多字节，压缩后的 H264 帧也能达到 1M 多。一般帧 封包 后的最后一个包 就是 M 位
- timestamp - 同一个帧的所有封包的 timestamp 是相同的，并且 seq number 是连续的。H264 内部有封包的起始位和结束位，根据这些标识就可以将多个封包组成一个完整的帧
- SSRC - SSRC的作用就是贡献者，视频和音频的SSRC是完全不相同的。同一个视频的SSRC有可能发生变化（产生冲突会发生变化，因为SSRC是随机数）
- CSRC - 贡献者

### 【协议规范】RTCP 中的 SR 与 RR 报文

<img src="/images/imageWebRTC/RTCP包.png">

<img src="/images/imageWebRTC/RTCPPayloadType.png">

- SDES - 中最重要的一个字段是 cname
- FR - 请求关键帧
- necho - 发现丢包重传

<img src="/images/imageWebRTC/RTCPHeader.png">

<img src="/images/imageWebRTC/RTCPHeader说明.png">

<img src="/images/imageWebRTC/RTCPSenderReport.png">

<img src="/images/imageWebRTC/SenderInfomationBlock.png">

<img src="/images/imageWebRTC/SenderInfo说明.png">

- NTP - 不同源之间的同步，比如音频和视频之间的同步

<img src="/images/imageWebRTC/ReportBlock.png">

<img src="/images/imageWebRTC/ReceiveReportBlock.png">

<img src="/images/imageWebRTC/RTCPReceiverReport.png">

<img src="/images/imageWebRTC/RTCPSR-RR发送时机.png">

<img src="/images/imageWebRTC/RTCPSDES.png">

<img src="/images/imageWebRTC/SDESitem.png">

<img src="/images/imageWebRTC/SDES说明.png">

- CNAME - 对于webrtc来说这个字段基本上是不用SDES这个消息，因为在SDP中就有CNAME的描述，除非音频源或者视频源发生了中断（or中转）会重新生成SSRC，然后再进行重新绑定

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





