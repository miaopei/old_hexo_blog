---
title: td-lte-ir
tags: []
categories: []
reward: true
abbrlink: 3124
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
| IE     | information element                   | 信息元素                                                     |



Ir接口协议定义了层一和层二协议来支持用户层的数据传输，BBU和RRU单元间同步等控制信息的发送和接收。用户层的消息是以IQ数据方式发送的，不同天线载波（Antenna & Carrier）的IQ数据分时在光传输通道中。Ir支持Ethernet协议来传送C&M信息，利用TCP协议获取IP，该IP地址由BBU自行分配。除此之外还需要传送厂商的特殊信息。

LTE IR接口协议的层一，层二遵从CPRI Specification V4.2协议，LTE IR接口协议对CPRI协议的部分内容加以约束，以保证符合LTE IR接口协议的BBU/RRU的互操作性。LTE IR接口协议的层3定义BBU与RRU间的交互流程，消息定义，通过层三流程BBU完成对RRU的配置与查询等操作。



# NetConf 协议学习

我们是基于 [libnetconf开源软件](https://github.com/CESNET/libnetconf) 进行二次开发

github 中有两套 libnetconf， 一套是 libnetconf，另外一套是 libnetconf2。libnetconf2 是正在开发中的版本，还未正式发布

网上的开源方案主要有2个：

一个是 ensuite 的 yencap + manager, 这个是基于 Python 的。MS 之前用的人比较多。

http://ensuite.sourceforge.net/

另一个是yuma（yangclient+netconfd)，这个感觉更专业。不过用的人很少。

http://netconfcentral.org

**[NETCONF模块设计介绍](https://blog.csdn.net/haopeng123321/article/details/54934542)**

**[NETCONF协议详解](https://blog.csdn.net/anzheangel/article/details/78885880)**

**[Yang解析](https://blog.csdn.net/CSND_PAN/article/details/79542917)**

**NetConf简介之一篇文章读懂NetConf：**

https://github.com/CESNET/libnetconf

https://blog.csdn.net/Kangyucheng/article/details/88251249

https://github.com/CESNET/libnetconf

https://github.com/CESNET/libnetconf

https://github.com/CESNET/libnetconf2/blob/master/src/messages_server.c

https://github.com/ncclient/ncclient

https://github.com/CESNET/libnetconf



## Reference

**5G 相关基础知识及架构：**

> [5G RAN组网架构及演进分析](http://m.c114.com.cn/w5466-1074079.html)

**CPRI 基础知识：**

> [超越CPRI：为5G前传制定计划](https://www.exfo.com/zh/resources/blog/beyond-cpri-planning-5g-fronthaul/)
>
> [CPRI与eCPRI接口]([http://www.5gcorner.com/2019/09/24/cpri%E4%B8%8Eecpri%E6%8E%A5%E5%8F%A3/](http://www.5gcorner.com/2019/09/24/cpri与ecpri接口/))

**NetConf 协议：**

> [ Netconf配置及其RPC和Notification下发流程解析 ](https://www.sdnlab.com/17786.html)
>
> [netopeer工具的使用]( https://blog.csdn.net/mylifeyouwill/article/details/81539547 )
>
> [【开源推介02-pyang】-你离yang模型只差一个pyang工具]( https://blog.csdn.net/xinquanv1/article/details/88133803 )
>
> [An error occurred after executing the ‘commit‘’ command](https://github.com/CESNET/netopeer/issues/166)
>
> [Set up Netopeer Server to use with NETCONFc](http://www.seguesoft.com/index.php/how-to-set-up-netopeer-server-to-use-with-netconfc)
>
> [YANG 1.1数据建模语言](https://www.bookstack.cn/read/rfc7950-zh/README.md)



> [netconf协议开发](https://blog.csdn.net/happylzs2008/article/details/91359439)
>
> [从NETCONF/YANG看网络配置自动化](https://www.sdnlab.com/16064.html)
>
> [NETCONF+Yang配置TSN](http://www.mamicode.com/info-detail-2619856.html)
>
> 
>
> [软件定义网络基础---NETCONF协议](https://www.cnblogs.com/ssyfj/p/11651450.html)
>
> [NETCONF协议详解](https://blog.csdn.net/CSND_PAN/article/details/79541868)
>
> [NETCONF协议之netopeer软件安装](https://blog.csdn.net/baiqishijkh/article/details/74006878)
>
> [netopeer工具的使用](https://blog.csdn.net/mylifeyouwill/article/details/81539547)
>
> [NETCONF协议netopeer软件安装与环境搭建](https://blog.csdn.net/rocson001/article/details/54575899)
>
> 

**SDN：**

> [SDN 是什么？](https://www.zhihu.com/question/20279620)
>
> [SDN介绍](https://www.cnblogs.com/ssyfj/tag/SDN/)





**netconf开发学习资料：**

> [网络基础](https://tonydeng.github.io/sdn-handbook/sdn/sbi/netconf.html)
>
> [关于RFC6241中文翻译](https://tonydeng.github.io/rfc6241-zh/)



```xml
netconf> status
Current NETCONF session:
  ID          : 1
  Host        : 127.0.0.1
  Port        : 830
  User        : root
  Transport   : SSH
  Capabilities:
	urn:ietf:params:netconf:base:1.0
	urn:ietf:params:netconf:base:1.1
	urn:ietf:params:netconf:capability:writable-running:1.0
	urn:ietf:params:netconf:capability:candidate:1.0
	urn:ietf:params:netconf:capability:startup:1.0
	urn:ietf:params:netconf:capability:rollback-on-error:1.0
	urn:ietf:params:netconf:capability:interleave:1.0
	urn:ietf:params:netconf:capability:notification:1.0
	urn:ietf:params:netconf:capability:validate:1.0
	urn:ietf:params:netconf:capability:validate:1.1
	urn:ietf:params:netconf:capability:with-defaults:1.0?basic-mode=explicit&also-supported=report-all,report-all-tagged,trim,explicit
	urn:ietf:params:netconf:capability:url:1.0?scheme=scp,file
	http://example.net/turing-machine?module=turing-machine&revision=2013-12-27
	urn:cesnet:tmc:netopeer:1.0?module=netopeer-cfgnetopeer&revision=2015-05-19&features=ssh,dynamic-modules
	urn:ietf:params:xml:ns:yang:ietf-netconf-server?module=ietf-netconf-server&revision=2014-01-24&features=ssh,inbound-ssh,outbound-ssh
	urn:ietf:params:xml:ns:yang:ietf-x509-cert-to-name?module=ietf-x509-cert-to-name&revision=2013-03-26
	urn:ietf:params:xml:ns:yang:ietf-netconf-acm?module=ietf-netconf-acm&revision=2012-02-22
	urn:ietf:params:xml:ns:yang:ietf-netconf-with-defaults?module=ietf-netconf-with-defaults&revision=2010-06-09
	urn:cesnet:params:xml:ns:libnetconf:notifications?module=libnetconf-notifications&revision=2016-07-21
	urn:ietf:params:xml:ns:netconf:notification:1.0?module=notifications&revision=2008-07-14
	urn:ietf:params:xml:ns:netmod:notification?module=nc-notifications&revision=2008-07-14
	urn:ietf:params:xml:ns:yang:ietf-netconf-notifications?module=ietf-netconf-notifications&revision=2012-02-06
	urn:ietf:params:xml:ns:yang:ietf-netconf-monitoring?module=ietf-netconf-monitoring&revision=2010-10-04
	urn:ietf:params:xml:ns:netconf:base:1.0?module=ietf-netconf&revision=2011-06-01&features=writable-running,candidate,rollback-on-error,validate,startup,url
	urn:ietf:params:xml:ns:yang:ietf-yang-types?module=ietf-yang-types&revision=2013-07-15
	urn:ietf:params:xml:ns:yang:ietf-inet-types?module=ietf-inet-types&revision=2013-07-15
netconf>
```




