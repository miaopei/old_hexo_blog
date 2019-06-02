---
title: Hexo 多端同步
toc: true
categories: coding
tags: Hexo
abbrlink: 19664
date: 2018-07-07 11:14:35
---

### 前言
在之前的文章中，我们已经讲过了 Hexo 的基本入门以及进阶操作，包括：
* [使用 GitHub + Hexo 搭建个人博客](http://diqigan.cn/2017/08/19/%E4%BD%BF%E7%94%A8-GitHub-Hexo-%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2/)
* [Hexo Yilia主题进阶配置](http://diqigan.cn/2017/08/21/Hexo-Yilia%E4%B8%BB%E9%A2%98%E8%BF%9B%E9%98%B6%E9%85%8D%E7%BD%AE/)
* [Hexo 进阶设置](http://diqigan.cn/2017/08/23/Hexo%E8%BF%9B%E9%98%B6%E8%AE%BE%E7%BD%AE/)

但是在那之后，我又安装了 Windows + Linux 双系统，如果我需要同时在两个系统下写博客，或者说需要同时在公司电脑以及个人电脑上发布文章，就需要在每次变更博客后及时拷贝源文件，然后复制到新的终端继续写作。  
无疑、这是一个很麻烦的过程。此时、我们会去想，有没有一个好用的 Hexo 多端同步方案来帮我们解决这些烦恼呢？答案是肯定的。
<!--more-->
### 初次备份
因为我们的博客是搭建在 GitHub 上的，所以备份方案依然是首选 GitHub。当然你也可以选择其他基于 Git 的版本管理系统，操作方法大同小异。
假定我们现在已经在终端的 `${path}` 目录下搭建好了 Hexo 博客。那么，Hexo 的备份步骤如下：  
1.修改 `${path}/.gitignore` 文件，在末尾添加两行内容：  
```
/.deploy_git
 /public
```
2.在 `${path}` 目录下打开 Git Bash 执行如下命令：  
```
git init  # 初始化 git 仓库
git remote add origin ${your github repository} # 添加 Github 远程仓库，
    # 其中：`[github repository]` 是你发布 Hexo 时所建立的仓库地址。
    # 比如：`git@github.com:Seven-Steven/seven-steven.github.io.git`
git add . # 将变更添加到 git 暂存区
git commit -m "${comment}" # 提交本次更改，其中 ${comment} 是本次提交的说明，按照实际情况填写任意字符即可
git push origin master:hexo # 将本地 master 分支的提交发布到远程仓库的 hexo 分支
```

可以在 Github 仓库页面图示位置直接复制得到： 
![github 仓库地址](https://qiniu.diqigan.cn/18-7-7/53099124.jpg)

远程仓库中的 master 分支用于存储 hexo 生成的静态页面，hexo 分支用于存储 hexo 源文件；
* 此时，我们已经成功将 Hexo 备份到了远程仓库的 hexo 分支；

### 恢复安装
现在，我们来到另一个终端，恢复刚才的备份。
* 首先，按照 [使用 GitHub + Hexo 搭建个人博客](http://diqigan.cn/2017/08/19/%E4%BD%BF%E7%94%A8-GitHub-Hexo-%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2/) 中的步骤，依次安装好 **Git**、 **Node**、 **npm**；
* 假设我们要将 hexo 恢复到本地的 `${path}` 目录下，在该目录下打开 ** Git Bash**，依次执行以下命令：
```
git clone -b hexo [github repository] ./ # 克隆远程仓库的 hexo 分支到本地
npm install hexo-cli -g # 安装 hexo
npm install # 安装各种插件
npm install hexo-deployer-git # hexo git 部署插件
```
* 依次执行 `hexo g`、 `hexo s` 测试效果。
* 大功告成！

### 多端同步
* 在任意一个终端更新博客前执行 `git pull origin hexo` 拉取云端最新版本；
* 在任意一个终端更新博客后依次执行
```
git add .
git commit -m "[comments]
git push origin hexo
```
发布本地变更到云端；
* just this

### 问题解决

1. npm 权限问题

   将 npm 默认目录定向到其他具有读写权限的目录即可. 具体操作流程如下: 

   * 创建一个目录用于全局安装:

     ```shell
     mkdir ~/.npm-global
     ```

   * 配置 npm 使用这个新目录: 

     ```shell
     npm config set prefix '~/.npm-global'
     ```

   * 打开或者创建文件 "~/.profile" 并在文末添加如下代码: 

     ```shell
     export PATH=~/.npm-global/bin:$PATH
     ```

   * 返回命令行, 更新系统变量: 

     ```shell
     source ~/.profile
     ```

   * 问题解决.

### 参考文献
1. [使用hexo，如果换了电脑怎么更新博客？](https://www.zhihu.com/question/21193762)     ——    CrazyMilk
2. [处理 npm 权限问题 · NPM 中文文档](https://www.kancloud.cn/shellway/npm-doc/199985)     ------    Shellway Ho
