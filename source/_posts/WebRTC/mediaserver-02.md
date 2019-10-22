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

![](/images/imageWebRTC/mediaserver/)

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

<details><summary></summary>

```c++

```

</details>