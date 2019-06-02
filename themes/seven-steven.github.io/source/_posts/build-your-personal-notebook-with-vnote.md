---
title: 使用 Github + VNote 搭建个人笔记
hide: false
categories:
  - geek
toc: true
tags:
  - vnote
  - geek
  - markdown
abbrlink: 52231
date: 2018-11-25 20:41:29
---

# 前言

自从使用 Ubuntu 系统以来, 笔记软件一直是我很头疼的问题. 现有的方案包括以下几种: 

* [蚂蚁笔记](https://leanote.com/) 

  蚂蚁笔记是我目前最喜欢的笔记软件之一, 蚂蚁笔记的开发者自身就是程序员, 所以充分迎合了程序员的习惯与需求. 支持 Markdown, 跨平台, **笔记可以转换为博客**. 试用期过后收费 5 元 / 月, 是我见过的最便宜的笔记了. 

  项目开源, 不想付费或者想挑战一下自己的大牛可以自己搭建. 

* [为知笔记](https://note.wiz.cn)

  跨平台, 支持 Markdown, 用户体验相对较好的笔记软件. 试用期过后收费 6 元 / 月.  [桌面客户端](https://github.com/WizTeam/WizQTClient) 开源, 意思就是没得搭建咯. 

* [印象笔记](https://www.yinxiang.com/)

  虽然可以通过 Crossover 或者 Wine 安装 Windows 版本的 Evernote, 但是目前 Windows 版 Evernote 不支持 Markdown, 不在考虑范围之内. 

  <!-- more -->

* [有道云笔记](https://note.youdao.com/)

  同样可以通过 Crossover 或者 Wine 强行安装, 但是买不起会员又忍不了广告的我并不喜欢这类软件, 排除. 

* [VNote](https://github.com/tamlok/vnote)

  没错, 我对开源项目就是毫无抵抗力 --> [Github 地址](https://github.com/tamlok/vnote)

  VNnote 是一款本地软件, 有 Windows, Linux 和 MacOS 的客户端. VNnote 自身的定义为: 

  > **更懂程序员和Markdown的笔记！**
  >
  > **VNote**是一个基于Qt框架的、免费的开源笔记软件。VNote专注于Markdown的编辑与阅读，以提供舒适的编辑体验为设计目标。
  >
  > VNote不是一个简单的Markdown编辑器。通过提供笔记管理功能，VNote使得编写Markdown笔记更简单和舒适！

  说实话我被它圈粉是因为它强大的公式编辑与流程图绘制能力. 话不多说, 直接上图: 

  ![vnote](https://qiniu.diqigan.cn/2018-11-25214147864.png)

说实话 Ubuntu 下的笔记软件还是选择 蚂蚁笔记 或者 为知笔记 比较好, 毕竟多平台, 方便随时随地编辑与查阅. 作者之所以使用 VNnote, 多少抱着好玩的态度, 说不定哪天临阵倒戈跑去 蚂蚁笔记. 

各位看官如果跟我一样喜欢玩, 那么我们就开始折腾之旅吧. 本文基于 Ubuntu 环境进行讲解, Windows 或者 MacOS 类似. 

# 安装 Vnote

* 下载

  点击 [**链接**](https://github.com/tamlok/vnote/releases) 下载对应版本的 VNote 客户端, Linux 用户下载 `AppImage` 版本即可.

* 给 `AppImage` 文件赋予可执行权限

  ```shell
  chmod +x ./XXXXX.AppImage
  ```
* 双击 `AppImage` 文件即可执行

* 添加笔记本

  在合适位置添加自己的笔记本, 记住自己笔记本的路径.

  ![new notebook](https://qiniu.diqigan.cn/18-11-25/81674744.jpg)

  此时, 笔记本就创建好了.

# Github 同步

其实就是简单地利用 Github 同步笔记文件.

* 在 Github 新建仓库并复制仓库地址

* 进入笔记目录, 运行以下命令: 

  ```shell
  git init
  git remote add origin ${github仓库地址}
  git add .
  git commit -m "版本信息"
  git push --set-upstream origin master
  ```

* 至此, 笔记同步完毕. 关于 git 的使用我不再多说, 程序员必备技能, 不熟悉的小伙伴可以自行查阅相关资料. 

# 笔记同步

* 在新电脑安装 VNote 之后, 先克隆 Github 仓库到本地: 

  ```shell
  git clone ${github仓库地址}
  ```

* 打开 VNote, 添加笔记本, 路径选择刚才克隆到本地的 Github 仓库, 就可以看到同步过来的笔记了

# 日常使用

* 编辑笔记之前, 需要先去笔记目录拉取远程仓库.

  ```shell
  git pull
  ```

* 编辑完笔记后, 需要到笔记目录将变更同步到 Github

  ```shell
  git add .
  git commit -m "变更信息"
  git push
  ```

# 后记

30 分钟前想写这篇文章时觉得心血来潮干劲满满. 写了一半才意识到这篇文章不过是介绍了 VNote 这款工具顺便讲解一下 Git 的用法而已, 并无多少稀奇之处, 权当是给 VNote 做了个广告, 支持开源软件了吧.
