---
title: ubuntu-installed-necessary
tags: []
categories: []
reward: true
abbrlink: 10634
date: 2019-10-29 19:34:38
---

# Ubuntu 装机必备软件和插件

## VNC

> [Ubuntu18.04如何配置成为VNC远程桌面服务器](https://www.linuxrumen.com/rmxx/1375.html)
>
> [x11vnc配置--ubuntu14.04](https://www.cnblogs.com/elmaple/p/4354814.html)

## samba

```shell
$ sudo apt-get install samba samba-common
$ sudo gedit /etc/samba/smb.conf
[miaow]
	path = /home/miaow
	writeable = yes
	browseable = yes
	create mask = 0755
	directory mask = 0775
	valid users = miaow
# 增加samba用户, 一定要操作这一步，否则windows上访问时输入用户名和密码会不对，访问不了。
$ sudo smbpasswd -a user
$ sudo service smbd restart
```

## openssh-server

```shell
$ sudo apt-get install openssh-server
$ sudo service ssh start
# 查看是否有“PermitRootLogin yes”，没有修改即可
$ sudo vim /etc/ssh/sshd_config

$ sudo apt-get install openssh-client
```

## oh-my-zsh

```shell
$ cat ~/.oh-my-zsh/themes/robbyrussell.zsh-theme 
PROMPT="%(?:%{$fg_bold[green]%}Mr.Miaow:%{$fg_bold[red]%}Mr.Miaow)"
PROMPT+=' %{$fg[cyan]%}%c%{$reset_color%} $(git_prompt_info)'

ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg_bold[blue]%}git:(%{$fg[red]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%} "
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[blue]%}) %{$fg[yellow]%}✗"
ZSH_THEME_GIT_PROMPT_CLEAN="%{$fg[blue]%})"
```

[Ubuntu 18.04 安装配置Oh My Zsh 主题设置](https://blog.csdn.net/weixin_38111667/article/details/86157841)



> [ubuntu18.04 安装 美化 zsh](https://blog.csdn.net/qq_14824885/article/details/81098091)
>
> [如何在Ubuntu 18.04 LTS中安装和美化ZSH Shell](https://www.sysgeek.cn/install-zsh-shell-ubuntu-18-04/)
>
> [在Ubuntu上完美安装oh-my-zsh](https://e99net.github.io/2018/06/07/install_oh-my-zsh_of_ubuntu/)

## vimplus





[Ubuntu 18.10 美化](https://www.jianshu.com/p/5bd14cbf7186)