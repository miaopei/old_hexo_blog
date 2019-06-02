---
title: Linux 命令 --- whereis
hide: false
categories:
  - coding
  - linux
toc: true
tags:
  - shell
  - linux
abbrlink: 49338
date: 2018-12-17 14:17:01
---

## 简介

"whereis" 命令常用来定位指令的二进制程序, 源代码文件和 man 手册页相关文件的路径. 

"whereis" 命令只能用于程序名的搜索, 而且只搜索二进制文件 (参数 -b), man 说明文件 (参数 -m) 和源代码文件 (参数 -s), 如果省略参数, 则返回上述所有信息. 

<!-- more -->

## 用法

```shell
用法：
 whereis [选项] [-BMS <dir>... -f] <名称>

定位某个命令的二进制文件、源码和帮助页文件。

选项：
 -b         只搜索二进制文件
 -B <目录>  定义二进制文件查找路径
 -m         只搜索手册和信息
 -M <目录>  定义 man 和 info 查找路径
 -s         只搜索源代码
 -S <目录>  定义源代码查找路径
 -f         终止 <目录> 参数列表
 -u         搜索不常见记录
 -l         输出有效查找路径

 -h, --help     display this help
 -V, --version  display version
```

注意: 

* 如果使用 "-B", "-M", "-S" 参数指定目录列表, 需要在目录列表之后追加 "-f" 命令表示终止目录参数列表.

## 举例

* 查找 "whereis" 命令路径: 

  ```shell
  whereis whereis
  ```

  命令输出: 

  ```shell
  whereis: /usr/bin/whereis /usr/share/man/man1/whereis.1.gz
  ```

  这里显示了 "whereis" 命令二进制文件的路径和 man 手册信息. 

* 查找 "whereis" 命令自身二进制文件所在路径: 

  ```shell
  whereis -b whereis
  ```

  命令输出: 

  ```shell
  whereis: /usr/bin/whereis
  ```

  这次只显示了 "whereis" 命令二进制文件的路径. 

* 到指定目录查找 "python" 命令的二进制文件:

  * 我们先看一次下指定目录前的效果: 

    ```shell
    whereis -b python
    ```

    命令输出: 

    ```shell
    python: /usr/bin/python3.6m-config /usr/bin/python3.6-config /usr/bin/python3.6m /usr/bin/python3.6 /usr/bin/python2.7 /usr/bin/python /usr/lib/python3.6 /usr/lib/python2.7 /usr/lib/python3.7 /etc/python3.6 /etc/python2.7 /etc/python /usr/local/lib/python3.6 /usr/local/lib/python2.7 /usr/include/python3.6m /usr/include/python3.6 /usr/include/python2.7 /usr/share/python
    ```

    命令输出了所有与 "python" 有关的命令的二进制文件路径. 如果我们只想查看个别目录下的搜索结果呢? 

  * 指定目录查找 "python" 命令的二进制文件: 

    ```shell
    whereis -b -B /usr/bin -f python
    ```

    命令输出: 

    ```shell
    python: /usr/bin/python3.6m-config /usr/bin/python3.6-config /usr/bin/python3.6m /usr/bin/python3.6 /usr/bin/python2.7 /usr/bin/python
    ```

    这次只显示了指定目录下与 "python" 命令有关的二进制文件路径. 
