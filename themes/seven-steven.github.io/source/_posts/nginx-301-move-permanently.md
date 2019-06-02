---
title: nginx 301 重定向实现方案
hide: false
categories:
  - coding
toc: true
tags:
  - nginx
  - 301
abbrlink: 60125
date: 2018-08-15 13:02:09
---

### 前言

依然是博客的问题, 因为我的主域名设置了一条 `MX` 记录, 导致主域名不能设置 `CNAME` 或者 `url 转发` 等解析记录, dnspod 提示建议使用 `A` 记录解析主域名, 遗憾的是我的博客搭建在 `Github Pages` 和 `Coding Pages` 上面, 他们只提供 `CNAME` 解析. 虽然可以通过 ping 命令得到 `Github Pages` 和 `Coding Pages` 的 ip, 但毕竟他们的 ip 相当多, 而且可能会有变动, 可能会导致解析不稳定. 

而且我的需求只是暂时将主域名指向博客所在的子域名, 所以最后选择了将主域名指向自己的一台服务器, 在服务器上利用 nginx 做 301 跳转, 算是退而求其次, 不太完美地解决了这个问题吧. 

<!-- more -->
### 实现步骤

#### 安装 nginx

我自己的服务器是 Ubuntu 16.04, 安装 nginx 只需要一条命令:

```shell
sudo apt install nginx
```

#### 配置 nginx

1. 在 `/etc/nginx/conf.d/` 目录下新建配置文件 `301.conf` :

   ```shell
   sudo vi /etc/nginx/conf.d/301.conf
   ```

2. 写入以下内容:

   ```json
   server {
       listen			80;
       server_name		example.org;
       return			301 http://subdomain.exaple.org$request_uri;
   }
   ```

3. 保存退出; 

4. 重启 nginx: 

   ```shell
   sudo service nginx restart
   ```

#### 添加域名解析

给自己的域名添加一条 A记录, 指向自己的服务器 ip 即可.

解析生效之后访问主域名便会 301 跳转到子域名. 

### 参考文献

1. [Converting rewrite rules](http://nginx.org/en/docs/http/converting_rewrite_rules.html)
