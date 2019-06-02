---
title: systemctl 常用用法简介
hide: false
categories:
  - coding
toc: true
tags:
  - Ubuntu
abbrlink: 18810
date: 2018-11-18 09:25:15
---

# 查看某个服务的状态
```shell
systemctl status ${service_name}
```
# 关闭某个服务
```shell
systemctl stop ${service_name}
```
# 开启某个服务
```shell
systemctl start ${service_name}
```
<!-- more -->

# 查看某个服务是否为开机自启动

```shell
systemctl is-enabled ${service_name}
```
# 设置某个服务为开机自启动
```shell
systemctl enable ${service_name}
```
# 取消某个服务的开机自启动
```shell
systemctl disable ${service_name}
```
# 查看所有被设置为开机自启动的服务
```shell
ls /etc/systemd/system/multi-user.target.wants
```

# 参考文献

1. [Linux systemctl 常用用法简介](https://www.linuxidc.com/Linux/2017-10/147886.htm)