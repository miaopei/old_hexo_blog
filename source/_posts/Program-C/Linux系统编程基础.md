---
title: Linux系统编程
tags: Program-C
reward: true
categories: Program-C
toc: true
abbrlink: 39639
date: 2016-05-01 10:14:50
---

# Linux Note

> ### C 语言之解析局部变量返回
>
> 一般的来说，函数是可以返回局部变量的。 局部变量的作用域只在函数内部，在函数返回后，局部变量的内存已经释放了。因此，如果函数返回的是局部变量的值，不涉及地址，程序不会出错。但是如果返回的是局部变量的地址(指针)的话，程序运行后会出错。因为函数只是把指针复制后返回了，但是指针指向的内容已经被释放了，这样指针指向的内容就是不可预料的内容，调用就会出错。
>
> 准确的来说，**函数不能通过返回指向栈内存的指针(注意这里指的是栈，返回指向堆内存的指针是可以的)**。

<!-- more -->

## 1. Linux 基础命令

> **stat命令**用于显示文件的状态信息。stat命令的输出信息比 [ls](http://man.linuxde.net/ls) 命令的输出信息要更详细。

### 1.0 创建用户

**创建用户命令两条**：

- adduser

- useradd

**用户删除命令**：

- userdel

**两个用户创建命令之间的区别**：

- adduser： 会自动为创建的用户指定主目录、系统shell版本，会在创建时输入用户密码。

- useradd：需要使用参数选项指定上述基本设置，如果不使用任何参数，则创建的用户无密码、无主目录、没有指定shell版本。

```shell
# 使用 adduser
$ adduser apple
正在添加用户"apple"...
正在添加新组"apple" (1007)...
正在添加新用户"apple" (1007) 到组"apple"...
创建主目录"/home/apple"...
正在从"/etc/skel"复制文件...
输入新的 UNIX 密码： 
重新输入新的 UNIX 密码： 
passwd：已成功更新密码
正在改变 apple 的用户信息
请输入新值，或直接敲回车键以使用默认值
        全名 []: 
        房间号码 []: 
        工作电话 []: 
        家庭电话 []: 
        其它 []: 
这些信息是否正确？ [Y/n] y

# 这样在创建用户名时，就创建了用户的主目录以及密码。

# 默认情况下：
# adduser在创建用户时会主动调用  /etc/adduser.conf；
# 在创建用户主目录时默认在/home下，而且创建为 /home/用户名   

# 如果主目录已经存在，就不再创建，但是此主目录虽然作为新用户的主目录，而且默认登录时会进入这个目录下，但是这个目录并不是属于新用户，当使用userdel删除新用户时，并不会删除这个主目录，因为这个主目录在创建前已经存在且并不属于这个用户。

# 为用户指定shell版本为：/bin/bash
```

因此 adduser 常用参数选项为：

- `--home`：  指定创建主目录的路径，默认是在/home目录下创建用户名同名的目录，这里可以指定；如果主目录同名目录存在，则不再创建，仅在登录时进入主目录。

-  `--quiet`：  即只打印警告和错误信息，忽略其他信息。

- `--debug`：  定位错误信息。

- `--conf`：   在创建用户时使用指定的configuration文件。

- `--force-badname`：  默认在创建用户时会进行/etc/adduser.conf中的正则表达式检查用户名是否合法，如果想使用弱检查，则使用这个选项，如果不想检查，可以将/etc/adduser.conf中相关选项屏蔽。

```shell
# 使用 useradd
# 注意： 在使用useradd命令创建新用户时，不会为用户创建主目录，不会为用户指定shell版本，不会为用户创建密码。
```

为用户指定参数的 useradd 命令，常用命令行选项：

- `-d`：   指定用户的主目录

- `-m`：   如果存在不再创建，但是此目录并不属于新创建用户；如果主目录不存在，则强制创建； -m和-d一块使用。

- `-s`：   指定用户登录时的shell版本

- `-M`：   不创建主目录

```shell
# 解释：   
#  -d   “/home/tt" ：就是指定/home/tt为主目录
#  -m   就是如果/home/tt不存在就强制创建
#  -s   就是指定shell版本           
$ sudo  useradd  -d  "/home/tt"  -m   -s "/bin/bash"   tt

# 修改 tt 密码：
$ sudo passwd tt
```

**删除用户命令**

- userdel
- 只删除用户：
  - `sudo   userdel   用户名`

- 连同用户主目录一块删除：
  - `sudo  userdel   -r   用户名`

**相关文件**：

- /etc/passwd - 使 用 者 帐 号 资 讯，可以查看用户信息
- /etc/shadow - 使 用 者 帐 号 资 讯 加 密
- /etc/group - 群 组 资 讯
- /etc/default/useradd - 定 义 资 讯
- /etc/login.defs - 系 统 广 义 设 定
- /etc/skel - 内 含 定 义 档 的 目 录

**为组用户增加 root 权限**：

```shell
# 修改 /etc/sudoers 文件，找到下面一行，在 root 下面添加一行，如下所示：
## Allow root to run any commands anywhere
root    ALL=(ALL)     ALL
tommy   ALL=(ALL)     ALL
# 修改完毕，现在可以用 tommy 帐号登录，然后用命令 sudo – ，即可获得 root 权限进行操作。
```

### 1.1 ln 软硬链接

**硬链接**

硬链接说白了是一个指针，指向文件索引节点，系统并不为它重新分配inode。可以用: ln 命令来建立硬链接。

尽管硬链接节省空间，也是Linux系统整合文件系统的传统方式，但是存在一下不足之处：

- （1）不可以在不同文件系统的文件间建立链接

- （2）只有超级用户才可以为目录创建硬链接。

**软链接（符号链接）**

软链接克服了硬链接的不足，没有任何文件系统的限制，任何用户可以创建指向目录的符号链接。因而现在更为广泛使用，它具有更大的灵活性，甚至可以跨越不同机器、不同网络对文件进行链接。
建立软链接，只要在 ln 后面加上选项  –s

```shell
$ ln -s abc cde 	# 建立 abc 的软连接
$ ln abc cde 		# 建立 abc 的硬连接，
```

**删除链接**

```shell
$ rm -rf symbolic_name
$ unlink symbolic_name
```

### 1.2 find grep xargs

```shell
# 列出当前目录及子目录下所有文件和文件夹
$ find .

# 在/home目录下查找以.txt结尾的文件名 但忽略大小写
$ find /home -iname "*.txt"

# 当前目录及子目录下查找所有以 .txt 和 .pdf 结尾的文件
$ find . \( -name "*.txt" -o -name "*.pdf" \)
$ find . -name "*.txt" -o -name "*.pdf"

# 匹配文件路径或者文件
$ find /usr/ -path "*local*"

# 基于正则表达式匹配文件路径
$ find . -regex ".*\(\.txt\|\.pdf\)$"

# 同上，但忽略大小写
$ find . -iregex ".*\(\.txt\|\.pdf\)$"

# 找出/home下 不是 以 .txt 结尾的文件
$ find /home ! -name "*.txt"

# 根据文件类型进行搜索
# 类型参数列表：
#  f 普通文件
#  l 符号连接
#  d 目录
#  c 字符设备
#  b 块设备
#  s 套接字
#  p Fifo
$ find . -type 类型参数

# 基于目录深度搜索 向下最大深度限制为3
$ find . -maxdepth 3 -type f

# 搜索出深度距离当前目录至少2个子目录的所有文件
$ find . -mindepth 2 -type f

# 根据文件时间戳进行搜索
# UNIX/Linux文件系统每个文件都有三种时间戳：
# - 访问时间（-atime/天，-amin/分钟）：用户最近一次访问时间。
# - 修改时间（-mtime/天，-mmin/分钟）：文件最后一次修改时间。
# - 变化时间（-ctime/天，-cmin/分钟）：文件数据元（例如权限等）最后一次修改时间。
$ find . -type f 时间戳

# 搜索最近七天内被访问过的所有文件
$ find . -type f -atime -7

# 搜索恰好在七天前被访问过的所有文件
$ find . -type f -atime 7

# 搜索超过七天内被访问过的所有文件
$ find . -type f -atime +7

# 搜索访问时间超过10分钟的所有文件
$ find . -type f -amin +10

# 找出比 file.log 修改时间更长的所有文件
$ find . -type f -newer file.log

# 根据文件大小进行匹配
# 文件大小单元：
#  b —— 块（512字节）
#  c —— 字节
#  w —— 字（2字节）
#  k —— 千字节
#  M —— 兆字节
#  G —— 吉字节
$ find . -type f -size 文件大小单元

# 搜索大于10KB的文件
$ find . -type f -size +10k

# 搜索小于10KB的文件
$ find . -type f -size -10k

# 搜索等于10KB的文件
$ find . -type f -size 10k

# 删除匹配文件 删除当前目录下所有.txt文件
$ find . -type f -name "*.txt" -delete

# 根据文件权限/所有权进行匹配 当前目录下搜索出权限为777的文件
$ find . -type f -perm 777

# 找出当前目录下权限不是644的php文件
$ find . -type f -name "*.php" ! -perm 644

# 找出当前目录用户tom拥有的所有文件
$ find . -type f -user tom

# 找出当前目录用户组sunk拥有的所有文件
$ find . -type f -group sunk

# 借助-exec选项与其他命令结合使用 
# 找出当前目录下所有root的文件，并把所有权更改为用户tom
# {} 用于与 -exec 选项结合使用来匹配所有文件，然后会被替换为相应的文件名。
$ find .-type f -user root -exec chown tom {} \;

# 找出自己家目录下所有的.txt文件并删除
# -ok 和 -exec 行为一样，不过它会给出提示，是否执行相应的操作。
$ find $HOME/. -name "*.txt" -ok rm {} \;

# 查找当前目录下所有.txt文件并把他们拼接起来写入到all.txt文件中
$ find . -type f -name "*.txt" -exec cat {} \;> all.txt

# 将30天前的.log文件移动到old目录中
$ find . -type f -mtime +30 -name "*.log" -exec cp {} old \;

# 找出当前目录下所有.txt文件并以 “File:文件名” 的形式打印出来
$ find . -type f -name "*.txt" -exec printf "File: %s\n" {} \;

# 因为单行命令中 -exec 参数中无法使用多个命令，以下方法可以实现在 -exec 之后接受多条命令
$ -exec ./text.sh {} \;

# 搜索但跳出指定的目录
# 查找当前目录或者子目录下所有.txt文件，但是跳过子目录sk
$ find . -path "./sk" -prune -o -name "*.txt" -print

# find其他技巧收集
# 要列出所有长度为零的文件
$ find . -empty

# -exec 接收 find 传过来的所有内容，容易造成溢出
# xargs find 的好伴侣，xargs 将 find 命令查找的结果分成若干模块输出给后面的指令
```

```shell
# grep 内容过滤

# 在文件中搜索一个单词，命令会返回一个包含“match_pattern”的文本行：
$ grep match_pattern file_name
$ grep "match_pattern" file_name

# 输出除之外的所有行 -v 选项：
$ grep -v "match_pattern" file_name

# 标记匹配颜色 --color=auto 选项：
$ grep "match_pattern" file_name --color=auto

# 使用正则表达式 -E 选项：
$ grep -E "[1-9]+"
$ egrep "[1-9]+"

# 只输出文件中匹配到的部分 -o 选项：
$ echo this is a test line. | grep -o -E "[a-z]+\."
line.
$ echo this is a test line. | egrep -o "[a-z]+\."
line.

# 统计文件或者文本中包含匹配字符串的行数 -c 选项：
$ grep -c "text" file_name

# 输出包含匹配字符串的行数 -n 选项：
$ grep "text" -n file_name
$ cat file_name | grep "text" -n

# 搜索多个文件并查找匹配文本在哪些文件中：
$ grep -l "text" file1 file2 file3...

# 在多级目录中对文本进行递归搜索：
$ grep "text" . -r -n

# 忽略匹配样式中的字符大小写：
$ echo "hello world" | grep -i "HELLO"

# 选项 -e 制动多个匹配样式：
$ echo this is a text line | grep -e "is" -e "line" -o
is
line
# 也可以使用-f选项来匹配多个样式，在样式文件中逐行写出需要匹配的字符。
cat patfile
aaa
bbb
$ echo aaa bbb ccc ddd eee | grep -f patfile -o

# 在grep搜索结果中包括或者排除指定文件：
# 只在目录中所有的.php和.html文件中递归搜索字符"main()"
$ grep "main()" . -r --include *.{php,html}
# 在搜索结果中排除所有README文件
$ grep "main()" . -r --exclude "README"
# 在搜索结果中排除filelist文件列表里的文件
$ grep "main()" . -r --exclude-from filelist

# 使用0值字节后缀的grep与xargs：
# 测试文件：
$ echo "aaa" > file1
$ echo "bbb" > file2
$ echo "aaa" > file3
$ grep "aaa" file* -lZ | xargs -0 rm
# 执行后会删除 file1 和 file3，grep 输出用 -Z 选项来指定以 0 值字节作为终结符文件名（\0），xargs -0 读取输入并用 0 值字节终结符分隔文件名，然后删除匹配文件，-Z 通常和 -l 结合使用。

# grep静默输出：
# 不会输出任何信息，如果命令运行成功返回0，失败则返回非0值。一般用于条件测试。
$ grep -q "test" filename

# 打印出匹配文本之前或者之后的行：
# 显示匹配某个结果 之后的3行，使用 -A 选项：
$ seq 10 | grep "5" -A 3
# 显示匹配某个结果 之前的3行，使用 -B 选项：
$ seq 10 | grep "5" -B 3
# 显示匹配某个结果的 前三行和后三行，使用 -C 选项：
$ seq 10 | grep "5" -C 3
```

```shell
# xargs

# 参数：
-a file 从文件中读入作为sdtin
-e flag ，注意有的时候可能会是-E，flag必须是一个以空格分隔的标志，当xargs分析到含有flag这个标志的时候就停止。
-p 当每次执行一个argument的时候询问一次用户。
-n num 后面加次数，表示命令在执行的时候一次用的argument的个数，默认是用所有的。
-t 表示先打印命令，然后再执行。
-i 或者是-I，这得看linux支持了，将xargs的每项名称，一般是一行一行赋值给 {}，可以用 {} 代替。
-r no-run-if-empty 当xargs的输入为空的时候则停止xargs，不用再去执行了。
-s num 命令行的最大字符数，指的是 xargs 后面那个命令的最大命令行字符数。
-L num 从标准输入一次读取 num 行送给 command 命令。
-l 同 -L。
-d delim 分隔符，默认的xargs分隔符是回车，argument的分隔符是空格，这里修改的是xargs的分隔符。
-x exit的意思，主要是配合-s使用。。
-P 修改最大的进程数，默认是1，为0时候为as many as it can ，这个例子我没有想到，应该平时都用不到的吧。
```

### 1.3 VIM

设置 ~/.bashrc

添加 set -o vi 	-- 可以直接使用 vim 的各种快捷键

VIM 快捷键：

<img src="/images/imageProgramC/vim.gif">

### 1.4 GCC

gcc 工作流程

```shell
# 预处理 头文件展开 宏替换
$ gcc -E hello.c
hello.i

# 生成汇编代码
$ gcc -S hello.i
hello.s

# 将汇编编译成二进制文件 
$ gcc -c hell0.s
hello.o

# 链接
$ gcc hello.o
a.out
```

gcc 参数

```shell
# 指定编译输出的名字
$ gcc main.c -o main

# 通过 -Wall 参数启用所有警告
$ gcc -Wall main.c -o main

# 使用 -E 参数只产生预处理输出
$ gcc -E main.c > main.i

# 使用 -S 参数只产生汇编代码
$ gcc -S main.c > main.s

# 使用 -C 参数只产生编译的代码
$ gcc -C main.c
# 上面的代码产生main.o, 包含机器级别的代码或者编译的代码。

# 使用-save-temps参数产生所有的中间步骤的文件
$ gcc -save-temps main.c
$ ls
a.out  main.c  main.i  main.o  main.s

# 使用 -l 参数链接共享库
$ gcc  -Wall main.c -o main -lCPPfile

# 使用 -fPIC 产生位置无关的代码
# 当产生共享库的时候，应该创建位置无关的代码，这会让共享库使用任意的地址而不是固定的地址，要实现这个功能，需要使用-fPIC参数。
# 下面的例子产生libCfile.so动态库。
$ gcc -c -Wall -Werror -fPIC Cfile.c
$ gcc -shared -o libCfile.so Cfile.o
# 产生共享库的时候使用了-fPIC 参数。
# 注意 -shared 产生共享库。

# 使用 -V 打印所有的执行命令
$ gcc -Wall -v main.c -o main
Using built-in specs.
COLLECT_GCC=gcc
COLLECT_LTO_WRAPPER=/usr/lib/gcc/i686-linux-gnu/4.6/lto-wrapper
...

# 使用 -D 参数可以使用编译时的宏
$ gcc -Wall -D MY_MACRO main.c -o main

# 使用 -Werror 将警告升级为错误
$ gcc -Wall -Werror main.c -o main

# 使用 @ 参数从文件中读取参数
# gcc参数可以从文件中读取，通过@后跟文件名的方式提供， 多个参数可以使用空格区隔。
$ cat opt_file 
-Wall -omain
$ gcc main.c @opt_file

# 使用参数 -I 指定头文件的文件夹
$ gcc -I/home/codeman/include input-file.c
# -I 取消前一个参数功能，一般用在 -Idir 之后。

# 使用参数-std指定支持的c++/c的标准
$ gcc -std=c++11 hello-world.cpp

# 使用 -static 生成静态链接的文件 静态编译文件(把动态库的函数和其它依赖都编译进最终文件)
$ gcc main.c -static -o main -lpthread
# 相反的使用 -shared 使用动态库链接。

# 使用 -g 用于 gdb 调试
$ gcc main.c -static -o main -g

# -lstdc++ 指定 gcc 以 c++ 方式编译
$ gcc main.cpp -lstdc++ -o main

# -O 优化选项， 1-3 越高优先级越高
$ gcc main.cpp -lstdc++ -o main -O1

# 使用 -M 生成文件关联的信息
$ gcc -M main.c
main.o: main.c /usr/include/stdc-predef.h /usr/include/stdio.h \
 /usr/include/features.h /usr/include/sys/cdefs.h \
 /usr/include/bits/wordsize.h /usr/include/gnu/stubs.h \
 /usr/include/gnu/stubs-64.h \
 /usr/lib/gcc/x86_64-redhat-linux/4.8.5/include/stddef.h \
 /usr/include/bits/types.h /usr/include/bits/typesizes.h \
 /usr/include/libio.h /usr/include/_G_config.h /usr/include/wchar.h \
 /usr/lib/gcc/x86_64-redhat-linux/4.8.5/include/stdarg.h \
 /usr/include/bits/stdio_lim.h /usr/include/bits/sys_errlist.h
```

### 1.5 库文件制作

**静态库制作和使用**

```shell
# 步骤
# 1. 编译为 .o 文件
# 2. 将 .o 文件打包：ar rcs libmycalc.a file1.0 file2.o ...
# 3. 将头文件与库一起发布

# 查看库信息
$ nm libmycalc.a

# 使用
# 编译时 需要加静态库名（记得路径），-I 包含头文件
$ gcc main.c -o app -I include/ -L lib/ -lmycalc

# 优点：
# 1. 执行快
# 2. 发布应用时不需要发布库
# 缺点：
# 1. 执行程序体积比较大
# 2. 库变更时需要重新编译应用
```

**动态库制作和使用**

```shell
# 步骤
# 1. 编译与位置无关的代码，生成 .o 关键参数 -fPIC
# 2. 将 .o 文件打包， 关键参数 -shared
# 3. 将库与头文件一起发布
$ gcc -shared -o libcalc.so *.o

# 使用
# -L 指定动态库路径 -I 指定库名
$ gcc main.c -o app -I include/ -L lib/ -lcalc

# ldd 查看库依赖
$ ldd libcalc.so

# 优点：
# 1. 执行程序体积小
# 2. 库变更时，一般不需要重新发布动态库
# 缺点：
# 1. 执行时需要加载动态库，相对而言，比静态库慢
# 2. 发布应用时需要同时发布动态库

# 解决不能加载动态库的问题
# 1. 拷贝到 /lib 下。 一般不允许
# 2. 将库路径增加到环境变量 LD_LIBRARY_PATH 中，不是特别推荐
# 3. 配置 /etc/ld.so.conf 文件，增加 当前项目库路径，执行 sudo ldconfig -v
```

<img src="/images/imageProgramC/数据段.png">

### 1.6 Makefile

makefile 的三要素：

- 目标
- 依赖
- 规则命令

写法：

- 目标：依赖
- tab键 规则命令

```makefile
app: main.c add.c sub.c div.c mul.c
	gcc -o app -I./include/ main.c add.c sub.c div.c mul.c
```

如果更改其中一个文件，所有的源码都重新编译

可以考虑编译过程分解，先生成 .o 文件，然后使用 .o 文件编程结果

规则是递归的，依赖文件如果比目标文件新，则重新生成目标文件

```shell
ObjFiles=main.o add.o sub.o div.o mul.o
app: $(ObjFiles)
	gcc -o app -I./include/ $(ObjFiles)

main.o: main.c
	gcc -c main.c -I./include/
add.o: add.c
	gcc -c add.c -I./include/	
sub.o: sub.c
	gcc -c sub.c -I./include/	
div.o: div.c
	gcc -c div.c -I./include/
mul.o: mul.c
	gcc -c mul.c -I./include/
```

makefile 的隐含规则：默认处理第一个目标

```shell
# get all .c files
SrcFiles=$(wildcard *.c)

# all .c files --> .o file
ObjFiles=$(patsubst %.c,%.o,$(SrcFiles))

test:
	echo $(SrcFiles)
	echo $(ObjFiles)
```

makefile 变量：

- $@	代表目标
- $^    代表全部依赖
- $<    第一个依赖
- $?    第一个变化的依赖

```shell
# get all .c files
SrcFiles=$(wildcard *.c)

# all .c files --> .o file
ObjFiles=$(patsubst %.c,%.o,$(SrcFiles))

all:app

# 目标文件用法 $(Var)
app: $(ObjFiles)
	gcc -o $@ -I./include/ $(ObjFiles)
	
# 模式匹配规则， $@ $< 这样的变量，只能在规则中出现
%.o:%.c
	gcc -c $< -I./include/ -o $@

# @ 在规则前代表不输出该条规则的命令
# - 规则前的“-”，代表该条规则报错，仍然继续执行
# .PHONY 定义伪目标，防止有歧义
.PHONY:clean all
clean:
	-@rm -f *.o
	-@rm -f app
```

make -f makefile1	指定makefile文件进行编译

```makefile
SrcFiles=$(wildcard *.c)
TargetFiles=$(patsubst %.c,%,$(SrcFiles))

all:$(TargetFiles)

%:%.c
	gcc -o $@ %^
	
clean:
	rm -f $(TargetFiles)
```

### 1.7 gdb 调试

> [gdb 调试入门，大牛写的高质量指南](http://blog.jobbole.com/107759/)
>
> [gdb 调试利器](https://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/gdb.html)

启动gdb：gdb app

在gdb启动程序：

- r(un)   -- 启动  可以带参数启动
- start   -- 启动 - 停留在main函数，分步调试
- n(ent)   -- 下一条指令
- s(tep)  -- 下一条指令，可以进入函数内部，库函数不能进
- q(uit)   -- 退出 gdb
- b(reak)  num  -- 指定行号，函数, 文件:行号  设置断点
  - b 行号  -- 主函数所在文件的行
  - b 函数名
  - b 文件名:行号
- l(ist) 文件：行号   -- 查看代码
  - l -- 显示主函数对应的文件
  - l 文件名:行号
- info b   -- 查看断点信息
- d(el)  num -- 删除断点
- c -- continue 跳到下一个断点
- p(rint) -- 打印参数，或者变量值
- ptype 变量  -- 查看变量类型
- set  -- 设置变量的值
  - set argc=4
  - set argv[1]=“12”
  - set argv[2] = “7”
- display argc  --  跟踪显示参数或者变量的变化
- info display
- undisplay num
- b num if xx == xx  -- 条件断点

**gdb跟踪core**

- 设置生成 core ：ulimit -c unlimited

- 取消生成 core： ulimit -c 0

- 设置 core 文件格式：/proc/sys/kernel/core_pattern

  文件不能 vi，可以用后面的套路：echo “/corefile/core-%e-%p-%t” > core_pattern

core 文件如何使用：

- gdb app core

- 如果看不到在哪儿core  可以用 where 查看在哪儿产生的 core

## 2. 系统api与库函数的关系



<img src="/images/imageProgramC/系统api与函数关系.png">

## 3. Linux 系统编程

ulimit -a 查看所有资源的上限

env 查看环境变量

echo $PATH  打印指定的环境变量

`char *getenv()` 获取环境变量

**创建一个进程**：

`pid_t fork(void)`

返回值：

- 失败 -1
- 成功，返回两次
  - 父进程返回子进程的 id
  - 子进程返回 0

获得pid，进程 id，获得当前进程

`pid_t getpid(void)`

获得当前进程父进程的 id

`pid_t getppid(void)`

ps ajx 查看父进程和子进程相关信息

**进程共享**：

父子进程之间在fork后，有哪些相同和不同：

- 父子相同处：
  - 全局变量
  - data、text、栈、堆、环境变量
  - 用户 ID
  - 宿主目录、进程工作目录、信号处理方式...
- 父子不同处：
  - 进程 ID
  - 父进程 ID
  - 进程运行时间
  - 闹钟（定时器）
  - 未决信号集

似乎，子进程复制了父进程 0-3G 用户空间内容，以及父进程的 PCB， 但 pid 不同。真的每 fork 一个子进程都要将父进程的 0-3G 地址空间完全拷贝一份，然后在映射至屋里内存吗？当然不是，父子进程间遵循**读时共享写时复制**。这样设计，无论子进程执行父进程的逻辑还是执行自己的逻辑都能节省内存开销。

**孤儿进程与僵尸进程**：

- 孤儿进程
  - 父进程死了，子进程被 init 进程领养
- 僵尸进程
  - 子进程死了，父进程没有回收子进程的资源（PCB）

回收子进程，知道子进程的死亡原因，作用：

- 阻塞等待
- 回收子进程资源
- 查看死亡原因

`pid_t wait(int *status)`

- status 传出参数
- 返回值
  - 成功返回终止的子进程 ID
  - 失败 返回 -1

子进程的死亡原因：

- 正常死亡 WIFEXITED
  - 如果 WIFEXITED 为真，使用 WEXITSTATUS 得到退出的状态
- 非正常死亡 WIFSIGNALED
  - 如果 WIFSIGNALED 为真，使用 WTERMSIG 得到信号

`pid_t waitpid(pid_t pid, int *status, int options)`

- pid
  - `< -1` 组ID
  - `-1` 回收任意
  - `0` 回收和调用进程组 ID 相同组内的子进程
  - `>0` 回收指定的 pid
- option
  - 0 与 wait 相同，也会阻塞
  - WNOHANG 如果当前没有子进程退出，会立刻返回
- 返回值
  - 如果设置了 WNOHANG ，那么如果没有子进程退出，返回 0
    - 如果有子进程退出返回退出的 pid
  - 失败返回 -1 （没有子进程）

### 3.1 IPC 概念

IPC ： 进程间通信，通过内核提供的缓存区进行数据交换的机制

IPC 通信的方式有几种：

- pipe 管道 -- 最简单
- fifo 有名管道
- mmap 文件映射共享IO -- 速度最快
- 本地 socket 最稳定
- 信号 携带信息量最小
- 共享内存
- 消息队列

**读管道**：

- 写端全部关闭 -- read 读到 0， 想当于读到文件末尾
- 写端没有全部关闭
  - 有数据 -- read 读到数据
  - 没有数据 -- read 阻塞 fcntl 函数可以更改非阻塞

**写管道**：

- 读端全部关闭 -- ？ 产生一个信号 SIGPIPE，程序异常终止
- 读端未全部关闭
  - 管道已满 -- write 阻塞 -- 如果要显示现象，读端一直不读，写端狂写。
  - 管道未满 -- write 正常写入

**管道缓冲区大小**

可以使用 `ulimit –a` 命令来查看当前系统中创建管道文件所对应的内核缓冲区大小。通常为：

```shell
pipe size            (512 bytes, -p) 8
```

也可以使用 `fpathconf` 函数，借助参数选项来查看。使用该宏应引入头文件<unistd.h>

`long fpathconf(int fd, int name);`	

- 成功：返回管道的大小	
- 失败：-1，设置errno

**管道的优劣**

- 优点：
  - 简单，相比信号，套接字实现进程间通信，简单很多。

- 缺点：
  - 只能单向通信，双向通信需建立两个管道。
  - 只能用于父子、兄弟进程(有共同祖先)间通信。该问题后来使用fifo有名管道解决。

**FIFO通信**

FIFO 有名管道，实现无血缘关系进程通信

- 创建一个管道的伪文件
  - mkfifo myfifo 命令创建
  - 也可以使用函数 `int mkfifo(const char *pathname,  mode_t mode); `
- 内核会针对 fifo 文件开辟一个缓存区，操作 fifo 文件，可以操作缓存区，实现进程间通信 -- 实际上就是文件读写

**mmap映射共享区**

```c
void *mmap(void *adrr, size_t length, int prot, int flags, int fd, off_t offset); 
```

- 返回：
  - 成功：返回创建的映射区首地址；
  - **失败：MAP_FAILED宏**

- 参数：	
  - addr: 	建立映射区的首地址，由Linux内核指定。使用时，直接传递NULL
  - length：   欲创建映射区的大小
  - prot：       映射区权限 PROT_READ、PROT_WRITE、PROT_READ|PROT_WRITE
  - flags：      标志位参数(常用于设定更新物理区域、设置共享、创建匿名映射区)
    - MAP_SHARED:  会将映射区所做的操作反映到物理设备（磁盘）上。（共享的）
    - MAP_PRIVATE:  映射区所做的修改不会反映到物理设备。（私有的）
  - fd： 	 用来建立映射区的文件描述符
  - offset：   映射文件的偏移(4k的整数倍)

释放映射区

```c
int munmap(void *addr, size_t length);
```

**匿名映射**

通过使用我们发现，使用映射区来完成文件读写操作十分方便，父子进程间通信也较容易。但缺陷是，每次创建映射区一定要依赖一个文件才能实现。通常为了建立映射区要open一个temp文件，创建好了再unlink、close掉，比较麻烦。 可以直接使用匿名映射来代替。其实Linux系统给我们提供了创建匿名映射区的方法，无需依赖一个文件即可创建映射区。同样需要借助标志位参数flags来指定。

使用 `MAP_ANONYMOUS `(或 `MAP_ANON` )， 如: 

```c
int *p = mmap(NULL, 4, PROT_READ|PROT_WRITE, MAP_SHARED|MAP_ANONYMOUS, -1, 0); 
// "4"随意举例，该位置表大小，可依实际需要填写。
```

需注意的是，MAP_ANONYMOUS和MAP_ANON这两个宏是Linux操作系统特有的宏。在类Unix系统中如无该宏定义，可使用如下两步来完成匿名映射区的建立。

```c
/*
/dev/zero 聚宝盆，可以随意映射
/dev/null 无底洞，一般错误信息重定向到这个文件中
*/
fd = open("/dev/zero", O_RDWR);
p = mmap(NULL, size, PROT_READ|PROT_WRITE, MMAP_SHARED, fd, 0);
```

**信号的概念**

- 信号的特点
  - 简单，不能带大量信息，满足特定条件发生
- 信号的机制
  - 进程 B 发送给进程 A ，内核产生信号，内核处理
- 信号的产生
  - 按键产生 
  - 函数调用 kill、raise、abort
  - 定时器 alarm、setitimer
  - 命令产生 kill
  - 硬件异常、段错误、浮点型错误、总线错误、SIGPIPE
- 信号的状态
  - 产生
  - 递达 信号到达并且处理完
  - 未决 信号被阻塞
- 信号的默认处理方式
  - 忽略
  - 执行默认动作
  - 捕捉

- 信号的 4 要素
  - 编号
  - 事件
  - 名称
  - 默认处理动作
    - 忽略
    - 终止
    - 终止 + core
    - 暂停
    - 继续

### 3.2 进程和线程

- 进程组
- 会话
- 守护进程

创建一个会话需要注意以下 5 点注意事项：

- 调用进程不能是进程组组长，该进程编程新会话首进程（session header）
- 该进程成为一个新进程组的组长进程
- 新会话丢弃原有的控制终端，该会话没有控制终端
- 该调用进程是组长进程，则出错返回
- 建立会话时，先调用fork，父进程终止，子进程调用 setsid

守护进程：

Daemon 进程，是 Linux 中的后台服务进程，通常独立于控制终端并且周期性地执行某种任务或等待处理某些发生的事件。一般采用以 d 结尾的名字。

创建守护进程，最关键的一步是调用 setsid 函数创建一个新的 session 。并成为 session leader。

**创建守护进程模型**：

- 创建子进程，父进程退出
  - 所有工作在子进程中进行形式上脱离了控制终端
- 在子进程中创建新会话
  - setsid() 函数
  - 使子进程完全能独立出来，脱离控制
- 改变当前目录为根目录
  - chdir() 函数
  - 防止占用可卸载的文件系统
  - 也可以换成其他路径
- 重设文件权限掩码
  - umask() 函数
  - 防止继承的文件创建屏蔽字拒绝某些权限
  - 增加守护进程灵活性
- 关闭文件描述符
  - 继承的打开文件不会用到，浪费系统资源，无法卸载
- 开始执行守护进程核心工作
- 守护进程退出处理程序模型

> 会话：进程组的更高一级，多个进程组对应一个会话
>
> 进程组：多个进程在同一个组，第一个进程默认是进程组的组长
>
> 创建会话的时候，组长不可以创建，必须是组员创建。
>
> 创建会话的步骤：创建子进程，父进程终止，子进程当会长
>
> 守护进程的步骤：
>
> - 创建子进程 fork
> - 父进程退出
> - 子进程当会长 setsid
> - 切换工作目录 $HOME
> - 设置掩码 umask
> - 关闭文件描述符，为了避免浪费资源
> - 执行核心逻辑
> - 退出

```c
int pthread_create(pthread_t *thread, const pthread_attr_t *attr,
                          void *(*start_routine) (void *), void *arg);
```

```c
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>
#include <signal.h>

int main(int argc, char *argv[])
{
    char strFileName[256] = {0};

    while (1) {
        memset(strFileName, 0x00, sizeof(strFileName));
        sprintf(strFileName, "%s/log/Mr.Miaow.%ld", getenv("HOME"), time(NULL));
        int fd = open(strFileName, O_RDWR | O_CREAT, 0666);
        if (fd < 0) {
            perror("open err");
            exit(1);
        }
        close(fd);
        sleep(5);                                                                                      
    }        
    return 0;
} 
```

扩展了解：

通过 nohup 指令也可以达到守护进程创建的效果

nohup cmd [> 1.log] &

- nohup 指令会让 cmd 收不到 SIGHUP 信号
- & 代表后台运行

线程是最小的执行单位，进程是最小的系统资源分配单位

查看 LWP 号：`ps -Lf pid` 查看指定线程的 lwp 号

线程非共享资源

- 线程 ID
- 处理器现场和栈指针（内核栈）
- 独立的栈空间（用户空间栈）
- errno 变量
- 信号屏蔽字
- 调度优先级

线程优缺点：

- 优点：
  - 提高程序并发性
  - 开销小
  - 数据通信、共享数据方便
- 缺点：
  - 库函数 不稳定
  - 调试、编写困难
  - 对信号支持不好

```shell
alias echomake=`cat ~/bin/makefile.template >> makefile`

$ cat ~/bin/makefile.template
# create by Mr.Miaow `date +%Y%m%d`
SrcFiles=$(wildcard *.c)
TargetFiles=$(patsubst %.c,%,$(SrcFiles))
all:$(TargetFiles)
%:%.c
	gcc -o $@ %< -lpthread -g
clean:
	-rm -f $(TargetFiles)
```

**线程退出注意事项**：

- 在线程中使用pthread_exit
- 在线程中使用 return （主控线程return 代表退出进程）
- exit 代表退出整个进程

线程回收函数：

```c
int pthread_join(pthread_t thread, void **retval);
```

杀死线程：

```c
int pthread_cancel(pthread_t thread);
```

被pthread_cancel 杀死的线程，退出状态为 PTHREAD_CANCELED

线程分离：

```c
int pthread_detach(pthread_t thread);
```

此时不需要 pthread_join回收资源

线程 ID 在进程内部是唯一的

**进程属性控制**：

- 初始化线程属性

  ```c
  int pthread_attr_init(pthread_attr_t *attr);
  ```

- 销毁线程属性

  ```c
  int pthread_attr_destroy(pthread_attr_t *attr);
  ```

- 设置属性分离态

  ```c
  int pthread_attr_setdetachstate(pthread_attr_t *attr, int detachstate);
  # attr init 初始化的属性
  # detachstate
  # - PTHREAD_CREATE_DETACHED 线程分离
  # - PTHREAD_CREATE_JOINABLE 允许回收
  
  int pthread_attr_getdetachstate(const pthread_attr_t *attr, int *detachstate);
  ```

查看线程库版本：

```shell
$ getconf GNU_LIBPTHREAD_VERSION
```

创建多少个线程？

- cpu核数 * 2 + 2

**线程同步**：

- 协调步骤，顺序执行

解决同步的问题：加锁

**mutex 互斥量**：

```c
pthread_mutex_t fastmutex = PTHREAD_MUTEX_INITIALIZER;	// 常量初始化，此时可以使用init
pthread_mutex_t recmutex = PTHREAD_RECURSIVE_MUTEX_INITIALIZER_NP;
pthread_mutex_t errchkmutex = PTHREAD_ERRORCHECK_MUTEX_INITIALIZER_NP;

int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *mutexattr);
int pthread_mutex_lock(pthread_mutex_t *mutex);
int pthread_mutex_trylock(pthread_mutex_t *mutex);
int pthread_mutex_unlock(pthread_mutex_t *mutex);
int pthread_mutex_destroy(pthread_mutex_t *mutex);
```

读写锁的特点：读共享，写独占，写优先级高

读写说任然是一把锁，有不同状态：

- 未加锁
- 读锁
- 写锁

```c
int pthread_rwlock_init(pthread_rwlock_t *restrict rwlock,
                        const pthread_rwlockattr_t *restrict attr);
int pthread_rwlock_destroy(pthread_rwlock_t *rwlock);
pthread_rwlock_t rwlock = PTHREAD_RWLOCK_INITIALIZER;

int pthread_rwlock_rdlock(pthread_rwlock_t *rwlock);
int pthread_rwlock_tryrdlock(pthread_rwlock_t *rwlock);
int pthread_rwlock_wrlock(pthread_rwlock_t *rwlock);
int pthread_rwlock_unlock(pthread_rwlock_t *rwlock);
```

**条件变量**（生产者消费者模型）：

```c
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;
int pthread_cond_init(pthread_cond_t *cond, pthread_condattr_t *cond_attr);
// 唤醒至少一个阻塞在条件变量 cond 上的线程
int pthread_cond_signal(pthread_cond_t *cond);
// 唤醒阻塞在条件变量 cond 上的全部线程
int pthread_cond_broadcast(pthread_cond_t *cond);
// 条件变量阻塞等待
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mutex);
// 超时等待
int pthread_cond_timedwait(pthread_cond_t *cond, pthread_mutex_t *mutex, const struct timespec *abstime);
int pthread_cond_destroy(pthread_cond_t *cond);
```

**信号量 加强版的互斥锁**：

信号量是进化版的互斥量，允许多个线程访问共享资源

```c
#include <semaphore.h>
int sem_init(sem_t *sem, int pshared, unsigned int value);
# pshared
# - 0 代表线程信号量
# - 非0 代表进程信号量
# value 定义信号量的个数

// 申请信号量，申请成功 value--
int sem_wait(sem_t *sem);
// 释放信号量 value++
int sem_post(sem_t *sem);

int sem_trywait(sem_t *sem);
int sem_timedwait(sem_t *sem, const struct timespec *abs_timeout);
int sem_destroy(sem_t *sem);

// Link with -pthread.
```

**文件锁**：

```c
#include <unistd.h>
#include <fcntl.h>

int fcntl(int fd, int cmd, ... /* arg */ );
```







































