---
title: git 一次 push 到多个远程仓库
hide: true
categories:
  - [coding]
  - [notes]
toc: true
tags:
  - git
abbrlink: 58890
date: 2018-11-28 14:27:41
---

# 前言

有时候我们同一个项目拥有多个远程仓库, 一个一个 push 未免有些麻烦, 我们可以通过更改 git 设置来达到一次 push 到多个远程仓库的目的.

# 步骤

* 编辑 ".git/config" 文件, 追加一个远程分支 "all", 指定多个 url 参数, 分别指向多个 git 仓库: 

  ```shell
  [remote "all"]
  	url = git@gitee.com:Seven-Steven/hexo-blog.git
  	url = git@git.coding.net:Seven-Steven/hexo-blog.git
  ```

* 此后执行 `git push all` 即可同时推送到多个远程仓库. 

* 如果想要进一步简化命令, 可以执行命令:

  ```shell
  git push --set-upstream all
  ```

  之后, 提交代码时只需执行 `git push` 即可提交到多个远程仓库.
