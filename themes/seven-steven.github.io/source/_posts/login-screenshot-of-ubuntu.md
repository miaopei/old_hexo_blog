---
title: 获取 Linux 登录页面截图
hide: false
categories:
  - coding
  - linux
toc: true
tags:
  - linux
abbrlink: 375
date: 2018-11-30 21:31:41
---

## 前言

这两天心血来潮, 想办法美化了自己 Ubuntu 系统的登录界面. 进而找到了获取 Linux 登录页面截图的方法. 这里记录一下流程, 以作日后查验之用. 

![登录界面](https://qiniu.diqigan.cn/18-11-30/29561543.jpg)

<!-- more -->

## 步骤

* 首先, 我们需要新建一个脚本文件 "screenshot.sh", 填入以下内容: 

  ```shell
    chvt 2
    sleep 5
    DISPLAY=:0.0 XAUTHORITY=/run/user/1000/gdm/Xauthority xwd -root > /tmp/shot.xwd
    convert /tmp/shot.xwd /tmp/screen.png
    mv /tmp/screen.png ~/
  ```

  其中: 

  * `chvt N` 表示跳转到 tty N, 我这里图形界面是 tty2, 所以写作 `chvt 2`;

  * `sleep N` 表示程序等待 N 秒, 可以自由调节时间长短, 留出时间调整截屏页面;

  * 第三行中 `/run/user/1000/gdm/Xauthority` 表示当前系统的登录管理器, 因为不同的 Linux 发行版可能使用不同的登录管理器, 所以出错的往往是在这里. 
    那么怎么获取当前登录界面 tty 编号以及登录管理器呢? 我们可以通过 `ps` 命令查看: 

    ```shell
    ps -ef | grep auth
    ```

    ![ps 结果](https://qiniu.diqigan.cn/18-11-30/63560742.jpg)

    可以看到, 我当前登录的终端为 tty2, 登录管理器为 "/run/user/1000/gdm/Xauthority", 可以按照自己的情况修改上面的脚本.
    脚本后两行是转换和转移图片, 这里不再多说.

* 赋予脚本文件可执行权限

  ```shell
  chmod +x ./screenshot.sh
  ```
* 注销当前登录状态, 然后按下按键 "ctrl + alt + <F5>" 进入 tty5 (也可以进入其他终端, 非图形界面即可). 从该终端进入到 screenshot.sh 脚本所在路径, 以 root 权限执行:

  ```shell
  sudo ./screenshot.sh
  ```
* 这时终端会自动跳转到我们退出登录的图形界面, 在倒计时结束前调整好自己想要截屏的页面, 等待脚本截图即可. 截图文件会存储在当前用户主目录下, 至此, 目的达成, 附上我的登录页面:

## 参考文献

1. [如何捕获 Linux 图形化登录界面的截图](https://linux.cn/article-6359-1.html)   ---   潘家邦
