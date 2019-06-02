---
title: 巧用 python 随时随地开启 http 服务器
hide: false
categories:
  - coding
  - python
toc: true
tags:
  - python
  - http
abbrlink: 23319
date: 2019-01-16 13:22:26
---

### 前言

近来发现 Python 中内置了一个小巧的 HTTP 服务器, 轻微使用的话及其方便. 特撰此文, 作为记录. 

### 方法

1. 进入到自己想要开启 HTTP 服务器的目录;

2. 输入对应命令即可: 

   ```python
   # python3
   python -m http.server
   ```

   ```python
   # python3 指定端口
   python -m http.server 8000
   ```

   ```python
   # python2 
   python -m SimpleHTTPServer
   ```

   此时, HTTP 服务器就启动在本机的 8000 端口了. 

<!-- more -->

### 用途

1. 预览前端项目:

   如果当前目录下存在 HTML 文件, 那么这个 HTTP 服务器可以直接用来预览前端项目. 

2. 临时文件传输: 

   如果当前目录下不存在 index.html, 就会显示当前目录下的文件列表. 你可以在开启 HTTP 服务器后把自己的 ip 以及端口告诉朋友, 朋友就可以直接通过网页下载你对应目录下的文件啦. 

### 参考文献: 

* [Python 也会传文件，再也不用看某某网盘的脸色了！](https://mp.weixin.qq.com/s?__biz=MzA5ODUzOTA0OQ==&mid=2651689715&idx=2&sn=a3e7f812cb1348192aa71d5ac3eb39eb&chksm=8b6931b5bc1eb8a3886e09b5665b33a0682cff5fafd84728e76a584fe4b446bcd2f9b00a476e&mpshare=1&scene=1&srcid=112108hm1ZQQKBE3bcDuG25j#rd)   ---   Rocky0429