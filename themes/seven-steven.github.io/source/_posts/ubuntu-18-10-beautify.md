---
title: Ubuntu 18.10 美化
hide: false
categories:
  - geek
toc: true
tags:
  - ubuntu
abbrlink: 54485
date: 2018-11-02 08:59:31
---

### 前言

当初倒腾 Ubuntu 18.04 的时候积攒了一些美化经验, 但是一直没有将其系统整理归纳. 暂借这次升级系统的机会, 重新记录一下 Ubuntu 的美化流程.

### 工具

gnome-tweak-tool 是 Gnome 官方发布的一款 Gnome 调节软件, 借助这款软件, 我们可以更好地管理主题, 扩展, 字体 以及系统行为等设置项.

输入以下命令安装:

```shell
sudo apt install gnome-tweak-tool
```

<!-- more -->

### 主题

先放几个我比较喜欢的主题: 

* [macOS High Sierra](https://www.gnome-look.org/p/1013714/) | [Github](https://github.com/vinceliuice/Sierra-gtk-theme) 
* [Flatabulous-Collection](https://www.gnome-look.org/p/1171746/) 
* [Ant Themes](https://www.gnome-look.org/p/1099856/) | [Github](https://github.com/EliverLara/Ant) 

主题安装只需要下载文中链接对应的主题, 然后解压并移动到 `/usr/share/themes/` 即可.

### 图标

我自己用的图标是 [macOS iCons](https://www.gnome-look.org/p/1102582/) 中的 **MacOS 11** ,  Github 地址 [USBA/macOS-iCons](https://github.com/USBA/macOS-iCons)
下载完成后解压并移动到 `/usr/share/icons/` 即可。

### [扩展](https://extensions.gnome.org/)

[Gnome Shell Extensions](https://extensions.gnome.org/) 是 Gnome 的一系列插件, 类似 Chrome 的插件, 可以起到系统增强的作用.
Ubuntu 18.4 软件中心集成了许多 gnome 扩展，但可能受到网络影响，我这里下载安装速度极慢，索性就借助 Chrome浏览器安装吧。
[具体步骤](https://linux.cn/article-9447-1.html)如下：

- 安装 Chrome 扩展程序 [GNOME Shell integration](https://chrome.google.com/webstore/detail/gnome-shell-integration/gphhapmejobijbbhgpjhcjognlahblep)
- 安装 主机连接器 `sudo apt install chrome-gnome-shell`

接下来我们就可以在网站 [GNOME Shell Extensions](https://extensions.gnome.org/) 安装 gnome 扩展了。
通过搜索找到自己心仪的扩展程序，点击进入详情页面，切换详情页面的“OFF”按钮即可安装对应扩展.

我自己安装的扩展程序包括：

*注: 斜体部分暂不支持 Ubuntu 18.10, 下列所有扩展均支持 Ubuntu 18.04*

- [dash to dock](https://extensions.gnome.org/extension/307/dash-to-dock/)  优化 Ubuntu 默认的 dock 

- [User Themes](https://extensions.gnome.org/extension/19/user-themes/)    自定义 shell 主题

- [Coverflow Alt-Tab](https://extensions.gnome.org/extension/97/coverflow-alt-tab/)   优化 Ubuntu 默认窗口切换动作

- *[Gnome Global Application Menu](https://extensions.gnome.org/extension/1250/gnome-global-application-menu/)   将当前程序的菜单项提取到状态栏*

- [NetSpeed](https://extensions.gnome.org/extension/104/netspeed/)    显示网速插件

- [Clipboard Indicator](https://extensions.gnome.org/extension/779/clipboard-indicator/)   提供剪切板历史记录功能

- *[Drop Down Terminal](https://extensions.gnome.org/extension/442/drop-down-terminal/)    可以从屏幕上快速弹出一个终端*

- [Recent Items](https://extensions.gnome.org/extension/72/recent-items/)          快速打开最近打开过的文件

- [Places Status Indicator](https://extensions.gnome.org/extension/8/places-status-indicator/)   利用下拉菜单快速打开驱动器上的常用位置

- *[Dynamic Top Bar](https://extensions.gnome.org/extension/885/dynamic-top-bar/)       动态调整状态栏透明度*

- [Hide top bar](https://extensions.gnome.org/extension/545/hide-top-bar/)    隐藏顶栏, 可以设置为鼠标靠近屏幕上边沿时显示顶栏

- [Top Panel Workspace Scroll](https://extensions.gnome.org/extension/701/top-panel-workspace-scroll/)    快速切换工作区

- [Gravatar](https://extensions.gnome.org/extension/1015/gravatar/)    把你的 Ubuntu 用户头像设置成你的 Gravatar 头像.

- [TopIcons Plus](<https://extensions.gnome.org/extension/1031/topicons/>)    将传统托盘图标移动到顶部面板 (Wine 程序救星)

  按下 `Alt` + `F2`,输入 `r`，回车重启 gnome。

### 其他

1. 将关闭按钮移动到窗口左侧
   gnome-tweak-tool 窗口设置中，将标题栏按钮放置位置改为“左”即可。

2. 卸载 Ubuntu-Dock

   ```shell
   sudo apt purge gnome-shell-extension-ubuntu-dock
   ```

3. [Oh My Zsh 主题](https://github.com/robbyrussell/oh-my-zsh/wiki/themes)

   在 `~/.zshrc` 文件中可以修改 zsh 的主题, 以下是我觉得比较好看的主题: 

   * agnoster
   * bira
   * robbyrussell



### 登录界面

1. 首先把选好的壁纸放到 "/usr/share/backgrounds/" 目录下: 

   ```shell
   sudo cp ${picture-path} /usr/share/backgrounds/
   ```

   其中: `${picture-path}` 是你自己的壁纸路径.

2. 然后编辑 "gdm3.css" 文件: 

   ```shell
   sudo gedit /etc/alternatives/gdm3.css
   ```

   把

   ```css
   #lockDialogGroup {
       background: #2c001e url(resource:///org/gnome/shell/theme/noise-texture.png); 
       background-repeat: repeat; }
   ```

   替换为: 

   ```css
   #lockDialogGroup {
       background: #2c001e url(file:///usr/share/backgrounds/壁纸名称);
       background-repeat: no-repeat;
       background-size: cover;
       background-position: center; }
   ```

   即可. 

   如果想要进一步仿 MacOS 登录界面, 可以使用: [macOS High Sierra](https://www.opendesktop.org/s/Gnome/p/1207015/)

### 开机动画

先罗列几个看起来不错的开机动画, 也可以去 [Plymouth Themes - www.gnome-look.org](https://www.gnome-look.org/browse/cat/108/order/latest) 查找更多动画.

- [UbuntuStudio - Suade](https://www.gnome-look.org/p/1176419/)
- [Mint Floral](https://www.gnome-look.org/p/1156215/)
- [Deb10 Plymouth Theme](https://www.gnome-look.org/p/1236548/)
- [ArcOS-X-Flatabulous](https://www.gnome-look.org/p/1215618/)

下面说安装流程: 

1. 首先下载并解压自己喜欢的开机动画; 

2. 把解压后的文件夹复制到 "/usr/share/plymouth/themes/" 文件夹下;

   ```shell
   sudo cp ${caton-path} /usr/share/plymouth/themes/ -r
   ```

3. 编辑配置文件: 

   ```shell
   sudo gedit /etc/alternatives/default.plymouth
   ```

   把后两行修改为: 

   ```shell
   [script]
   ImageDir=/usr/share/plymouth/themes/${theme-directory}
   ScriptFile=/usr/share/plymouth/themes/${theme-directory}/${script-file-name}
   ```

   其中: 

   - ${theme-directory}  是你的主题文件夹名;
   - ${script-file-name}  是主题文件夹下后缀为 ".script" 文件的文件名. 

4. 重启即可. 



### [Grub2 主题](https://www.gnome-look.org/browse/cat/109/order/latest)

还是先罗列几个不错的主题, 更多主题可以前往 [GRUB Themes - www.gnome-look.org](https://www.gnome-look.org/browse/cat/109/order/latest) 下载. 

* [poly-light](https://github.com/shvchk/poly-light)
* [Atomic-GRUB2-Theme](https://github.com/lfelipe1501/Atomic-GRUB2-Theme) 
* [Arch silence](https://github.com/fghibellini/arch-silence) 
* [Breeze](https://github.com/gustawho/grub2-theme-breeze) 
* [Vimix](https://github.com/vinceliuice/grub2-themes) 
* [Blur](https://www.gnome-look.org/p/1220920/) 

下载对应的主题并解压, 运行文件夹下的 "install" 即可.  

如果你想手动安装: 

1. 下载对应的主题并解压;

2. 把主题目录移动到 "/boot/grub/themes/" 文件夹下, 如果没有对应文件夹就新建一个;

   主题目录是指含有 "theme.txt" 文件的目录.

3. 编辑 "/etc/default/grub", 在**文件开头**添加如下配置: 

   ```shell
   GRUB_THEME="/boot/grub/themes/${theme-directory-name}/theme.txt"
   ```

   其中: ${theme-directory-name} 是指主题文件夹名称.

4. 生成 grub 配置: 

   ```shell
   sudo update-grub
   ```

5. Done. 

(每个主题都有对应的安装说明, 官方文档往往是最好的指导. )




### 后记

因为我是第三次美化 Ubuntu 了, 所以很多细节没有写得很清楚, 权当是对设置项做了一个罗列.

不过, 文末的参考文献是个好东西, 所有的细节基本都在里面, 感谢前人的贡献. 

### 效果

![锁屏界面](https://qiniu.diqigan.cn/18-11-30/96864796.jpg)

![登录界面](https://qiniu.diqigan.cn/18-11-30/29561543.jpg)

![设置界面](https://qiniu.diqigan.cn/18-11-2/45314020.jpg)

![文件管理](https://qiniu.diqigan.cn/18-11-2/87131283.jpg)

![网易云音乐](https://qiniu.diqigan.cn/18-11-30/65169954.jpg)

![TIM](https://qiniu.diqigan.cn/18-11-30/88998966.jpg)

![dash](https://qiniu.diqigan.cn/18-11-2/11860177.jpg)

### 参考文献

1. [可爱的ubuntu：快速安装与人性化改造](https://www.jianshu.com/p/e36a6c2ccc4a) —— 翁岚敏的左边口袋
2. [Ubuntu17.10／Ubuntu18.04配置以及美化](https://zhuanlan.zhihu.com/p/35362159) —— Mikahe
3. [Ubuntu 18.04配置及美化](https://blog.csdn.net/ice__snow/article/details/80152068) —— ffiirree
4. [如何使用 GNOME Shell 扩展](https://zhuanlan.zhihu.com/p/34608388) —— Linux中国
5. [不容错过这十款 GNOME Shell 扩展](https://blog.csdn.net/jack__cj/article/details/52761390) —— Jack_CJ
6. [【教程】 Ubuntu 18.04 美化笔记](https://www.k-xzy.xyz/archives/5577) ------- XZYQvQ
7. [Ubuntu18.04主题更换为Mac OS high Sierra美化教程](https://ywnz.com/linuxmh/2105.html) ------- 王小雷-多面手
8. [给Ubuntu18.04安装mac os主题](https://www.cnblogs.com/feipeng8848/p/8970556.html) ------- feipeng8848
9. [zsh中用户名主机隐藏](http://blog.lichfaker.com/2018/03/16/zsh%E4%B8%AD%E7%94%A8%E6%88%B7%E5%90%8D%E4%B8%BB%E6%9C%BA%E9%9A%90%E8%97%8F/) ------- LichFaker
10. [Ubuntu 18.04 LTS 安装、美化](https://zhuanlan.zhihu.com/p/37314255) ------- Leihungjyu
