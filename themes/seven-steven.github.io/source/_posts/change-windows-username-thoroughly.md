---
title: 彻底修改Windows系统用户名
toc: true
categories: coding
tags:
  - Windows
abbrlink: 53860
date: 2018-01-13 14:33:15
---
作为一名玩机狂魔，差不多一年左右就会因为各种原因要给电脑重装一次系统。然而使用微软账号登录Windows之后，Windows会自动把系统用户名设置成登录的邮箱账号。有着小小强迫症的我当然是忍不了啦，一定要改成自己称心的用户名才算舒服。多方搜索，终于找到了修改Windows系统用户名的方法，特此记录，以备不时之需。

本教程主要是用来修改如下图所示的cmd命令行下用户文件夹的名称。
![cmd命令行下用户文件夹名称](https://qiniu.diqigan.cn/18-1-13/2298881.jpg)
<!-- more -->
###### 1. 按下 **win + R** 键打开运行窗口， 输入 `control userpasswords2` 并回车。
![运行窗口](https://qiniu.diqigan.cn/18-1-13/58502809.jpg)
###### 2. 此时会进入到**用户账户**界面。选中当前用户，点击**属性**，修改属性界面的**用户名**，一路确定即可。
![](https://qiniu.diqigan.cn/18-1-13/6394252.jpg)
###### 3. 按下 **win + R** 键打开运行窗口， 输入 `regedit` 并回车。
![](https://qiniu.diqigan.cn/18-1-13/80985957.jpg)
###### 4. 进入到**注册表**界面，定位到路径 `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList`，选中下面名字最长的项，双击右侧的 `ProfileImagePath`，修改 `C:\Users\` 后面的用户名，点击确定。 
![](https://qiniu.diqigan.cn/18-1-13/32179179.jpg)
###### 5. **注销**账户并**重新登录**。
###### 6. 打开**文件资源管理器**，进入路径`C:\Users\`，将新的用户名文件夹删除，再将原来的用户名文件夹重命名为新的用户名。
###### 7. 再次**注销**并**重新登录**，用户名就改好啦！

###### 参考文献：
* [彻底修改 Windows 系统用户名](https://www.techzero.cn/change-windows-user-name-completely.html) ———— Techzero
