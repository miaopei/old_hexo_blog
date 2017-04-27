---
title: lighttpd 配置https
date: 2017-03-31 12:34:28
tags: 
  - lighttpd
  - https
toc: true
---

### 确定安装的lighttpd支持ssl

版本信息中含有（ssl）字样的信息说明支持ssl，可以在终端输入如下查看：

```bash
$ lighttpd -v
lighttpd/1.4.35 (ssl) - a light and fast webserver
Build-Date: Apr 25 2017 10:25:18
```

<!-- more -->

### 生成自签名证书

完整的ssl证书分为四个部分：

* CA根证书（root CA）
* 中级证书（Intermediate Certificate）
* 域名证书
* 证书秘钥（仅由开发者提供）

证书相当于公钥，pem相当于私钥。

Self-Signed Certificates：包含公钥和私钥的结合体，证书（公钥）会在连接请求的时候发给浏览器，以便浏览器解密和加密。

创建Self-Signed Certificates：

```bash
$ openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
```

上边的命令生成一个server.pem文件。

### lighttpd.conf 配置

```bash
$SERVER["socket"] == "[::]:443" {  
     ssl.engine      = "enable"
     ssl.pemfile     = "/mnt/flash/server.pem"
}
```

### 强制定向到HTTPS

下面是 `lighttpd.conf` 文件中关于强制 HTTP 定向到 HTTPS 的部分配置：

```bash
$HTTP["scheme"] == "http" {
    # capture vhost name with regex conditiona -> %0 in redirect pattern
    # must be the most inner block to the redirect rule
    $HTTP["host"] =~ ".*" {
        url.redirect = (".*" => "https://%0$0")
    }
}
```

此功能需要lighttpd `mod_redirect` 模块支持。使用此功能前确保模块已经安装。

### lighttpd安全配置

**禁用 SSL Compression (抵御 CRIME 攻击)**

```bash
ssl.use-compression = "disable"
```

**禁用 SSLv2 及 SSLv3**

```bash
ssl.use-sslv2 = "disable"
ssl.use-sslv3 = "disable"
```

**抵御 Poodle 和 SSL downgrade 攻击**

需要支持 `TLS-FALLBACK-SCSV` 以自动开启此功能。下列 openSSL 版本包含对 `TLS-FALLBACK-SCSV` 的支持，lighttpd 会自动启用此特性。

* OpenSSL **1.0.1** 在 `1.0.1j` 及之后的版本中支持
* OpenSSL **1.0.0** 在 `1.0.0o` 及之后的版本中支持
* OpenSSL **0.9.8** 在 `0.9.8zc` 及之后的版本中支持

**加密及交换算法**

一份推介的配置：

```bash
ssl.cipher-list = "EECDH+AESGCM:EDH+AESGCM:AES128+EECDH:AES128+EDH"
```

如果您需要兼容一些老式系统和浏览器 (例如 Windows XP 和 IE6)，请使用下面的：

```bash
ssl.cipher-list = "EECDH+AESGCM:EDH+AESGCM:ECDHE-RSA-AES128-GCM-SHA256:AES256+EECDH:AES256+EDH:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES256-GCM-SHA384:AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256:AES256-SHA:AES128-SHA:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4"
```

**配置 Forward Secrecy 和 DHE 参数**

生成强 DHE 参数：

```bash
$ cd /etc/ssl/certs
$ openssl dhparam -out dhparam.pem 4096
```

**建议您使用性能强劲的平台生成此文件**，例如最新版的至强物理机。如果您只有一台小型 VPS，请使用 `openssl dhparam -out dhparam.pem 2048` 命令生成 2048bit 的参数文件。

添加到 SSL 配置文件：

```bash
ssl.dh-file = "/etc/ssl/certs/dhparam.pem"
ssl.ec-curve = "secp384r1"
```

**启用 HSTS**

```bash
server.modules += ( "mod_setenv" )
$HTTP["scheme"] == "https" {
    setenv.add-response-header  = ( "Strict-Transport-Security" => "max-age=63072000; includeSubdomains; preload")
}
```
### 参考资料

[Lighttpd](https://wiki.archlinux.org/index.php/Lighttpd)
