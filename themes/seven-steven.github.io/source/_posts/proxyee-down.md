---
title: Proxyee-Down --- 提速百度云下载
hide: false
categories:
  - geek
toc: true
tags:
  - tools
  - 百度云
abbrlink: 1546
date: 2018-11-02 17:08:42
---

### 前言

最近很多朋友问我, 有没有什么办法能让百度云下载速度加快? 

除了买会员之外, 这个问题也确实比较棘手. 毕竟傻瓜式的工具容易被封号限速, 专业的工具比较难上手. 

按照我的性格, 一件事情最好是做到极致, 选用工具也是如此, 如果要用, 那就用最好的. 所以, 也就有了这篇文章.

本来用的是 Ubuntu 系统, 后来想了一下, 还是切回 Windows 写了这篇文章, 毕竟敢碰 Linux 的大佬还有什么问题是攻克不了的呢?

附上官方教程: [Github 地址](https://github.com/proxyee-down-org/proxyee-down) | [官方教程](https://github.com/proxyee-down-org/proxyee-down/wiki/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B) | [Onedrive 下载](https://imhx-my.sharepoint.com/personal/pd_imhx_onmicrosoft_com/Documents/Forms/All.aspx?slrid=bf5f9e9e-4001-0000-32b2-b68b5404f6cf&RootFolder=%2Fpersonal%2Fpd_imhx_onmicrosoft_com%2FDocuments%2Fproxyee-down&FolderCTID=0x012000536DC31294EC264084FE880734F95AEA) , Linux 大佬请酌情享用. 

(看完官方教程真觉得自己这篇文章是多余)

<!-- more -->

### [Proxyee-dwon](https://github.com/proxyee-down-org/proxyee-down) 简介

![proxyee-down](https://qiniu.diqigan.cn/18-11-2/38811307.jpg)

> Proxyee Down 是一款开源的免费 HTTP 高速下载器，底层使用`netty`开发，支持自定义 HTTP 请求下载且支持扩展功能，可以通过安装扩展实现特殊的下载需求。                                                           ------ Proxyee down

简言之, **proxyee-down 是一款支持多线程分块下载的 http 下载工具**. 因为支持多线程分块下载, 所以正常情况下可以让电脑下载速度得到彻底的解放. 

没错, proxyee-down 不仅仅局限于百度云下载, 其他 http 下载也可以借助 proxyee-down 提速. 

### [下载与运行](https://github.com/proxyee-down-org/proxyee-down/wiki/%E8%BD%AF%E4%BB%B6%E4%B8%8B%E8%BD%BD%E4%B8%8E%E8%BF%90%E8%A1%8C)

目前官方提供的下载方式是通过 [Onedrive 下载](https://imhx-my.sharepoint.com/personal/pd_imhx_onmicrosoft_com/Documents/Forms/All.aspx?slrid=bf5f9e9e-4001-0000-32b2-b68b5404f6cf&RootFolder=%2Fpersonal%2Fpd_imhx_onmicrosoft_com%2FDocuments%2Fproxyee-down&FolderCTID=0x012000536DC31294EC264084FE880734F95AEA), 选择最新的版本点击下载即可. 

下载完成后, 解压至任意目录, 执行文件夹里面的 `Proxyee Down.exe` 即可.

运行成功后, 软件初始界面如下: 

![proxyee-down初始界面](https://qiniu.diqigan.cn/18-11-2/76419339.jpg)

### 安装插件

proxyee-down 运行成功之后还需要安装 "百度云下载" 插件才能支持百度云下载. 

点击 "扩展管理" 可以看到插件列表, 然后点击 "百度云下载" 插件对应 "操作" 栏中的 "下载" 按钮即可安装 (因为我已经安装过 "百度云下载" 插件, 所以下图箭头指向了其他插件的下载按钮). 

![扩展管理界面](https://qiniu.diqigan.cn/18-11-2/52080389.jpg)

### 百度云资源下载

安装好 "百度云下载" 插件之后, 打开自己的百度云, 会发现百度云界面多了一个红色的 "PD下载" 按钮.

![PD下载](https://qiniu.diqigan.cn/18-11-2/22169568.jpg)

在资源左侧复选框选中自己要下载的资源, 然后点击 "PD下载" 中的 "批量推送下载". 之后, proxyee-down 会自动接管本次下载. 

![下载界面](https://qiniu.diqigan.cn/18-11-2/84332477.jpg)

基本上是满速下载了.

### 小心驶得万年船

没错, 用上面讲到的方法, 现在已经可以实现百度云告诉下载了, 但这毕竟是通过你的账号下载的, 百度云有的是方法检测你的下载速度, 非会员用户频繁高速下载有可能被百度云加入黑名单, 然后就跟高速说再见吧. 虽说被检测的概率很小, 但是谁也不希望自己被加入黑名单嘛. 

那么有没有方法可以规避百度云检测呢? 答案当然是肯定的.

我们可以先在自己的账号下把文件分享出去, 然后在不登陆自己账号的情况下 (最好是浏览器新开一个隐身窗口, chrome 同时按下 <span id="inline-blue">`ctrl` + `shift` + `n` </span>可以打开隐身窗口) 打开分享链接依然可以通过 proxyee-down 下载文件, 这样就毫无后顾之忧了. 

-----------------------

### 进阶

1. [使用SwitchyOmega接管代理](https://github.com/proxyee-down-org/proxyee-down/wiki/%E4%BD%BF%E7%94%A8SwitchyOmega%E6%8E%A5%E7%AE%A1%E4%BB%A3%E7%90%86) 

   基本上用过 SwitchyOmega 的人都知道怎么设置, 没用过的人也不会有使用的需求. 而且 peoxyee-down 扩展并不需要 SwitchyOmega. 所以, 这里就只放一个链接啦. 

2. 软件设置

   proxyee-down 的 "软件设置" 界面可以对软件进行简单设置, 这里不再赘述. 

3. 下载中途进度停止

   个别情况下 (单次下载文件特别大 / 自己被拉黑) 下载会中途停止. 

   先暂停 "进行中" 的任务, 然后去百度云界面再添加一次相同的下载任务, 文件会继续上次下载. 

4. 借助百度云做中转下载文件

   Chrome 浏览器下可以借助 [Tampermonkey](https://tampermonkey.net/) 的 [一键离线下载](https://greasyfork.org/zh-CN/scripts/22590-%E4%B8%80%E9%94%AE%E7%A6%BB%E7%BA%BF%E4%B8%8B%E8%BD%BD) 插件将文件转存至百度云, 然后借助 proxyee-down 下载文件. 过程不再赘述, 以后可能会写关于 chrome 插件的文章, 到时再详谈. 

### 参考文献

1. [Proxyee Down 使用教程](https://github.com/proxyee-down-org/proxyee-down/wiki/%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B) ------ proxyee-down
