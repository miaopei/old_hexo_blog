---
title: Ubuntu 18.04 系统优化
categories:
  - [geek]
  - [coding]
toc: true
tags:
  - geek
  - ubuntu
  - linux
  - 优化
abbrlink: 3236
date: 2018-08-07 13:47:23
---

# 前言

完全转入 Ubuntu 大概已经有一段时间了, 像我这种有着些微强迫症的人, 接触到新事物必定是先要优化 + 美化一番. 毕竟, 工具玩的顺手, 工作才更有激情.

# 优化

## 设置 root 用户密码

- 在 Terminal 下输入 `sudo passwd root` 
- 输入当前用户密码，回车
- 输入新密码，回车，这个密码就是 su 用户的密码。

<!-- more -->

## 设置使用 `sudo` 时免输密码

每次使用 `sudo` 时都需要输入密码确实烦人, 毕竟是私人电脑, 安全性有锁屏密码保护就可以了, 为了使用方便, 不仿取消使用 `sudo` 时需要输入 `root` 用户密码的设定:

同时按下 `ctrl` + `alt` + `t` 打开终端, 输入 `sudo visudo` , 在打开的文件中, 将

```
%sudo ALL=(ALL:ALL) ALL
```

改为：

```shell
%sudo ALL=(ALL:ALL) NOPASSWD:ALL
```

即可。

## 隐藏 grub 引导菜单

```shell
sudo vim /etc/default/grub
```

修改内容为: 

```shell
GRUB_DEFAULT=0
GRUB_HIDDEN_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT_QUIET=true
GRUB_TIMEOUT=0
GRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
GRUB_CMDLINE_LINUX=""
GRUB_DISABLE_OS_PROBER=true
```

更新 grub: 

```shell
sudo update-grub
```

之后开机就不会再出现 grub 引导界面啦, 如果需要临时显示启动页面, 只需要在开机过程中长按 空格 键就好了. 

## 更改软件源

按 `win` 键召唤 `bash` 栏, 搜索 `update` 并在搜索结果中打开 "软件更新器", 软件打开时会自动检查更新, 点 "停止" 即可.

选择 "设置" - "Ubuntu 软件" , 在 "下载自" 下拉列表中选择合适的服务器, 个人推荐 "中国的服务器", 相对来说软件版本会比较新.

## 更新软件

```shell
sudo apt update
sudo apt upgrade
```

## 安装 Gdebi 

> Gdebi 是一个安装.deb软件包的工具。它提供了图形化的使用界面，但也有命令行选项。 相比 dpkg，它能自动解决依赖问题。

安装命令:

```shell
sudo apt install gdebi
```

## 安装 Chrome 浏览器

Ubuntu 自带的是 Firefox 浏览器, 不过我个人更喜欢 Chrome, 直接下载 Chrome 安装包 [ [Download | Chrome](https://www.google.com/chrome/) ],  然后使用 gdebi 或者 Ubuntu 自带软件管理器安装均可. 

## 安装 [aria2](https://aria2.github.io/) | [GitHub](https://github.com/aria2/aria2) 

安装命令:

```shell
sudo apt-get install aria2
```

配置文件参考 [fsaimon / aria2.conf](https://github.com/fsaimon/aria2.conf).

图形界面可以使用: 

1. [Uget](https://ugetdm.com/)
2. chrome 扩展 [YAAW for Chrome](https://chrome.google.com/webstore/detail/yaaw-for-chrome/dennnbdlpgjgbcjfgaohdahloollfgoc) 

## 安装 [apt-fast](https://github.com/ilikenwf/apt-fast)

> apt-fast是一个为 **apt-get** 和 **aptitude** 做的“ **shell脚本封装** ”，通过对每个包进行并发下载的方式可以大大减少APT的下载时间。apt-fast使用aria2c下载管理器来减少APT下载时间。就像传统的apt-get包管理器一样，apt-fast支持几乎所有的apt-get功能，如， **install** , **remove** , **update** , **upgrade** , **dist-upgrade** 等等，并且更重要的是它也支持proxy。

直白点说, `apt-fast`  就是一个多线程的 `apt-get` , 对于我们通过 `apt-get` 安装软件时尤其有用. 

安装命令: 

```shell
sudo add-apt-repository ppa:apt-fast/stable
sudo apt-get update
sudo apt-get -y install apt-fast
```

使用时, 将对应命令中的 `apt-get` 替换为 `apt-fast` 即可. 享受多线程飞一般的速度吧! 

## 安装 [v2ray](https://github.com/v2ray/v2ray-core)

做 IT 这行，没个梯子还怎么混呀。我自己用的是 [v2ray](https://www.v2ray.com/)，大佬们可以自行选择其他工具。
安装很简单，运行命令：

```shell
  sudo apt install curl
  bash <(curl -L -s https://install.direct/go.sh)
```

即可。

具体的配置和运行方法见官网 [v2ray](https://www.v2ray.com/chapter_00/install.html) , 这里不再赘述。

## 安装 Linux 终端代理工具 proxychains4

有些时候我们需要在终端使用代理, proxychains4 可以很好地帮我们解决这个问题. 

* 在终端输入以下命令安装:

  ```shell
  sudo apt install proxychains4
  ```

* 修改 proxychains4 配置: 

  在终端输入命令:

  ```shell
  sudo vim /etc/proxychains4.conf
  ```

  打开配置文件, 按照自己使用的代理方式配置即可. 

* 使用方法:

  在需要代理的命令前加上 `proxychains4` 即可, 如: 

  ```shell
  proxychains4 curl ip.gs
  ```

## 安装 Git / Vim / zsh

执行命令:

```shell
sudo apt install git vim zsh
```

即可. 

## Git 优化

如果 `git log` 等命令中中文显示乱码, 可以尝试设置 `git config --global core.quotepath false` 修复. 

另外可以使用以下命令美化 `git log` :

```shell
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

设置之后运行 `git lg` , 即可体验更好的 `git log` 效果. 

## [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh) 

oh-my-zsh 是 zsh 的一个超赞的配置文件, 可以让终端更好看更好用. 

安装了 zsh 的前提下, 在终端运行以下命令即可安装:

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

## [autojump](https://github.com/wting/autojump)

> A cd command that learns - easily navigate directories from the command line

一款快速切换工作目录的工具, 可以根据 [Github](https://github.com/wting/autojump) 的说明文档安装使用.

## Vim

主要是自己懒得配置 vim，所以安装别人配好的嘻嘻嘻...

vim 配置可选 [spf13-vim](https://github.com/spf13/spf13-vim) 或者 [SpaceVim](https://github.com/SpaceVim/SpaceVim).

### [spf13-vim](https://github.com/spf13/spf13-vim)
安装命令: 

```shell
curl http://j.mp/spf13-vim3 -L -o - | sh
```

### [SpaceVim](https://github.com/SpaceVim/SpaceVim)

运行命令：

```shell
  curl -sLf https://spacevim.org/install.sh | bash
```

即可。随后第一次运行 vim 会自动安装插件，耐心等待就好。附:

- 安装文档 [Quick start guide | SpaceVim](https://spacevim.org/quick-start-guide/#linux-and-macos) 
- 中文文档 [SpaceVim 中文手册 | SpaceVim](https://spacevim.org/cn/documentation/) 

### 打通 vim 和系统剪切板

```shell
sudo apt-get install vim-gnome
```

安装之后, 在 vim 中可以通过 `+y` 命令复制内容到系统剪切板, 使用 `+p` 命令粘贴系统剪切板内容到 vim.

## [搜狗输入法](https://pinyin.sogou.com/linux/?r=pinyin) 

略微考虑了一下，姑且把输入法也算作系统增强的一部分吧。
首先安装 fcitx:

```shell
sudo apt install fcitx
```

然后下载搜狗输入法 [Download | sougouinput](https://pinyin.sogou.com/linux/) 并安装；

dash 搜索 language 打开“语言支持”，将“键盘输入法系统”改为“fcitx”，重启电脑；
点击屏幕右上角的键盘图标，选择“配置当前输入法”，选择搜狗即可。
参见[搜狗输入法 for linux 安装指南](https://pinyin.sogou.com/linux/help.php) 

* [Ubuntu 下 fctix + 搜狗输入法 CPU 占用 100% 问题解决方案](https://blog.csdn.net/sunhaobo1996/article/details/80526140) 

## [Albert](https://albertlauncher.github.io/)

albert 是 Linux 下的快捷启动/搜索工具，官方描述如下：

> Access everything with virtually zero effort. Run applications, open files or their paths,
> open bookmarks in your browser, search the web, calculate things and a lot more …
> Albert is a desktop agnostic launcher. Its goals are usability and beauty,
> performance and extensibility. It is written in C++ and based on the Qt framework.

对于 Ubuntu 18.04，可以运行以下命令即可安装：

```shell
sudo sh -c "echo 'deb http://download.opensuse.org/repositories/home:/manuelschneid3r/xUbuntu_18.04/ /' > /etc/apt/sources.list.d/home:manuelschneid3r.list"
  sudo apt-get update
  sudo apt-get install albert
```

也可以直接下载 deb 软件包进行安装 [Download | Albert](http://ftp.gwdg.de/pub/opensuse/repositories/home:/manuelschneid3r/xUbuntu_18.04/amd64/albert_0.14.21_amd64.deb)

其他系统的安装方法参见：[安装软件包 home:manuelschneid3r / albert](https://software.opensuse.org/download.html?project=home:manuelschneid3r&package=albert) 

## 使用 alias 简化常用命令

在 Linux 我们可以使用 alias 别名来简化常用命令，直接在 terminal 下输入 `alias` 就可以查看系统现有别名。
因为我们使用的终端是 zsh，所以这里介绍一下 zsh 下 alias 的使用方法。
使用命令

```shell
vim ~/.zshrc
```

来编辑 zsh 的配置文件，在其中加入需要的配置即可，格式为：

```shell
alias ${alias_name}="${command}"
```

其中：${alias_name} 表示你要为 linux 命令设置的别名，${command} 表示原先的 linux 命令。

比如我自己感觉每次写博客都要 cd 去 hexo 目录很繁琐，就设置了这样一个别名：

```shell
alias tohexo="cd ~/Documents/Coding/Web/Hexo"
```

编辑完成之后，保存 .zshrc 文件，在终端输入：

```shell
source ~/.zshrc
```

即可使刚刚的设置生效。

再举个例子, 比如有时候我想在命令行直接打开文件管理器, 那么就可以设置一条这样的别名: 

```shell
alias o="nautilus ./"
```

可以极大地简化操作. 

我个人不建议大家设置过多别名，毕竟学习阶段还是多熟悉一下 linux 命令比较好。

## 设置快捷键

继承了我在 Windows 下的操作习惯，总是习惯用 `win` + `E` 快捷键来打开文件管理器，不妨在 Ubuntu 中设置一样的快捷键，方便日常操作：

- 依次打开 “设置” - “设备” - “键盘”，拉到页面最下方，添加自定义快捷键；
- “名称” 写 “打开文件管理器”， “命令” 写 “`nautilus`”，不怕自己误操作的可以在 `nautilus` 前加上 `sudo` 以管理员权限运行；
- 最后设置快捷键即可；
- 其他命令同理。

下面罗列出我正在使用的快捷键, 仅供参考: 

| 名称           | 命令                 | 键位                     |
| -------------- | -------------------- | ------------------------ |
| 打开文件管理器 | nautilus             | `super` + `E`            |
| 打开设置中心   | gnome-control-center | `super` + `I`            |
| 系统监视器     | gnome-system-monitor | `shift` + `ctrl` + `esc` |
| 深度截图       | deepin-screenshot    | `ctrl` + `alt` + `A`     |

## 安装 exfat 支持

因为我自己的U盘是 exfat 格式，而 Ubuntu 默认不支持此格式，所以需要安装相应的扩展：

```shell
sudo apt install exfat-utils
```

## 安装 unar

Ubuntu 18.04 下使用 nautilus 解压 `.zip` 文件会产生乱码, 可以使用 `unar` 工具解压. (ubuntu 18.10 已经修复此问题).

安装命令: 

```shell
sudo apt-get install unar
```

## 安装 [TimeShift](https://github.com/teejee2008/timeshift)

TimeShift 是一款 Linux 下的系统备份还原工具, 支持自动备份和增量备份.

安装命令:

```shell
sudo add-apt-repository -y ppa:teejee2008/ppa
sudo apt-get update
sudo apt-get install timeshift
```

## 修复双系统造成的 windows 时间错误

先在 ubuntu 下更新一下时间，确保时间无误：

```shell
sudo apt install ntpdate
sudo ntpdate time.windows.com
```

然后将时间更新到硬件上

```shell
sudo hwclock --localtime --systohc
```

重启进入 Windows 系统，更新时间即可。

## 解决联想电脑开机 / 插拔耳机噪音（pop noise）

- 解决开关机噪音：

  在 `/etc/modprobe.d/` 创建一个文件 `modprobe.conf`，写入下面内容保存即可：

  ```shell
  options snd-hda-intel model=,generic
  ```

- 解决耳机插拔噪音：

  把 alsa 的 suto mute 关掉，插拔耳机就没有噪音了:

  ```shell
  sudo alsamixer
  ```

  按 `F6` 选择第二个显卡 (HDA INTEL PCH)，然后把 auto mute 改为 disabled;

  ```shell
  sudo alsactl store    # 保存配置
  ```

# 软件安装

想了一下, 软件也算是系统的一部分, 软件好用了系统用起来自然更舒畅, 所以这里收集了一些自我感觉良好的软件.

## 截图工具

下面是我比较喜欢的两款截图工具, 按需选择即可. 我个人比较喜欢 flameshot. 

### [flameshot](<https://github.com/lupoDharkael/flameshot>) 

安装: 

```shell
sudo apt-get install flameshot
```

使用: 

```shell
flameshot gui
```

快捷键命令同上. 

### deepin-screenshot

安装: 

```shell
sudo apt-get install deepin-screenshot
```

使用: 

```shell
deepin-screenshot
```

快捷键命令同上. 

## 录屏工具

### deepin-screen-recorder

安装: 

```shell
sudo apt-get install deepin-screen-recorder
```

### [peek](https://github.com/phw/peek) 

Ubuntu 下安装 peek:

```shell
sudo add-apt-repository ppa:peek-developers/stable
sudo apt update
sudo apt install peek
```

## 音视频软件

### 网易云音乐

网易云音乐算是目前为止 Linux 下最好用的音乐客户端了吧, 直接到  [网易云音乐官网](http://music.163.com/#/download) 下载 deb 安装包，在安装包所在目录运行: 

```shell
sudo gdebi ${网易云音乐安装包文件名}
```

即可. 

目前网易云音乐客户端有一个小 bug, 必须以 root 身份运行才可以正常使用. 可以通过 alias 别名简化操作, 或者直接在桌面快捷方式中的 `Exec` 命令前加上 `sudo` 使快捷方式正常运行. 

### 视频播放器 VLC

支持倍速播放, 界面相对来说也比较美观, 安装命令: 

```shell
sudo apt install vlc
```

### [kdenlive](<https://kdenlive.org/en/>) 

一款功能强大的视频编辑工具. 安装命令: 

```shell
sudo add-apt-repository ppa:kdenlive/kdenlive-stable
sudo apt-get update
sudo apt install kdenlive
```

## 办公软件

### [XMind ZEN](https://www.xmind.cn/zen/) 

超赞的思维导图软件, 下载对应的安装包安装即可.

![XMind Zen](https://qiniu.diqigan.cn/18-11-24/21142946.jpg)

下载地址: [Download | XMind ZEN deb](https://www.xmind.cn/zen/)

### [WPS Office](http://linux.wps.cn/) 

虽然不及 Windows 上面的 Office 那般强大, 但这也确实是 Linux 下的最好选择了. 

下载地址: [Download | WPS Office](http://community.wps.cn/download/) 

字体文件: [IamDH4/ttf-wps-fonts](https://github.com/IamDH4/ttf-wps-fonts) <!--  |  [Download| WPS Fonts](http://wps-community.org/download.html?vl=fonts#download) -->

通过 `gdebi` 命令安装下载好的 `deb` 安装包即可. 

### [ydcv](https://github.com/felixonmars/ydcv)

ydcv 是一款 Linux 命令行版字典工具, 可以直接在命令行中查询单词短语.

点击 [链接](https://github.com/felixonmars/ydcv/tree/master/src) 下载 `ydcv.py` 文件并移动到 `/opt` 目录下, 然后在 `/usr/bin` 下创建一个指向此文件的软链即可. 

![ydcv](https://qiniu.diqigan.cn/18-11-24/98115858.jpg)

### 百度云网盘

[iikira / BaiduPCS-Go](https://github.com/iikira/BaiduPCS-Go#linux--macos) 这是一款用 Go 语言编写的跨平台百度网盘客户端, 除了正常的多线程下载之外最最炫酷的一点是它可以在 CLI 模式下操作百度云盘里的文件, 感觉与本地无异, 强烈推荐尝试!

## MarkDown 编辑器

用户体验上来讲我个人首推 Typora, 但是毕竟 Haroopad 支持 vim 快捷键, 程序员可以尝试一下.

### [Typora](https://typora.io/) 

Typora 是一款轻量、优雅、跨平台、实时预览的 MarkDown 编辑器。并且可以将 Markdown 文件转化为多种格式输出. 

下载地址：[Download | Typora](https://typora.io/#linux) 

[notable](https://github.com/notable/notable) 

用户体验很不错的一款笔记应用. 

![Notable](https://github.com/notable/notable/raw/master/resources/demo/main.png)

### [Vnote](https://github.com/tamlok/vnote)

> **VNote** 是一个受Vim启发开发的专门为 **Markdown** 而优化、设计的笔记软件。VNote是一个更了解程序员和Markdown的笔记软件。

Vnote 的定义是一款笔记软件, 配合 [Github](https://github.com/) 或者 [gitee](https://gitee.com/) 使用可以当做云笔记来使用.

![Vnote 界面](https://qiniu.diqigan.cn/18-11-24/45068574.jpg)

下载地址: [Download | Vnote](https://github.com/tamlok/vnote/releases)

### [Haroopad](http://pad.haroopress.com/user.html)

> 跨平台的 Markdown 桌面编辑器，多种界面皮肤，支持 vim 快捷键，多格式输出。

下载地址: [Download | Haroopad](http://pad.haroopress.com/user.html#download)

## 聊天软件

### [Telegram](https://telegram.org/) 

聊天工具，下载地址：[Download | Telegram](https://desktop.telegram.org/) 

下载完成便是可执行文件, 建议放在 `/opt` 目录下. 

### WeChat & Tim

我个人推荐 deepin-wine-ubuntu 移植的 WeChat 和 Tim, electronic 用户体验不太好.

#### [wszqkzqk/deepin-wine-ubuntu](https://github.com/wszqkzqk/deepin-wine-ubuntu)

这个项目是 Deepin-wine 环境的 Ubuntu 移植版, 可以在 Ubuntu 上运行 Tim, 微信, 网易云音乐, 百度云网盘, 迅雷等 Windows 软件, 可以说是很良心了. 使用方法参见项目文档. 


#### [electronic-wechat](https://github.com/geeeeeeeeek/electronic-wechat) 

Linux 下一种退而求其次的 Wechat 客户端解决方案吧, 虽然不像官方客户端那么好用, 但毕竟比网页版强很多.

下载地址：[Download | electronic-wechat](https://github.com/geeeeeeeeek/electronic-wechat/releases) 

## 小玩具

### [edex-ui](https://github.com/GitSquared/edex-ui)

> A science fiction desktop running everywhere. Awesome.

编译工程的时候拿出来摆桌面还是很不错的. 

![edex-ui](https://qiniu.diqigan.cn/18-11-24/88802889.jpg)																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																										

### [wkhtmltopdf](https://wkhtmltopdf.org/) | [Github](https://github.com/wkhtmltopdf/wkhtmltopdf)
可以通过命令行把指定网页转换为 pdf 或者图片.

## 编程软件集合

嗯, 另外再罗列一下我自己用到的编程软件吧. 是的, 你没听错, 只是罗列, 毕竟敢用 Ubuntu 需要编程软件的大佬都有自己解决问题的能力. 什么? 你说自己不能解决问题? 嗯, 那就乖乖用回 Windows 吧. 

### [Intellij IDEA]()

下载地址: [Download | Intellij IDEA](https://www.jetbrains.com/idea/) 

### [Intellij Pycharm](https://www.jetbrains.com/pycharm/) 

下载地址: [Download | IntelliJ Pycharm](https://www.jetbrains.com/pycharm/download/#section=linux) 

### [Navicat Premium](https://www.navicat.com/en/download/navicat-premium)

下载地址: [Download | Navicat Premium](https://www.navicat.com/en/download/navicat-premium)

### [Sublime Text](https://www.sublimetext.com/)

安装方法见官网: [Linux Package Manager Repositories – Sublime Text 3 Documentation](https://www.sublimetext.com/docs/3/linux_repositories.html#apt)

如果出现无法输入中文的情况, 可参考下述方法解决: [lyfeyaj/sublime-text-imfix](https://github.com/lyfeyaj/sublime-text-imfix)

### Java jdk

我自己开发用的是 jdk-8, 大佬可以按需选择. 

```shell
sudo apt install openjdk-8-jdk openjdk-8-source openjdk-8-doc
```

### Maven

```shell
sudo apt install maven
```

### Mysql

我查到的资料说 Ubuntu 18.04 已经不支持 mysql 5.7，参考以下方法解决：[Ubuntu18.04安装MySQL8.0解决root用户密码登录不成功问题](https://blog.csdn.net/zyqblog/article/details/80159990)

### [Docker](https://www.docker.com/) 

参考链接: [安装 Docker · Docker —— 从入门到实践](https://yeasy.gitbooks.io/docker_practice/install/) 

## 创建软链

有一些软件下载之后就是可执行文件, 比如 Telegram, electronic-wechat 等等, 每次运行都要 cd 到软件所在目录也是麻烦, 除了 alias 别名之外还有一种方法就是创建软链, 在 `/usr/bin/`  目录下创建软链之后就可以在系统任何地方执行命令了. 

创建软链的命令如下: 

```shell
sudo ln -s ${file_path}/${file_name} /usr/bin/${new_command}
```

其中: 

* `${file_path}` 代表可执行文件所在的路径; 
* `${file_name}` 代表可执行文件的文件名; 
* `${new_command}` 代表新的命令; 

之后, 就可以在人以终端输入 `${new_command}` 来打开软链指向的程序了. 

软链还有很多有用的特性, 感兴趣的可以自行查阅相关资料, 此处不再赘述. 

## 为应用添加启动图标

依然是针对极个别的可执行文件, 安装之后在 dash 栏是搜索不到的, 因为在 `/usr/share/applications/` 目录下没有他们的 `.desktop` 文件呀, 既然没有, 创建一个便是. 

以 electronic-wechat 为例:

```shell
sudo vim /usr/share/application/electronic-wechat.desktop
```

填入以下内容:

```shell
[Desktop Entry]
Name=Electronic Wechat
Name[zh_CN]=微信电脑版
Name[zh_TW]=微信电脑版
Exec=/opt/electronic-wechat-linux-x64/electronic-wechat
Icon=/opt/icons_customer/wechat1.png
Terminal=false
X-MultipleArgs=false
Type=Application
Encoding=UTF-8
Categories=Application;Utility;Network;InstantMessaging;
StartupNotify=false
StartupWMClass=electronic-wechat
```

其中:

* `Name` 是应用名称, 也就是在 dash 栏搜索是需要输入的内容; 
* `Exec` 是可执行程序路径;
* `Icon` 是应用图标, 当 `Type=Application` 时有效;
* `StartupWMClass` 是图标分类依据, 这个字段值相同的图标会自动被分为一组. 
* 其他字段不多说, 自行查找资料吧. 

# 参考文献

1. [apt-fast：飞一般的apt-get](https://linux.cn/article-2143-1.html) 
2. [git log的简化及美化](https://blog.csdn.net/asukasmallriver/article/details/77882465) —— asukasmallriver
3. [linux开关机啪啪响(pop noise)的解决方案](https://blog.csdn.net/chenyiyue/article/details/51066913) —— Vic_Chen_is_here
4. [Ubuntu 18.04 LTS安装中文输入法，桌面美化等各种东西记录](https://www.jianshu.com/p/e75c27c27a2e) —— JoshXXX
5. [2018年wine QQ最完美解决方案（多Linux发行版通过测试并稳定运行）](https://www.lulinux.com/archives/1319)    ------    小撸
