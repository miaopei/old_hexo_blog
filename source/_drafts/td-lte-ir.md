---
title: td-lte-ir
tags: []
categories: []
reward: true
date: 2019-10-27 16:46:12
---

# TD-LTE 蜂窝移动通信分布式基站 IR 接口技术学习笔记

## 基本缩略语

| 缩略词 | 英文解释                              | 中文解释                                                     |
| ------ | ------------------------------------- | ------------------------------------------------------------ |
| BBU    | Base Band Unit                        | 基带单元                                                     |
| CN     | Core Network                          | 核心网络                                                     |
| C&M    | Control and management                | 控制和管理                                                   |
| Ir     | Interface between the RRU and the BBU | BBU 与 RRU 的接口                                            |
| RRU    | Remote RF Unit                        | 射频远端单元                                                 |
| CPRI   | Common Public Radio Interface         | 通用公共无线接口                                             |
| UE     | User Equipment                        | 用户设备                                                     |
| LOS    | Lost of signal                        | 信号丢失                                                     |
| LOF    | Lost of frame                         | 帧丢失                                                       |
| MME    | Mobility Management Entity            | 移动性管理实体                                               |
| S-GW   | Serving Gateway                       | 服务网关                                                     |
| EPC    | Evolved Packet Core                   | 分组核心网                                                   |
| eNodeB | Evolved Node B                        | 演进型[Node B](https://baike.baidu.com/item/Node B/5128355)，简称eNB，LTE中基站的名称 |
|        |                                       |                                                              |



Ir接口协议定义了层一和层二协议来支持用户层的数据传输，BBU和RRU单元间同步等控制信息的发送和接收。用户层的消息是以IQ数据方式发送的，不同天线载波（Antenna & Carrier）的IQ数据分时在光传输通道中。Ir支持Ethernet协议来传送C&M信息，利用TCP协议获取IP，该IP地址由BBU自行分配。除此之外还需要传送厂商的特殊信息。

LTE IR接口协议的层一，层二遵从CPRI Specification V4.2协议，LTE IR接口协议对CPRI协议的部分内容加以约束，以保证符合LTE IR接口协议的BBU/RRU的互操作性。LTE IR接口协议的层3定义BBU与RRU间的交互流程，消息定义，通过层三流程BBU完成对RRU的配置与查询等操作。







## Reference

**5G 相关基础知识及架构：**

> [5G RAN组网架构及演进分析](http://m.c114.com.cn/w5466-1074079.html)

**CPRI 基础知识：**

> [超越CPRI：为5G前传制定计划](https://www.exfo.com/zh/resources/blog/beyond-cpri-planning-5g-fronthaul/)
>
> [CPRI与eCPRI接口]([http://www.5gcorner.com/2019/09/24/cpri%E4%B8%8Eecpri%E6%8E%A5%E5%8F%A3/](http://www.5gcorner.com/2019/09/24/cpri与ecpri接口/))

