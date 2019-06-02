---
title: Deepin 装机后的一点优化
toc: true
categories: coding
tags:
  - deepin
  - linux
  - 优化
abbrlink: 56192
date: 2018-02-01 23:28:42
---

# 前言
最近想体验一下 Linux 系统，初步搜索之后决定安装 Ubuntu。折腾了一周的感悟就是 Ubuntu 对于国内用户的优化做得略差，安装系统后初步的优化、美化以及入门操作大概要花一周左右，不太适合**不爱折腾**的**国内**用户**入门**使用。后来朋友推荐我试一下 [deepin](https://www.deepin.org/)，简单地体验之后，我觉得相比 Ubuntu，Deepin 更适合新手入门，Deepin  对于国内的优化可谓是做到了极致，自带正版 [Crossover](https://www.codeweavers.com/products)，可以运行部分 Windows 应用，非常适合从 Windows 或者 Mac 转型过来的新手使用。
当然以上只是作者个人的见解，作为一个刚刚入门 Linux 的新手来说，我自己本身是没有什么发言权的，如有偏颇，还请见谅。
接下来说一下安装 Deepin 系统之后的一些优化流程，无关紧要，算是写给自己的备忘录吧。
<!-- more -->
# 1. 设置 root 用户密码
虽然没什么用，但这个一般是我安装 Linux 系统之后做的第一件事。
打开命令行，输入以下命令进行设置：
```shell
sudo passwd root
```
![设置 root 用户密码](https://qiniu.diqigan.cn/18-1-29/26697735.jpg)
# 2. 更新软件以及系统
软件的更新可以在 “控制中心” → “更新” 栏目下可视化操作，也可以在命令行运行以下命令进行更新：
```shell
sudo apt-get update
sudo apt-get upgrade
```
个人推荐前者。
# 3. 常用软件安装
平常能用到的软件大部分都可以在 **深度商店** 找到，进入深度商店搜索相应软件名点击安装即可。
我自己用到的软件有：
- Chrome (系统自带)
- 微信
- Tim
- Typora
- Telegram
- Albert
有一些需要特别说明的软件：
(1) Git
   深度商店里面貌似是没有 Git 的，我们可以通过命令行安装：
   ```shell
   sudo apt-get install git
   ```
(2) [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)
   首先确保你安装了 Git 和 wget，然后运行命令：
   ```shell
   sudo apt-get install zsh
   sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
   ```
   体验更好的命令行工具吧！
(3) [CMDU_DDE_DOCK](https://github.com/sonichy/CMDU_DDE_DOCK)
   CMDU_DDE_DOCK 是一个深度 Linux 网速任务栏插件，可以在任务栏显示网络上传下载速度等信息。
   安装方法：
   ```shell
   git clone https://github.com/sonichy/CMDU_DDE_DOCK
   sh ./CMDU_DDE_DOCK/install.sh
   ```
   ![显示效果](https://github.com/sonichy/CMDU_DDE_DOCK/raw/master/preview.png)
(4) electron-ssr
   electron-ssr 是一个跨平台 (支持Windows MacOS Linux系统) 的`ShadowsocksR`客户端桌面应用，可以很方便得对 ssr 进行管理。
   点击链接【 [electron-ssr | Download](https://github.com/erguotou520/electron-ssr/releases) 】下载对应的安装包，Deepin 系统用户下载 .deb 安装包即可。
   下载完成后直接使用 **深度软件包管理器** 安装即可，具体的使用方法不再赘述。
(5) axel
   axel 是一款命令行多线程下载工具，输入以下命令安装：
   ```shell
   sudo apt-get install axel
   ```
   具体的使用方法不再赘述。
(6) Sublime Text
   Sublime Text 直接在 深度商店 即可搜索安装，只是通过深度商店安装的 sublime text 3 的运行命令是`sublime-text-dev`，较为不便。可以通过以下命令将其更改为`subl` ：
   ```shell
   sudo ln -s /usr/bin/sublime-text-dev /usr/bin/subl
   ```
# 4. 软件卸载
讲完安装当然要讲卸载啦。
- 通过 *深度商店* 或者 *深度软件包管理工具* 安装的软件可以在启动器中右键对应软件图标进行卸载。
- 通过`apt` 或者 `apt-get` 命令安装的软件大都可使用命令 `sudo apt remove --purge 软件名` 进行卸载。

# 5. 创建软链
部分应用的启动命令过于繁琐，我们可以通过创建软链的方式来自定义运行命令。
```shell
sudo ln -s /usr/bin/old-command /usr/bin/new-command
```
将上述命令行中的`old-command` 和 `new-command` 替换为你自己的命令即可。
我们也可以通过这种方式将系统的 `python` 命令指向最新版本的 Python 哦！
# 6. 自定义快捷键
每次打开应用都要拿鼠标点击图标是不是超级不方便？没关系！我们可以自定义快捷键来完成这些操作。
具体方法是：
依次打开 "控制中心" → "快捷键" → "添加自定义快捷键"，完善对应的信息即可。
![快捷键设置](https://qiniu.diqigan.cn/18-1-29/13307639.jpg)
我自己添加的命令有：
- 打开控制中心： `dde-control-center -s `
- 关机：`shutdown -t now`  / `poweroff`
- 打开 Chrome：`google-chrome`
其它的就靠你们自己发挥想象力啦！
# 7. 关闭系统提示音
我自己是比较喜欢安静的，总觉得开机音效以及系统的各种提示音有点吵？
关闭方法：
“控制中心”	→	“声音”	→	“音效”
选择关闭即可。
# 参考文献：
- [Deepin使用优化及技巧](https://lanseyujie.com/post/deepin-optimization-techniques.html) —— 森林生灵
