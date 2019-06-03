---
title: lighttpd+fastcgi
tags:
  - lighttpd
  - FastCGI
toc: true
abbrlink: 930
date: 2017-03-31 12:34:28
---

### 简介

`lighttpd` 提供了一种外部程序调用的接口，即 `FastCGI` 接口。这是一种独立于平台和服务器的接口，它介于Web应用程序和Web服务器之间。

这就意味着能够在 `Apache` 服务器上运行的 `FastCGI` 程序，也一定可以无缝的在 `lighttpd` 上使用。

<!-- more -->

### FastCGI介绍

1）就像 `CGI` 一样，`FastCGI` 也是独立于编程语言的。
2）就像 `CGI` 一样，`FastCGI` 程序运行在完全独立于核心 `Web Server` 之外的进程中，和 `API` 方式相比，提供了很大的安全性。（API会将程序代码与核心Web Server挂接在一起，这就意味着基于问题API的应用程序可能会使整个Web Server或另一个应用程序崩溃；一个恶意API还可以从核心Web Server或另一个应用程序中盗取安全密钥）

3) 虽然 `FastCGI` 不能一夜之间复制CGI的所有功能，但是 `FastCGI` 一直宣扬开放，这也使得我们拥有很多免费的 `FastCGI` 应用程序库（C/C++、Java、Perl、TCL）和免费的Server模块（Apache、ISS、Lighttpd）。

4) 就像 `CGI` 一样，`FastCGI` 并不依附于任何 `Web Server` 的内部架构，因此即使 `Server` 的技术实现变动，`FastCGI` 仍然非常稳定；而 `API` 设计是反映 `Web Server` 内部架构的，因此，一旦架构改变，API要随之变动。

5) `FastCGI` 程序可以运行在任何机器上，完全可以和 `Web Server` 不在一台机器上。这种分布式计算的思想可以确保可扩展性、提高系统可用性和安全性。

6) `CGI` 程序主要是对 `HTTP` 请求做计算处理，而 `FastCGI` 却还可以做得更多，例如模块化认证、授权检查、数据类型转换等等。在未来，`FastCGI` 还会有能力扮演更多角色。

7) `FastCGI` 移除了 `CGI` 程序的许多弊端。例如，针对每一个新请求，`WebServer` 都必须重启 `CGI` 程序来处理新请求，这导致 `WebServer` 的性能会大受影响。而 `FastCGI` 通过保持进程处理运行状态并持续处理请求的方式解决了该问题，这就将进程创建和销毁的时间节省了出来。

8) `CGI` 程序需要通过管道（pipe）方式与 `Web Server` 通信，而 `FastCGI` 则是通过 `Unix-Domain-Sockets` 或 `TCP/IP` 方式来实现与 `Web Server` 的通信。这确保了 `FastCGI` 可以运行在 `Web Server` 之外的服务器上。`FastCGI` 提供了 `FastCGI` 负载均衡器，它可以有效控制多个独立的 `FastCGI Server` 的负载，这种方式比 `load-balancer+apache+mod_php` 方式能够承担更多的流量。

### FastCGI 模块

若要 `lighttpd` 支持 `fastcgi`，则需要配置如下内容：

在 `fastcgi.conf` 中配置

```test
server.modules += ( "mod_fastcgi" )
```

及在 `module.conf` 中配置

```test
include "conf.d/fastcgi.conf"
```

### FastCGI 配置选项

`lighttpd` 通过 `fastcgi` 模块的方式实现了对 `fastcgi` 的支持，并且在配置文件中提供了三个相关的选项：

1） fastcgi.debug

可以设置一个从0到65535的值，用于设定 `FastCGI` 模块的调试等级。当前仅有0和1可用。**1表示开启调试（会输出调试信息），0表示禁用**。例如：

```test
fastcgi.debug = 1
```

2） fastcgi.map-extentsions

同一个 `fastcgi server` 能够映射多个扩展名，如 `.php3` 和 `.php4` 都对应 `.php`。例如：

```test
fastcgi.map-extensions = ( ".php3" => ".php" )
```

or for multiple

```test
fastcgi.map-extensions = ( ".php3" => ".php", ".php4" => ".php" )
```

3） fastcgi.server

这个配置是告诉 `Web Server` 将 `FastCGI` 请求发送到哪里，其中每一个文件扩展名可以处理一个类型的请求。负载均衡器可以实现对同一扩展名的多个对象的负载均衡。

`fastcgi.server` 的结构语法如下：

```bash
( <extension> =>
  ( [ <name> => ]
    ( # Be careful: lighty does *not* warn you if it doesn't know a specified option here (make sure you have no typos)
      "host" => <string> ,
      "port" => <integer> ,
      "socket" => <string>,                 # either socket or host+port
      "bin-path" => <string>,               # optional
      "bin-environment" => <array>,         # optional
      "bin-copy-environment" => <array>,    # optional
      "mode" => <string>,                   # optional
      "docroot" => <string> ,               # optional if "mode" is not "authorizer"
      "check-local" => <string>,            # optional
      "max-procs" => <integer>,             # optional - when omitted, default is 4
      "broken-scriptfilename" => <boolean>, # optional
      "kill-signal" => <integer>,           # optional, default is SIGTERM(15) (v1.4.14+)
    ),
    ( "host" => ...
    )
  )
)
```

其中：
> **extentsion** ：文件名后缀或以”/”开头的前缀（也可为文件名）
> **name** ：这是一个可选项，表示handler的名称，在mod_status中用于统计功能，可以清晰的分辨出是哪一个handler处理了<extension>。
> **host** ：FastCGI进程监听的IP地址。此处不支持hostname形式。
> **port** ：FastCGI进程所监听的TCP端口号
> **bin-path** ：本地FastCGI二进制程序的路径，当本地没有FastCGI正在运行时，会启动这个FastCGI程序。
> **socket** ：unix-domain-socket所在路径。
> **mode** ：可以选择FastCGI协议的模式，默认是“responder”，还可以选择authorizer。
> **docroot** ：这是一个可选项，对于responder模式来讲，表示远程主机docroot；对于authorizer模式来说，它表示MANDATORY，并且指向授权请求的docroot。
> **check_local** ：这是一个可选项，默认是enable。如果是enable，那么server会首先在本地（server.document-root）目录中检查被请求的文件是否存在，如果不存在，则给用户返回404（Not Found），而不会把这个请求传递给FastCGI。如果是disable，那么server不会检查本地文件，而是直接将请求转发给FastCGI。（disable的话，server从某种意义上说就变为了一个转发器）
> **broken-scriptfilename** ：以类似PHP抽取PATH_INFO的方式，抽取URL中的SCRIPT_FILENAME。

如果 `bin-path` 被设置了，那么：

> **max-procs** ：设置多少个FastCGI进程被启动
> **bin-environment** ：在FastCGI进程启动时设置一个环境变量
> **bin-copy-environment** ：清除环境，并拷贝指定的变量到全新的环境中。
> **kill-signal** ：默认的话，在停止FastCGI进程时，lighttpd会发送SIGTERM(-15)信号给子进程。此处可以设置发送的信号。

**举例** ：

使用前缀来对应主机：

```bash
fastcgi.server = (
  "/remote_scripts/" =>
  (( "host" => "192.168.0.3",
     "port" => 9000,
     "check-local" => "disable",
     "docroot" => "/" # remote server may use
                      # it's own docroot
  ))
)
```

如果有一个请求 "http://my.example.org/remote_scripts/test.cgi"，那么server会将其转发给192.168.0.3的9000端口，并且 `SCRIPT_NAME` 会被赋值为 `“/remote_scripts/test.cgi”`。如果所设置的 `handler` 的末尾不是 `“/”` ，那么会被认为是一个文件。

**负载均衡** ：

`FastCGI` 模块提供了一种在多台 `FastCGI` 服务器间负载均衡的方法。

例如：

```bash
fastcgi.server = ( ".php" =>
  (
    ( "host" => "10.0.0.2",
      "port" => 1030
    ),
    ( "host" => "10.0.0.3",
      "port" => 1030 )
    )
  )
```

为了更好的理解负载均衡实现的原理，建议你置 `fastcgi.debug` 为 `1` 。即使对于本机的多个 `FastCGI` ，你也会获得如下输出：

```test
  proc: 127.0.0.1 1031  1 1 1 31454
  proc: 127.0.0.1 1028  1 1 1 31442
  proc: 127.0.0.1 1030  1 1 1 31449
  proc: 127.0.0.1 1029  1 1 2 31447
  proc: 127.0.0.1 1026  1 1 2 31438
  got proc: 34 31454
  release proc: 40 31438
  proc: 127.0.0.1 1026  1 1 1 31438
  proc: 127.0.0.1 1028  1 1 1 31442
  proc: 127.0.0.1 1030  1 1 1 31449
  proc: 127.0.0.1 1031  1 1 2 31454
  proc: 127.0.0.1 1029  1 1 2 31447
```

上述信息显示出了IP地址，端口号、当前链接数（也就是负载）（倒数第二列）、进程ID（倒数第一列）等等。整个输出信息总是以负载域来从小到大排序的。

### 参考文献

[](http://redmine.lighttpd.net/projects/1/wiki/Docs:ModFastCGI)

[](http://www.fastcgi.com)

[说说lighttpd的fastcgi](http://roclinux.cn/?p=2347)

[Nginx + CGI/FastCGI + C/Cpp](http://www.cnblogs.com/skynet/p/4173450.html)

[FastCGI+lighttpd开发之介绍和环境搭建](https://segmentfault.com/a/1190000004006596)



### 附：QC V3 PP 版本 lighttpd.conf

```bash
$ cat /etc/qtilighttpd.conf 
# ------------------------------------------------------------------------------
# Copyright (c) 2016 Qualcomm Technologies, Inc.
# All Rights Reserved.
# Confidential and Proprietary - Qualcomm Technologies, Inc.
# ------------------------------------------------------------------------------

server.document-root = "/opt/qcom/www"

server.port    = 80
server.username    = "apps"
server.groupname  = "apps"
server.bind    = "0.0.0.0"
server.tag    = "lighttpd"
$SERVER["socket"] == "[::]:80" {  }

server.errorlog-use-syslog  = "enable"
accesslog.use-syslog    = "enable"

server.modules    = (
  "mod_access","mod_accesslog", "mod_cgi", "mod_fastcgi"
)

fastcgi.debug = 1
fastcgi.server = (
    "/fsmoam" => (
    "fsmoam.fcgi.handler" => (
        "socket" => "/tmp/fsmoam.fcgi.socket",
        "check-local" => "disable",
        "bin-path" => "/opt/qcom/bin/tests/fsmWebServer --default-log-level=DEBUG",
        "max-procs" => 1)
     )
)


# mimetype mapping
mimetype.assign    = (
  ".pdf"    =>  "application/pdf",
  ".sig"    =>  "application/pgp-signature",
  ".spl"    =>  "application/futuresplash",
  ".class"  =>  "application/octet-stream",
  ".ps"    =>  "application/postscript",
  ".torrent"  =>  "application/x-bittorrent",
  ".dvi"    =>  "application/x-dvi",
  ".gz"    =>  "application/x-gzip",
  ".pac"    =>  "application/x-ns-proxy-autoconfig",
  ".swf"    =>  "application/x-shockwave-flash",
  ".tar.gz"  =>  "application/x-tgz",
  ".tgz"    =>  "application/x-tgz",
  ".tar"    =>  "application/x-tar",
  ".zip"    =>  "application/zip",
  ".mp3"    =>  "audio/mpeg",
  ".m3u"    =>  "audio/x-mpegurl",
  ".wma"    =>  "audio/x-ms-wma",
  ".wax"    =>  "audio/x-ms-wax",
  ".ogg"    =>  "audio/x-wav",
  ".wav"    =>  "audio/x-wav",
  ".gif"    =>  "image/gif",
  ".jpg"    =>  "image/jpeg",
  ".jpeg"    =>  "image/jpeg",
  ".png"    =>  "image/png",
  ".xbm"    =>  "image/x-xbitmap",
  ".xpm"    =>  "image/x-xpixmap",
  ".xwd"    =>  "image/x-xwindowdump",
  ".css"    =>  "text/css",
  ".html"    =>  "text/html",
  ".htm"    =>  "text/html",
  ".js"    =>  "text/javascript",
  ".asc"    =>  "text/plain",
  ".c"    =>  "text/plain",
  ".conf"    =>  "text/plain",
  ".text"    =>  "text/plain",
  ".txt"    =>  "text/plain",
  ".dtd"    =>  "text/xml",
  ".xml"    =>  "text/xml",
  ".mpeg"    =>  "video/mpeg",
  ".mpg"    =>  "video/mpeg",
  ".mov"    =>  "video/quicktime",
  ".qt"    =>  "video/quicktime",
  ".avi"    =>  "video/x-msvideo",
  ".asf"    =>  "video/x-ms-asf",
  ".asx"    =>  "video/x-ms-asf",
  ".wmv"    =>  "video/x-ms-wmv",
  ".bz2"    =>  "application/x-bzip",
  ".tbz"    =>  "application/x-bzip-compressed-tar",
  ".tar.bz2"  =>  "application/x-bzip-compressed-tar"
)

index-file.names = ( "index.html" )

cgi.assign = ( ".sh" => "/bin/sh" )
```

