---
title: WebRTC 镜像源
tags: WebRTC
reward: true
categories: WebRTC
abbrlink: 39639
date: 2019-05-30 19:14:50
---

# WebRTC 镜像源

> [WebRTC 镜像源](https://webrtc.agora.io/mirror/)

> [webrtc src](http://120.92.49.206:3232/chromiumsrc/webrtc)

> [WebRTC-编译以及运行IOS的Demo](<https://www.jianshu.com/p/1b4c79b45055>)
>
> [WebRTC iOS&OSX 库的编译](<http://www.enkichen.com/2017/05/12/webrtc-ios-build/>)
>
> [生成WebRTC的DEMO并运行](<https://www.binss.me/blog/build-webrtc-demo-and-run/>)
>
> [使用xcode来生成webrtc的Demo](<https://www.binss.me/blog/use-xcode-to-bulid-webrtc-demo/>)
>
> [webrtc ios client 源码拉取和编译](<https://blog.csdn.net/liwenlong_only/article/details/79422673>)

> [webrtc视频jitterbuffer原理机制(描述版)](<https://www.jianshu.com/p/bd10d60cebcd>)
>
> [jitter buffer QoS的解决方案](https://www.cnblogs.com/lidabo/p/6846548.html)
>
> [webrtc中的码率控制](<https://blog.csdn.net/chinabinlang/article/details/78294464?locationNum=7&fps=1>)
>
> 

# 查看和下载特定版本的webrtc代码

**注**：*这个方法已经不适用了*

`gclient`：如果不知道 gclient 是什么东西 。。。 就别再往下看了。

下载特定版本的代码：

```shell
$ gclient sync --revision src@31000
```

**其中31000是版本号**

查看自己下载代码的版本号：

```shell
$ gclient revinfo -a
webrtc@ubuntu:~/code/webrtc/src/talk$ gclient revinfo -a
src: http://webrtc.googlecode.com/svn/trunk@**7706**
src/third_party/gflags/src: http://gflags.googlecode.com/svn/trunk/src@84
src/third_party/junit/:http://webrtc.googlecode.com/svn/deps/third_party/junit@3367
```

**其中7706是版本号**

如何在官网上浏览特定版本的代码：

https://code.google.com/p/webrtc/source/browse/?r=7643

**其中7643是版本号**

```shell
# 同步第三方依赖库
$ gclient sync
```





创建xcode的mac 工程

```shell
$ export GYP_GENERATOR_FLAGS="xcode_project_version=7.2 xcode_ninja_target_pattern=All_mac xcode_ninja_executable_target_pattern=AppRTCDemo output_dir=out_mac"
$ export GYP_GENERATORS="ninja,xcode-ninja"
$ ./webrtc/build/gyp_webrtc.py 
```

创建xcode的iOS工程 

```shell
$ export GYP_GENERATOR_FLAGS="xcode_project_version=7.2 xcode_ninja_target_pattern=All_iOS xcode_ninja_executable_target_pattern=AppRTCDemo output_dir=out_ios"
$ export GYP_GENERATORS="ninja,xcode-ninja"
$ ./webrtc/build/gyp_webrtc.py 
```

运行后在 webrtc 根目录下生成 `all.ninja.xcodeproj` 和 `sources_for_indexing.xcodeproj`， 分别用来编译和浏览源代码。





> [webrtc技术难点笔记 --- 带github工程](<https://blog.csdn.net/zhangkai19890929/article/details/84590332>)
>
> [webrtc代码研究](https://blog.csdn.net/zhangkai19890929/article/category/7955356)

webrtc工程有点大，自己强攻了一个多月，基本被拖进了无穷无尽多工程结构梳理中。

现在的思路就是：

总结webrtc里面的工程难点，然后到对应的github上去找开源项目，然后一个一个项目的研究，然后再回过头去研究工程.

webrtc的研究点包括:

1.音视频的网络抖动缓冲策略

2.网络的拥塞处理策略

3.丢包重传策略

4.

对应的开源github工程:

1.video jitter buffer https://github.com/TaoistKing/Video-Jitter-Buffer

介绍video jitter buffer设计原理的文章: https://blog.csdn.net/u012635648/article/details/72953237

2.网络拥塞流控 https://github.com/yuanrongxi/razor

相关文档: https://blog.csdn.net/chinabinlang/article/details/78294464?locationNum=7&fps=1

