---
title: 使用 yarn 安装 packages 之后出现 command not found 问题的解决办法
hide: false
categories:
  - coding
toc: true
tags:
  - yarn
abbrlink: 13351
date: 2019-03-15 11:13:15
---

# 前言

最近了解到 nodejs 的一款新的包管理器 yarn, 据说相对于 npm 来说有许多优点. 遂果断开启试用流程, 无奈遇到使用 yarn 安装 packages 之后出现 command not found 的问题, 这里写出我自己的解决方法. 

# 解决

1. 工作环境

   ```text
   OS: Ubuntu 18.10 x86_64
   Kernel: 4.18.0-16-generic
   Shell: zsh 5.5.1 
   ```

   非 root 用户登录. 

2. 问题重现

   * 使用 yarn 安装 Angular CLI

     ```shell
     yarn global add @angular/cli
     ```

     ![yarn-gloabl-add-angular-cli](https://i.loli.net/2019/03/15/5c8b1ac541c4d.jpg) 

     <!-- more --> 

     提示安装成功. 

   * 运行 ng 命令却提示 command not found. 

     ![command-not-found](https://i.loli.net/2019/03/15/5c8b1b8acdcf2.jpg) 

3. 解决方案 

   * yarn 全局安装的包其实是在 `~/.yarn/bin/` 目录下的, 只需将这个目录配置到系统环境变量即可. 

     ```shell
     echo 'export PATH=~/.yarn/bin/:$PATH' >> ~/.zshrc
     source ~/.zshrc 
     ```

     ![add-export](https://i.loli.net/2019/03/15/5c8b2085449de.jpg) 

     问题解决. 

   * 非 zsh 终端的用户可以将上述命令中的 `.zshrc` 改为 `.profile` 即可. 

# 参考文献

* [Installation Problem: bash: yarn: command not found](<https://github.com/yarnpkg/yarn/issues/601>) 

