---
title: Sublime Text 插件配置多端同步
toc: true
categories: coding
tags:
  - sublime
  - synchronize
abbrlink: 24668
date: 2018-07-10 12:55:46
---
### 前言
依旧是因为最近公司 + 宿舍双电脑以及双系统的各种折腾引发了各种软件的同步需求，又刚好喜欢 GitHub，所以就选择 GitHub 来作为同步服务器啦。
本文建立在已经可以熟练使用 git 以及 github 的前提下，如果对 git 或者 github 不熟悉，还请自行补充相关知识。

### 首次备份
1. 打开安装好的 Sublime Text，选择 “菜单栏” —— “Preferences” —— “Browse Packages” 打开 Sublime Text 配置文件目录；
 > Windows 下一般是: `C:\Users\${your_username}\AppData\Roaming\Sublime Text 3\Packages`
 <!-- > Linux 下一般是: `` -->
2. 关闭 Sublime Text 软件；
3. 进入 **User** 目录，创建 **.gitignore** 文件，内容为：
```
Package Control.last-run
Package Control.ca-list
Package Control.ca-bundle
Package Control.system-ca-bundle
Package Control.cache/
Package Control.ca-certs/
```
<!-- more -->
这里的项目是不需要同步的文件/文件夹，可根据实际情况调整。
4. 打开 GitBash，依次执行以下命令：
```
git init # 初始化 git 仓库
git add . # 跟踪本地文件
git commit -m "${comment}" # 提交本次更新，其中：${comment} 是对于本次提交的说明
git remote add origin ${your_github_repository} # 添加远程仓库
git push origin master # 提交本地变更到远程仓库
```
至此，sublime text 的插件以及设置备份完毕！

### 首次恢复
1. 在当前终端安装并打开 sublime text 软件；
2. 选择“菜单栏” —— “Preferences” —— “Browse Packages” 打开 Sublime Text 配置文件目录；
3. 关闭 Sublime Text 软件；
3. 打开 git bash，依次执行以下命令：
```
mv User User.old # 备份
git clone ${your_github_repository} User # 克隆远程仓库到本地 User 目录
```
5. 打开 Sublime Text，安装 Package Control
  * 按下 `ctrl` + `~` 键或者选择 “菜单栏” —— “View” —— “Show Console” 打开控制台；
  * 复制以下命令粘贴到 Sublime 控制台并回车执行：
  ```
  import urllib.request,os,hashlib; h = '6f4c264a24d933ce70df5dedcf1dcaee' + 'ebe013ee18cced0ef93d5f746d80ef60'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
  ```
  可以在 [Installation - Package Control](https://packagecontrol.io/installation) 查询上述命令。
  * 等待程序执行完成
6. 恢复完毕！

### 日常备份恢复
1. 如果任意一个终端设置有所改动，在 `${package_folder}/User` 目录下执行
```
git add .
git commit -m "${comment}"
git push origin master
```
即可。
2. 如果需要恢复其他终端的设置更新，在 `${package_folder}/User` 目录下执行
```
git pull origin master
```
即可。

### 插件清单
罗列一下我自己使用的插件清单，就不作过多解释啦。
  1. Package Control
  1. Alignment
  1. BracketHighlighter
  1. Color Highlighter
  1. ConvertToUTF8
  1. CSS Comments
  1. DocBlockr
  1. Emmet
  1. HTML5
  1. MarkdownEditing
  1. MarkdownPreview
  1. PlainTasks
  1. SideBarEnhancements

### 参考文献
1. [使用git在多台机器上同步sublime text的设置和插件](https://www.sheng00.com/1861.html) —— sheng00
2. [Installation - Package Control](https://packagecontrol.io/installation)
