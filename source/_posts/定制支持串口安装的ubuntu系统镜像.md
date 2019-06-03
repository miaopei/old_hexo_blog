---
title: 定制支持串口安装的ubuntu系统镜像
tags: ubuntu
reward: true
categories: Ubuntu
toc: true
abbrlink: 63378
date: 2017-05-15 15:48:06
---

## 1、所需环境：

**硬件环境：**

* 笔记本
* 串口调试线缆
* 光盘
* 显示器
* FWA产品的任一机型（此次使用的是FWA-4210）
* SATA或者USB光驱×1

**软件环境：**

* 带有genisoimage(旧版是mkisofs)的linux发行版（此次使用的是Ubuntu 16.04 server版）
* Ubuntu官网通用镜像ISO文件

<!-- more -->

## 2、操作过程：

### 2.1 开机进入系统，将光盘挂载到Ubuntu系统 

CLI命令如下；

```bash
$ mount -o loop ubuntu-16.04.2-server-amd64.iso /mnt/temp
```

### 2.2 更改配置

相关配置文件（menu.cfg、txt.cfg、isolinux.cfg此文件不是必须要修改，具体见下边解释）。将光盘文件，拷贝到临时目录（家目录或者自己新建目录均可，但建议拷贝到/var或/temp目录下），具体命令如下：

```bash
$ cp -rf /mnt/temp/ /var/mycdrom
```

因为 `/mnt` 目录的默认权限是 `333` ，所以在此使用 `-r` 和 `-f` 参数，`-r` 代表递归，即文件夹下所有文件都拷贝，`-f` 代表强制执行；

更改 `menu.cfg` 文件，如下图，主要是注释掉标准安装的配置文件，以便可以定制安装。

```bash
$ cd /var/mycdrom/temp/isolinux

$ vi menu.cfg
```

**注：**

> vi有三种模式，普通模式、编辑模式、命令行模式；
>
> I o a进入编辑模式，
>
> 普通模式下数字+yy复制
>
> P黏贴
>
> 命令行模式：w写入，q离开，！强制执行

注释 `menu.cfg` 内容如下红框所示：

![](http://i.imgur.com/JM99sFZ.png)

更改 `txt.cfg` 文件，主要用于定制串口安装（如下图）：

![](http://i.imgur.com/pA7ruhP.png)

更改 `isolinux.cfg` 文件，主要修改grub菜单等待时间（如下图），也可不修改；

![](http://i.imgur.com/jE4zoMG.png)

### 2.3 重新打包ISO文件

命令如下：

```bash
$ genisoimage -o ubuntu-16.04.2-server-adm64-console_115200.iso -r -J -no-emul-boot -boot-load-size 4 -boot-info-table -b isolinux/isolinux.bin -c isolinux/boot.cat /var/mycdrom/temp
```

`genisoimage` 是linux各大发行版制作ISO镜像比较流行的工具，若要定制系统，最好在linux下更改相关配置，并使用此工具重新打包；若在Windows平台使用UltraISO等工具解压更改重新打包会出现不稳定的情况（无法找到镜像，无法找到安装源等）。

* `-o` ：是output缩写，用来指定输出镜像名称
* `-r` ： 即rational-rock，用来开放ISO文件所有权限（r、w、x） 
* `-J` ： 即Joliet，一种ISO9600扩展格式，用来增加兼容性，最好加上
* `-no-emul-boot`  `-boot-load-size 4`  `-boot-info-table` ：指定兼容模式下虚拟扇区的数量，若不指定，有些BISO会出现一些问题
* `-b` ：指定开机映像文件
* `-c` ：具体开机配置文件
* 最后加上输出目录

Reboot系统U盘启动，即可安装系统。

## 3、文本安装系统注意事项

### 3.1 进入安装模式

关闭系统插入U盘，启动系统，看到如下提示按F12进入安装系统模式：

```text
Press  F12  for  boot  menu..
```

选择U盘所在的选项。

### 3.2 分区

若是硬盘已有linux发行版系统，那在如下界面，必须umount分区，才能将更改写入分区表





### 3.3 自动更新

如下界面，若有特许需求（需要安装一些特许软件apache、weblogic等）可以选择自动更新（需要联网），一般情况不选则自动更新
