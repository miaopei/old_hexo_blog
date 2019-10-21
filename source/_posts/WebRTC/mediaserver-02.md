---
title: WebRTC 流媒体服务器（三）
tags: [WebRTC]
categories: [WebRTC]
reward: true
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