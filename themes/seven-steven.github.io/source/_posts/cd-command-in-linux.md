---
title: Linux 命令 --- cd
hide: false
categories:
  - coding
toc: true
tags:
  - shell
  - linux
abbrlink: 42427
date: 2018-11-29 11:51:48
---

# 简介

`cd` 命令全称 "change directory", 用于**切换当前工作目录**, 是 Linux 下最基础的命令之一. 

# 语法

```shell
cd [path]
```

其中: 

* [path] 表示目标路径, 可以是相对路径, 也可以是绝对路径.

<!-- more -->

# 举例

* 跳转到指定目录

  ```shell
  cd /etc
  ```

* 跳转到根目录

  ```shell
  cd /
  ```

* 跳转到用户主目录

  ```shell
  cd ~
  ```

  ```shell
  cd
  ```

  上述两个命令效果相同.

* 跳转到上一层目录

  ```shell
  cd ../
  ```

* 跳转到上一次跳转的目录 (同一 shell 内有效)

  ```shell
  cd -1
  ```