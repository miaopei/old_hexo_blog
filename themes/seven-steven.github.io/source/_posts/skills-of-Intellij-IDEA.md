---
title: 使用 Intellij IDEA 的一些技巧
hide: false
categories:
  - coding
toc: true
tags:
  - coding
  - tools
  - geek
abbrlink: 45060
date: 2018-11-16 22:02:23
---

# 前言

从 Eclipse 转入 Intellij IDEA, 个人感觉还是收益很大的. 熟悉一个新的 IDE 毕竟需要一个过程, 在此记录我逐步了解 IDEA 过程中的一些心得与体会. 希望能够帮到有需要的人.

# [插件](https://plugins.jetbrains.com/idea)

## [.ignore](https://plugins.jetbrains.com/plugin/7495--ignore)

这是一款自动生成 `.ignore` 文件的插件, 官方介绍如下: 

> **.ignore** is a plugin for *.gitignore (Git), .hgignore (Mercurial), .npmignore (NPM), .dockerignore (Docker), .chefignore (Chef), .cvsignore (CVS), .bzrignore (Bazaar), .boringignore (Darcs), .mtn-ignore (Monotone), ignore-glob (Fossil), .jshintignore (JSHint), .tfignore (Team Foundation), .p4ignore (Perforce), .prettierignore (Prettier), .flooignore (Floobits), .eslintignore (ESLint), .cfignore (Cloud Foundry), .jpmignore (Jetpack), .stylelintignore (StyleLint), .stylintignore (Stylint), .swagger-codegen-ignore (Swagger Codegen), .helmignore (Kubernetes Helm), .upignore (Up), .prettierignore (Prettier), .ebignore (ElasticBeanstalk)* files in your project. 

<!-- more -->

总之就是能够生成各种各样的 `.ignore` 文件啦, 为 `java` 工程生成 `.gitignore` 的过程如下图:  

![.gitignore](https://qiniu.diqigan.cn/18-11-25/2256730.jpg)

# 奇淫技巧

## 关闭 Intellij IDEA 的 Tab 页

或许有人会纳闷儿为什么要关闭 idea 的 tab 页, 至少我个人觉得 tab 页的存在一定程度上会让我们对其形成依赖性, 查找文件时总会不自觉得瞄一眼 tab 页, 找到后再鼠标去点击切换. 这种操作流程很大程度上降低了工作效率, [khotyn](https://www.jianshu.com/u/5ad83b187765) 提出了另外一种更高效的方案, 那就是关闭 idea 的 tab 页, 然后改用快捷键 `ctrl + E` 查找最近访问的文件, 改用快捷键 `ctrl + shift + E` 来查找最近编辑的文件, 个人感觉颇为受用.

关闭 idea tab 页的方法: 

settings -> Editor -> General -> Editor Tabs -> Placement: None

![关闭 tab 页](https://qiniu.diqigan.cn/18-11-16/87701282.jpg)

## Rest Client

Intellij IDEA 里面内置了一个 Rest Client, 可以通过快捷键 `ctrl + shift + A`, 然后搜索 `Rest Client` 找到: 

![Rest Client in IDEA](https://qiniu.diqigan.cn/18-11-16/60392349.jpg)

![REST Client](https://qiniu.diqigan.cn/18-11-16/28130986.jpg)

虽然不如 Postman 那般强大, 但是简单调试还是够用的.

<!--

## HTTP Client

也许细心地小伙伴已经发现, 上图中显示 REST Client 已经被废弃, IDEA 提供了更加强大的 HTTP Client.

-->

# 一些小问题

## 快捷键冲突

虽然可以通过在 idea 更改或者追加快捷键来解决这类问题, 但是像我这种强迫症是极其不建议更改系统默认快捷键, 统一的标准更有助于自己的开发与团队的交流. 

这里只说一下我自己在 Ubuntu 环境下 idea 内置方案 `Default for GNOME` 下遇到的快捷键冲突问题, 其他系统还需要自己排查.

### `ctrl + alt + s`

* Fctix

  这个问题有可能是和 Fctix 输入法冲突, 解决步骤: 

  * Ubuntu Dash 栏搜索 "Fctix", 打开 "Fctix" 配置;
  * 点击 "全局配置" 选项卡, 勾选左下角 "显示高级选项" 复选框;

  ![fctix 配置界面](https://qiniu.diqigan.cn/18-11-28/26438405.jpg)

* 可见 `ctrl + alt + s` 快捷键已被 fctix 输入法注册为 "保存配置及输入历史", 删除或者更改这个快捷键映射即可. 

<!--

### `ctrl + shift + f10`

-->

# 参考文献

1. [Intellij IDEA 一些不为人知的技巧](https://www.jianshu.com/p/364b94a664ff)
2. [idea .gitignore(git文件忽略)](https://www.jianshu.com/p/9ff3920d7a63)