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

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)





<details><summary></summary>

```c++

```

</details>