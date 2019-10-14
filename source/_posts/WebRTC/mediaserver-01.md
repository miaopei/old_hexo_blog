---
title: WebRTC 流媒体服务器（二）
tags:
  - WebRTC
categories:
  - WebRTC
reward: true
abbrlink: 5975
date: 2019-10-12 10:56:03
---

# WebRTC 流媒体服务器

## TCP/IP详解

### IP协议详解

<!-- more -->

![IP协议头](/images/imageWebRTC/mediaserver/IP协议头.png)

![MTU](/images/imageWebRTC/mediaserver/MTU.png)

### TCP协议详解

![TCP/IP协议栈](/images/imageWebRTC/mediaserver/TCPIP协议栈.png)

![TCP协议头](/images/imageWebRTC/mediaserver/TCP协议头.png)

![Seq Number含义](/images/imageWebRTC/mediaserver/SeqNumber.png)

Ack Number 表示可靠性：

![Ack Number含义](/images/imageWebRTC/mediaserver/AckNumber.png)

### TCP三次握手

![TCP三次握手](/images/imageWebRTC/mediaserver/TCP三次握手.png)

### TCP四次挥手

![TCP四次挥手](/images/imageWebRTC/mediaserver/TCP四次挥手-01.png)

![TCP四次挥手ACK未收到重发FIN](/images/imageWebRTC/mediaserver/TCP四次挥手-02.png)

### TCP的ACK机制

![TCP协议](/images/imageWebRTC/mediaserver/TCP-ACK-01.png)

![TCP ACK机制](/images/imageWebRTC/mediaserver/TCP-ACK-02.png)

![TCP ACK机制](/images/imageWebRTC/mediaserver/TCP-ACK-03.png)

![TCP ACK机制](/images/imageWebRTC/mediaserver/TCP-ACK-04.png)

### TCP滑动窗口

![滑动窗口](/images/imageWebRTC/mediaserver/滑动窗口-01.png)

![Delay ACK](/images/imageWebRTC/mediaserver/滑动窗口-02.png)

![Data ACK](/images/imageWebRTC/mediaserver/滑动窗口-03.png)

### UDP与RTP

![UDP协议](/images/imageWebRTC/mediaserver/UDP协议.png)

![RTP](/images/imageWebRTC/mediaserver/RTP.png)

### 实时通信TCP_UDP的选择

![TCP丢包重传](/images/imageWebRTC/mediaserver/TCP丢包重传.png)

一般情况下实时通信会选择UDP，丢包重传、延迟、乱序一般是在应用层去实现。TCP在极端网络下丢包会造成很大的延迟。

### TCP在实时通信中的作用

一般情况下使用UDP，在UDP无法连通的情况下使用TCP，在全世界使用网络的应用80%以上都是TCP。

在连通性上TCP要比UDP好太多。

所有做音视频实时通信都要关注的一个指标：连通率。默认UDP，UDP不通使用TCP，TCP端口被限制情况下可以使用HTTPS。

## UDP/RTP/RTCP详解

### RTP包的使用

延迟要保证在800毫秒以内，更好的的500毫秒以内。

![RTP](/images/imageWebRTC/mediaserver/RTP.png)

![RTP包的使用](/images/imageWebRTC/mediaserver/RTP包的使用.png)

### RTCP协议头的分析

![RTCP包](/images/imageWebRTC/mediaserver/RTCP包.png)

![RTCP Header](/images/imageWebRTC/mediaserver/RTCPHeader.png)

![RTCP Header说明](/images/imageWebRTC/mediaserver/RTCPHeader说明.png)

### RTCP PayloadType介绍

![RTCP Type](/images/imageWebRTC/mediaserver/RTCPType-01.png)

![RTCP Type](/images/imageWebRTC/mediaserver/RTCPType-02.png)

### RTCP SR报文详解

![RTCP SR](/images/imageWebRTC/mediaserver/RTCPSR-01.png)

![RTCP SR](/images/imageWebRTC/mediaserver/RTCPSR-02.png)

![Sender Info说明](/images/imageWebRTC/mediaserver/SenderInfo说明.png)

![RTCP SR](/images/imageWebRTC/mediaserver/RTCPSR-03.png)

![Receive Report Block](/images/imageWebRTC/mediaserver/ReceiveReportBlock.png)

### RTCP RR SDES报文介绍

![RTCP RR](/images/imageWebRTC/mediaserver/RTCPRR.png)

![RTCP SDES](/images/imageWebRTC/mediaserver/RTCPSDES.png)

![RTCP SDES](/images/imageWebRTC/mediaserver/RTCPSDES-01.png)

![SDES item](/images/imageWebRTC/mediaserver/SDESitem.png)

![SDES说明](/images/imageWebRTC/mediaserver/SDES说明.png)

### BYE APP报文介绍

![RTCP BYE](/images/imageWebRTC/mediaserver/RTCPBYE.png)

![RTCP APP](/images/imageWebRTC/mediaserver/RTCPAPP.png)

![RTCP APP](/images/imageWebRTC/mediaserver/RTCPAPP-01.png)

### RTCP FB协议介绍

![RTCP Type](/images/imageWebRTC/mediaserver/RTCPType.png)

![RTCP FB Type](/images/imageWebRTC/mediaserver/RTCPFBType.png)

![RTCP RTPFB Type](/images/imageWebRTC/mediaserver/RTCPRTPFBType.png)

![RTCP PsFB Type](/images/imageWebRTC/mediaserver/RTCPPsFBType.png)

![RTCP FB Header](/images/imageWebRTC/mediaserver/RTCPFBHeader.png)

## WebRTC协议

### STUN协议介绍

STUN协议介绍：

- STUN存在的目的就是进行 NAT 穿越
- STUN是典型的客户端 / 服务器模式。客户端发送请求，服务器进行响应

![RFC STUN规范](/images/imageWebRTC/mediaserver/RFCSTUN规范.png)

STUN协议：

- 包括 20 字节的 STUN header
- Body 中可以有 0 个或多个 Attribute

![STUN Header格式](/images/imageWebRTC/mediaserver/STUNHeader格式.png)

![STUN Header](/images/imageWebRTC/mediaserver/STUNHeader.png)

### STUN Message Type消息

![STUN Message Type](/images/imageWebRTC/mediaserver/STUNMessageType-01.png)

![STUN Message Type](/images/imageWebRTC/mediaserver/STUNMessageType-02.png)

![C0C1](/images/imageWebRTC/mediaserver/STUNMessageType-03.png)

![STUN消息类型](/images/imageWebRTC/mediaserver/STUNMessageType-04.png)

**大小端模式：**

- **大端模式**：数据的高字节保存在内存的低地址中
- **小端模式**：数据的高字节保存在内存的高地址中
- **网络字节顺序**：采用大端排序方式

![STUN Message Type](/images/imageWebRTC/mediaserver/STUNMessageType-05.png)

![Transaction ID](/images/imageWebRTC/mediaserver/STUNMessageType-06.png)

### STUN body详解

STUN Message Body：

- 消息头后有 0 或多个属性
- 每个属性进行 `TLV` 编码： `Type`、`Lenght`、`Value`

![TLV](/images/imageWebRTC/mediaserver/TLV.png)

![RFC3489定义的属性](/images/imageWebRTC/mediaserver/RFC3489定义的属性.png)

![Attribute的使用](/images/imageWebRTC/mediaserver/Attribute的使用.png)

### ICE工作中原理

什么是ICE：

- ICE：Interactive Connectivity Establishment
- 需要两端进行交互才能创建连接

![ICE](/images/imageWebRTC/mediaserver/ICE.png)

![ICE Candidate](/images/imageWebRTC/mediaserver/ICECandidate.png)

Candidate类型：

- 主机候选者
- 反射候选择
- 中继候选者

![Candidate关系图](/images/imageWebRTC/mediaserver/Candidate关系图.png)

收集Candidate：

- Host Candidate：本机所有 IP 和指定端口
- Reflexive Candidate：STUN / TURN
- Relay Candidate：TURN

ICE 具体做些什么：

- 收集 Candidate
- 对 Candidate Pair 排序
- 连通性检查

### 加密解密基本概念

什么是非对称加密：

- 什么是公钥
- 什么是私钥

数字签名：

- 数字签名的作用
- 如何使用数字签名

数字证书：

- 数字证书的使用
- 如何获取证书

![私有证书](/images/imageWebRTC/mediaserver/私有证书.png)

![常用加密算法](/images/imageWebRTC/mediaserver/常用机密算法.png)

### OpenSSL概念及使用

OpenSSL：

- 什么是 OpenSSL
- SSL，Secure Sockets Layer
- TLS，Transport Layer Security

TLS协议：

- TLS 握手协议
- TLS 记录协议

OpenSSL原理：

- SSL_CTX
- SSL：代表一个 SSL 连接
- SSL_Write / SSL_Read

![OpenSSL的使用](/images/imageWebRTC/mediaserver/OpenSSL的使用.png)

DTLS 协议：

- TLS 是基于 TCP 协议的
- DTLS 基于 UDP 协议的

### DTLS协议详解

![DTLS握手协议](/images/imageWebRTC/mediaserver/DTLS握手协议.png)

![DTLS时序图](/images/imageWebRTC/mediaserver/DTLS时序图.png)

![WebRTC安全机制](/images/imageWebRTC/mediaserver/WebRTC安全机制.png)

### TLS-SRTP协议详解

DTLS要解决的问题：

- 交换密钥
- 加密算法

SRTP要解决的问题：

- 对数据加密，保证数据安全
- 保证数据完整性

![SRTP](/images/imageWebRTC/mediaserver/SRTP.png)

![libsrtp](/images/imageWebRTC/mediaserver/libsrtp.png)

## SDP协议与WebRTC媒体协商【需要牢牢掌握】

### 媒体协商过程

![媒体协商过程](/images/imageWebRTC/mediaserver/媒体协商过程.png)

媒体协商方法：

- `createOffer`
- `createAnswer`
- `setLocalDescription`
- `setRemoteDescription`

### SDP协议简介

什么是SDP：

> **SDP（Session Description Protocol）** 它只是一种信息格式的描述标准，本身不属于传输协议，但是可以被其他传输协议用来交换必要的信息。

SDP 规范：

- 多个媒体级描述
- 一个会话级描述
- 由多个 `<type> = <value>` 组成

会话层：

- 会话的名称与目的
- 会话的存活时间
- 会话中包括多个媒体信息

媒体层：

- 媒体格式
- 传输协议
- 传输 IP 和端口
- 媒体负载类型

### SDP描述信息

SDP描述信息：

- Session Description
- Media Description

Session Description：

- `v=(protocol version)`
- `o=(owner/create and session identifier)`
- `s=(session name)`
- `c=*(conn info - option if included at session-level)`
- `t=(time the session is active)`
- `a=*(zero or more session attribute lines)`

Media Description：

- `m=(media name and transport address)`
- `c=*(conn info - option if included at session-level)`
- `b=*(bandwidth information)`
- `a=*(zero or more session attribute lines)`

### SDP关键字段的含义及其使用

![SDP字段含义](/images/imageWebRTC/mediaserver/SDP字段含义-01.png)

![SDP字段含义](/images/imageWebRTC/mediaserver/SDP字段含义-02.png)

![SDP字段含义](/images/imageWebRTC/mediaserver/SDP字段含义-03.png)

![SDP字段含义](/images/imageWebRTC/mediaserver/SDP字段含义-04.png)

![SDP字段含义](/images/imageWebRTC/mediaserver/SDP字段含义-05.png)

![SDP字段含义](/images/imageWebRTC/mediaserver/SDP字段含义-06.png)

![SDP字段含义](/images/imageWebRTC/mediaserver/SDP字段含义-07.png)

### WebRTC中的SDP

![WebRTC中的SDP](/images/imageWebRTC/mediaserver/WebRTC中的SDP.png)

### WebRTC中的SDP各个字段含义讲解

WebRTC Offer / Answer SDP：

<details><summary>SDP报文内容</summary>

```shell
v=0
o=- 2584450093346841581 2 IN IP4 127.0.0.1
s=-
t=0 0   # 0 0 表示持续有效
a=group:BUNDLE audio video data
a=msid-semantic: WMS 616cfbb1-33a3-4d8c-8275-a199d6005549 # WMS：WebRTC Media Stream

m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 110 112 113 126
c=IN IP4 0.0.0.0 
a=rtcp:9 IN IP4 0.0.0.0
a=ice-ufrag:sXJ3					# 安全认证的时候使用，STUN 中会使用这两个参数
a=ice-pwd:yEclOTrLg1gEubBFefOqtmyV	# 安全认证的时候使用
a=ice-options:trickle	# 新版本中使用trickle之后就没有candidate字段了，只要有合适的就检测连接，然后传输数据，如果有更好的则替换掉
a=fingerprint:sha-256 22:14:B5:AF:66:12:C7:C7:8D:EF:4B:DE:40:25:ED:5D:8F:17:54:DD:88:33:C0:13:2E:FD:1A:FA:7E:7A:1B:79	# 验证证书是否被串改了
a=setup:actpass		# setup表示建立链接的时候是主动建立还是被动建立，actpass：既可以主动连接也可以被动作为服务端
a=mid:audio
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level # extmap 对与rtp扩展头
a=sendrecv	# 控制数据流向
a=rtcp-mux 	# rtp与rtcp端口是否复用
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
a=ssrc:120276603 cname:iSkJ2vn5cYYubTve		# cname 唯一的标识
a=ssrc:120276603 msid:616cfbb1-33a3-4d8c-8275-a199d6005549 1da3d329-7399-4fe9-b20f-69606bebd363
a=ssrc:120276603 mslabel:616cfbb1-33a3-4d8c-8275-a199d6005549
a=ssrc:120276603 label:1da3d329-7399-4fe9-b20f-69606bebd363		# label代表了具体设备ID

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
a=rtcp-rsize	# rtcp传输量太大的时候，网络承受不住的时候，可以简化成最小的trcp
a=rtpmap:96 VP8/90000
a=rtcp-fb:96 ccm fir
a=rtcp-fb:96 nack
a=rtcp-fb:96 nack pli
a=rtcp-fb:96 goog-remb
a=rtcp-fb:96 transport-cc
a=rtpmap:97 rtx/90000	# 97 表示重传
a=fmtp:97 apt=96	# 关联关系：表示 97 是 96 丢包重传的通道
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

## 各流媒体服务器的比较

![](/images/imageWebRTC/mediaserver/)

## mediasoup服务器的部署与使用

![](/images/imageWebRTC/mediaserver/)

## mediasoup的信令系统

![](/images/imageWebRTC/mediaserver/)

## mediasoup源码分析

![](/images/imageWebRTC/mediaserver/)

## 总结

![](/images/imageWebRTC/mediaserver/)



<details><summary></summary>

```c++

```

</details>