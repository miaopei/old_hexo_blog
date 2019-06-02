---
title: Linux 命令 --- ssh
hide: false
categories:
  - coding
toc: true
tags:
  - linux
  - shell
abbrlink: 48881
date: 2018-11-28 09:52:36
---

# 前言

做开发少不了要配置各种环境, 配置环境又少不了连接 Linux 服务器, SSH 可以说是最常用的协议了. 本文主要简单介绍 Linux 系统下使用 ssh 命令连接远程主机的一些基本用法.

# 基本用法

* 以用户名 "user" 连接远程主机 "host"

  ```shell
  ssh user@host
  ```

* 如果本机用户名和远程主机用户名一致, 可以省略 "user"

  ```shell
  ssh host
  ```

* 指定端口登录远程主机

  `ssh` 默认端口是 22, 如果远程主机更换了默认端口, 那么本机也可以使用 `-p` 参数指定端口登录:

  ```shell
  ssh -p port user@host
  ```

这三种方式都是基于口令登录的, 也就是说, 与服务器建立连接之前, 你需要输入密码确认. 

<!-- more -->

# 公钥登录

有时候我们需要频繁连接服务器, 比如看 log 或者是部署等应用场景, 每次都要输密码的话可谓是相当麻烦了. 好在 SSH 提供了公钥登录的方法, 可以省去输密码的步骤.

> 所谓 "公钥登录"，原理很简单，就是用户将自己的公钥储存在远程主机上。登录的时候，远程主机会向用户发送一段随机字符串，用户用自己的私钥加密后，再发回来。远程主机用事先储存的公钥进行解密，如果成功，就证明用户是可信的，直接允许登录 shell，不再要求密码。

这种方法要求用户提供自己的公钥. 如果没有现成的公钥, 可以自己生成一个:

```shell
ssh-keygen
```

运行上述命令后系统会出现一系列提示, 一路回车即可. 如果担心自己私钥的安全, 这里可以对私玥设置一个口令. 

命令执行结束后会在本机 `$HOME/.ssh/` 目录下生成两个文件: "id_rsa.pub" 和 "id_rsa". 前者是你的公钥, 后者是你的私钥.

接着输入以下指令, 将自己的公钥上传到远程主机: 

```shell
ssh-copy-id user@host
```

此后, 登录远程主机便不再需要输入密码了.

如果还是不行, 就打开远程主机的 "/etc/ssh/sshd_config" 这个文件, 取消下面几行配置前面的 "#" 注释.

```shell
RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

然后重启远程主机的 ssh 服务: 

```shell
# Ubuntu 系统
serivce ssh restart
# debian 系统
/etc/init.d/ssh restart
```



## authorized_keys 文件

这里是扩展阅读部分, 按需查看即可. 

远程主机将用户的公钥保存在 "$HOME/.ssh/authorized_keys" 文件中. 公钥的本质是一个字符串, 上面 `ssh-copy-id` 命令的作用就是把自己的公钥追加到了远程主机的 "authorized_keys" 文件中.

可以使用下面的命令实现 `ssh-copy-id` 命令相同的效果: 

```shell
ssh user@host 'mkdir -p .ssh && cat >> .ssh/authorized_keys' < ~/.ssh/id_rsa.pub
```

这条命令由多个语句组成, 依次分解开来看:

1. "$ ssh user@host"，表示登录远程主机;
2. 单引号中的 mkdir .ssh && cat >> .ssh/authorized_keys，表示登录后在远程 shell 上执行的命令;
3. "$ mkdir -p .ssh" 的作用是，如果用户主目录中的. ssh 目录不存在，就创建一个;
4. 'cat >> .ssh/authorized_keys' < ~/.ssh/id_rsa.pub 的作用是，将本地的公钥文件~/.ssh/id_rsa.pub，重定向追加到远程文件 authorized_keys 的末尾。

写入 authorized_keys 文件后，公钥登录的设置就完成了.

# 参考文献

1. [SSH 原理与运用（一）：远程登录](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)   ------   阮一峰
