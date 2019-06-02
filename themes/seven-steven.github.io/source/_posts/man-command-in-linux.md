---
title: Linux 命令 --- man
hide: false
categories:
  - coding
  - linux
toc: true
tags:
  - linux
  - shell
abbrlink: 57380
date: 2018-11-29 11:12:08
---

# 前言

`man` 命令可以说是初学 Linux 系统最应该接触的命令了. 使用 `man` 命令, 你几乎可以查看任何命令的用户手册. 

# 简介
`man` 命令的全称叫 "manual", 是 Linux 下的帮助指令, 可用于查看 Linux 中各种指令的帮助信息.

<!-- more -->
# 语法
```shell
用法： man [选项...] [章节] 手册页...

  -C, --config-file=文件   使用该用户设置文件
  -d, --debug                输出调试信息
  -D, --default              将所有选项都重置为默认值
      --warnings[=警告]    开启 groff 的警告

 主要运行模式：
  -f, --whatis               等同于 whatis
  -k, --apropos              等同于 apropos
  -K, --global-apropos       在所有页面中搜索文字
  -l, --local-file
                             把“手册页”参数当成本地文件名来解读
  -w, --where, --path, --location
                             输出手册页的物理位置
  -W, --where-cat, --location-cat
                             输出 cat 文件的物理位置

  -c, --catman               由 catman 使用，用来对过时的 cat
                             页重新排版
  -R, --recode=编码        以指定编码输出手册页源码

 寻找手册页：
  -L, --locale=区域
                             定义本次手册页搜索所采用的区域设置
  -m, --systems=系统       使用来自其它系统的手册页
  -M, --manpath=路径       设置搜索手册页的路径为 PATH

  -S, -s, --sections=列表  使用以半角冒号分隔的章节列表

  -e, --extension=扩展
                             将搜索限制在扩展类型为“扩展”的手册页之内

  -i, --ignore-case          查找手册页时不区分大小写字母
                             (默认)
  -I, --match-case           查找手册页时区分大小写字母

      --regex                显示所有匹配正则表达式的页面
      --wildcard             显示所有匹配通配符的页面

      --names-only           使得 --regex 和 --wildcard
                             仅匹配页面名称，不匹配描述信息

  -a, --all                  寻找所有匹配的手册页
  -u, --update               强制进行缓存一致性的检查

      --no-subpages          不要尝试子页面，如“man foo bar” =>
                             “man foo-bar”

 控制格式化的输出：
  -P, --pager=PAGER          使用 PAGER 程序显示输出文本
  -r, --prompt=字符串     给 less 分页器提供一个提示行

  -7, --ascii                显示某些 latin1 字符的 ASCII 翻译形式
  -E, --encoding=编码      使用选中的输出编码
      --no-hyphenation, --nh 关闭连字符
      --no-justification,                              --nj   禁止两端对齐
  -p, --preprocessor=字符串   字符串表示要运行哪些预处理器：
                             e - [n]eqn, p - pic, t - tbl,
g - grap, r - refer, v - vgrind

  -t, --troff                使用 groff 对手册页排版
  -T, --troff-device[=设备]   使用 groff 的指定设备

  -H, --html[=浏览器]     使用 www-browser 或指定浏览器显示 HTML
                             输出
  -X, --gxditview[=分辨率]   使用 groff 并通过 gxditview (X11)
                             来显示：
                             -X = -TX75, -X100 = -TX100, -X100-12 = -TX100-12
  -Z, --ditroff              使用 groff 并强制它生成 ditroff

  -?, --help                 显示此帮助列表
      --usage                显示一份简洁的用法信息
  -V, --version              打印程序版本

选项完整形式所必须用的或是可选的参数，在使用选项缩写形式时也是必须的或是可选的。
```

# 示例

* 使用 man 命令查看 man 命令自己的用户手册

  ```shell
  man man
  ```

  执行效果: 

  ![man](https://qiniu.diqigan.cn/18-11-29/94845570.jpg)
