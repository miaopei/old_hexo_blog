---
title: Linux 下为 ydcv 添加查词记录
hide: false
categories:
  - geek
toc: true
tags:
  - linux
  - ydcv
abbrlink: 7774
date: 2018-11-28 11:32:47
---



# 前言

[ydcv](https://github.com/felixonmars/ydcv) 是目前为止我最喜欢的命令行查词工具, 强烈推荐有查词需求的 Linux 用户尝试, 安装方法参见 [项目主页](https://github.com/felixonmars/ydcv), 运行 `setup.py` 即可. 

这个脚本只是提供了命令行查词功能, 但是像我这样的英语渣渣可能想把查过的单词记录下来, 以便添加到背单词的软件中进行记忆学习, 所有就有了这篇文章. 

<!-- more -->

# 实现

实现方法也很简单, 写一个简单的 shell 脚本, 在查词之前记录单词即可. 

* 我这里新建了一个叫作 "record.sh" 的脚本文件, 写入以下内容

  ```shell
  #!/bin/sh
  # 单词本所在文件夹
  dir="/home/seven/.ydcv/"
  # 单词本文件
  file="wordlist.txt"
  # 检查文件夹是否存在
  if [ ! -e $dir ]
  then
      mkdir $dir -p
  fi
  
  # 记录单词
  for i in $*
  do
      echo $i >> $dir$file
  done
  
  # 调用 ydcv 进行查词
  ydcv $*
  ```

* 给脚本添加可执行权限

  ```shell
  chmod +x record.sh
  ```

* 为脚本添加软链

  ```shell
  sudo ln -s ${record.sh_path} /usr/bin/yd
  ```

* 以后, 输入命令 `yd` 就可以记录查词记录了, 单词记录会以文本形式存储在 shell 脚本指定的文件中.