---
title: Ubuntu 18.10 开机自动打开数字键盘
hide: false
categories:
  - coding
  - linux
toc: true
tags:
  - linux
  - ubuntu
abbrlink: 63426
date: 2018-12-01 11:03:06
---

# 前言

可能是为了照顾程序员? Ubuntu 开机默认是不打开数字键盘的, 本文主要描述如何让 Ubuntu 开机自动打开小键盘. 

# 步骤

1. 同时按下 "ctrl + alt + T" 打开终端;

2. 获取 root 权限:

   ```shell
   sudo -i
   ```

3. 允许 gdm 和 X 服务建立连接: 

   ```shell
   xhost +SI:localuser:gdm
   ```

   <!-- more -->

4. 切换到 gdm 用户: 

   ```shell
   su gdm -s /bin/bash
   ```

5. 设置开机自动打开数字键盘: 

   ```shell
   gsettings set org.gnome.settings-daemon.peripherals.keyboard numlock-state 'on'
   ```

6. 启动触控板: 

   ```shell
   gsettings set org.gnome.desktop.peripherals.touchpad tap-to-click true
   ```

   至此, 设置已经完成. 

7. 如果你像我一样强迫症, 可以取消 gdm 和 X 服务器的连接设置: 

   ```shell
   xhost -SI:localuser:gdm
   ```

That's all, enjoy it.

# 参考文献: 

1. [Enable Numlock, Tap to Click in Ubuntu 18.04 Login Screen](http://tipsonubuntu.com/2018/06/17/enable-numlock-tap-click-ubuntu-18-04-login-screen/)   ---   ml
