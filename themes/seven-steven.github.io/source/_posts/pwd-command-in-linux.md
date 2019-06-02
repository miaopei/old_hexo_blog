---
title: Linux 命令 --- pwd
hide: false
categories:
  - coding
toc: true
tags:
  - shell
  - linux
abbrlink: 27928
date: 2018-11-29 23:44:29
---



# 简介

`pwd` 命令全称 "print working directory", 是 Linux 的基础命令之一, 用来打印当前工作目录. 

<!-- more -->

# 用法

`pwd` 命令的用户手册描述如下: 

```shell
NAME
       pwd - print name of current/working directory

SYNOPSIS
       pwd [OPTION]...

DESCRIPTION
       Print the full filename of the current working directory.

       -L, --logical
              use PWD from environment, even if it contains symlinks

       -P, --physical
              avoid all symlinks

       --help display this help and exit

       --version
              output version information and exit

       If no option is specified, -P is assumed.

       NOTE:  your shell may have its own version of pwd, which usually super‐
       sedes the version described here.  Please refer to your  shell's  docu‐
       mentation for details about the options it supports.

AUTHOR
       Written by Jim Meyering.

REPORTING BUGS
       GNU coreutils online help: <http://www.gnu.org/software/coreutils/>
       Report pwd translation bugs to <http://translationproject.org/team/>

COPYRIGHT
       Copyright  ©  2017  Free Software Foundation, Inc.  License GPLv3+: GNU
       GPL version 3 or later <http://gnu.org/licenses/gpl.html>.
       This is free software: you are free  to  change  and  redistribute  it.
       There is NO WARRANTY, to the extent permitted by law.

SEE ALSO
       getcwd(3)

       Full documentation at: <http://www.gnu.org/software/coreutils/pwd>
       or available locally via: info '(coreutils) pwd invocation'

GNU coreutils 8.28               October 2018                           PWD(1)
```



# 用例

* 使用 `pwd` 命令显示当前工作目录: 

  ```shell
  pwd
  ```

* `pwd` 命令 `-P` 参数和 `-L` 参数解析, 如图: 

  ![test_pwd](https://qiniu.diqigan.cn/18-11-30/15262089.jpg)

  1. 我们先是使用 `pwd` 命令查看了当前工作目录, 为 "/home/seven/Downloads";

  2. 然后我们使用 `mkdir` 命令在这个目录下创建了一个名为 "test_pwd" 的文件夹;

  3. 使用 `cd` 命令进入 "test_pwd" 目录;

  4. 在 "test_pwd" 目录下创建三个文件夹: "a", "a/aa" 和 "b";

  5. 使用 `ln` 命令把 "a/aa" 目录链接到 "b/bb" 目录;

  6. 此时, 可以使用 `tree` 命令查看当前目录结构为: 

     ```shell
     .
     ├── a
     │   └── aa
     └── b
         └── bb -> /home/seven/Downloads/test_pwd/a/aa
     
     4 directories, 0 files
     ```

  7. 使用 `cd` 命令进入到 "b/bb" 目录下;

  8. 不带参的 `pwd` 命令显示当前工作目录为 "/home/seven/Downloads/test_pwd/b/bb";

  9. `pwd -P` 命令显示当前工作目录为 "/home/seven/Downloads/test_pwd/a/aa";

  10. `pwd -L` 命令显示当前工作目录为 "/home/seven/Downloads/test_pwd/b/bb";

  可见: 

  * `-P` 参数会避开所有符号链接, 显示真实的**物理路径**;
  * `-L` 参数不管是否包含符号链接, 都只会显示**逻辑路径**. 