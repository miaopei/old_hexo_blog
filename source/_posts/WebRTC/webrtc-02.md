---
title: WebRTC（二）
tags: WebRTC
reward: true
categories: WebRTC
abbrlink: 39639
#password: Miaow
#abstract: Welcome to my blog, enter password to read.
#message: Welcome to my blog, enter password to read.
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

## 即时通信（IM）和实时通信（RTC）的区别

即时通信（IM=Instant messaging）和实时通信（rtc=Real-time communication）都是一套网络通信系统，其本质都是对信息进行转发。其最大的不同点，是对信息传递的时间规定。二者的区别可以从以下几个方面：

### 场景

-  **即时通信**

  常见场景包括文字聊天、语音消息发送、文件传输、音视频播放等。**通俗的说，就是发短信**。

- **实时通信**

  场景包括语音、视频电话会议、网络电话等。**通俗的说，就是打电话**。

### 要求

- **即时通讯**

  主要要求可靠，考核送达率。要是你发一条短信，结果丢了，对方没收到！你再也不相信短信了吧。

- **实时通信**

  主要要求低延时和接通率。

  - **低延时**：你打一通电话，每说一句话，对方得几秒钟才有回应，这电话你也讲不下去了吧。
  - **接通率**：你打电话，你这边听到接通了，实际上对方的手机毫无反应，这实际上就没接通。

### 技术环节

- **即时通信**

  消息发送和确认，【消息接入端、服务端消息逻辑处理，服务端消息缓存和存储，转发，服务端用户状态管理，心跳机制，消息发送端】、消息接收和确认。

- **实时通信**

  技术环节：采集、前处理、编码、【服务端接入、转发、服务端接入】、解码、播放和渲染。 

这些技术环节重合的部分是：**信息转发**。

### 传输协议

公共互联网上，最常用的通信协议有TCP、UDP。

- **TCP**：Transmission Control Protocol，传输控制协议是基于连接的协议，也就是说，在正式收发数据前，必须和对方建立可靠的连接。**有延迟不可控的特点**。
- **UDP**：User Data Protocol，用户数据报协议，是与TCP相对应的协议。它是面向非连接的协议，它不与对方建立连接，而是直接就把数据包发送过去。 **存在丢包、抖动、延迟的特征**。

即时通信系统为了保证连接的可靠性，最常用的是TCP协议或者类TCP连接协议。这类协议的特点是追求连接的可靠性，而造成了延迟的不可控性，超过2秒的延迟响应是常态，甚至几十分钟的延迟响应，而电信级的实时通信标准是400ms，而基于互联网的实时通信需要另辟蹊径，开创出新的传输解决方案。发短信，延迟几秒钟送达，对使用者影响不大。

实时通信，一般采用 UDP 作为基础传输协议。在设计低延时的实时通信服务时，UDP 表现要比 TCP 好得多。这是因为实时通信中，低时延比可靠性更重要。打电话，几秒的延迟是不能忍受的。

TCP协议封装了消息的重传机制，在丢包的情况下，采用TCP协议的应用程序几乎无法优化这个重传机制，来达到低时延的效果。特别是在移动互联网络中，超过30%丢包时，TCP 的延时可以到几十分钟, 超过 50%丢包时，甚至很容易断开。 在同样丢包30%的链路上，UDP还可以传输数据，TCP就无法进行实时通信了。

### 成本

成本涉及到的环节有：**服务端接入、存储和转发**。

二者成本会产生差异的环节有：

- 从服务端接入方式来看，即时通信采用TCP协议来保证可靠性，可能会建立多个连接，相比无连接的UDP传输方式，这是一种昂贵的传输方式。实时通信可以基于UDP协议，与服务端建立灵活的、快速的接入机制。
- 存储方面，实时通信在服务端是实时转发，不会在服务端存储数据，而即时消息系统一般会将缓存转为存储数据，包括富媒体数据，会占用大量的存储空间，产生更多的存储成本。
- 从成本上来看，传输同样信息量的数据，基于TCP的即时通信方式，更侧重于可靠性，会优先采用多线机房的传输方式，成本比较高；
- 而基于UDP的实时通信方式，会优先选取最优路径进行传输数据，并可以动态调整传输路径，这样能够高效的利用带宽，提高传输效率，降低成本。

### 可用的解决方案

- **即时通信**：XMPP，MQTT
- **实时通信**：WebRTC、Tokbox

> 免费的 im 与 rtc 示例：<https://github.com/starrtc/android-demo>

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

### socket.io 原理详解

> [socket.io 原理详解](<https://blog.csdn.net/u013243347/article/details/86669988>)

### 音视频数据采集与控制

> [WebRTC音频引擎实现分析](<https://www.jianshu.com/p/5a8a91cd84ef>)
>
> [WebRTC手记之本地音频采集](https://www.cnblogs.com/fangkm/p/4374668.html)
>
> [WebRTC音视频同步分析](https://blog.csdn.net/lincaig/article/details/81209895#%E5%9B%9B%E3%80%81WebRTC%E9%9F%B3%E8%A7%86%E9%A2%91%E5%90%8C%E6%AD%A5%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90)
>
> [webrtc数据接收、解码、渲染等接口调用流程图](<https://blog.csdn.net/lincaig/article/details/86500656>)
>
> [WebRTC视频采集和编码过程](<https://blog.csdn.net/lincaig/article/details/79587417>)
>
> [H264中4x4、8x8和16x16尺寸对应场景](<https://blog.csdn.net/lincaig/article/details/84594764>)

### NAT 穿越

> [ICE协议下NAT穿越的实现（STUN&TURN）](<https://www.jianshu.com/p/84e8c78ca61d>)
>
> [WebRTC中NAT穿透浅析](https://www.cnblogs.com/xiaofengfengzhang/p/6590687.html)

### ICE 原理

> [（转）NAT与NAT穿越学习总结--ICE过程讲的不错](https://www.cnblogs.com/wangle1001986/p/6083871.html)
>
> [ICE 原理学习](<https://blog.csdn.net/voipmaker/article/details/8453702>)

### 媒体协商过程

> [完整WebRTC技术及应用概要](<http://www.ctiforum.com/news/guandian/549857.html>)
>
> [WebRTC SDP协议](<https://blog.csdn.net/qq_21358401/article/details/79341031>)
>
> [WebRTC 中的 SDP 协议](<https://www.jianshu.com/p/026c7ef271cb>)

### 网络处理与流程

> [WEBRTC 视频接收原理及流程](<https://blog.csdn.net/doitsjz/article/details/52022642>)
>
> [webrtc(11) 数据接收——总流程](<https://blog.csdn.net/NB_vol_1/article/details/82119450>)
>
> [WebRTC 是如何进行通信的，WebRCT 的三种网络结构 | 野狗 WebRTC 专栏](<https://blog.wilddog.com/?p=2196>)
>
> [WebRTC 音视频引擎研究 -- 整体架构分析](<http://ngudream.com/2016/01/18/webrtc-structure/>)

### 如何实现并规模高并发

> [即构自研WebRTC网关服务器架构实践](<https://juejin.im/post/5b568f7a6fb9a04fad3a1b9f>)
>
> [WebRTC、标准测试、大前端技术、实时网络质量……RTC2018帮你“划重点”！](<https://new.qq.com/omn/20180909/20180909A10XFQ.html>)

### 如何更好的利用网络

> [WebRTC 点对点直播](<https://cloud.tencent.com/developer/article/1004661>)

### 回音消除与降噪

> [WebRTC音频降噪使用](<https://blog.csdn.net/tanningzhong/article/details/88664338>)
>
> [webrtc--AudioProcessing-- 音频降噪的处理过程](<http://www.voidcn.com/article/p-wcltdqbt-bck.html>)
>
> [PCM音频处理——使用WebRTC音频降噪模块与其他方式的对比](<https://www.jianshu.com/p/77a363960711>)
>
> [音频降噪在 58 直播中的研究与实现](<https://www.infoq.cn/article/QOp4IOao_DJJ6eNsIOXp>)
>
> [单独编译和使用webrtc音频回声消除模块(附完整源码+测试音频文件)](<https://www.cnblogs.com/mod109/p/5469799.html>)
>
> [借助Webrtc音频采集、降噪、回音消除、静音检测、编解码、播放等功能，剥离Webrtc自带的RTP传输协议，使用私有的协议进行传输。从而实现自己的实时语音聊天功能。](<https://gitee.com/icedbeer/Webrtc_Audio>)
>
> [webrtc学习2-音频预处理模块](http://www.cclk.cc/2017/08/14/webrtc/webrtc%E5%AD%A6%E4%B9%A02-%E9%9F%B3%E9%A2%91%E9%A2%84%E5%A4%84%E7%90%86%E6%A8%A1%E5%9D%97/)

### OpenCV

TODO

### OpenGL视频渲染

TODO

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
# Linux
$ netstat -ntpl | grep 443
# MacOS
# lsof 通过list open file命令可以查看到当前打开文件，在linux中所有事物都是以文件形式存在，包括网络连接及硬件设备。
$ sudo lsof -i:80  // sudo lsof -i tcp:80
# -i 参数表示网络链接，:80 指明端口号，该命令会同时列出 PID
$ sudo lsof -i -P | grep -i "listen"
# 查看所有进程监听的端口
```

## 补充

![1V1互动直播通讯过程](/images/imageWebRTC/supplement/1V1互动直播通讯过程.png)

![知识框架介绍](/images/imageWebRTC/supplement/TIM-01.jpg)

![知识框架介绍](/images/imageWebRTC/supplement/TIM-02.jpg)

![WebRTC-ICE Candidate Exchange](/images/imageWebRTC/supplement/WebRTC-ICECandidateExchange.svg)

![WebRTC-Signaling Diagram](/images/imageWebRTC/supplement/WebRTC-SignalingDiagram.svg)

<details><summary>turnserver.conf</summary>

```shell
# RFC5766-TURN-SERVER configuration file
# RFC5766-TURN-SERVER配置文件
#
# Boolean values note: where boolean value is supposed to be used,
# you can use '0', 'off', 'no', 'false', 'f' as 'false,
# and you can use '1', 'on', 'yes', 'true', 't' as 'true'
# If the value is missed, then it means 'true'.
#
# 布尔值注意: 布尔值应该被使用,
# 您可以使用'0', 'off', 'no', 'false', 'f' 相当于 'false,
# 还有你可以用'1', 'on', 'yes', 'true', 't' 相当于 'true'
# 如果没有值，相当于'true'.
#

# Listener interface device (optional, Linux only).
# NOT RECOMMENDED.
#
# 侦听器接口设备(仅可选,Linux)。
# 不推荐。
#
listening-device=eth0

# TURN listener port for UDP and TCP (Default: 3478).
# Note: actually, TLS & DTLS sessions can connect to the
# "plain" TCP & UDP port(s), too - if allowed by configuration.
#
# TURN为UDP和TCP的侦听器端口(默认: 3478)。
# 注:实际上,TLS和DTLS会话可以连接到"清晰的"TCP和UDP端口,——如果允许配置。
#
#listening-port=3478
listening-port=3478

# TURN listener port for TLS (Default: 5349).
# Note: actually, "plain" TCP & UDP sessions can connect to the TLS & DTLS
# port(s), too - if allowed by configuration. The TURN server
# "automatically" recognizes the type of traffic. Actually, two listening
# endpoints (the "plain" one and the "tls" one) are equivalent in terms of
# functionality; but we keep both endpoints to satisfy the RFC 5766 specs.
# For secure TCP connections, we currently support SSL version 3 and
# TLS version 1.0, 1.1 and 1.2. SSL2 "encapculation mode" is also supported.
# For secure UDP connections, we support DTLS version 1.
#
# TURN为TLS的侦听器端口(默认: 5349)。
# 注意:事实上,"清晰的"TCP和UDP会话可以连接到TLS和DTLS端口，如果允许配置。
# TURN服务器"自动"识别传输类型。实际上,两个监听终端点("清晰的"端和"TLS"端)是
# 对等的功能;但我们保持两个端点来满足RFC 5766规范。
# 对于安全的TCP连接,我们目前支持SSL的3个版本，是TLS 1.0版本,1.1版本和1.2版本。
# SSL2还支持"encapculation模式"。对于安全的UDP连接,我们支持DTLS版本1。
#
#tls-listening-port=5349
tls-listening-port=5349

# Alternative listening port for UDP and TCP listeners;
# default (or zero) value means "listening port plus one".
# This is needed for RFC 5780 support
# (STUN extension specs, NAT behavior discovery). The TURN Server
# supports RFC 5780 only if it is started with more than one
# listening IP address of the same family (IPv4 or IPv6).
# RFC 5780 is supported only by UDP protocol, other protocols
# are listening to that endpoint only for "symmetry".
#
# 选择UDP和TCP监听器监听端口;
# 默认(或者0)是表示监听的端口加1.
# 这是必须的，为了RFC 5780的支持(STUN的扩展规范, NAT后端的发现)。
# TURN服务器支持RFC 5780只有启动与多个监听同一族的IP地址(IPv4或IPv6).
# RFC 5780只有UDP协议,支持其他协议是监听"对称"型端口的。
#
#alt-listening-port=0
                                   
# Alternative listening port for TLS and DTLS protocols.
# Default (or zero) value means "TLS listening port plus one".
#
# 选择监听端口TLS和DTLS协议。
# 默认(或者0)是表示TLS监听的端口加1.
#
#alt-tls-listening-port=0
    
# Listener IP address of relay server. Multiple listeners can be specified.
# If no IP(s) specified in the config file or in the command line options,
# then all IPv4 and IPv6 system IPs will be used for listening.
#
# 侦听器中继服务器的IP地址。可以指定多个侦听器。
# 如果没有在配置文件或者命令选项中指定监听的IP，
# 那么所有的IPv4和IPv6所有的IP将被监听
#
listening-ip=172.26.7.151

# Auxiliary STUN/TURN server listening endpoint.
# Aux servers have almost full TURN and STUN functionality.
# The (minor) limitations are:
# 1) Auxiliary servers do not have alternative ports and
# they do not support STUN RFC 5780 functionality (CHANGE REQUEST).
# 2) Auxiliary servers also are never returning ALTERNATIVE-SERVER reply.
# Valid formats are 1.2.3.4:5555 for IPv4 and [1:2::3:4]:5555 for IPv6.
# There may be multiple aux-server options, each will be used for listening
# to client requests.
#
# 辅助STUN/TURN服务器监听端口。
# 辅助服务器几乎有齐TURN和STUN功能
# (一些)局限性:
# 1) 辅助服务器没有替代的端口并且他们不支持STUN RFC 5780功能(变更请求)。
# 2) 辅助服务器也不会返回ALTERNATIVE-SERVER回复。
# 有效格式，IPv4的1.2.3.4:5555 和IPv6的[1:2::3:4]:5555。
# 可能会有多个aux-server选项,每个将用于监听客户端请求。
#
#aux-server=172.17.19.110:33478
#aux-server=[2607:f0d0:1002:51::4]:33478

# (recommended for older Linuxes only)
# Automatically balance UDP traffic over auxiliary servers (if configured).
# The load balancing is using the ALTERNATE-SERVER mechanism.
# The TURN client must support 300 ALTERNATE-SERVER response for this
# functionality.
#
# (仅推荐老的Linuxes)
# 在辅助服务器自动均衡UDP流量(如果配置)。
# 使用ALTERNATE-SERVER的负载均衡机制。
# TURN客户端必须支持300个ALTERNATE-SERVER响应。
#
#udp-self-balance

# Relay interface device for relay sockets (optional, Linux only).
# NOT RECOMMENDED.
#
# 终极接口设备为中继套接字(可选, 仅Linux).
# 不推荐。
#
#relay-device=eth1

# Relay address (the local IP address that will be used to relay the
# packets to the peer).
# Multiple relay addresses may be used.
# The same IP(s) can be used as both listening IP(s) and relay IP(s).
# If no relay IP(s) specified, then the turnserver will apply the default
# policy: it will decide itself which relay addresses to be used, and it
# will always be using the client socket IP address as the relay IP address
# of the TURN session (if the requested relay address family is the same
# as the family of the client socket).
#
# 中继地址(本地IP地址将用于传递数据包的给每个端)
# 可以使用多个中继地址。
# 相同的IP可以用作监听IP和继电器IP。
# 如果没有指定中继IP，那么turnserver将应用默认策略：它将自行决定使用那个中继
# 地址，并且它总是会使用客户端套接字的IP地址作为中继的IP地址在TURN会话中(如果
# 请求的中继地址族解决同族的客户端套接字)。
#
#relay-ip=172.17.19.105
#relay-ip=2607:f0d0:1002:51::5
relay-ip=172.26.7.151

# For Amazon EC2 users:#
# TURN Server public/private address mapping, if the server is behind NAT.
# In that situation, if a -X is used in form "-X <ip>" then that ip will be reported
# as relay IP address of all allocations. This scenario works only in a simple case
# when one single relay address is be used, and no RFC5780 functionality is required.
# That single relay address must be mapped by NAT to the 'external' IP.
# The "external-ip" value, if not empty, is returned in XOR-RELAYED-ADDRESS field.
# For that 'external' IP, NAT must forward ports directly (relayed port 12345
# must be always mapped to the same 'external' port 12345).
# In more complex case when more than one IP address is involved,
# that option must be used several times, each entry must
# have form "-X <public-ip/private-ip>", to map all involved addresses.
# RFC5780 NAT discovery STUN functionality will work correctly,
# if the addresses are mapped properly, even when the TURN server itself
# is behind A NAT.
# By default, this value is empty, and no address mapping is used.
#
# Amazon EC2用户:
# TURN服务器公开/私有的地址映射，假如服务器是在NAT后端。
# 在这种情况下,如果一个表单中"-X <ip>"使用一个-X，然后该ip将被作为中继ip地址来使用。
# 这种情况只适用于一个简单的例子,当一个中继的地址是被使用,和没有RFC5780功能是必需的。
# 单个中继地址必须通过NAT映射到外部的IP。
# 外部的IP值，假如不为空，通过XOR-RELAYED-ADDRESS字段返回。
# 外部的IP,NAT必须直接转发端口(转发端口12345，必须总是映射到相同的外部端口12345)。
# 在更复杂的情况下,当涉及到多个IP地址,这个选项必须使用几次,每个条目必须形
# 成"-X <public-ip/private-ip>",将所有涉及到的地址。
# RFC5780 NAT发现STUN功能正常工作，如果正确的地址映射,即使TURN服务器本身是
# 在一个NAT后。
# 默认，该值为空，并且没有使用地址映射。
#
#external-ip=60.70.80.91
#
#OR:
#
#external-ip=60.70.80.91/172.17.19.101
#external-ip=60.70.80.92/172.17.19.102
external-ip=47.92.119.215


# Number of relay threads to handle the established connections
# (in addition to authentication thread and the listener thread).
# If set to 0 then application runs relay process in a single thread,
# in the same thread with the listener process (the authentication thread will
# still be a separate thread).
# In the older systems (Linux kernel before 3.9),
# the number of UDP threads is always one thread per network listening endpoint -
# including the auxiliary endpoints - unless 0 (zero) or 1 (one) value is set.
#
# 数量的中继线程处理建立连接(除了验证线程和侦听器线程)。
# 如果设置为0,那么应用程序中继进程在一个线程中运行,在同一
# 个线程中监听处理(身份验证线程仍然是一个单独的线程)。
# 在旧系统(3.9 Linux内核之前),数量的UDP线程总是一个线程监听一个网络端点,包括辅助端点——除非设置0或1值。
#
#relay-threads=0
relay-threads=10

# Lower and upper bounds of the UDP relay endpoints:
# (default values are 49152 and 65535)
#
# UDP中继端点的上下边界:
# (默认是49152至65535)
#
min-port=49152
max-port=65535
    
# Uncomment to run TURN server in 'normal' 'moderate' verbose mode.
# By default the verbose mode is off.
#
# 取消TURN服务器运行'normal' 'moderate'详细模式。
# 默认情况下,详细模式是关闭的。
#
#verbose
    
# Uncomment to run TURN server in 'extra' verbose mode.
# This mode is very annoying and produces lots of output.
# Not recommended under any normal circumstances.
#
# 取消TURN服务器运行'extra'详细模式。
# 这种模式是非常恼人的,产生大量的输出。
# 在任何正常情况下不建议。
#
#Verbose

# Uncomment to use fingerprints in the TURN messages.
# By default the fingerprints are off.
#
# 取消在TURN消息中使用指纹。
# 默认情况下,指纹是关闭的。
#
#fingerprint

# Uncomment to use long-term credential mechanism.
# By default no credentials mechanism is used (any user allowed).
# This option can be used with either flat file user database or
# PostgreSQL DB or MySQL DB or Redis DB for user keys storage.
#
# 取消使用长期证书机制。
# 默认情况下不使用凭证机制(允许任何用户)。
# 这个选项可能使用用户数据文件或PostgreSQL或MySQL或Redis来存储用户密钥。
#
#lt-cred-mech
lt-cred-mech

# Uncomment to use short-term credential mechanism.
# By default no credentials mechanism is used (any user allowed).
# For short-term credential mechanism you have to use PostgreSQL or
# MySQL or Redis database for user password storage.
#
# 取消使用短期证书机制。
# 默认情况下不使用凭证机制(允许任何用户)。
# 短期证书机制必须使用PostgreSQL或MySQL或Redis数据库来存储用户密码。
#
#st-cred-mech

# This option is opposite to lt-cred-mech or st-cred-mech.
# (TURN Server with no-auth option allows anonymous access).
# If neither option is defined, and no users are defined,
# then no-auth is default. If at least one user is defined,
# in this file or in command line or in usersdb file, then
# lt-cred-mech is default.
#
# 这个选项是lt-cred-mech或st-cred-mech相反。
# (TURN服务器no-auth选项允许匿名访问)。
# 如果没有选项定义,没有用户定义,那么no-auth默认。
# 如果至少定义有一个用户,在这个文件中或在命令行或usersdb文件,
# 那么lt-cred-mech默认。
#
#no-auth

# TURN REST API flag.
# Flag that sets a special authorization option that is based upon authentication secret.
# This feature can be used with the long-term authentication mechanism, only.
# This feature purpose is to support "TURN Server REST API", see
# "TURN REST API" link in the project's page
# http://code.google.com/p/rfc5766-turn-server/.
# This option is used with timestamp:
# usercombo -> "timestamp:userid"
# turn user -> usercombo
# turn password -> base64(hmac(secret key, usercombo))
# This allows TURN credentials to be accounted for a specific user id.
# If you don't have a suitable id, the timestamp alone can be used.
# This option is just turning on secret-based authentication.
# The actual value of the secret is defined either by option static-auth-secret,
# or can be found in the turn_secret table in the database (see below).
#
# TURN REST API标志。
# 标志是设置一个特殊的授权选项,是基于身份验证的私密。
# 这个功能可以用于长期验证机制。
# 这个功能的目的是支持"TURN Server REST API",看到"TURN Server REST API"项目的页面的链接
# http://code.google.com/p/rfc5766-turn-server/。
# 这个选项是使用时间戳:
# usercombo -> "timestamp:userid"
# turn user -> usercombo
# turn password -> base64(hmac(secret key, usercombo))
# 这允许TURN凭证占用一个特定的用户id。
# 如果你没有一个合适的id,可以使用单独的时间戳。
# 这个选项只是打开基于私密的身份验证。
# 实际值定义的私密就是通过选择static-auth-secret,或可以在数据库中找到turn_secret表(见下文)。
#
use-auth-secret

# 'Static' authentication secret value (a string) for TURN REST API only.
# If not set, then the turn server
# will try to use the 'dynamic' value in turn_secret table
# in user database (if present). The database-stored  value can be changed on-the-fly
# by a separate program, so this is why that other mode is 'dynamic'.
#
# TURN REST API的'Static'身份验证的私密值(字符串)
# 如果没有设置，那么turn服务器将尝试使用'dynamic'值在用户数据库的turn_secret表(如果存在)。
# 数据库存储的值可以随时改变，通过单独的程序，所以这就是'dynamic'模式。
#
static-auth-secret=ling 

# 'Static' user accounts for long term credentials mechanism, only.
# This option cannot be used with TURN REST API or with short-term credentials
# mechanism.
# 'Static' user accounts are NOT dynamically checked by the turnserver process,
# so that they can NOT be changed while the turnserver is running.
#
# 'Static'用户长期占凭证机制。
# 这个选项不能用于TURN REST API或短期凭证机制。
# 'Static'用户帐户不是turnserver程序动态检查,所以他们不能改变在turnserver运行时。
#
#user=username1:key1
#user=username2:key2
# OR:
#user=username1:password1
#user=username2:password2
#
# Keys must be generated by turnadmin utility. The key value depends
# on user name, realm, and password:
#
# 钥匙必须由turnadmin实用程序生成。键值取决于用户名称、领域和密码:
#
# Example:
# 例子,使用以下命令:
#
# $ turnadmin -k -u ninefingers -r north.gov -p youhavetoberealistic
#
# Output: 0xbc807ee29df3c9ffa736523fb2c4e8ee
# 输出是: 0xbc807ee29df3c9ffa736523fb2c4e8ee
#
# ('0x' in the beginning of the key is what differentiates the key from
# password. If it has 0x then it is a key, otherwise it is a password).
# ('0x'开始的关键是区分从密码的关键。如果它有0x,那么它是一个关键,否则这是一个密码)。
#
# The corresponding user account entry in the config file will be:
# 相应的配置文件中的用户帐户条目将:
#
#user=ninefingers:0xbc807ee29df3c9ffa736523fb2c4e8ee
# Or, equivalently, with open clear password (less secure):
#或者是这样，明文密码(不安全的):
user=ling:0xc93be9d24fb0eab034f539c855528a26
#
user=ling:ling1234

# 'Dynamic' user accounts database file name.
# Only users for long-term mechanism can be stored in a flat file,
# short-term mechanism will not work with option, the short-term
# mechanism required PostgreSQL or MySQL or Redis database.
# 'Dynamic' long-term user accounts are dynamically checked by the turnserver process,
# so that they can be changed while the turnserver is running.
# Default file name is turnuserdb.conf.
#
# 'Dynamic'用户帐户数据库文件名。
# 只有用户长期机制可以存储在一个文件,短期机制不会处理选项,短期机制需要PostgreSQL或MySQL或
# Redis数据库。
# 'Dynamic'的长期用户帐户在turnserver程序中动态检查的,这样他们可以改变的在turnserver运行时。
# 默认文件名是turnuserdb.conf.
#
#userdb=/usr/local/etc/turnuserdb.conf
userdb=/etc/turnuserdb.conf

# PostgreSQL database connection string in the case that we are using PostgreSQL
# as the user database.
# This database can be used for long-term and short-term credential mechanisms
# and it can store the secret value for secret-based timed authentication in TURN RESP API.
# See http://www.postgresql.org/docs/8.4/static/libpq-connect.html for 8.x PostgreSQL
# versions connection string format, see
# http://www.postgresql.org/docs/9.2/static/libpq-connect.html#LIBPQ-CONNSTRING
# for 9.x and newer connection string formats.
#
# PostgreSQL数据库连接字符串,使用PostgreSQL作为用户数据库。
# 该数据库可用于长期和短期证书机制,它可以存储的私密值，为基于私密身份验证的在TURN RESP API中。
# 8.x PostgreSQL版本请参见http://www.postgresql.org/docs/8.4/static/libpq-connect.html的连接字符串
# 格式,9.x和更新的请参阅http://www.postgresql.org/docs/9.2/static/libpq-connect.html LIBPQ-CONNSTRING
# 的连接字符串格式。
#
#psql-userdb="host=<host> dbname=<database-name> user=<database-user> password=<database-user-password> connect_timeout=30"

# MySQL database connection string in the case that we are using MySQL
# as the user database.
# This database can be used for long-term and short-term credential mechanisms
# and it can store the secret value for secret-based timed authentication in TURN RESP API.
# Use string format as below (space separated parameters, all optional):
#
# MySQL数据库连接字符串,使用MySQL作为用户数据库。
# 该数据库可用于长期和短期证书机制,它可以存储的私密值，为基于私密身份验证的在TURN RESP API中。
# 使用字符串格式如下(空间分离参数,所有可选):
#
#mysql-userdb="host=<host> dbname=<database-name> user=<database-user> password=<database-user-password> port=<port> connect_timeout=<seconds>"

# Redis database connection string in the case that we are using Redis
# as the user database.
# This database can be used for long-term and short-term credential mechanisms
# and it can store the secret value for secret-based timed authentication in TURN RESP API.
# Use string format as below (space separated parameters, all optional):
#
# Redis数据库连接字符串,使用Redis作为用户数据库。
# 该数据库可用于长期和短期证书机制,它可以存储的私密值，为基于私密身份验证的在TURN RESP API中。
# 使用字符串格式如下(空间分离参数,所有可选):
#
#redis-userdb="ip=<ip-address> dbname=<database-number> password=<database-user-password> port=<port> connect_timeout=<seconds>"

# Redis status and statistics database connection string, if used (default - empty, no Redis stats DB used).
# This database keeps allocations status information, and it can be also used for publishing
# and delivering traffic and allocation event notifications.
# The connection string has the same parameters as redis-userdb connection string.
# Use string format as below (space separated parameters, all optional):
#
# Redis状态和统计数据库连接字符串,如果使用(默认空,没有Redis统计数据库使用)。
# 这个数据库保持分配状态信息,它也可以用于发布和交付传输和分配事件通知。
# 连接字符串有相同的参数作为redis-userdb连接字符串。
# 使用字符串格式如下(空间分离参数,所有可选):
#
#redis-statsdb="ip=<ip-address> dbname=<database-number> password=<database-user-password> port=<port> connect_timeout=<seconds>"

# Realm for long-term credentials mechanism and for TURN REST API.
#
# TURN REST API的长期凭证机制范围。
#
#realm=mycompany.org

# Per-user allocation quota.
# default value is 0 (no quota, unlimited number of sessions per user).
#
# 每个用户分配配额。
# 默认值为0(没有配额,每个用户无限数量的会话)。
#
#user-quota=0

# Total allocation quota.
# default value is 0 (no quota).
#
# 总分配配额。
# 默认值为0(无配额)。
#
#total-quota=0

# Max bytes-per-second bandwidth a TURN session is allowed to handle
# (input and output network streams are treated separately). Anything above
# that limit will be dropped or temporary suppressed (within
# the available buffer limits).
#
# TURN会话允许最大的传输占用带宽(输入和输出网络流分别处理)。
# 高于限制将被删除或暂时抑制(在可用的缓冲区范围内)。
#
#max-bps=0
max-bps=1024

# Uncomment if no UDP client listener is desired.
# By default UDP client listener is always started.
#
# 如果没有UDP客户端监听器需要取消。
# 默认情况下UDP客户端监听器总是启动。
#
#no-udp

# Uncomment if no TCP client listener is desired.
# By default TCP client listener is always started.
#
# 如果没有TCPP客户端监听器需要取消。
# 默认情况下TCPP客户端监听器总是启动。
#
#no-tcp

# Uncomment if no TLS client listener is desired.
# By default TLS client listener is always started.
#
# 如果没有TLS客户端监听器需要取消。
# 默认情况下TLS客户端监听器总是启动。
#
#no-tls

# Uncomment if no DTLS client listener is desired.
# By default DTLS client listener is always started.
#
# 如果没有DTLS客户端监听器需要取消。
# 默认情况下DTLS客户端监听器总是启动。
#
#no-dtls

# Uncomment if no UDP relay endpoints are allowed.
# By default UDP relay endpoints are enabled (like in RFC 5766).
#
# 如果不允许UDP中继端点需要取消。
# 默认情况下启用UDP继电器端点(如在RFC 5766)。
#
#no-udp-relay

# Uncomment if no TCP relay endpoints are allowed.
# By default TCP relay endpoints are enabled (like in RFC 6062).
#
# 如果不允许TCP中继端点需要取消。
# 默认情况下启用TCP继电器端点(如在RFC 5766)。
#
#no-tcp-relay

# Uncomment if extra security is desired,
# with nonce value having limited lifetime (600 secs).
# By default, the nonce value is unique for a session,
# but it has unlimited lifetime. With this option,
# the nonce lifetime is limited to 600 seconds, after that
# the client will get 438 error and will have to re-authenticate itself.
#
# 取消如果需要额外的安全,现时已有有限的生命周期(600秒)。
# 默认情况下,一个会话的唯一临界值,但它一般拥有无限的生命周期。这个选项,临界值
# 仅限于600秒,之后,客户端将得到438错误,将不得不重新认证。
#
stale-nonce

# Certificate file.
# Use an absolute path or path relative to the
# configuration file.
#
# 证书文件。
# 使用绝对路径或路径相对于配置文件。
#
cert=/etc/cacert.pem

# Private key file.
# Use an absolute path or path relative to the
# configuration file.
# Use PEM file format.
#
# 私钥文件。
# 使用绝对路径或路径相对于配置文件。使用PEM文件格式。
#
pkey=/etc/cakey.pem

# Private key file password, if it is in encoded format.
# This option has no default value.
#
# 私有密钥文件密码,如果是在编码格式。
# 这个选项没有默认值。
#
#pkey-pwd=...

# Allowed OpenSSL cipher list for TLS/DTLS connections.
# Default value is "DEFAULT".
#
# 允许OpenSSL的密码列表为TLS/DTLS连接。
# 默认值是"DEFAULT"
#
#cipher-list="DEFAULT"

# CA file in OpenSSL format.
# Forces TURN server to verify the client SSL certificates.
# By default it is not set: there is no default value and the client
# certificate is not checked.
#
# 在OpenSSL格式的CA文件。
# 强制TURN服务器验证客户端SSL证书。
# 默认情况下它没有设置:没有默认值,不检查的客户端证书。
#
# Example:
#CA-file=/etc/ca11111.crt

# Curve name for EC ciphers, if supported by OpenSSL library (TLS and DTLS).
# The default value is prime256v1.
#
# 曲线名称的EC密码,如果由OpenSSL库支持(TLS和DTLS)。
# 默认值是prime256v1。
#
#ec-curve-name=prime256v1

# Use 566 bits predefined DH TLS key. Default size of the key is 1066.
#
# 使用566位预定义DH TLS键。默认键大小是1066
#
#dh566

# Use 2066 bits predefined DH TLS key. Default size of the key is 1066.
#
# 使用2066位预定义DH TLS键。默认键大小是1066
#
#dh2066

# Use custom DH TLS key, stored in PEM format in the file.
# Flags --dh566 and --dh2066 are ignored when the DH key is taken from a file.
#
# 使用惯例的DH TLS键，使用PEM格式存储在文件里
# 当DH键从文件里加载，将忽略标志--dh566和--dh2066
#
#dh-file=<DH-PEM-file-name>

# Flag to prevent stdout log messages.
# By default, all log messages are going to both stdout and to
# the configured log file. With this option everything will be
# going to the configured log only (unless the log file itself is stdout).
#
# 标志防止输出日志信息
# 默认情况下,所有日志消息将输出到配置的日志文件。采用这一选项都将只配置日志
# (除非日志文件本身是输出的)。
#
#no-stdout-log

# Option to set the log file name.
# By default, the turnserver tries to open a log file in
# /var/log, /var/tmp, /tmp and current directories directories
# (which open operation succeeds first that file will be used).
# With this option you can set the definite log file name.
# The special names are "stdout" and "-" - they will force everything
# to the stdout. Also, the "syslog" name will force everything to
# the system log (syslog).
# In the runtime, the logfile can be reset with the SIGHUP signal
# to the turnserver process.
#
# 设置日志文件
# 默认情况下,turnserver尝试一个日志文件在/var/log,/var/tmp,/tmp和
# 当前目录(那个文件先打开成功,文件将被使用)。
# 采用这一选项可以设置明确的日志文件名。
# 特殊的名字是"stdout"和"-"——他们将强制所有的输出。同时,"syslog"名称将强制所有的系统日志(syslog)。
# 在运行时,日志文件可以重置通过SIGHUP信号在turnserver程序中。
#
#log-file=/var/tmp/turn.log

# Option to redirect all log output into system log (syslog).
#
# 选择重定向所有日志输出到系统日志(syslog)。
#
#syslog

# This flag means that no log file rollover will be used, and the log file
# name will be constructed as-is, without PID and date appendage.
#
# 这个标志意味着没有日志文件将使用翻转,并按原样将创建日志文件名称,没有PID和日期的附加。
#
#simple-log

# Option to set the "redirection" mode. The value of this option
# will be the address of the alternate server for UDP & TCP service in form of
# <ip>[:<port>]. The server will send this value in the attribute
# ALTERNATE-SERVER, with error 300, on ALLOCATE request, to the client.
# Client will receive only values with the same address family
# as the client network endpoint address family.
# See RFC 5389 and RFC 5766 for ALTERNATE-SERVER functionality description.
# The client must use the obtained value for subsequent TURN communications.
# If more than one --alternate-server options are provided, then the functionality
# can be more accurately described as "load-balancing" than a mere "redirection".
# If the port number is omitted, then the default port
# number 3478 for the UDP/TCP protocols will be used.
# Colon ( characters in IPv6 addresses may conflict with the syntax of
# the option. To alleviate this conflict, literal IPv6 addresses are enclosed
# in square brackets in such resource identifiers, for example:
# [2001:db8:85a3:8d3:1319:8a2e:370:7348]:3478 .
# Multiple alternate servers can be set. They will be used in the
# round-robin manner. All servers in the pool are considered of equal weight and
# the load will be distributed equally. For example, if we have 4 alternate servers,
# then each server will receive 25% of ALLOCATE requests. A alternate TURN server
# address can be used more than one time with the alternate-server option, so this
# can emulate "weighting" of the servers.
#
# 选项设置"redirection"模式。这个选项的值将备用服务器的地址UDP和TCP服务形式的<ip>[:<port>]。
# 服务器将发送这个值属性ALTERNATE-SERVER,错误300,在ALLOCATE请求,客户端。
# 客户端将只接收和自己相同的地址族的客户端的值。查看RFC 5389和RFC 5766为ALTERNATE-SERVER的功能描述。
# 客户端必须使用获得的值为随后的TURN通信。如果不止一个——alternate-server选项提供,那么功能可以更准确
# 地描述为"load-balancing",而不仅仅是一个"redirection"。如果端口号省略,那么为UDP/TCP协议，使用默认端
# 口号是3478。冒号(在IPv6地址字符可能与选项的语法冲突。缓解这种冲突,文字IPv6地址包含在方括号在这种
# 资源标识符,例如[2001:db8:85a3:8d3:1319:8a2e:370:7348]:3478 。
# 可以设置多个备用服务器。他们将用于循环的方式。所有服务器池中被认为是平等的重量和载荷将平均分配的原则。
# 例如,如果我们有4个备用服务器,每个服务器将获得25%的分配请求。备用TURN服务器地址可以使用超过一次
# alternate-server选项,所以这可以效仿的"weighting"服务器。
#
# Examples:
#alternate-server=1.2.3.4:5678
#alternate-server=11.22.33.44:56789
#alternate-server=5.6.7.8
#alternate-server=[2001:db8:85a3:8d3:1319:8a2e:370:7348]:3478
              
# Option to set alternative server for TLS & DTLS services in form of
# <ip>:<port>. If the port number is omitted, then the default port
# number 5349 for the TLS/DTLS protocols will be used. See the previous
# option for the functionality description.
#
# 选项设置替代服务器TLS和DTLS服务形式的<ip>:<port>。
# 如果省略的端口号,那么默认端口号5349将使用TLS/DTLS协议。看到前面选择的功能描述。
#
# Examples:
#tls-alternate-server=1.2.3.4:5678
#tls-alternate-server=11.22.33.44:56789
#tls-alternate-server=[2001:db8:85a3:8d3:1319:8a2e:370:7348]:3478

# Option to suppress TURN functionality, only STUN requests will be processed.
# Run as STUN server only, all TURN requests will be ignored.
# By default, this option is NOT set.
#
# 选择抑制TURN功能,只有STUN的请求将被处理。
# 作为STUN服务器,所有TURN请求将被忽略。
# 默认情况下,没有设置这个选项。
#
#stun-only

# Option to suppress STUN functionality, only TURN requests will be processed.
# Run as TURN server only, all STUN requests will be ignored.
# By default, this option is NOT set.
#
# 选择抑制STUN功能,只有TURN的请求将被处理。
# 作为TURN服务器,所有STUN请求将被忽略。
# 默认情况下,没有设置这个选项。
#
#no-stun

# This is the timestamp/username separator symbol (character) in TURN REST API.
# The default value is ':'.
#
# 这是时间戳/用户名分离器符号(字符)在TURN REST API。
# 默认是使用':'
#
# rest-api-separator=:    

# Flag that can be used to disallow peers on the loopback addresses (127.x.x.x and ::1).
# This is an extra security measure.
#
# 标记用于不接受的端在环回地址(127.x.x.x 和 ::1)。
# 这是一个额外的安全措施。
#
#no-loopback-peers
172.26.7.151
# Flag that can be used to disallow peers on well-known broadcast addresses (224.0.0.0 and above, and FFXX:*).
# This is an extra security measure.
#
# 标记用于不接受的端在广播地址(224.0.0.0和以上的，和FFXX:*)。
# 这是一个额外的安全措施。
#
#no-multicast-peers

# Option to set the max time, in seconds, allowed for full allocation establishment.
# Default is 60 seconds.
#
# 选项设置的最大时间,以秒为单位,允许完整的分配。
# 默认60秒
#
#max-allocate-timeout=60

# Option to allow or ban specific ip addresses or ranges of ip addresses.
# If an ip address is specified as both allowed and denied, then the ip address is
# considered to be allowed. This is useful when you wish to ban a range of ip
# addresses, except for a few specific ips within that range.
# This can be used when you do not want users of the turn server to be able to access
# machines reachable by the turn server, but would otherwise be unreachable from the
# internet (e.g. when the turn server is sitting behind a NAT)
#
# 选择允许或禁止特定的ip地址或ip地址范围。
# 如果指定一个ip地址允许和拒绝,那么ip地址被认为是允许的。这是有用的,当你希望禁止一个范
# 围的ip地址,除了一些特定的ip范围内。
# 这可以使用当你不希望turn服务器的用户能够访问机器通过turn服务器,但可能是另一方面从互联
# 网上不能到达(例如,当turn服务器是在一个NAT后)
#
# Examples:
# denied-peer-ip=83.166.64.0-83.166.95.255
# allowed-peer-ip=83.166.68.45

# File name to store the pid of the process.
# Default is /var/run/turnserver.pid (if superuser account is used) or
# /var/tmp/turnserver.pid .
#
# 存储进程pid的文件名。
# 默认是/var/run/turnserver.pid(超级用户使用)或者是/var/tmp/turnserver.pid
#
#pidfile="/var/run/turnserver.pid"
pidfile="/var/tmp/turnserver.pid"

# Require authentication of the STUN Binding request.
# By default, the clients are allowed anonymous access to the STUN Binding functionality.
#
# 需要STUN绑定请求的身份验证。
# 默认情况下,客户允许匿名访问STUN绑定功能。
#
#secure-stun

# Require SHA256 digest function to be used for the message integrity.
# By default, the server uses SHA1 (as per TURN standard specs).
# With this option, the server
# always requires the stronger SHA256 function. The client application
# must support SHA256 hash function if this option is used. If the server obtains
# a message from the client with a weaker (SHA1) hash function then the
# server returns error code 426.
#
# 需要SHA256采摘功能用于消息的完整性。
# 默认情况下,服务器使用SHA1(按标准规格)。
# 采用这一选项,服务器总是需要更强的SHA256功能。客户端应用程序必须支持SHA256散列函数
# 如果使用这个选项。如果服务器获得消息从客户端较弱(SHA1)散列函数那么服务器返回错误代码426。
#
#sha256

# Mobility with ICE (MICE) specs support.
#
# 移动的ICE(MICE)的规范支持。
#
#mobility

# User name to run the process. After the initialization, the turnserver process
# will make an attempt to change the current user ID to that user.
#
# 用户名运行程序。初始化后,turnserver程序将试图改变当前用户的用户ID。
#
#proc-user=<user-name>

# Group name to run the process. After the initialization, the turnserver process
# will make an attempt to change the current group ID to that group.
#
# 组名运行程序。初始化后,turnserver程序将试图改变当前组的组ID。
#
#proc-group=<group-name>

# Turn OFF the CLI support.
# By default it is always ON.
# See also options cli-ip and cli-port.
#
# 关掉CLI的支持。
# 默认情况下它总是ON。
# 参阅选项cli-ip和cli-port。
#
#no-cli

#Local system IP address to be used for CLI server endpoint. Default value
# is 127.0.0.1.
#
# 本地系统的IP地址将用于CLI服务器端点。默认值是127.0.0.1。
#
#cli-ip=127.0.0.1

# CLI server port. Default is 5766.
#
# CLI服务器端口。默认是5766。
#
#cli-port=5766

# CLI access password. Default is empty (no password).
#
# CLI访问密码。默认是空的(没有密码)。
#
cli-password=logen

# Server relay. NON-STANDARD AND DANGEROUS OPTION.
# Only for those applications when we want to run
# server applications on the relay endpoints.
# This option eliminates the IP permissions check on
# the packets incoming to the relay endpoints.
#
# 中继服务器。NON-STANDARD和DANGEROUS的选择。
# 只对这些应用程序时,我们想在中继服务器上运行服务器应用程序端点。
# 这个选项可以消除IP权限检查传递的数据包传入的端点。
#
#server-relay

# Maximum number of output sessions in ps CLI command.
# This value can be changed on-the-fly in CLI. The default value is 256.
#
# 最大数量的输出会议在ps CLI命令。
# 这个值可以动态改变在CLI。默认值是256。
#
#cli-max-output-sessions

# Set network engine type for the process (for internal purposes).
#
# 设置网络引擎类型(用于内部目的)的过程。
#
#ne=[1|2|3]

# Do not allow an SSL/TLS version of protocol
#
# 不允许一个SSL/TLS版本的协议
#
#no-sslv2
#no-sslv3
#no-tlsv1
#no-tlsv1_1
#no-tlsv1_2%  
```

</details>

