---
title: 执行文件出现lib库缺失问题解决
tags: []
categories: []
reward: true
abbrlink: 52717
date: 2020-02-10 18:27:12
---

# 下面介绍一个memcached执行失败的问提

启动memcached时报错：

```shell
error while loading shared libraries: libevent-2.1.so.6
```

下面给出解决办法：

1.用ldd命令查看 memcached 命令缺失什么库

```shell
[root@Autumn ~]# ldd /usr/local/bin/memcached
	linux-vdso.so.1 =>  (0x00007ffc517cf000)
	libevent-2.1.so.6 => not found
	libpthread.so.0 => /lib64/libpthread.so.0 (0x00007f6c96860000)
	libc.so.6 => /lib64/libc.so.6 (0x00007f6c96493000)
	/lib64/ld-linux-x86-64.so.2 (0x00007f6c96a7c000)
```

2.在安装libevent时，安装结果告诉我们libevent安装在/usr/local/lib/，可以用locate命令查看:

```shell
locate libevent-2.1.so.6
```

如果没有安装locate，请查看：[yum安装locate命令](https://www.ishareit.fun/system/linux/248/)。

3.查看 memcached 查找依赖库的路径：

```shell
[root@Autumn ~]# LD_DEBUG=libs /usr/local/bin/memcached -v
     30708:	find library=libevent-2.1.so.6 [0]; searching
     30708:	 search cache=/etc/ld.so.cache
     30708:	 search path=/lib64/tls/x86_64:/lib64/tls:/lib64/x86_64:/lib64:/usr/lib64/tls/x86_64:/usr/lib64/tls:/usr/lib64/x86_64:/usr/lib64		(system search path)
     30708:	  trying file=/lib64/tls/x86_64/libevent-2.1.so.6
     30708:	  trying file=/lib64/tls/libevent-2.1.so.6
     30708:	  trying file=/lib64/x86_64/libevent-2.1.so.6
     30708:	  trying file=/lib64/libevent-2.1.so.6
     30708:	  trying file=/usr/lib64/tls/x86_64/libevent-2.1.so.6
     30708:	  trying file=/usr/lib64/tls/libevent-2.1.so.6
     30708:	  trying file=/usr/lib64/x86_64/libevent-2.1.so.6
     30708:	  trying file=/usr/lib64/libevent-2.1.so.6
     30708:	
/usr/local/bin/memcached: error while loading shared libraries: libevent-2.1.so.6: cannot open shared object file: No such file or directory
```

发现它查找了search path那一行后面的路径，我们将libevent-2.1.so.6链接到/lib64目录下：

4.链接libevent-2.1.so.6：

```shell
$ sudo ln -s /usr/local/lib/libevent-2.1.so.6 /usr/lib64/libevent-2.1.so.6
```