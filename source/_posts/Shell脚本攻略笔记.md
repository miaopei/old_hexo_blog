---
title: Shell脚本攻略笔记
date: 2017-05-15 15:40:41
tags: shell
reward: true
categories: Shell
toc: true
---

## 1. 基本命令

### 1.1 shell 格式输出

```bash
$ echo 'Hello world !'
-n	# 忽略结尾的换行符
-e	# 激活转义字符
-E	# disable转义字符

# echo会将一个换行符追加到输出文本的尾部。可以使用选项-n来忽略结尾的换行符。

$ echo -e "1\t2\t3"
```

<--! more -->

打印彩色输出：

```bash
# 彩色文本
# 重置=0，黑色=30，红色=31，绿色=32，黄色=33，蓝色=34，洋红=35，青色=36，白色=37
$ echo -e "\e[1;31m This is red text \e[0m"

# 彩色背景
# 重置=0，黑色=40，红色=41，绿色=42，黄色=43，蓝色=44，洋红=45，青色=46，白色=47
$ echo -e "\e[1;42m Green Background \e[0m"
```

```bash
$ printf "%-5s %-10s %-4s\n" No Name Mark
```

**原理：**

` %-5s` 指明了一个格式为左对齐且宽度为5的字符串替换（ `- `表示左对齐）。如果不用 `-` 指定对齐方式，字符串就采用右对齐形式。

`%s` 、 `%c` 、`%d` 和 `%f` 都是格式替换符（format substitution character），其所对应的参数可以置于带引号的格式字符串之后。 

### 1.2 替换命令 tr

```bash
# tr 是 translate的简写
$ tr '\0' '\n'		# 将 \0 替换成 \n
$ tr [选项]… 集合1 [集合2]
选项说明：
-c, -C, –complement 用集合1中的字符串替换，要求字符集为ASCII。
-d, –delete 删除集合1中的字符而不是转换
-s, –squeeze-repeats 删除所有重复出现字符序列，只保留第一个；即将重复出现字符串压缩为一个字符串。
-t, –truncate-set1 先删除第一字符集较第二字符集多出的字符

字符集合的范围：
\NNN 八进制值的字符 NNN (1 to 3 为八进制值的字符)
\\ 反斜杠
\a Ctrl-G 铃声
\b Ctrl-H 退格符
\f Ctrl-L 走行换页
\n Ctrl-J 新行
\r Ctrl-M 回车
\t Ctrl-I tab键
\v Ctrl-X 水平制表符
CHAR1-CHAR2 从CHAR1 到 CHAR2的所有字符按照ASCII字符的顺序
[CHAR*] in SET2, copies of CHAR until length of SET1
[CHAR*REPEAT] REPEAT copies of CHAR, REPEAT octal if starting with 0
[:alnum:] 所有的字母和数字
[:alpha:] 所有字母
[:blank:] 水平制表符，空白等
[:cntrl:] 所有控制字符
[:digit:] 所有的数字
[:graph:] 所有可打印字符，不包括空格
[:lower:] 所有的小写字符
[:print:] 所有可打印字符，包括空格
[:punct:] 所有的标点字符
[:space:] 所有的横向或纵向的空白
[:upper:] 所有大写字母
```

### 1.3 打印变量

```bash
$ var="value"
$ echo $var
或者
$ echo ${var}
```

### 1.4 设置环境变量

```bash
# 在PATH中添加一条新路径
$ export PATH="$PATH:/home/user/bin"
也可以使用：
$ PATH="$PATH:/home/user/bin"
$ export PATH
```

### 1.5 Shell中三种引号的用法

```bash
# 单引号
# 使用单引号时，变量不会被扩展（expand），将依照原样显示。
$ var="123"
$ echo '$var' will print $var
结果为：'$var' will print 123

# 双引号
# 输出引号中的内容，若存在命令、变量等，会先执行命令解析出结果再输出
$ echo "$var" will print $var
结果为：123 will print 123

# 反引号
# 命令替换
$ var=`whoami`
$ echo $var
结果为：root

# 备注：反引号和$()作用相同
```

### 1.6 获得字符串的长度

```bash
# 用法
$ length=${#var}

$ var=12345678901234567890
$ echo ${#var}
20
```

### 1.7 识别当前shell

```bash
$ echo $SHELL
也可以使用：
$ echo $0
```

### 1.8 使用shell进行数学运算

在Bash shell环境中，可以利用 `let`、` (( ))` 和`[]` 执行基本的算术操作。而在进行高级操作时，`expr` 和 `bc` 这两个工具也会非常有用。

使用 `let` 时，变量名之前不需要再添加 `$`

```bash
$ no1=4
$ let no1++
$ let no1+=6	# 等同于let no=no+6
```

```bash
# 操作符[]的使用方法和let命令类似
$ result=$[ no1 + no2 ]
# 在[]中也可以使用$前缀
$ result=$[ $no1 + 5 ]
```

```bash
# 使用(())时，变量名之前需要加上$
$ result=$(( no1 + 50 ))
```

```bash
# expr同样可以用于基本算术操作
$ result=`expr 3 + 4`
$ result=$(expr $no1 + 5)
```

bc是一个用于数学运算的高级工具，这个精密计算器包含了大量的选项 。此处不多介绍。

### 1.9 shell中各种括号的作用()、(())、[\]、[[]]、{}

#### 1.9.1 小括号，圆括号（）

1、单小括号 ( )

* **命令组。**括号中的命令将会新开一个子shell顺序执行，所以括号中的变量不能够被脚本余下的部分使用。
* **命令替换。**等同于`cmd`，shell扫描一遍命令行，发现了`$(cmd)结构` ，便将 `$(cmd)` 中的cmd执行一次，得到其标准输出，再将此输出放到原来命令。有些shell不支持，如tcsh。
* **用于初始化数组。**如：array=(a b c d)。


2、双小括号 (( ))

* **整数扩展。**这种扩展计算是整数型的计算，不支持浮点型。((exp))结构扩展并计算一个算术表达式的值，如果表达式的结果为0，那么返回的退出状态码为1，或者 是"假"，而一个非零值的表达式所返回的退出状态码将为0，或者是"true"。若是逻辑判断，表达式exp为真则为1,假则为0。
* **只要括号中的运算符、表达式符合C语言运算规则，都可用在 `$((exp))`中，甚至是三目运算符**。作不同进位(如二进制、八进制、十六进制)运算时，输出结果全都自动转化成了十进制。如：echo $((16#5f)) 结果为95 (16进位转十进制)。
* **单纯用 (( )) 也可重定义变量值**，比如 a=5; ((a++)) 可将 $a 重定义为6。
* **常用于算术运算比较，双括号中的变量可以不使用`$` 符号前缀**。括号内支持多个表达式用逗号分开。 只要括号中的表达式符合C语言运算规则,比如可以直接使用for((i=0;i<5;i++)), 如果不使用双括号, 则为for i in `seq 0 4`或者for i in {0..4}。再如可以直接使用 `if (($i<5))` , 如果不使用双括号, 则为 `if [ $i -lt 5 ]` 。

#### 1.9.2 中括号，方括号[]

1、单中括号 []

* bash 的内部命令，[和test是等同的。如果我们不用绝对路径指明，通常我们用的都是bash自带的命令。if/test结构中的左中括号是调用test的命令标识，右中括号是关闭条件判断的。这个命令把它的参数作为比较表达式或者作为文件测试，并且根据比较的结果来返回一个退出状态码。if/test结构中并不是必须右中括号，但是新版的Bash中要求必须这样。
* Test和[]中可用的比较运算符只有==和!=，两者都是用于字符串比较的，不可用于整数比较，整数比较只能使用-eq，-gt这种形式。无论是字符串比较还是整数比较都不支持大于号小于号。如果实在想用，对于字符串比较可以使用转义形式，如果比较"ab"和"bc"：[ ab \< bc ]，结果为真，也就是返回状态为0。[ ]中的逻辑与和逻辑或使用-a 和-o 表示。
* 字符范围。用作正则表达式的一部分，描述一个匹配的字符范围。作为test用途的中括号内不能使用正则。
* 在一个array 结构的上下文中，中括号用来引用数组中每个元素的编号。

2、双中括号 [[ ]]

* [[是 bash 程序语言的关键字。并不是一个命令，[[ ]] 结构比[ ]结构更加通用。在[[和]]之间所有的字符都不会发生文件名扩展或者单词分割，但是会发生参数扩展和命令替换。
* 支持字符串的模式匹配，使用=~操作符时甚至支持shell的正则表达式。字符串比较时可以把右边的作为一个模式，而不仅仅是一个字符串，比如[[ hello == hell? ]]，结果为真。[[ ]] 中匹配字符串或通配符，不需要引号。
* 使用[[ ... ]]条件判断结构，而不是[ ... ]，能够防止脚本中的许多逻辑错误。比如，&&、||、<和> 操作符能够正常存在于[[ ]]条件判断结构中，但是如果出现在[ ]结构中的话，会报错。比如可以直接使用 `if [[ $a != 1 && $a != 2 ]]` , 如果不适用双括号, 则为 `if [ $a -ne 1] && [ $a != 2 ] `或者 `if [ $a -ne 1 -a $a != 2 ]` 。
* bash把双中括号中的表达式看作一个单独的元素，并返回一个退出状态码。

#### 1.9.3 大括号、花括号 {}

1）常规用法

* 大括号拓展。(通配(globbing))将对大括号中的文件名做扩展。在大括号中，不允许有空白，除非这个空白被引用或转义。第一种：对大括号中的以逗号分割的文件列表进行拓展。如 touch {a,b}.txt 结果为a.txt b.txt。第二种：对大括号中以点点（..）分割的顺序文件列表起拓展作用，如：touch {a..d}.txt 结果为a.txt b.txt c.txt d.txt
* 代码块，又被称为内部组，这个结构事实上创建了一个匿名函数 。与小括号中的命令不同，大括号内的命令不会新开一个子shell运行，即脚本余下部分仍可使用括号内变量。括号内的命令间用分号隔开，最后一个也必须有分号。{}的第一个命令和左括号之间必须要有一个空格。

2）几种特殊的替换结构

```bash
${var:-string},${var:+string},${var:=string},${var:?string}
```

* `${var:-string}` 和 `${var:=string}:` 若变量var为空，则用在命令行中用string来替换 `${var:-string}`，否则变量var不为空时，则用变量var的值来替换 `${var:-string}` ；对于 `${var:=string}` 的替换规则和 `${var:-string}` 是一样的，所不同之处是 `${var:=string}` 若var为空时，用string替换 `${var:=string}` 的同时，把string赋给变量 `var： ${var:=string}` 很常用的一种用法是，判断某个变量是否赋值，没有的话则给它赋上一个默认值。
* `${var:+string}` 的替换规则和上面的相反，即只有当var不是空的时候才替换成string，若var为空时则不替换或者说是替换成变量 var的值，即空值。(因为变量var此时为空，所以这两种说法是等价的) 。
* `${var:?string}` 替换规则为：若变量var不为空，则用变量var的值来替换 `${var:?string}` ；若变量var为空，则把string输出到标准错误中，并从脚本中退出。我们可利用此特性来检查是否设置了变量的值。

补充扩展：在上面这五种替换结构中string不一定是常值的，可用另外一个变量的值或是一种命令的输出。

3）四种模式匹配替换结构

模式匹配记忆方法：

```
# 是去掉左边(在键盘上#在$之左边)
% 是去掉右边(在键盘上%在$之右边)
#和%中的单一符号是最小匹配，两个相同符号是最大匹配。
```

```bash
${var%pattern},${var%%pattern},${var#pattern},${var##pattern}
```

* 第一种模式：`${variable%pattern}` ，这种模式时，shell在variable中查找，看它是否一给的模式pattern结尾，如果是，就从命令行把variable中的内容去掉右边最短的匹配模式


* 第二种模式：`${variable%%pattern}`，这种模式时，shell在variable中查找，看它是否一给的模式pattern结尾，如果是，就从命令行把variable中的内容去掉右边最长的匹配模式
* 第三种模式：`${variable#pattern}` 这种模式时，shell在variable中查找，看它是否一给的模式pattern开始，如果是，就从命令行把variable中的内容去掉左边最短的匹配模式
* 第四种模式：`${variable##pattern}` 这种模式时，shell在variable中查找，看它是否一给的模式pattern结尾，如果是，就从命令行把variable中的内容去掉右边最长的匹配模式

这四种模式中都不会改变variable的值，其中，只有在pattern中使用了匹配符号时，%和%%，#和##才有区别。结构中的pattern支持通配符，表示零个或多个任意字符，?表示仅与一个任意字符匹配，[...]表示匹配中括号里面的字符，[!...]表示不匹配中括号里面的字符。

4）字符串提取和替换

```bash
${var:num},${var:num1:num2},${var/pattern/pattern},${var//pattern/pattern}
```

* 第一种模式：`${var:num}` ，这种模式时，shell在var中提取第num个字符到末尾的所有字符。若num为正数，从左边0处开始；若num为负数，从右边开始提取字串，但必须使用在冒号后面加空格或一个数字或整个num加上括号，如 `${var: -2}` 、`${var:1-3}` 或 `${var:(-2)}`。         
* 第二种模式：`${var:num1:num2}`，num1是位置，num2是长度。表示从 `$var字符串的第$num1` 个位置开始提取长度为$num2的子串。不能为负数。
* 第三种模式：`${var/pattern/pattern}`表示将var字符串的第一个匹配的pattern替换为另一个pattern。。         
* 第四种模式：`${var//pattern/pattern}` 表示将var字符串中的所有能匹配的pattern替换为另一个pattern。

#### 1.9.4 符号$后的括号

* `${a}` 变量a的值, 在不引起歧义的情况下可以省略大括号。
* `$(cmd)`  命令替换，和`cmd`效果相同，结果为shell命令cmd的输，过某些Shell版本不支持 `$()` 形式的命令替换, 如tcsh。
* `$((expression))` 和`exprexpression`效果相同, 计算数学表达式exp的数值, 其中exp只要符合[C语言](http://lib.csdn.net/base/c)的运算规则即可, 甚至三目运算符和逻辑表达式都可以计算。

#### 1.9.5 多条命令执行

* 单小括号，`(cmd1;cmd2;cmd3)`  新开一个子shell顺序执行命令cmd1,cmd2,cmd3, 各命令之间用分号隔开, 最后一个命令后可以没有分号。
* 单大括号，`{ cmd1;cmd2;cmd3;}`  在当前shell顺序执行命令cmd1,cmd2,cmd3, 各命令之间用分号隔开, 最后一个命令后必须有分号, 第一条命令和左括号之间必须用空格隔开。

对 `{}` 和 `()` 而言, 括号中的重定向符只影响该条命令，而括号外的重定向符影响到括号中的所有命令。

### 1.10 Shell特殊变量 `$0, $#, $*, $@, $?, ### 和命令行参数

| 变量   | 含义                                    |
| ---- | ------------------------------------- |
| $0   | 当前脚本的文件名。                             |
| $n   | 传递给脚本或函数的参数。n是一个数字，表示几个参数。            |
| $#   | 传递给脚本或函数的参数个数。                        |
| $*   | 传递给脚本或函数的所有参数。                        |
| $@   | 传递给脚本或函数的所有采纳数。被双引号(" ")包含是，与$* 稍有不同。 |
| $?   | 上个命令的退出状态，或函数的返回值。                    |
| $$   | 当前shell进程ID。对于shell脚本，就是这个脚本所在的进程ID。  |

#### 1.10.1 命令行参数

运行脚本时传递给脚本的参数称为命令行参数。命令行参数用 `$n` 表示，例如，`$1 ` 表示第一个参数，`$2` 表示第二个参数，依次类推。

#### 1.10.2 `$*` 和 `$@` 的区别

`$*` 和 `$@` 都表示传递给函数或脚本的所有参数，不被双引号(" ")包含时，都以`"$1" "$2" … "$n"` 的形式输出所有参数。

但是当它们被双引号(" ")包含时，`"$*"` 会将所有的参数作为一个整体，以`"$1 $2 … $n"` 的形式输出所有参数；`"$@"` 会将各个参数分开，以 `"$1" "$2" … "$n" `的形式输出所有参数。

#### 1.10.3 退出状态

`$?` 可以获取上一个命令的退出状态。所谓退出状态，就是上一个命令执行后的返回结果。

退出状态是一个数字，一般情况下，大部分命令执行成功会返回 0，失败返回 1。

不过，也有一些命令返回其他值，表示不同类型的错误。

`$?` 也可以表示函数的返回值，此处不展开。

### 1.11 Shell重定向

1、重定向符号

```text
>               输出重定向到一个文件或设备 覆盖原来的文件
>!              输出重定向到一个文件或设备 强制覆盖原来的文件
>>              输出重定向到一个文件或设备 追加原来的文件
<               输入重定向到一个程序 
```

2、标准输入刷出

```text
在 bash 命令执行的过程中，主要有三种输出入的状况，分别是：
1. 标准输入；代码为 0 ；或称为 stdin ；使用的方式为 <
2. 标准输出：代码为 1 ；或称为 stdout；使用的方式为 1>
3. 错误输出：代码为 2 ；或称为 stderr；使用的方式为 2>
```

3、使用实例

```bash
# & 是一个描述符，如果1或2前不加&，会被当成一个普通文件。
# 1>&2 意思是把标准输出重定向到标准错误.
# 2>&1 意思是把标准错误输出重定向到标准输出。
# &>filename 意思是把标准输出和标准错误输出都重定向到文件filename中

$ cmd <> file		# 以读写方式打开文件 file
$ cmd >&n			# 将 cmd 的输出发送到文件描述符 n
$ cmd m>&n			# 将本该输出到文件描述符 m 的内容, 发送到文件描述符 n
$ cmd m<&n 			# 除了本该从文件描述符 m 处获取输入，改为从文件描述符 n 处获取
$ cmd >&-			# 关闭标准输出
$ cmd <&-			# 关闭标准输入
$ cmd  >& file		# 将标准输出和标准错误都发送到文件 file 
$ cmd  &> file		# 作用同上, 更好的格式
```

要在终端中打印stdout，同时将它重定向到一个文件中，那么可以这样使用tee 。

```bash
# 用法：command | tee FILE1 FILE2
$ cat a* | tee out.txt | cat -n
# 默认情况下， tee命令会将文件覆盖，但它提供了一个-a选项，用于追加内容
$ cat a* | tee -a out.txt | cat –n

# 我们可以使用stdin作为命令参数。只需要将-作为命令的文件名参数即可
# 用法：$ cmd1 | cmd2 | cmd -
$ echo who is this | tee -
```

### 1.12 Shell数组和关联数组

#### 1.12.1 简介

数组是Shell脚本非常重要的组成部分，它借助索引将多个独立的独立的数据存储为一个集合。普通数组只能使用整数作为数组索引，关联数组不仅可以使用整数作为索引，也可以使用字符串作为索引。通常情况下，使用字符串做索引更容易被人们理解。Bash从4.0之后开始引入关联数组。

#### 1.12.2 定义打印普通数组

数组的方法有如下几种：

```bash
#在一行上列出所有元素
$ array_var=(1 2 3 4 5 6)

#以“索引-值”的形式一一列出
$ array_var[0]="test1"
$ array_var[1]="test2"
$ array_var[2]="test3"
```

注意：第一种方法要使用圆括号，否则后面会报错。

数组元素的方法有如下几种：

```bash
$ echo ${array_var[0]}         #输出结果为 test1
$ index=2
$ echo ${array_var[$index]}    #输出结果为 test3
$ echo ${array_var[*]}         #输出所有数组元素
$ echo ${array_var[@]}         #输出所有数组元素
$ echo ${#array_var[*]}        #输出值为 3
```

注意：在ubuntu 14.04中，shell脚本要以#!/bin/bash开头，且执行脚本的方式为 bash test.sh。

#### 1.12.3 定义打印关联数组

定义关联数组 
在关联数组中，可以使用任何文本作为数组索引。定义关联数组时，首先需要使用声明语句将一个变量声明为关联数组，然后才可以在数组中添加元素，过程如下：

```bash
$ declare -A ass_array                           #声明一个关联数组
$ ass_array=(["index1"]=index1 ["index2"]=index2)#内嵌“索引-值”列表法
$ ass_array["index3"]=index3
$ ass_array["index4"]=index4
$ echo ${ass_array["index1"]}                    #输出为index1
$ echo ${ass_array["index4"]}
$ echo ${!ass_array[*]}                          #输出索引列表
$ echo ${!ass_array[@]}                          #输出索引列表
```

注意：对于普通数组，使用上面的方法依然可以列出索引列表，在声明关联数组以及添加数组元素时，都不能在前面添加美元符$。

### 1.13 使用别名

alias命令的作用只是暂时的。一旦关闭当前终端，所有设置过的别名就失效了。为了使别名设置一直保持作用，可以将它放入~/.bashrc文件中。因为每当一个新的shell进程生成时，都会执行 ~/.bashrc中的命令。 

```bash
$ alias install='sudo apt-get install'
```

### 1.14 获取、设置日期和延时 

时间方面 :

```bash
% : 印出
% %n : 下一行
%t : 跳格
%H : 小时(00..23)
%I : 小时(01..12)
%k : 小时(0..23)
%l : 小时(1..12)
%M : 分钟(00..59)
%p : 显示本地 AM 或 PM
%r : 直接显示时间 (12 小时制，格式为 hh:mm:ss [AP]M)
%s : 从 1970 年 1 月 1 日 00:00:00 UTC 到目前为止的秒数 %S : 秒(00..61)
%T : 直接显示时间 (24 小时制)
%X : 相当于 %H:%M:%S
%Z : 显示时区
```

日期方面 :

```bash
%a : 星期几 (Sun..Sat)
%A : 星期几 (Sunday..Saturday)

%b : 月份 (Jan..Dec)
%B : 月份 (January..December)

%y : 年份的最后两位数字 (00.99)
%Y : 完整年份 (0000..9999)

%c : 直接显示日期与时间
%d : 日 (01..31)
%D : 直接显示日期 (mm/dd/yy)
%h : 同 %b
%j : 一年中的第几天 (001..366)
%m : 月份 (01..12)
%U : 一年中的第几周 (00..53) (以 Sunday 为一周的第一天的情形)
%w : 一周中的第几天 (0..6)
%W : 一年中的第几周 (00..53) (以 Monday 为一周的第一天的情形)
%x : 直接显示日期 (mm/dd/yy)
```

若是不以加号作为开头，则表示要设定时间，而时间格式为 `MMDDhhmm[[CC]YY][.ss]`，其中：

```bash
MM 	为月份，
DD 	为日，
hh 	为小时，
mm 	为分钟，
CC 	为年份前两位数字，
YY 	为年份后两位数字，
ss 	为秒数
```

参数 :

-d datestr : 显示 datestr 中所设定的时间 (非系统时间)

–help : 显示辅助讯息

-s datestr : 将系统时间设为 datestr 中所设定的时间

-u : 显示目前的格林威治时间

–version : 显示版本编号

例子：

```bash
$ date				# 获取日期
$ date +%s			# 打印纪元时
$ date "+%d %B %Y"	# 用格式串结合 + 作为date命令的参数，可以按照你的选择打印出对应格式的日期
20 May 2010
$ date -s "21 June 2009 11:01:22" 	# 设置日期和时间
```

### 1.15 脚本调试

#### 1.15.1使用选项–x，启用shell脚本的跟踪调试功能 

```bash
$ bash -x script.sh
```

#### 1.15.2 使用set -x和set +x对脚本进行部分调试 

```typescript
#!/bin/bash
#文件名: debug.sh
for i in {1..6}
do
	set -x
	echo $i
	set +x
done
echo "Script executed"
```

* set –x：在执行时显示参数和命令。 
* set +x：禁止调试。 
* set –v：当命令进行读取时显示输入。 
* set +v：禁止打印输入。 

#### 1.15.3 通过传递 _DEBUG环境变量调试

```typescript
#!/bin/bash
function DEBUG()
{
	[ "$_DEBUG" == "on" ] && $@ || :
}
for i in {1..10}
do
	DEBUG echo $i
done
```

可以将调试功能置为"on"来运行上面的脚本：

```bash
$ _DEBUG=on ./script.sh
```

我们在每一个需要打印调试信息的语句前加上DEBUG。如果没有把 _DEBUG=on传递给脚本，那么调试信息就不会打印出来。在Bash中，命令 `:` 告诉shell不要进行任何操作。 

#### 1.15.4 利用shebang来进行调试 

shebang的妙用
把shebang从 `#!/bin/bash` 改成 `#!/bin/bash -xv`，这样一来，不用任何其他选项就可以启用调试功能了。 

### 1.16 函数参数

```typescript
$0 		# 脚本名
$1		# 第一个参数
$2		# 第二个参数
$n		# 第n个参数
"$@"	# 被扩展成 "$1" "$2" "$3"等
"$*"	# 被扩展成 "$1c$2c$3"，其中c是IFS的第一个字符
"$@" 要比"$*"用得多。由于 "$*"将所有的参数当做单个字符串，因此它很少被使用。
```

**导出函数：**

函数也能像环境变量一样用export导出，如此一来，函数的作用域就可以扩展到子进程中，例如： 

```typescript
export -f fname 
```

### 1.17 read命令

```bash
# 从输入中读取n个字符并存入变量
$ read -n 2 var
$ echo $var

# 用无回显的方式读取密码
$ read -s var

# 显示提示信息
$ read -p "Enter input:" var

# 在特定时(秒)限内读取输入
$ read -t timeout var
```

### 1.18 条件比较与测试 

```bash
# if条件
if condition
then
	commands
fi

# else if和else
if condition
then
	commands
else if condition then
	commands
else
	commands
fi
```

if的条件判断部分可能会变得很长，但可以用逻辑运算符将它变得简洁一些： 

```bash
[ condition ] && action		 # 如果condition为真，则执行action
[ condition ] || action		 # 如果condition为假，则执行action
```

`&&` 是逻辑与运算符， `||` 是逻辑或运算符。编写Bash脚本时，这是一个很有用的技巧。现在来了解一下条件和比较操作。 

算术比较：

* `-gt` ：大于。 
* `-lt` ：小于。 
* `-ge` ：大于或等于。 
* `-le` ：小于或等于。 

可以按照下面的方法结合多个条件进行测试： 

```bash
[ $var1 -ne 0 -a $var2 -gt 2 ] 		#使用逻辑与-a
[ $var1 -ne 0 -o var2 -gt 2 ] 		#逻辑或 -o
```

文件系统相关测试：

我们可以使用不同的条件标志测试不同的文件系统相关的属性。 

* `[ -f $file_var ]` ：如果给定的变量包含正常的文件路径或文件名，则返回真。 
* `[ -x $var ]` ：如果给定的变量包含的文件可执行，则返回真。 
* `[ -d $var ]` ：如果给定的变量包含的是目录，则返回真。 
* `[ -e $var ]` ：如果给定的变量包含的文件存在，则返回真。 
* `[ -c $var ]` ：如果给定的变量包含的是一个字符设备文件的路径，则返回真。 
* `[ -b $var ]` ：如果给定的变量包含的是一个块设备文件的路径，则返回真。 
* `[ -w $var ]` ：如果给定的变量包含的文件可写，则返回真。 
* `[ -r $var ]` ：如果给定的变量包含的文件可读，则返回真。 
* `[ -L $var ]` ：如果给定的变量包含的是一个符号链接，则返回真。 

字符串比较：

<p style="color: red;">使用字符串比较时，最好用双中括号，因为有时候采用单个中括号会产生错误，所以最好避开它们。 </p>

可以用下面的方法检查两个字符串，看看它们是否相同。 

* `[[ $str1 = $str2 ]]`：当str1等于str2时，返回真。也就是说， str1和str2包含
  的文本是一模一样的。 
* `[[ $str1 == $str2 ]]` ：这是检查字符串是否相等的另一种写法。 

也可以检查两个字符串是否不同。 

* `[[ $str1 != $str2 ]]` ：如果str1和str2不相同，则返回真。 

我们还可以检查字符串的字母序情况，具体如下所示。 

* `[[ $str1 > $str2 ]]` ：如果str1的字母序比str2大，则返回真。 
* `[[ $str1 < $str2 ]]` ：如果str1的字母序比str2小，则返回真。 
* `[[ -z $str1 ]]` ：如果str1包含的是空字符串，则返回真。 
* `[[ -n $str1 ]]` ：如果str1包含的是非空字符串，则返回真。 

使用逻辑运算符 && 和 || 能够很容易地将多个条件组合起来： 

```bash
if [[ -n $str1 ]] && [[ -z $str2 ]] 
then
	commands
fi
```

test命令可以用来执行条件检测。用test可以避免使用过多的括号。之前讲过的[]中的测试条件同样可以用于test命令。 

```bash
if [ $var -eq 0 ]; then echo "True"; fi
# 也可以写成：
if test $var -eq 0 ; then echo "True"; fi
```

### 补充内容

#### 1. 利用子shell生成一个独立的进程

子shell本身就是独立的进程。可以使用 `( )`操作符来定义一个子shell ：

```typescript
pwd;
(cd /bin; ls);
pwd;
```

#### 2. 无限循环的实例

```typescript
repeat() { while true; do $@ && return; done }
```

工作原理：

函数repeat，它包含了一个无限while循环，该循环执行以参数形式（通过 `$@` 访问）传入函数的命令。如果命令执行成功，则返回，进而退出循环。 

**一种更快的做法 ：**

在大多数现代系统中， `true` 是作为 `/bin` 中的一个二进制文件来实现的。<p style="color: red;">这就意味着每执行一次while循环， shell就不得不生成一个进程。</p>如果不想这样，可以使用shell内建的 `:`命令，它总是会返回为0的退出码： 

```typescript
repeat() { while :; do $@ && return; done } 
```

尽管可读性不高，但是肯定比第一种方法快。 

## 2. 命令之乐

### 2.1 cat命令

```bash
# 摆脱多余的空白行
$ cat -s file

# 显示行号
$ cat -n file
# -n甚至会为空白行加上行号。如果你想跳过空白行，那么可以使用选项-b。
```

### 2.2 find命令

```bash
# 列出当前目录及子目录下所有的文件和文件夹
$ find base_path

$ find . -print
# -print指明打印出匹配文件的文件名（路径）。当使用 -print时， '\n'作为用于对输出的文件名进行分隔。就算你忽略-print， find命令仍会打印出文件名。
# -print0指明使用'\0'作为匹配的文件名之间的定界符。
```

1、find命令有一个选项 `-iname`（忽略字母大小写） 

```bash
$ ls
example.txt EXAMPLE.txt file.txt
$ find . -iname "example*" -print
./example.txt
./EXAMPLE.txt
```

2、如果想匹配多个条件中的一个，可以采用OR条件操作 :

```bash
$ ls
new.txt some.jpg text.pdf
$ find . \( -name "*.txt" -o -name "*.pdf" \) -print
./text.pdf
./new.txt
```

3、选项-path的参数可以使用通配符来匹配文件路径。 `-name` 总是用给定的文件名进行匹配。`-path` 则将文件路径作为一个整体进行匹配。例如 :

```bash
$ find /home/users -path "*/slynux/*" -print
/home/users/list/slynux.txt
/home/users/slynux/eg.css
```

4、选项 `-regex` 的参数和 `-path` 的类似，只不过 `-regex` 是基于正则表达式来匹配文件路径的。 

```bash
$ ls
new.PY next.jpg test.py
$ find . -regex ".*\(\.py\|\.sh\)$"
./test.py
# 类似地， -iregex可以让正则表达式忽略大小写。例如：
$ find . -iregex ".*\(\.py\|\.sh\)$"
./test.py
./new.PY
```

5、find也可以用“!”否定参数的含义。例如： 

```bash
$ ls
list.txt new.PY new.txt next.jpg test.py
$ find . ! -name "*.txt" -print
.
./next.jpg
./test.py
./new.PY
```

6、基于目录深度的搜索

```bash
# 深度选项-maxdepth和 -mindepth来限制find命令遍历的目录深度
# 下列命令将find命令向下的最大深度限制为1:
$ find . -maxdepth 1 -name "f*" -print

# 打印出深度距离当前目录至少两个子目录的所有文件:
$ find . -mindepth 2 -name "f*" -print
```

**注：**-maxdepth和-mindepth应该作为find的第三个参数出现。如果作为第4个或之后的参数，就可能会影响到find的效率，因为它不得不进行一些不必要的检查。 

根据文件类型搜索

7、根据文件类型搜索

`-type` 可以对文件搜索进行过滤 

| 文件类型 | 类型参数 |
| ---- | ---- |
| 普通文件 | f    |
| 符号链接 | l    |
| 目录   | d    |
| 字符设备 | c    |
| 块设备  | b    |
| 套接字  | s    |
| FIFO | p    |

8、根据文件时间进行搜索

* 访问时间（-atime）：用户最近一次访问文件的时间。
* 修改时间（-mtime）：文件内容最后一次被修改的时间。
* 变化时间（-ctime）：文件元数据（例如权限或所有权）最后一次改变的时间。

> -atime、 -mtime、 -ctime可作为find的时间选项。它们可以用整数值指定，单位是天。这些整数值通常还带有 - 或 + ： - 表示小于， + 表示大于。 

```bash
# 打印出在最近7天内被访问过的所有文件：
$ find . -type f -atime -7 -print

# 打印出恰好在7天前被访问过的所有文件：
$ find . -type f -atime 7 -print

# 打印出访问时间超过7天的所有文件：
$ find . -type f -atime +7 -print
```

-atime、 -mtime以及-ctime都是基于时间的参数，其计量单位是“天”。还有其他一些基于时间的参数是以分钟作为计量单位的。这些参数包括： 

* -amin（访问时间）
* -mmin（修改时间）
* -cmin（变化时间）

使用 `-newer` ，我们可以指定一个用于比较时间戳的参考文件，然后找出比参考文件更新的（更近的修改时间）所有文件 

```bash
# 找出比file.txt修改时间更近的所有文件：
$ find . -type f -newer file.txt -print
```

9、基于文件大小的搜索

```bash
$ find . -type f -size +2k
# 大于2KB的文件

$ find . -type f -size -2k
# 小于2KB的文件

$ find . -type f -size 2k
# 大小等于2KB的文件
```

* b —— 块（512字节）
* c —— 字节
* w —— 字（2字节）
* k —— 1024字节
* M —— 1024k字节
* G —— 1024M字节

10、删除匹配的文件

`-delete` 可以用来删除find查找到的匹配文件。 

```bash
# 删除当前目录下所有的 .swp文件：
$ find . -type f -name "*.swp" -delete
```

11、基于文件权限和所有权的匹配

```bash
$ find . -type f -perm 644 -print
# 打印出权限为644的文件
```

-perm指明find应该只匹配具有特定权限值的文件。 

12、利用find执行命令或动作 

find命令可以借助选项-exec与其他命名进行结合。 -exec算得上是find最强大的特性之一。 

```bash
$ find . -type f -user root -exec chown slynux {} \;

# {}是一个与 -exec选项搭配使用的特殊字符串。对于每一个匹配的文件，{}会被替换成相应的文件名。
```

`-exec` 结合多个命令 :

我们无法在-exec参数中直接使用多个命令。它只能够接受单个命令，不过我们可以耍一个小花招。把多个命令写到一个shell脚本中（例如command.sh），然后在-exec中使用这个脚本：

```typescript
-exec ./commands.sh {} \; 
```

13、让find跳过特定的目录

```bash
$ find devel/source_path \( -name ".git" -prune \) -o \( -type f -print \)

# 以上命令打印出不包括在.git目录中的所有文件的名称（路径）。
```

`\( -name ".git" -prune \)` 的作用是用于进行排除，它指明了 .git目录应该被排除在外，而` \( -type f -print \)` 指明了需要执行的动作。这些动作需要被放置在第二个语句块中（打印出所有文件的名称和路径）。 

### 2.3 玩转xargs

`xargs` 擅长将标准输入数据转换成命令行参数。

`xargs` 命令把从 stdin接收到的数据重新格式化，再将其作为参数提供给其他命令。 

####  2.3.1 将多行输入转换成单行输出

只需要将换行符移除，再用" "（空格）进行代替，就可以实现多行输入的转换。 

```bash
$ cat example.txt # 样例文件
1 2 3 4 5 6
7 8 9 10
11 12
$ cat example.txt | xargs
1 2 3 4 5 6 7 8 9 10 11 12
```

#### 2.3.2 将单行输入转换成多行输出

指定每行最大的参数数量 `n`，我们可以将任何来自stdin的文本划分成多行，每行 `n` 个参数。 

```bash
$ cat example.txt | xargs -n 3
1 2 3
4 5 6
7 8 9
10 11 12
```

#### 2.3.3 定制定界符

用 `-d` 选项为输入指定一个定制的定界符： 

```bash
$ echo "splitXsplitXsplitXsplit" | xargs -d X
split split split split

$ echo "splitXsplitXsplitXsplit" | xargs -d X -n 2
split split
split split
```

在这里，我们明确指定X作为输入定界符，而在默认情况下， xargs采用内部字段分隔符（空格）作为输入定界符。 

#### 2.3.4 读取stdin，将格式化参数传递给命令 

`-I` 指定替换字符串，这个字符串在xargs扩展时会被替换掉。如果将 `-I` 与 `xargs` 结合使用，对于每一个参数，命令都会被执行一次。 

```bash
$ cat args.txt
arg1
arg2
arg3
$ cat args.txt | xargs -I {} ./cecho.sh -p {} -l
-p arg1 -l #
-p arg2 -l #
-p arg3 -l #
```

`-I {}` 指定了替换字符串。对于每一个命令参数，字符串 `{}` 都会被从stdin读取到的参数替换掉。 

使用 `-I` 的时候，命令以循环的方式执行。 

xargs和find算是一对死党。两者结合使用可以让任务变得更轻松。 不过人们通常却是以一种错误的组合方式使用它们。例如： 

```bash
$ find . -type f -name "*.txt" -print | xargs rm -f
```

这样做很危险。 有时可能会删除不必要删除的文件。 

只要我们把 `find` 的输出作为 `xargs` 的输入，就必须将 `-print0` 与 `find` 结合使用，以字符`null（'\0'）`来分隔输出。 

```bash
$ find . -type f -name "*.txt" -print0 | xargs -0 rm -f
# xargs -0将\0作为输入定界符。

$ find source_code_dir_path -type f -name "*.c" -print0 | xargs -0 wc -l
# 统计源代码目录中所有C程序文件的行数
```

### 2.4 校验和与核实

校验和（checksum）程序用来从文件中生成校验和密钥，然后利用这个校验和密钥核实文件的完整性。文件可以通过网络或任何存储介质分发到不同的地点。 

最知名且使用最为广泛的校验和技术是md5sum和SHA-1。它们对文件内容使用相应的算法来生成校验和。 

```bash
$ md5sum filename
68b329da9893e34099c7d8ad5cb9c940 filename

$ md5sum filename > file_sum.md5

$ md5sum file1 file2 file3 ..

$ md5sum -c file_sum.md5
# 这个命令会输出校验和是否匹配的消息

# 如果需要用所有的.md5信息来检查所有的文件，可以使用：
$ md5sum -c *.md5
```

计算SAH-1串的命令是sha1sum。其用法和md5sum的非常相似。只需要把先前讲过的那些命令中的md5sum替换成sha1sum就行了，记住将输入文件名从file_sum.md5改为file_sum.sha1。 

对目录进行校验：

```bash
$ md5deep -rl directory_path > directory.md5
# -r使用递归的方式
# -l使用相对路径。默认情况下， md5deep会输出文件的绝对路径

# 或者也可以结合find来递归计算校验和：
$ find directory_path -type f -print0 | xargs -0 md5sum >> directory.md5

# 用下面的命令进行核实：
$ md5sum -c directory.md5
```

#### 2.4.1 加密工具与散列 

`crypt`、 `gpg`、 `base64`、 `md5sum`、 `sha1sum` 以及 `openssl` 的用法。 

1）crypt是一个简单的加密工具，它从stdin接受一个文件以及口令作为输入，然后将加密数据输出到Stdout（因此要对输入、输出文件使用重定向）。 

```bash
$ crypt <input_file >output_file
Enter passphrase:
# 它会要求输入一个口令。我们也可以通过命令行参数来提供口令。

$ crypt PASSPHRASE <input_file >encrypted_file
# 如果需要解密文件，可以使用：
$ crypt PASSPHRASE -d <encrypted_file >output_file
```

2）gpg（GNU隐私保护）是一种应用广泛的工具，它使用加密技术来保护文件，以确保数据在送达目的地之前无法被读取。这里我们讨论如何加密、解密文件。 

```bash
# 用gpg加密文件：
$ gpg -c filename
# 该命令采用交互方式读取口令，并生成filename.gpg。使用以下命令解密gpg文件：
$ gpg filename.gpg
# 该命令读取口令，然后对文件进行解密。
```

3）Base64是一组相似的编码方案，它将ASCII字符转换成以64为基数的形式，以可读的ASCII字符串来描述二进制数据。 base64命令可以用来编码/解码Base64字符串。要将文件编码为Base64格式，可以使用： 

```bash
$ base64 filename > outputfile
# 或者
$ cat file | base64 > outputfile
# base64可以从stdin中进行读取。

# 解码Base64数据：
$ base64 -d file > outputfile
# 或者
$ cat base64_file | base64 -d > outputfile
```

4）md5sum与sha1sum都是单向散列算法，均无法逆推出原始数据。它们通常用于验证数据完整性或为特定数据生成唯一的密钥： 

```bash
$ md5sum file
8503063d5488c3080d4800ff50850dc9 file
$ sha1sum file
1ba02b66e2e557fede8f61b7df282cd0a27b816b file
```

这种类型的散列算法是存储密码的理想方案。密码使用其对应的散列值来存储。如果某个用户需要进行认证，读取该用户提供的密码并转换成散列值，然后将其与之前存储的散列值进行比对。如果相同，用户就通过认证，被允许访问；否则，就会被拒绝访问。 

5）openssl

用openssl生成shadow密码。 shadow密码通常都是salt密码。所谓SALT就是额外的一个字符串，用来起一个混淆的作用，使加密更加不易被破解。 salt由一些随机位组成，被用作密钥生成函数的输入之一，以生成密码的salt散列值。 

```bash
$ opensslpasswd -1 -salt SALT_STRING PASSWORD
$1$SALT_STRING$323VkWkSLHuhbt1zkSsUG.
# 将SALT_STRING替换为随机字符串，并将PASSWORD替换成你想要使用的密码。
```

### 2.5 排序、唯一与重复

```bash
# 对一组文件进行排序：
$ sort file1.txt file2.txt > sorted.txt

# 按照数字顺序进行排序：
$ sort -n file.txt

# 按照逆序进行排序：
$ sort -r file.txt

# 按照月份进行排序（依照一月，二月，三月……）：
$ sort -M months.txt

# 合并两个已排序过的文件：
$ sort -m sorted1 sorted2

# 找出已排序文件中不重复的行：
$ sort file1.txt file2.txt | uniq
```

检查文件是否已经排序过：

```typescript
#!/bin/bash
#功能描述：排序
sort -C filename ;
if [ $? -eq 0 ]; then
	echo Sorted;
else
	echo Unsorted;
fi
```

`-k` 指定了排序应该按照哪一个键（key）来进行。键指的是列号，而列号就是执行排序时的依据。 `-r` 告诉sort命令按照逆序进行排序。例如： 

```bash
# 依据第1列，以逆序形式排序
$ sort -nrk 1 data.txt
4 linux 1000
3 bsd 1000
2 winxp 4000
1 mac 2000
# -nr表明按照数字，采用逆序形式排序
# 依据第2列进行排序
$ sort -k 2 data.txt
3 bsd 1000
4 linux 1000
1 mac 2000
2 winxp 4000
```

有时文本中可能会包含一些像空格之类的不必要的多余字符。如果需要忽略这些字符，并以字典序进行排序，可以使用：

```bash
$ sort -bd unsorted.txt
# 选项-b用于忽略文件中的前导空白行，选项-d用于指明以字典序进行排序。
```

sort选项：

```bash
-b：忽略每行前面开始出的空格字符；

-c：检查文件是否已经按照顺序排序； 

-d：排序时，处理英文字母、数字及空格字符外，忽略其他的字符； 

-f：排序时，将小写字母视为大写字母； 

-i：排序时，除了040至176之间的ASCII字符外，忽略其他的字符；

-m：将几个排序号的文件进行合并； 

-M：将前面3个字母依照月份的缩写进行排序； 

-n：依照数值的大小排序； 

-o<输出文件>：将排序后的结果存入制定的文件； 

-r：以相反的顺序来排序； 

-t<分隔字符>：指定排序时所用的栏位分隔字符； 

+<起始栏位>-<结束栏位>：以指定的栏位来排序，范围由起始栏位到结束栏位的前一栏位。
```

uniq选项：

```bash
-c或——count：在每列旁边显示该行重复出现的次数； 

-d或--repeated：仅显示重复出现的行列； 

-f<栏位>或--skip-fields=<栏位>：忽略比较指定的栏位； 

-s<字符位置>或--skip-chars=<字符位置>：忽略比较指定的字符； 

-u或——unique：仅显示出一次的行列； 

-w<字符位置>或--check-chars=<字符位置>：指定要比较的字符。
```

wc选项：

```bash
-c或--bytes或——chars：只显示Bytes数； 		# 统计字符数

-l或——lines：只显示列数； 					# 统计行数

-w或——words：只显示字数。					# 统计单词数

# 当不使用任何选项执行wc时，它会分别打印出文件的行数、单词数和字符数：
$ wc file
1435 15763 112200

# 使用-L选项打印出文件中最长一行的长度：
$ wc file -L
205
```

### 2.6 临时文件命名与随机数  

```bash
# 创建临时文件：
$ filename=`mktemp`
$ echo $filename
/tmp/tmp.8xvhkjF5fH

# 创建临时目录：
$ dirname=`mktemp -d`
$ echo $dirname
tmp.NI8xzW7VRX

# 如果仅仅是想生成文件名，又不希望创建实际的文件或目录，方法如下：
$ tmpfile=`mktemp -u`
$ echo $tmpfile
/tmp/tmp.RsGmilRpcT

# 根据模板创建临时文件名：
$mktemp test.XXX
test.2tc
```

如果提供了定制模板， X会被随机的字符（字母或数字）替换。注意， mktemp正常工作的前提是保证模板中只少要有3个X。 

### 2.7 split 分割文件和数据 

```bash
# 将文件分割成多个大小为10KB的文件
$ split -b 10k data.file
$ ls
data.file xaa xab xac xad xae xaf xag xah xai xaj
```

上面的命令将data.file分割成多个文件，每一个文件大小为10KB。这些文件以xab、 xac、 xad的形式命名。这表明它们都有一个字母后缀。如果想以数字为后缀，可以另外使用-d参数。此外，使用 -a length可以指定后缀长度： 

```bash
$ split -b 10k data.file -d -a 4
$ ls
data.file x0009 x0019 x0029 x0039 x0049 x0059 x0069 x0079
```

除了k（KB）后缀，我们还可以使用M（MB）、 G（GB）、 c（byte）、 w（word）等后缀。 

```bash
# 为分割后的文件指定文件名前缀 
$ split -b 10k data.file -d -a 4 split_file
$ ls
data.file	   split_file0002 split_file0005 split_file0008 strtok.c
split_file0000 split_file0003 split_file0006 split_file0009
split_file0001 split_file0004 split_file0007

# 如果不想按照数据块大小，而是需要根据行数来分割文件的话，可以使用 -l no_of_lines：
$ split -l 10 data.file
# 分割成多个文件，每个文件包含10行
```

csplit。它能够依据指定的条件和字符串匹配选项对日志文件进行分割。 

```bash
$ cat server.log
SERVER-1
[connection] 192.168.0.1 success
[connection] 192.168.0.2 failed
[disconnect] 192.168.0.3 pending
[connection] 192.168.0.4 success
SERVER-2
[connection] 192.168.0.1 failed
[connection] 192.168.0.2 failed
[disconnect] 192.168.0.3 success
[connection] 192.168.0.4 failed
SERVER-3
[connection] 192.168.0.1 pending
[connection] 192.168.0.2 pending
[disconnect] 192.168.0.3 pending
[connection] 192.168.0.4 failed
$ csplit server.log /SERVER/ -n 2 -s {*} -f server -b "%02d.log" ; rm server00.log
$ ls
server01.log server02.log server03.log server.log
```

有关这个命令的详细说明如下。 

* /SERVER/ 用来匹配某一行，分割过程即从此处开始。 
* /[REGEX]/ 表示文本样式。包括从当前行（第一行）直到（但不包括）包含“SERVER”的匹配行。 
* {*} 表示根据匹配重复执行分割，直到文件末尾为止。可以用{整数}的形式来指定分割执行的次数。 
* -s 使命令进入静默模式，不打印其他信息。 
* -n 指定分割后的文件名后缀的数字个数，例如01、 02、 03等。 
* -f 指定分割后的文件名前缀（在上面的例子中， server就是前缀）。 
* -b 指定后缀格式。例如%02d.log，类似于C语言中printf的参数格式。在这里文件名=前缀+后缀=server + %02d.log。 

因为分割后的第一个文件没有任何内容（匹配的单词就位于文件的第一行中），所以我们删除了server00.log。 

#### 2.7.1 根据扩展名切分文件名$、## 

借助 `%` 操作符可以轻松将名称部分从 “名称.扩展名” 这种格式中提取出来。 

```typescript
file_jpg="sample.jpg"
name=${file_jpg%.*}
echo File name is: $name
输出结果：
File name is: sample
```

将文件名的扩展名部分提取出来，这可以借助 # 操作符实现。 

```typescript
extension=${file_jpg#*.}
echo Extension is: jpg
输出结果：
Extension is: jpg
```

`${VAR%.*}`  的含义如下所述： 

* 从 $VAR中删除位于 % 右侧的通配符（在前例中是.*）所匹配的字符串。通配符从右向左进行匹配。 
* 给VAR赋值， VAR=sample.jpg。那么，通配符从右向左就会匹配到.jpg，因此，从 $VAR中删除匹配结果，就会得到输出sample。 

%属于非贪婪（non-greedy）操作。它从右到左找出匹配通配符的最短结果。还有另一个操作符 %%，这个操作符与%相似，但行为模式却是贪婪的，这意味着它会匹配符合条件的最长的字符串。 

操作符%%则用.*从右向左执行贪婪匹配（.fun.book.txt）。 

`${VAR#*.}` 的含义如下所述：
从$VAR中删除位于#右侧的通配符（即在前例中使用的*.）所匹配的字符串。通配
符从左向右进行匹配。
和 %% 类似， #也有一个相对应的贪婪操作符 ##。

`##`从左向右进行贪婪匹配，并从指定变量中删除匹配结果。

这里有个能够提取域名不同部分的实用案例。假定 `URL="www.google.com"`：

```bash
$ echo ${URL%.*} # 移除.*所匹配的最右边的内容
www.google
$ echo ${URL%%.*} # 将从右边开始一直匹配到最左边的*.移除（贪婪操作符）
www
$ echo ${URL#*.} # 移除*.所匹配的最左边的内容
google.com
$ echo ${URL##*.} # 将从左边开始一直匹配到最右边的*.移除（贪婪操作符）
com
```

### 2.8 批量重命名和移动  

```bash
# 将 *.JPG更名为 *.jpg：
$ rename *.JPG *.jpg

# 将文件名中的空格替换成字符“_”：
$ rename 's/ /_/g' *

# 转换文件名的大小写：
$ rename 'y/A-Z/a-z/' *
$ rename 'y/a-z/A-Z/' *

# 将所有的 .mp3文件移入给定的目录：
$ find path -type f -name "*.mp3" -exec mv {} target_dir \;

# 将所有文件名中的空格替换为字符“_”：
$ find path -type f -exec rename 's/ /_/g' {} \;
```

## 3 以文件之名

### 3.1 生成任意大小的文件

```bash
$ dd if=/dev/zero of=junk.data bs=1M count=1
```

该命令会创建一个1MB大小的文件junk.data。来看一下命令参数： if代表输入文件（input file），of代表输出文件（output file）， bs代表以字节为单位的块大小（block size）， count代表需要被复制的块数。

使用dd命令时一定得留意，该命令运行在设备底层。要是你不小心出了岔子，搞不好会把磁盘清空或是损坏数据。所以一定要反复检查dd命令所用的语法是否正确，尤其是参数of=。 

| 单元大小        | 代码   |
| ----------- | ---- |
| 字节（1B）      | c    |
| 字（2B）       | w    |
| 块（512B）     | b    |
| 千字节（1024B）  | k    |
| 兆字节（1024KB） | M    |
| 吉字节（1024MB） | G    |

`ls -lS` 对当前目录下的所有文件按照文件大小进行排序，并列出文件的详细信息。  

### 3.2 文件权限、所有权和粘滞位 

用命令ls -l可以列出文件的权限： 

```
-rw-r--r-- 1 slynux slynux 2497 2010-02-28 11:22 bot.py
drwxr-xr-x 2 slynux slynux 4096 2010-05-27 14:31 a.py
-rw-r--r-- 1 slynux slynux 539 2010-02-10 09:11 cl.pl
```

* `-`—— 普通文件。 
* d —— 目录。 
* c —— 字符设备。 
* b —— 块设备。 
* l —— 符号链接。 
* s —— 套接字。 
* p —— 管道。 

```bash
# 更改所有权
$ chown user.group filename

# 设置粘滞位
# 要设置粘滞位，利用chmod将 +t应用于目录：
$ chmod a+t directory_name

# 以递归的方式设置权限
$ chmod 777 . -R

# 以递归的方式设置所有权
$ chown user.group . -R
```

### 3.3 创建不可修改的文件

chattr能够将文件设置为不可修改。 

```bash
# 使用下列命令将一个文件设置为不可修改：
$ chattr +i file

# 如果需要使文件恢复可写状态，移除不可修改属性即可：
$ chattr -i file
```

### 3.4 查找符号链接及其指向目标 

```bash
# 创建符号链接：
$ ln -s target symbolic_link_name
例如：
$ ln -l -s /var/www/ ~/web
#这个命令在已登录用户的home目录中创建了一个名为Web的符号链接。该链接指向/var/www。

# 使用下面的命令来验证是否创建链接：
$ ls -l web
lrwxrwxrwx 1 slynux slynux 8 2010-06-25 21:34 web -> /var/www

# 打印出当前目录下的符号链接：
$ ls -l | grep "^l"

# 使用find打印当前目录以及子目录下的符号链接：
$ find . -type l -print

# 使用readlink打印出符号链接所指向的目标路径：
$ readlink web
/var/www
```

### 3.5 列举文件类型统计信息

```bash
# 用下面的命令打印文件类型信息：
$ file filename
$ file /etc/passwd
/etc/passwd: ASCII text

# 打印不包括文件名在内的文件类型信息：
$ file -b filename
ASCII text
```

### 3.6 使用环回文件 

```bash
# 下面的命令可以创建一个1GB大小的文件：
$ dd if=/dev/zero of=loobackfile.img bs=1G count=1
1024+0 records in
1024+0 records out
1073741824 bytes (1.1 GB) copied, 37.3155 s, 28.8 MB/s
# 你会发现创建好的文件大小超过了1GB。这是因为硬盘作为块设备，其分配存储空间时是按照块大小的整数倍来进行的。

# 用mkfs命令将1GB的文件格式化成ext4文件系统：
$ mkfs.ext4 loopbackfile.img

# 使用下面的命令检查文件系统：
$ file loobackfile.img
loobackfile.img: Linux rev 1.0 ext4 filesystem data,
UUID=c9d56c42-f8e6-4cbd-aeab-369d5056660a (extents) (large files) (huge files)

# 现在就可以挂载环回文件了：
$ mkdir /mnt/loopback
$ mount -o loop loopbackfile.img /mnt/loopback
# -o loop用来挂载环回文件系统。

# 我们也可以手动来操作：
$ losetup /dev/loop1 loopbackfile.img
$ mount /dev/loop1 /mnt/loopback

# 使用下面的方法进行卸载（umount）：
$ umount mount_point
```

### 3.7 生成 ISO 文件及混合型 ISO  

```bash
#用下面的命令从/dev/cdrom创建一个ISO镜像：
$ cat /dev/cdrom > image.iso

#尽管可以奏效。但创建ISO镜像最好的方法还是使用dd工具：
$ dd if=/dev/cdrom of=image.iso

# mkisofs命令用于创建ISO文件系统。
$ mkisofs -V "Label" -o image.iso source_dir/
# 选项 -o指定了ISO文件的路径。 source_dir是作为ISO文件内容来源的目录路径，选项 -V指定了ISO文件的卷标。
```

### 3.8 diff命令

```bash
- 　				# 指定要显示多少行的文本。此参数必须与-c或-u参数一并使用。
-a或--text 　		# diff预设只会逐行比较文本文件。
-b或--ignore-space-change 　# 不检查空格字符的不同。
-B或--ignore-blank-lines 　 # 不检查空白行。
-c 　			# 显示全部内文，并标出不同之处。
-C或--context 	# 与执行"-c-"指令相同。
-d或--minimal 	# 使用不同的演算法，以较小的单位来做比较。
-D或ifdef		# 此参数的输出格式可用于前置处理器巨集。
-e或--ed			# 此参数的输出格式可用于ed的script文件。
-f或-forward-ed	# 输出的格式类似ed的script文件，但按照原来文件的顺序来显示不同处。
-H或--speed-large-files 　	# 比较大文件时，可加快速度。
-l或--ignore-matching-lines 　# 若两个文件在某几行有所不同，而这几行同时都包含了选项中指定的字符或字符串，则不显示这两个文件的差异。
-i或--ignore-case 　# 不检查大小写的不同。
-l或--paginate	   # 将结果交由pr程序来分页。
-n或--rcs 　		  # 将比较结果以RCS的格式来显示。
-N或--new-file 　	  # 在比较目录时，若文件A仅出现在某个目录中，预设会显示：Only in目录：文件A若使用-N参数，则diff会将文件A与一个空白的文件比较。
-p 　			  # 若比较的文件为C语言的程序码文件时，显示差异所在的函数名称。
-P或--unidirectional-new-file 　# 与-N类似，但只有当第二个目录包含了一个第一个目录所没有的文件时，才会将这个文件与空白的文件做比较。
-q或--brief 　	# 仅显示有无差异，不显示详细的信息。
-r或--recursive 　# 比较子目录中的文件。
-s或--report-identical-files 　# 若没有发现任何差异，仍然显示信息。
-S或--starting-file 　# 在比较目录时，从指定的文件开始比较。
-t或--expand-tabs 　	# 在输出时，将tab字符展开。
-T或--initial-tab 　	# 在每行前面加上tab字符以便对齐。
-u,-U或--unified= 　	# 以合并的方式来显示文件内容的不同。
-v或--version 　		# 显示版本信息。
-w或--ignore-all-space 　# 忽略全部的空格字符。
-W或--width 　		# 在使用-y参数时，指定栏宽。
-x或--exclude 　		# 不比较选项中所指定的文件或目录。
-X或--exclude-from 　 # 您可以将文件或目录类型存成文本文件，然后在=中指定此文本文件。
-y或--side-by-side 　 # 以并列的方式显示文件的异同之处。
--help 　			 # 显示帮助。
--left-column 　		# 在使用-y参数时，若两个文件某一行内容相同，则仅在左侧的栏位显示该行内容。
--suppress-common-lines 　# 在使用-y参数时，仅显示不同之处。
```

生成目录的差异信息 ：

```bash
$ diff -Naur directory1 directory2
```

* -N：将所有缺失的文件视为空文件。 
* -a：将所有文件视为文本文件。 
* -u：生成一体化输出。 
* -r：遍历目录下的所有文件。 

```bash
# 生成patch文件
$ diff -u version1.txt version2.txt > version.patch

# 用下列命令来进行修补：
$ patch -p1 version1.txt < version.patch
patching file version1.txt
# version1.txt的内容现在和verson2.txt的内容一模一样。

# 下面的命令可以撤销做出的修改：
$ patch -p1 version1.txt < version.patch
patching file version1.txt
Reversed (or previously applied) patch detected! Assume -R? [n] y
# 修改被撤销
```

### 3.9 more、less、head与tail命令

#### 3.9.1 more文件内容输出查看工具

```bash
$ more [参数选项] [文件] 

# 参数如下： 
+num   		# 从第num行开始显示； 
-num   		# 定义屏幕大小，为num行； 
+/pattern   # 从pattern 前两行开始显示； 
-c   		# 从顶部清屏然后显示； 
-d   		# 提示Press space to continue, 'q' to quit.（按空格键继续，按q键退出），禁用响铃功能； 
-l    		# 忽略Ctrl+l （换页）字符； 
-p    		# 通过清除窗口而不是滚屏来对文件进行换页。和-c参数有点相似； 
-s    		# 把连续的多个空行显示为一行； 
-u    		# 把文件内容中的下划线去掉退出more的动作指令是q 
```

举例：

```bash
# 显示提示，并从终端或控制台顶部显示；
$ more -dc /etc/profile 

# 从profile的第4行开始显示；
$ more +4 /etc/profile     

# 每屏显示4行；
$ more -4 /etc/profile    

# 从profile中的第一个MAIL单词的前两行开始显示；
$ more +/MAIL /etc/profile   
```

more 的动作指令：

```typescript
Enter       	# 向下n行，需要定义，默认为1行； 
Ctrl+f    		# 向下滚动一屏； 
空格键			 # 向下滚动一屏； 
Ctrl+b  		# 返回上一屏； 
=         		# 输出当前行的行号； 
:f      		# 输出文件名和当前行的行号； 
v      			# 调用vi编辑器； 
! 命令          # 调用Shell，并执行命令； 
q     			# 退出more当我们查看某一文件时，想调用vi来编辑它，不要忘记了v动作指令，这是比较方便的； 
```

其它命令通过管道和more结合的运用例子：

```bash
$ ls -l /etc |more 
```

#### 3.9.2 less查看文件内容工具

```bash
-c 		# 从顶部（从上到下）刷新屏幕，并显示文件内容。而不是通过底部滚动完成刷新； 
-f 		# 强制打开文件，二进制文件显示时，不提示警告； 
-i 		# 搜索时忽略大小写；除非搜索串中包含大写字母； 
-I 		# 搜索时忽略大小写，除非搜索串中包含小写字母； 
-m 		# 显示读取文件的百分比； 
-M 		# 显法读取文件的百分比、行号及总行数； 
-N 		# 在每行前输出行号； 
-p 		# pattern 搜索pattern；比如在/etc/profile搜索单词MAIL，就用 less -p MAIL /etc/profile 
-s 		# 把连续多个空白行作为一个空白行显示； 
-Q 		# 在终端下不响铃； 
```

less的动作命令：

```bash
回车键 	# 向下移动一行； 
y 		  # 向上移动一行； 
空格键 	# 向下滚动一屏； 
b 		  # 向上滚动一屏； 
d 		  # 向下滚动半屏； 
h 		  # less的帮助； 
u 		  # 向上洋动半屏； 
w 		  # 可以指定显示哪行开始显示，是从指定数字的下一行显示；比如指定的是6，那就从第7行显示； 
g 		  # 跳到第一行； 
G 		  # 跳到最后一行； 
p 		  # n% 跳到n%，比如 10%，也就是说比整个文件内容的10%处开始显示； 
/pattern  # 搜索pattern ，比如 /MAIL表示在文件中搜索MAIL单词； 
v 		  # 调用vi编辑器； 
q 		  # 退出less 
!command  # 调用SHELL，可以运行命令；比如!ls 显示当前列当前目录下的所有文件； 
```

#### 3.9.3 head

head 是显示一个文件的内容的前多少行：

```bash
$ head -n 10 /etc/profile 
```

#### 3.9.4 tail

tail 是显示一个文件的内容的最后多少行：

```bash
$ tail -n 5 /etc/profile 
```

### 3.10 getopts 参数解析

#### 3.10.1 getopts（shell内置命令）

```bash
$ type getopt
getopt 是 /usr/bin/getopt
$ type getopts 
getopts 是 shell 内建
```

getopts不能直接处理长的选项（如：--prefix=/home等）

关于getopts的使用方法，可以man bash  搜索getopts。

getopts有两个参数，第一个参数是一个字符串，包括字符和“：”，每一个字符都是一个有效的选项，如果字符后面带有“：”，表示这个字符有自己的参数。getopts从命令中获取这些参数，并且删去了“-”，并将其赋值在第二个参数中，如果带有自己参数，这个参数赋值在 `$OPTARG`中。提供getopts的shell内置了 `$OPTARG` 这个变变，getopts修改了这个变量。

这里变量 `$OPTARG` 存储相应选项的参数，而 `$OPTIND` 总是存储原始 `$*` 中下一个要处理的元素位置。`while getopts ":a:bc" opt`   #第一个冒号表示忽略错误；字符后面的冒号表示该选项必须有自己的参数

getopts后面的字符串就是可以使用的选项列表，每个字母代表一个选项，后面带:的意味着选项除了定义本身之外，还会带上一个参数作为选项的值，比如d:在实际的使用中就会对应-d 30，选项的值就是30；getopts字符串中没有跟随:的是开关型选项，不需要再指定值，相当于true/false，只要带了这个参数就是true。如果命令行中包含了没有在getopts列表中的选项，会有警告信息，如果在整个getopts字符串前面也加上个:，就能消除警告信息了。

两个特殊变量：

```bash
$OPTIND     # 特殊变量，option index，会逐个递增, 初始值为1
$OPTARG     # 特殊变量，option argument，不同情况下有不同的值
```

例子：

```typescript
echo $*
while getopts ":a:bc" opt
do
        case $opt in
                a ) echo $OPTARG
                    echo $OPTIND;;
                b ) echo "b $OPTIND";;
                c ) echo "c $OPTIND";;
                ? ) echo "error"
                    exit 1;;
        esac
done
echo $OPTIND
shift $(($OPTIND - 1))
#通过shift $(($OPTIND - 1))的处理，$*中就只保留了除去选项内容的参数，可以在其后进行正常的shell编程处理了。
echo $0
echo $*
```

```bash
$ ./getopts.sh -a 11 -b -c
-a 11 -b -c
11
3
b 4
c 5
5
./getopts.sh
```

#### 3.10.2 getopt（一个外部工具）

具体用用法可以 man getopt

`-o` 表示短选项，两个冒号表示该选项有一个可选参数，可选参数必须紧贴选项，如 `-carg` 而不能是 `-c arg`。

`--long` 表示长选项

例子：

```typescript
#!/bin/bash

# A small example program for using the new getopt(1) program.
# This program will only work with bash(1)
# An similar program using the tcsh(1) script. language can be found
# as parse.tcsh

# Example input and output (from the bash prompt):
# ./parse.bash -a par1 'another arg' --c-long 'wow!*\?' -cmore -b " very long "
# Option a
# Option c, no argument
# Option c, argument `more'
# Option b, argument ` very long '
# Remaining arguments:
# --> `par1'
# --> `another arg'
# --> `wow!*\?'

# Note that we use `"$@"' to let each command-line parameter expand to a
# separate word. The quotes around `$@' are essential!
# We need TEMP as the `eval set --' would nuke the return value of getopt.

#-o表示短选项，两个冒号表示该选项有一个可选参数，可选参数必须紧贴选项
#如-carg 而不能是-c arg
#--long表示长选项
#"$@"在上面解释过
# -n:出错时的信息
# -- ：举一个例子比较好理解：
#我们要创建一个名字为 "-f"的目录你会怎么办？
# mkdir -f #不成功，因为-f会被mkdir当作选项来解析，这时就可以使用
# mkdir -- -f 这样-f就不会被作为选项。

TEMP=`getopt -o ab:c:: --long a-long,b-long:,c-long:: \
     -n 'example.bash' -- "$@"`

if [ $? != 0 ] ; then echo "Terminating..." >&2 ; exit 1 ; fi

# Note the quotes around `$TEMP': they are essential!
#set 会重新排列参数的顺序，也就是改变$1,$2...$n的值，这些值在getopt中重新排列过了
eval set -- "$TEMP"

#经过getopt的处理，下面处理具体选项。

while true ; do
        case "$1" in
                -a|--a-long) echo "Option a" ; shift ;;
                -b|--b-long) echo "Option b, argument \`$2'" ; shift 2 ;;
                -c|--c-long)
                        # c has an optional argument. As we are in quoted mode,
                        # an empty parameter will be generated if its optional
                        # argument is not found.
                        case "$2" in
                                "") echo "Option c, no argument"; shift 2 ;;
                                *)  echo "Option c, argument \`$2'" ; shift 2 ;;
                        esac ;;
                --) shift ; break ;;
                *) echo "Internal error!" ; exit 1 ;;
        esac
done
echo "Remaining arguments:"
for arg do
   echo '--> '"\`$arg'" ;
done
```

```bash
$ ./getopt.sh --b-long abc -a -c33 remain
Option b, argument `abc'
Option a
Option c, argument `33'
Remaining arguments:
--> `remain'
```

### 3.11 只列出目录的各种方法

```bash
# 使用ls –d：
$ ls -d */

# 使用grep结合ls –F：
$ ls -F | grep "/$"
# 当使用-F时，所有的输出项都会添加上一个代表文件类型的字符，如@、 *、 |等。目录对应的是 / 字符。我们用grep只过滤那些以 /$ 作为行尾标记的输出项。

# 使用grep结合ls –l：
$ ls -l | grep "^d"

# 使用find：
$ find . -type d -maxdepth 1 -print
```

### 3.12 使用pushd和popd进行快速定位

使用pushd和popd时，可以无视cd命令。 

```bash
# 压入并切换路径：
$ pushd /var/www

# 再压入下一个目录路径：
$ pushd /usr/src

# 用下面的命令查看栈内容：
$ dirs
/usr/src /var/www ~ /usr/share /etc
0 			1 	  2 	3 		4

# 当你想切换到列表中任意一个路径时，将每条路径从0到n进行编号，然后使用你希望切换到的路径编号，例如：
$ pushd +3
# 这条命令会将栈进行翻转并切换到目录 /use/share。

# 要删除最后添加的路径并把当前目录更改为上一级目录，可以使用以下命令：
$ popd
# 用popd +num可以从列表中移除特定的路径。num是从左到右，从0到n开始计数的。
```

### 3.13 tree打印目录树

```bash
# 重点标记出匹配某种样式的文件：
$ tree PATH -P "*.sh" # 用一个目录路径代替PATH
|-- home
| |-- packtpub
| | `-- automate.sh

# 重点标记出除符合某种样式之外的那些文件：
$ tree path -I PATTERN

# 使用 -h选项同时打印出文件和目录的大小：
$ tree -h
```

## 4 让文件飞 

### 4.1 正则表达式

| 正则表达式  | 描述                     | 示例                                       |
| ------ | ---------------------- | :--------------------------------------- |
| ^      | 行起始标记                  | ^tux 匹配以tux起始的行                          |
| $      | 行尾标记                   | tux$ 匹配以tux结尾的行                          |
| .      | 匹配任意一个字符               | Hack.匹配Hackl和Hacki，它只能匹配单个字符             |
| [ ]    | 匹配包含在 [字符] 之中的任意一个字符   | coo[kl] 匹配cook或cool                      |
| [ ^ ]  | 匹配除 ` [^字符]` 之外的任意一个字符 | `9[^01]`匹配92、 93，但是不匹配91或90              |
| [ - ]  | 匹配 [ ] 中指定范围内的任意一个字符   | [1-5] 匹配从1～5的任意一个数字                      |
| ?      | 匹配之前的项1次或0次            | colou?r 匹配color或colour，但是不能匹配colouur     |
| +      | 匹配之前的项1次或多次            | Rollno-9+ 匹配Rollno-99、Rollno-9，但是不能匹配Rollno- |
| *      | 匹配之前的项0次或多次            | co*l 匹配cl、 col、 coool等                   |
| ( )    | 创建一个用于匹配的子串            | ma(tri)?x 匹配max或maxtrix                  |
| {n}    | 匹配之前的项n次               | [0-9]{3} 匹 配 任 意 一 个 三 位 数 ， [0-9]{3} 可 以 扩 展 为`[0-9][0-9][0-9]` |
| {n, }  | 之前的项至少需要匹配n次           | [0-9]{2,} 匹配任意一个两位或更多位的数字                |
| {n, m} | 指定之前的项所必需匹配的最小次数和最大次数  | [0-9]{2,5} 匹配从两位数到五位数之间的任意一个数字           |
| \|     | 交替——匹配 \| 两边的任意一项      | Oct  (1st \| 2nd) 匹配Oct 1st或Oct 2nd      |
| \      | 转义符可以将上面介绍的特殊字符进行转义    | `a\.b` 匹配a.b，但不能匹配ajb。通过在 . 之间加上前缀 \ ，从而忽略了 . 的特殊意义 |

| 正则表达式       | 描述            |
| ----------- | ------------- |
| [:alnum:]   | 所有的字母和数字      |
| [:alpha:]   | 所有字母          |
| [:blank:]   | 水平制表符，空白等     |
| [:cntrl:]   | 所有控制字符        |
| [:digit:]   | 所有的数字         |
| `[:graph:]` | 所有可打印字符，不包括空格 |
| [:lower:]   | 所有的小写字符       |
| [:print:]   | 所有可打印字符，包括空格  |
| [:punct:]   | 所有的标点字符       |
| [:space:]   | 所有的横向或纵向的空白   |
| [:upper:]   | 所有大写字母        |

### 4.2 grep命令

```bash
-a				# 不要忽略二进制的数据。
-A<显示列数> 	 # 除了显示符合范本样式的那一列之外，并显示该列之后的内容。
-b				# 在显示符合范本样式的那一列之前，标示出该列第一个字符的位编号。
-B<显示列数>	 # 除了显示符合范本样式的那一列之外，并显示该列之前的内容。
-c				# 计算符合范本样式的列数。
-C<显示列数>或-<显示列数>	# 除了显示符合范本样式的那一列之外，并显示该列之前后的内容。
-d<进行动作>	 # 当指定要查找的是目录而非文件时，必须使用这项参数，否则grep指令将回报信息并停止动作。
-e<范本样式>	 # 指定字符串做为查找文件内容的范本样式。
-E				# 将范本样式为延伸的普通表示法来使用。
-f<范本文件>	 # 指定范本文件，其内容含有一个或多个范本样式，让grep查找符合范本条件的文件内容，格式为每列一个范本样式。
-F				# 将范本样式视为固定字符串的列表。
-G				# 将范本样式视为普通的表示法来使用。
-h				# 在显示符合范本样式的那一列之前，不标示该列所属的文件名称。
-H				# 在显示符合范本样式的那一列之前，表示该列所属的文件名称。
-i				# 忽略字符大小写的差别。
-l				# 列出文件内容符合指定的范本样式的文件名称。
-L				# 列出文件内容不符合指定的范本样式的文件名称。
-n				# 在显示符合范本样式的那一列之前，标示出该列的列数编号。
-q				# 不显示任何信息。
-r				# 此参数的效果和指定“-d recurse”参数相同。
-s				# 不显示错误信息。
-v				# 反转查找。
-V				# 显示版本信息。
-w				# 只显示全字符合的列。
-x				# 只显示全列符合的列。
-o 				# 只输出文件中匹配到的部分。
```

```bash
# 单个grep命令也可以对多个文件进行搜索：
$ grep "match_text" file1 file2 file3 ...

# grep -E选项——这意味着使用扩展（extended）正则表达式：
$ grep -E "[a-z]+" filename
# 或者
$ egrep "[a-z]+" filename

# 只输出文件中匹配到的文本部分，可以使用选项 -o：
$ echo this is a line. | egrep -o "[a-z]+\."
line.

# 要打印除包含match_pattern行之外的所有行，选项-v可以将匹配结果进行反转（invert）。可使用：
$ grep -v match_pattern file

# 统计文件或文本中包含匹配字符串的行数：
$ grep -c "text" filename
10
# 需要注意的是-c只是统计匹配行的数量，并不是匹配的次数。。例如：
$ echo -e "1 2 3 4\nhello\n5 6" | egrep -c "[0-9]"
2

# 要文件中统计匹配项的数量，可以使用下面的技巧：
$ echo -e "1 2 3 4\nhello\n5 6" | egrep -o "[0-9]" | wc -l
6

# 打印模式匹配所位于的字符或字节偏移：
$ echo gnu is not unix | grep -b -o "not"
7:not
# 选项 -b总是和 -o配合使用。

# 搜索多个文件并找出匹配文本位于哪一个文件中：
$ grep -l linux sample1.txt sample2.txt
sample1.txt
sample2.txt
# 和-l相反的选项是-L，它会返回一个不匹配的文件列表。

# grep的选项-R和-r功能一样。

# 忽略样式中的大小写
$ echo hello world | grep -i "HELLO"
hello

# grep匹配多个样式
$ echo this is a line of text | grep -e "this" -e "line" -o
this
line

# 在grep搜索中指定或排除文件
$ grep "main()" . -r --include *.{c,cpp} 		# 目录中递归搜索所有的 .c和 .cpp文件
# 如果需要排除目录，可以使用 --exclude-dir选项。
# 如果需要从文件中读取所需排除的文件列表，使用--exclude-from FILE。

# 使用0值字节作为后缀的grep与xargs，为了指明输入的文件名是以0值字节（\0）作为终止符，需要在xargs中使用-0。
# grep使用-Z选项输出以0值字节作为终结符的文件名（\0）。
$ grep "test" file* -lZ | xargs -0 rm
# -Z通常和 -l结合使用。

# grep的静默输出
# grep的静默选项（-q）来实现。在静默模式中， grep命令不会输出任何内容。它仅是运行命令，然后根据命令执行成功与否返回退出状态。

# 要打印匹配某个结果之后的3行，使用 -A选项：
$ seq 10 | grep 5 -A 3
5
6
7
8

# 要打印匹配某个结果之前的3行，使用 -B选项：
$ seq 10 | grep 5 -B 3
2
3
4
5

# 要打印匹配某个结果之前以及之后的3行，使用-C选项：
$ seq 10 | grep 5 -C 3
2
3
4
5
6
7
8

# 如果有多个匹配，那么使用--作为各部分之间的定界符：
$ echo -e "a\nb\nc\na\nb\nc" | grep a -A 1
a
b
--
a
b
```

### 4.3 cut 按列切分文件

```bash
# 显示第2列和第3列：
$ cut -f 2,3 filename

# 
```

| 记法    | 范围                                |
| ----- | --------------------------------- |
| N -   | 从第N个字节，字符或字段到行尾                   |
| N - M | 从第N个字节，字符或字段到第M个（包括第M个在内）字节、字符或字段 |
| - M   | 第1个字节，字符或字段到第M个（包括第M个在内）字节、字符或字段  |

结合下列选项将字段指定为某个范围内的字节或字符 ：

* -b ：表示字节
* -c ：表示字符
* -f ：用于定义字段

```bash
$ cat range_fields.txt
abcdefghijklmnopqrstuvwxyz
abcdefghijklmnopqrstuvwxyz
abcdefghijklmnopqrstuvwxyz
abcdefghijklmnopqrstuvwxy

# 打印第1个到第5个字符：
$ cut -c1-5 range_fields.txt
abcde
abcde
abcde
abcde
# 打印前2个字符：
$ cut range_fields.txt -c -2
ab
ab
ab
ab
```

### 4.4 sed 进行文本替换 

选项：

```bash
-e <script>			# 以选项中指定的script来处理输入的文本文件
-f <script>			# 以选项中指定的script文件来处理输入的文本文件
-h					# 显示帮助
-n					# 仅显示script处理后的结果
-V					# 显示版本信息
```

命令：

```bash
a\ 			# 在当前行下面插入文本。
i\ 			# 在当前行上面插入文本。
c\ 			# 把选定的行改为新的文本。 
d 			# 删除，删除选择的行。 
D 			# 删除模板块的第一行。
s 			# 替换指定字符 h 拷贝模板块的内容到内存中的缓冲区。 
H 			# 追加模板块的内容到内存中的缓冲区。 
g 			# 获得内存缓冲区的内容，并替代当前模板块中的文本。 
G 			# 获得内存缓冲区的内容，并追加到当前模板块文本的后面。 
l 			# 列表不能打印字符的清单。 
n 			# 读取下一个输入行，用下一个命令处理新的行而不是用第一个命令。 
N 			# 追加下一个输入行到模板块后面并在二者间嵌入一个新行，改变当前行号码。 
p 			# 打印模板块的行。 P(大写) 打印模板块的第一行。 
q 			# 退出Sed。 
b lable 	# 分支到脚本中带有标记的地方，如果分支不存在则分支到脚本的末尾。 
r file 		# 从file中读行。 
t label 	# if分支，从最后一行开始，条件一旦满足或者T，t命令，将导致分支到带有标号的命令处，或者到脚本的末尾。 
T label 	# 错误分支，从最后一行开始，一旦发生错误或者T，t命令，将导致分支到带有标号的命令处，或者到脚本的末尾。
w file 		# 写并追加模板块到file末尾。 
W file 		# 写并追加模板块的第一行到file末尾。 
! 			# 表示后面的命令对所有没有被选定的行发生作用。 
= 			# 打印当前行号码。 
# 把注释扩展到下一个换行符以前。
```

sed 替换标记：

```bash
g 		# 表示行内全面替换。
p 		# 表示打印行。 
w 		# 表示把行写入一个文件。 
x 		# 表示互换模板块中的文本和缓冲区中的文本。 
y 		# 表示把一个字符翻译为另外的字符（但是不用于正则表达式） 
\1 		# 子串匹配标记 
& 		# 已匹配字符串标记
```

sed 元字符集：

```bash
^ 		# 匹配行开始，如：/^sed/匹配所有以sed开头的行。
$ 		# 匹配行结束，如：/sed$/匹配所有以sed结尾的行。 
. 		# 匹配一个非换行符的任意字符，如：/s.d/匹配s后接一个任意字符，最后是d。 
* 		# 匹配0个或多个字符，如：/*sed/匹配所有模板是一个或多个空格后紧跟sed的行。 
[] 		# 匹配一个指定范围内的字符，如/[ss]ed/匹配sed和Sed。 
[^] 	# 匹配一个不在指定范围内的字符，如：/[^A-RT-Z]ed/ 匹配不包含A-R和T-Z的一个字母开头，紧跟ed的行。
\(..\) 	# 匹配子串，保存匹配的字符，如s/(love)able/\1rs，loveable被替换成lovers。 
& 		# 保存搜索字符用来替换其他字符，如s/love/**&**/，love这成**love**。 
\< 	 	# 匹配单词的开始，如:/\<love/匹配包含以开头的单词的行。
\>		# 匹配单词的结束，如:/love\>/匹配包含以love结尾的单词的行。
x\{m\} 		# 重复字符x，m次，如：/0\{5\}/匹配包含5个0的行。 
x\{m,\} 	# 重复字符x，至少m次，如：/0\{5,\}/匹配至少有5个0的行。 
x\{m,n\} 	# 重复字符x，至少m次，不多于n次，如：/0\{5,10\}/匹配5~10个0的行。
```

```bash
# sed可以替换给定文本中的字符串。
$ sed 's/pattern/replace_string/' file

# 如果需要在替换的同时保存更改，可以使用-i选项
$ sed -i 's/text/replace/' file

# 后缀/g意味着sed会替换每一处匹配。但是有时候我们只需要从第n处匹配开始替换。对此，可以使用/Ng选项。
$ sed 's/pattern/replace_string/g' file
$ echo thisthisthisthis | sed 's/this/THIS/2g'
thisTHISTHISTHIS
$ echo thisthisthisthis | sed 's/this/THIS/3g'
thisthisTHISTHIS

# 字符/在sed中被作为定界符使用。我们可以像下面一样使用任意的定界符：
$ sed 's:text:replace:g'
$ sed 's|text|replace|g'
# 当定界符出现在样式内部时，我们必须用前缀\对它进行转义：
$ sed 's|te\|xt|replace|g'
# \|是一个出现在样式内部并经过转义的定界符。

# 移除空白行
$ sed '/^$/d' file

# 已匹配字符串标记（&）在sed中，我们可以用 &标记匹配样式的字符串，这样就能够在替换字符串时使用已匹配的内容。
$ echo this is an example | sed 's/\w\+/[&]/g'
[this] [is] [an] [example]
# 正则表达式 \w\+ 匹配每一个单词，然后我们用[&]替换它。 & 对应于之前所匹配到的单词。

# 组合多个表达式
$ sed 'expression' | sed 'expression'
# 它等价于
$ sed 'expression; expression'
# 或者
$ sed -e 'expression' -e expression'

# 引用。sed表达式通常用单引号来引用。双引号会通过对表达式求值来对其进行扩展。
$ text=hello
$ echo hello world | sed "s/$text/HELLO/"
HELLO world
```

### 4.5 awk 进行高级文本处理

#### 4.5.1 awk 常用命令选项

* `-F fs`		fs指定输入分隔符，fs可以是字符串或正则表达式，如`-F:`
  * `-v var=value`   赋值一个用户定义变量，将外部变量传递给awk 
* `-f scripfile`      从脚本文件中读取awk命令 
* `-m[fr] val`          对val值设置内在限制，`-mf` 选项限制分配给val的最大块数目；`-mr` 选项限制记录的最大数目。这两个功能是Bell实验室版awk的扩展功能，在标准awk中不适用。

#### 4.5.2 awk 脚本基本结构

```bash
$ awk 'BEGIN{ print "start" } pattern{ commands } END{ print "end" }' file
# 一个awk脚本通常由：BEGIN语句块、能够使用模式匹配的通用语句块、END语句块3部分组成，这三个部分是可选的。任意一个部分都可以不出现在脚本中，脚本通常是被单引号或双引号中，例如：
$ awk 'BEGIN{ i=0 } { i++ } END{ print i }' filename 
$ awk "BEGIN{ i=0 } { i++ } END{ print i }" filename


```

#### 4.5.3 awk 的工作原理

```bash
$ awk 'BEGIN{ commands } pattern{ commands } END{ commands }'
```

* 第一步：执行 `BEGIN{ commands }` 语句块中的语句
* 第二步：从文件或标准输入(stdin)读取一行，然后执行 `pattern{ commands }` 语句块，它逐行扫描文件，从第一行到最后一行重复这个过程，直到文件全部被读取完毕
* 第三步：当读至输入流末尾时，执行 `END{ commands }` 语句块

#### 4.5.4 awk 内置变量（预定义变量）

**说明：**  `[A][N][P][G]`表示第一个支持变量的工具，`[A]=awk`、`[N]=nawk`、`[P]=POSIXawk`、`[G]=gawk`

```bash
$n 				# 当前记录的第n个字段，比如n为1表示第一个字段，n为2表示第二个字段。 
$0 				# 这个变量包含执行过程中当前行的文本内容。 
[N] ARGC 		# 命令行参数的数目。 
[G] ARGIND 		# 命令行中当前文件的位置（从0开始算）。 
[N] ARGV 		# 包含命令行参数的数组。 
[G] CONVFMT 	# 数字转换格式（默认值为%.6g）。 
[P] ENVIRON 	# 环境变量关联数组。 
[N] ERRNO 		# 最后一个系统错误的描述。 
[G] FIELDWIDTHS # 字段宽度列表（用空格键分隔）。 
[A] FILENAME 	# 当前输入文件的名。 
[P] FNR 		# 同NR，但相对于当前文件。 
[A] FS 			# 字段分隔符（默认是任何空格）。 
[G] IGNORECASE 	# 如果为真，则进行忽略大小写的匹配。 
[A] NF 			# 表示字段数，在执行过程中对应于当前的字段数。 
[A] NR 			# 表示记录数，在执行过程中对应于当前的行号。 
[A] OFMT 		# 数字的输出格式（默认值是%.6g）。 
[A] OFS 		# 输出字段分隔符（默认值是一个空格）。 
[A] ORS 		# 输出记录分隔符（默认值是一个换行符）。 
[A] RS 			# 记录分隔符（默认是一个换行符）。 
[N] RSTART 		# 由match函数所匹配的字符串的第一个位置。 
[N] RLENGTH 	# 由match函数所匹配的字符串的长度。 
[N] SUBSEP 		# 数组下标分隔符（默认值是34）。
```

```bash
$ echo -e "line1 f2 f3nline2 f4 f5nline3 f6 f7" | awk '{print "Line No:"NR", No of fields:"NF, "$0="$0, "$1="$1, "$2="$2, "$3="$3}' 
Line No:1, No of fields:3 $0=line1 f2 f3 $1=line1 $2=f2 $3=f3 
Line No:2, No of fields:3 $0=line2 f4 f5 $1=line2 $2=f4 $3=f5 
Line No:3, No of fields:3 $0=line3 f6 f7 $1=line3 $2=f6 $3=f7

# 使用print $NF可以打印出一行中的最后一个字段，使用$(NF-1)则是打印倒数第二个字段，其他以此类推：
$ echo -e "line1 f2 f3n line2 f4 f5" | awk '{print $NF}' 
f3
f5
$ echo -e "line1 f2 f3n line2 f4 f5" | awk '{print $(NF-1)}' 
f2 
f4

# 打印每一行的第二和第三个字段：
$ awk '{ print $2,$3 }' filename

# 统计文件中的行数：
$ awk 'END{ print NR }' filename

# 一个每一行中第一个字段值累加的例子：
$ seq 5 | awk 'BEGIN{ sum=0; print "总和：" } { print $1"+"; sum+=$1 } END{ print "等于"; print sum }' 
总和： 
1+ 
2+ 
3+ 
4+ 
5+ 
等于 
15
```

#### 4.5.5 将外部变量值传递给awk 

借助 `-v` 选项，可以将外部值（并非来自stdin）传递给awk：

```bash
$ VAR=10000 
$ echo | awk -v VARIABLE=$VAR '{ print VARIABLE }'

# 另一种传递外部变量方法：
$ var1="aaa" 
$ var2="bbb" 
$ echo | awk '{ print v1,v2 }' v1=$var1 v2=$var2

# 当输入来自于文件时使用：
$ awk '{ print v1,v2 }' v1=$var1 v2=$var2 filename
```

#### 4.5.6 awk 运算与判断

**算数运算符：**

| 运算符   | 描述            |
| ----- | ------------- |
| + -   | 加、减           |
| * / & | 乘，除与求余        |
| + - ! | 一元加、减和逻辑非     |
| ^ *** | 求幂            |
| ++ -- | 增加或减少，作为前缀或后缀 |

```bash
$ awk 'BEGIN{a="b";print a++,++a;}' 
0 2
```

<p style="color=red">**注意：**所有用作算术运算符进行操作，操作数自动转为数值，所有非数值都变为0</p>

**赋值运算符：**

| 运算符                     | 描述   |
| ----------------------- | ---- |
| = += -= *= /= %= ^= **= | 赋值语句 |

**逻辑运算符：**

| 运算符  | 描述   |
| ---- | ---- |
| \|\| | 逻辑或  |
| &&   | 逻辑与  |

```bash
$ awk 'BEGIN{a=1;b=2;print (a>5 && b<=2),(a>5 || b<=2);}'
0 1
```

**正则运算符：**

| 运算符   | 描述               |
| ----- | ---------------- |
| ~  ~! | 匹配正则表达式和不匹配正则表达式 |

```bash
$ awk 'BEGIN{a="100testa";if(a ~ /^100*/){print "ok";}}' 
ok
```

**关系运算符：**

| 运算符                  | 描述    |
| -------------------- | ----- |
| <  <=  >  >=  !=  == | 关系运算符 |

```bash
$ awk 'BEGIN{a=11;if(a >= 9){print "ok";}}' 
ok
```

<p style="color=red">**注意：**>  < 可以作为字符串比较，也可以用作数值比较，关键看操作数如果是字符串就会转换为字符串比较。两个都为数字才转为数值比较。字符串比较：按照ASCII码顺序比较。</p>

**其他运算符：**

| 运算符  | 描述         |
| ---- | ---------- |
| $    | 字段引用       |
| 空格   | 字符串连接符     |
| ? :  | C条件表达式     |
| in   | 数组中是否存在某键值 |

```bash
$ awk 'BEGIN{a="b";print a=="b"?"ok":"err";}' 
ok 

$ awk 'BEGIN{a="b";arr[0]="b";arr[1]="c";print (a in arr);}' 
0 

$ awk 'BEGIN{a="b";arr[0]="b";arr["b"]="c";print (a in arr);}' 
1
```

运算级优先级表：

| 级别   | 运算符                                      | 说明              |
| ---- | ---------------------------------------- | --------------- |
| 1    | =, +=, -=, *=, /=, %=, &=, ^=, \|=, <<=, >>= | 赋值、运算           |
| 2    | \|\|                                     | 逻辑或             |
| 3    | &&                                       | 逻辑与             |
| 4    | \|                                       | 按位或             |
| 5    | ^                                        | 按位异或            |
| 6    | &                                        | 按位与             |
| 7    | ==, !=                                   | 等于、不等于          |
| 8    | <=, >=, <, >                             | 小于等于、大于等于、小于、大于 |
| 9    | <<, >>                                   | 按位左移，按位右移       |
| 10   | +, -                                     | 加、减             |
| 11   | *, /, %                                  | 乘、除、取模          |
| 12   | !, ~                                     | 逻辑非、按位取反或补码     |
| 13   | -, +                                     | 正、负             |

级别越高越优先

#### 4.5.7 awk 高级输入输出

**读取下一条记录：**

awk中 `next` 语句使用：在循环逐行匹配，如果遇到 `next`，就会跳过当前行，直接忽略下面语句。而进行下一行匹配。net语句一般用于多行合并：

```bash
$ cat text.txt 
a 
b 
c 
d 
e 

$ awk 'NR%2==1{next}{print NR,$0;}' text.txt 
2 b 
4 d 
```

当记录行号除以2余1，就跳过当前行。下面的 `print NR,$0` 也不会执行。下一行开始，程序有开始判断 `NR%2` 值。这个时候记录行号是 `：2`  ，就会执行下面语句块：`'print NR,$0'` 

分析发现需要将包含有 “web” 行进行跳过，然后需要将内容与下面行合并为一行： 

```bash
$ cat text.txt 
web01[192.168.2.100] 
httpd 		ok 
tomcat 		ok 
sendmail 	ok 
web02[192.168.2.101] 
httpd 		ok 
postfix 	ok 
web03[192.168.2.102] 
mysqld 		ok 
httpd 		ok 
0 

$ awk '/^web/{T=$0;next;}{print T":t"$0;}' test.txt 
web01[192.168.2.100]: httpd 		ok 
web01[192.168.2.100]: tomcat 		ok 
web01[192.168.2.100]: sendmail 		ok 
web02[192.168.2.101]: httpd 		ok 
web02[192.168.2.101]: postfix 		ok 
web03[192.168.2.102]: mysqld 		ok 
web03[192.168.2.102]: httpd 		ok
```

**简单地读取一条记录：**

`awk getline` 用法：输出重定向需用到 `getline函数`。getline从标准输入、管道或者当前正在处理的文件之外的其他输入文件获得输入。它负责从输入获得下一行的内容，并给NF,NR和FNR等内建变量赋值。<p style="color=red">如果得到一条记录，getline函数返回1，如果到达文件的末尾就返回0，如果出现错误，例如打开文件失败，就返回-1。 </p>

> getline语法：getline var，变量var包含了特定行的内容。 

awk getline从整体上来说，用法说明：

* **当其左右<p style="color=red">无</p>重定向符 `|` 或 `<` 时：**getline作用于当前文件，读入当前文件的第一行给其后跟的变量 `var` 或 `$0`（无变量），应该注意到，由于awk在处理getline之前已经读入了一行，所以getline得到的返回结果是隔行的。
* **当其左右<p style="color=red">有</p>重定向符 `|` 或 `<` 时：**getline则作用于定向输入文件，由于该文件是刚打开，并没有被awk读入一行，只是getline读入，那么getline返回的是该文件的第一行，而不是隔行。

```bash
# 执行linux的date命令，并通过管道输出给getline，然后再把输出赋值给自定义变量out，并打印它：
$ awk 'BEGIN{ "date" | getline out; print out }' test

# 执行shell的date命令，并通过管道输出给getline，然后getline从管道中读取并将输入赋值给out，split函数把变量out转化成数组mon，然后打印数组mon的第二个元素：
$ awk 'BEGIN{ "date" | getline out; split(out,mon); print mon[2] }' test

# 命令ls的输出传递给geline作为输入，循环使getline从ls的输出中读取一行，并把它打印到屏幕。这里没有输入文件，因为BEGIN块在打开输入文件前执行，所以可以忽略输入文件。
$ awk 'BEGIN{ while( "ls" | getline) print }'
```

**关闭文件：**

awk中允许在程序中关闭一个输入或输出文件，方法是使用awk的close语句。

```typescript
close("filename")
```

filename可以是getline打开的文件，也可以是stdin，包含文件名的变量或者getline使用的确切命令。或一个输出文件，可以是stdout，包含文件名的变量或使用管道的确切命令。

**输出到一个文件：**

```bash
$ echo | awk '{printf("hello word!n") > "datafile"}'
或 
$ echo | awk '{printf("hello word!n") >> "datafile"}'
```

#### 4.5.8 设置字段定界符

<p style="color=red">默认的字段定界符是空格</p>，可以使用 `-F "定界符"` 明确指定一个定界符：

```bash
$ awk -F: '{ print $NF }' /etc/passwd 
或 
$ awk 'BEGIN{ FS=":" } { print $NF }' /etc/passwd
```

在 `BEGIN语句块` 中则可以用 `OFS=“定界符”` 设置输出字段的定界符。

#### 4.5.9 流程控制语句

**条件判断语句：**

```bash
$ awk 'BEGIN{ 
	test=100; 
	if(test>90){ 
		print "very good"; 
	} else if(test>60){ 
		print "good"; 
	} else{ 
		print "no pass"; 
	} 
}' 

very good
```

每条命令语句后面可以用 `;` <p style="color=red">分号</p>结尾。

**循环语句：**

while语句：

```bash
$ awk 'BEGIN{ 
	test=100; 
	total=0; 
	while(i<=test){ 
		total+=i; i++; 
	} 
	print total; 
}' 

5050
```

for循环：

格式1：

```bash
$ awk 'BEGIN{ 
	for(k in ENVIRON){ 
		print k"="ENVIRON[k]; 
	} 
}' 
TERM=linux 
G_BROKEN_FILENAMES=1 
SHLVL=1 
pwd=/root/text 
... 
logname=root 
HOME=/root 
SSH_CLIENT=192.168.1.21 53087 22
```

**注：**ENVIRON是awk常量，是子典型数组。

格式2：

```bash
$ awk 'BEGIN{ 
	total=0; 
	for(i=0;i<=100;i++){ 
		total+=i; 
	} 
	print total; 
}' 

5050
```

do循环：

```bash
$ awk 'BEGIN{ 
	total=0; 
	i=0; 
	do {
		total+=i;i++;
	} while(i<=100) 
	print total; 
}' 

5050
```

**其他语句：**

* **break**  		当 break 语句用于 while 或 for 语句时，导致退出程序循环
* **continue**       当 continue 语句用于 while 或 for 语句时，使程序循环移动到下一个迭代
* **next**               能能够导致读入下一个输入行，并返回到脚本的顶部。这可以避免对当前输入行执行其他的操作过程
* **exit**                 语句使主输入循环退出并将控制转移到END,如果END存在的话。如果没有定义END规则，或在END中应用exit语句，则终止脚本的执行

#### 4.5.10 数组应用

```bash
# 得到数组长度
$ awk 'BEGIN{info="it is a test";lens=split(info,tA," ");print length(tA),lens;}' 
4 4
# length返回字符串以及数组长度，split进行分割字符串为数组，也会返回分割得到数组长度。

# asort对数组进行排序，返回数组长度。
$ awk 'BEGIN{info="it is a test";split(info,tA," ");print asort(tA);}' 
4

# 输出数组内容（无序，有序输出）：
$ awk 'BEGIN{info="it is a test";split(info,tA," ");for(k in tA){print k,tA[k];}}' 
4 test 
1 it 
2 is 
3 a 

# for…in 输出，因为数组是关联数组，默认是无序的。所以通过 for…in 得到是无序的数组。如果需要得到有序数组，需要通过下标获得。
$ awk 'BEGIN{info="it is a test";tlen=split(info,tA," ");for(k=1;k<=tlen;k++){print k,tA[k];}}' 
1 it 
2 is 
3 a 
4 test
# 注意：数组下标是从1开始，与C数组不一样。

# 判断键值存在以及删除键值：
$ awk 'BEGIN{tB["a"]="a1";tB["b"]="b1";if( "c" in tB){print "ok";};for(k in tB){print k,tB[k];}}' 
a a1 
b b1
# 删除键值： 
$ awk 'BEGIN{tB["a"]="a1";tB["b"]="b1";delete tB["a"];for(k in tB){print k,tB[k];}}' 
b b1

# 二维、多维数组使用
$ awk 'BEGIN{ 
	for(i=1;i<=9;i++){ 
		for(j=1;j<=9;j++){ 
			tarr[i,j]=i*j; 
			print i,"*",j,"=",tarr[i,j]; 
		} 
	} 
}' 
1 * 1 = 1 
1 * 2 = 2 
1 * 3 = 3 
1 * 4 = 4 
1 * 5 = 5 
1 * 6 = 6 
... 
9 * 6 = 54 
9 * 7 = 63 
9 * 8 = 72 
9 * 9 = 81
# 可以通过array[k,k2]引用获得数组内容。

# 另一种方法：
$ awk 'BEGIN{ 
	for(i=1;i<=9;i++){ 
		for(j=1;j<=9;j++){ 
			tarr[i,j]=i*j; 
		} 
	} 
	for(m in tarr){ 
		split(m,tarr2,SUBSEP); print tarr2[1],"*",tarr2[2],"=",tarr[m]; 
	} 
}'
```

#### 4.5.11 内置函数

awk内置函数，主要分以下3种类似：算数函数、字符串函数、其它一般函数、时间函数。

**算数函数：**

| 格式              | 描述                                       |
| --------------- | ---------------------------------------- |
| atan2( y, x )   | 返回 y/x 的反正切                              |
| cos( x )        | 返回 x 的余弦；x 是弧度                           |
| sin( x )        | 返回 x 的正弦；x 是弧度                           |
| exp( x )        | 返回 x 幂函数                                 |
| log( x )        | 返回 x 的自然对数                               |
| sqrt( x )       | 返回 x 平方根                                 |
| int( x )        | 返回 x 的截断至整数的值                            |
| rand( )         | 返回任意数字 n，其中 0 <= n < 1                   |
| srand( [expr] ) | 将 rand 函数的种子值设置为 Expr 参数的值，或如果省略 Expr 参数则使用某天的时间。返回先前的种子值。 |

```bash
$ awk 'BEGIN{OFMT="%.3f";fs=sin(1);fe=exp(10);fl=log(10);fi=int(3.1415);print fs,fe,fl,fi;}' 
0.841 22026.466 2.303 3

# 获得随机数：
$ awk 'BEGIN{srand();fr=int(100*rand());print fr;}' 
78 
$ awk 'BEGIN{srand();fr=int(100*rand());print fr;}' 
31 
$ awk 'BEGIN{srand();fr=int(100*rand());print fr;}' 
41 
```

**字符串函数：**

| 格式                                  | 描述                                       |
| ----------------------------------- | ---------------------------------------- |
| gsub( Ere, Repl, [ In ] )           | 除了正则表达式所有具体值被替代这点，它和 sub 函数完全一样地执行       |
| sub( Ere, Repl, [ In ] )            | 用 Repl 参数指定的字符串替换 In 参数指定的字符串中的由 Ere 参数指定的扩展正则表达式的第一个具体值。sub 函数返回替换的数量。出现在 Repl 参数指定的字符串中的 &（和符号）由 In 参数指定的与 Ere 参数的指定的扩展正则表达式匹配的字符串替换。如果未指定 In 参数，缺省值是整个记录（$0 记录变量） |
| index( String1, String2 )           | 在由 String1 参数指定的字符串（其中有出现 String2 指定的参数）中，返回位置，从 1 开始编号。如果 String2 参数不在 String1 参数中出现，则返回 0（零） |
| length [(String)]                   | 返回 String 参数指定的字符串的长度（字符形式）。如果未给出 String 参数，则返回整个记录的长度（$0 记录变量） |
| blength [(String)]                  | 返回 String 参数指定的字符串的长度（以字节为单位）。如果未给出 String 参数，则返回整个记录的长度（$0 记录变量） |
| substr( String, M, [ N ] )          | 返回具有 N 参数指定的字符数量子串。子串从 String 参数指定的字符串取得，其字符以 M 参数指定的位置开始。M 参数指定为将 String 参数中的第一个字符作为编号 1。如果未指定 N 参数，则子串的长度将是 M 参数指定的位置到 String 参数的末尾 的长度 |
| match( String, Ere )                | 在 String 参数指定的字符串（Ere 参数指定的扩展正则表达式出现在其中）中返回位置（字符形式），从 1 开始编号，或如果 Ere 参数不出现，则返回 0（零）。RSTART 特殊变量设置为返回值。RLENGTH 特殊变量设置为匹配的字符串的长度，或如果未找到任何匹配，则设置为 -1（负一） |
| split( String, A, [Ere] )           | 将 String 参数指定的参数分割为数组元素 A[1], A[2], . . ., A[n]，并返回 n 变量的值。此分隔可以通过 Ere 参数指定的扩展正则表达式进行，或用当前字段分隔符（FS 特殊变量）来进行（如果没有给出 Ere 参数）。除非上下文指明特定的元素还应具有一个数字值，否则 A 数组中的元素用字符串值来创建 |
| tolower( String )                   | 返回 String 参数指定的字符串，字符串中每个大写字符将更改为小写。大写和小写的映射由当前语言环境的 LC_CTYPE 范畴定义 |
| toupper( String )                   | 返回 String 参数指定的字符串，字符串中每个小写字符将更改为大写。大写和小写的映射由当前语言环境的 LC_CTYPE 范畴定义 |
| sprintf(Format, Expr, Expr, . . . ) | 根据 Format 参数指定的 printf 子例程格式字符串来格式化 Expr 参数指定的表达式并返回最后生成的字符串 |

**注：**Ere都可以是正则表达式。

```bash
# gsub,sub使用 
$ awk 'BEGIN{info="this is a test2010test!";gsub(/[0-9]+/,"!",info);print info}' 
this is a test!test!

# 查找字符串（index使用） 
$ awk 'BEGIN{info="this is a test2010test!";print index(info,"test")?"ok":"no found";}' 
ok

# 正则表达式匹配查找(match使用） 
$ awk 'BEGIN{info="this is a test2010test!";print match(info,/[0-9]+/)?"ok":"no found";}' 
ok

# 截取字符串(substr使用） 
$ awk 'BEGIN{info="this is a test2010test!";print substr(info,4,10);}' 
s is a tes

# 字符串分割（split使用） 
$ awk 'BEGIN{info="this is a test";split(info,tA," ");print length(tA);for(k in tA){print k,tA[k];}}' 
4 
4 test 
1 this 
2 is 
3 a
```

**格式化字符串输出（sprintf使用）** 

格式化字符串格式：

| 格式   | 描述               |
| ---- | ---------------- |
| %d   | 十进制有符号整数         |
| %u   | 十进制无符号整数         |
| %f   | 浮点数              |
| %s   | 字符串              |
| %c   | 单个字符             |
| %p   | 指针的值             |
| %e   | 指数形式的浮点数         |
| %x   | %X 无符号以十六进制表示的整数 |
| %o   | 无符号以八进制表示的整数     |
| %g   | 自动选择合适的表示法       |

```bash
$ awk 'BEGIN{n1=124.113;n2=-1.224;n3=1.2345; printf("%.2f,%.2u,%.2g,%X,%on",n1,n2,n3,n1,n1);}' 
124.11,18446744073709551615,1.2,7C,174
```

**一般函数：**

| 格式                                 | 描述                                       |
| ---------------------------------- | ---------------------------------------- |
| close( Expression )                | 用同一个带字符串值的 Expression 参数来关闭由 print 或 printf 语句打开的或调用 getline 函数打开的文件或管道。如果文件或管道成功关闭，则返回 0；其它情况下返回非零值。如果打算写一个文件，并稍后在同一个程序中读取文件，则 close 语句是必需的 |
| system(command )                   | 执行 Command 参数指定的命令，并返回退出状态。等同于 system 子例程 |
| Expression \| getline [ Variable ] | 从来自 Expression 参数指定的命令的输出中通过管道传送的流中读取一个输入记录，并将该记录的值指定给 Variable 参数指定的变量。如果当前未打开将 Expression 参数的值作为其命令名称的流，则创建流。创建的流等同于调用 popen 子例程，此时 Command 参数取 Expression 参数的值且 Mode 参数设置为一个是 r 的值。只要流保留打开且 Expression 参数求得同一个字符串，则对 getline 函数的每次后续调用读取另一个记录。如果未指定 Variable 参数，则 $0 记录变量和 NF 特殊变量设置为从流读取的记录 |
| getline [ Variable ] < Expression  | 从 Expression 参数指定的文件读取输入的下一个记录，并将 Variable 参数指定的变量设置为该记录的值。只要流保留打开且 Expression 参数对同一个字符串求值，则对 getline 函数的每次后续调用读取另一个记录。如果未指定 Variable 参数，则 $0 记录变量和 NF 特殊变量设置为从流读取的记录 |
| getline [ Variable ]               | 将 Variable 参数指定的变量设置为从当前输入文件读取的下一个输入记录。如果未指定 Variable 参数，则 $0 记录变量设置为该记录的值，还将设置 NF、NR 和 FNR 特殊变量 |

```bash
# 打开外部文件（close用法） 
$ awk 'BEGIN{while("cat /etc/passwd"|getline){print $0;};close("/etc/passwd");}' 
root:x:0:0:root:/root:/bin/bash 
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin

# 逐行读取外部文件(getline使用方法） 
$ awk 'BEGIN{while(getline < "/etc/passwd"){print $0;};close("/etc/passwd");}' 
root:x:0:0:root:/root:/bin/bash 
bin:x:1:1:bin:/bin:/sbin/nologin 
daemon:x:2:2:daemon:/sbin:/sbin/nologin 
$ awk 'BEGIN{print "Enter your name:";getline name;print name;}' 
Enter your name: 
chengmo 
chengmo

# 调用外部应用程序(system使用方法） 
$ awk 'BEGIN{b=system("ls -al");print b;}' 
total 42092 
drwxr-xr-x 14 chengmo chengmo 4096 09-30 17:47 . 
drwxr-xr-x 95 root root 4096 10-08 14:01 .. 
# b返回值，是执行结果。
```

**时间函数：**

| 格式                                 | 描述                                  |
| ---------------------------------- | ----------------------------------- |
| 函数名                                | 说明                                  |
| mktime( YYYY MM dd HH MM ss[ DST]) | 生成时间格式                              |
| strftime([format [, timestamp]])   | 格式化时间输出，将时间戳转为时间字符串 具体格式，见下表.       |
| systime()                          | 得到时间戳,返回从1970年1月1日开始到当前时间(不计闰年)的整秒数 |

```bash
# 建指定时间(mktime使用） 
$ awk 'BEGIN{tstamp=mktime("2001 01 01 12 12 12");print strftime("%c",tstamp);}' 
2001年01月01日 星期一 12时12分12秒 

$ awk 'BEGIN{tstamp1=mktime("2001 01 01 12 12 12");tstamp2=mktime("2001 02 01 0 0 0");print tstamp2-tstamp1;}' 
2634468 

# 求2个时间段中间时间差，介绍了strftime使用方法 
$ awk 'BEGIN{tstamp1=mktime("2001 01 01 12 12 12");tstamp2=systime();print tstamp2-tstamp1;}' 
308201392
```

strftime日期和时间格式说明符

| 格式   | 描述                            |
| ---- | ----------------------------- |
| %a   | 星期几的缩写（Sun）                   |
| %A   | 星期几的完整写法（Sunday）              |
| %b   | 月名的缩写（Oct）                    |
| %B   | 月名的完整写法（October）              |
| %c   | 本地日期和时间                       |
| %d   | 十进制日期                         |
| %D   | 日期 08/20/99                   |
| %e   | 日期，如果只有一位会补上一个空格              |
| %H   | 用十进制表示24小时格式的时间               |
| %I   | 用十进制表示12小时格式的时间               |
| %j   | 从1月1日期一年中的第几天                 |
| %m   | 十进制表示的月份                      |
| %M   | 十进制表示的分钟                      |
| %p   | 12小时表示法（AM/PM）                |
| %S   | 十进制表示的秒                       |
| %U   | 十进制表示的一年中的第几个星期（星期天作为一个星期的开始） |
| %w   | 十进制表示的星期几（星期天是0）              |
| %W   | 十进制表示的一年中的第几个星期（星期一作为一个星期的开始） |
| %x   | 重新设置本地日期（08/20/99）            |
| %X   | 重新设置本地时间（12 : 00 : 00）        |
| %y   | 两位数字表示的年（99）                  |
| %Y   | 当前月份                          |
| %Z   | 时区（PDT）                       |
| %%   | 百分号（%）                        |

###  4.6 find 对目录中的所有文件进行文本替换

```bash
# 将所有.cpp文件中的Copyright替换成Copyleft：
$ find . -name *.cpp -print0 | xargs -I{} -0 sed -i 's/Copyright/Copyleft/g' {}

# 选项-exec实现同样的效果：
$ find . -name *.cpp -exec sed -i 's/Copyright/Copyleft/g' \{\} \;
```

 ## 5 一团乱麻

### 5.1 wget命令

```bash
-a<日志文件>：			# 在指定的日志文件中记录资料的执行过程； 
-A<后缀名>：			 # 指定要下载文件的后缀名，多个后缀名之间使用逗号进行分隔； 
-b：					   # 进行后台的方式运行wget； 
-B<连接地址>：			# 设置参考的连接地址的基地地址； 
-c：					   # 继续执行上次终端的任务； 
-C<标志>：				 # 设置服务器数据块功能标志on为激活，off为关闭，默认值为on； 
-d：					   # 调试模式运行指令； 
-D<域名列表>：		    # 设置顺着的域名列表，域名之间用“，”分隔； 
-e<指令>：				 # 作为文件“.wgetrc”中的一部分执行指定的指令； 
-h：					   # 显示指令帮助信息； 
-i<文件>：				 # 从指定文件获取要下载的URL地址； 
-l<目录列表>：			# 设置顺着的目录列表，多个目录用“，”分隔； 
-L：					   # 仅顺着关联的连接； 
-r：					   # 递归下载方式； 
-nc：				   # 文件存在时，下载文件不覆盖原有文件； 
-nv：				   # 下载时只显示更新和出错信息，不显示指令的详细执行过程； 
-q：					   # 不显示指令执行过程； 
-nh：				   # 不查询主机名称； 
-v：					   # 显示详细执行过程； 
-V：					   # 显示版本信息； 
--passive-ftp：		   # 使用被动模式PASV连接FTP服务器； 
--follow-ftp：		   # 从HTML文件中下载FTP连接文件。
```

```bash
# 使用wget下载单个文件 
$ wget http://www.linuxde.net/testfile.zip

# 下载并以不同的文件名保存 
$ wget -O wordpress.zip http://www.linuxde.net/download.aspx?id=1080

# wget限速下载 
$ wget --limit-rate=300k http://www.linuxde.net/testfile.zip

# 使用wget断点续传 
$ wget -c http://www.linuxde.net/testfile.zip

# 使用wget后台下载 
$ wget -b http://www.linuxde.net/testfile.zip 
Continuing in background, pid 1840. 
Output will be written to `wget-log'.
# 对于下载非常大的文件的时候，我们可以使用参数-b进行后台下载，你可以使用以下命令来察看下载进度： 
$ tail -f wget-log

# 伪装代理名称下载 
$ wget --user-agent="Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.204 Safari/534.16" http://www.linuxde.net/testfile.zip
# 有些网站能通过根据判断代理名称不是浏览器而拒绝你的下载请求。不过你可以通过--user-agent参数伪装。
```

**测试下载链接：**

当你打算进行定时下载，你应该在预定时间测试下载链接是否有效。我们可以增加--spider参数进行检查。 

```bash
$ wget --spider URL
```

如果下载链接正确，将会显示:

```text
Spider mode enabled. Check if remote file exists. 
HTTP request sent, awaiting response... 200 OK 
Length: unspecified [text/html] 
Remote file exists and could contain further links, 
but recursion is disabled -- not retrieving.
```

这保证了下载能在预定的时间进行，但当你给错了一个链接，将会显示如下错误:

```bash
$ wget --spider url 
Spider mode enabled. Check if remote file exists. 
HTTP request sent, awaiting response... 404 Not Found 
Remote file does not exist -- broken link!!!
```

你可以在以下几种情况下使用--spider参数：

* 定时下载之前进行检查
* 间隔检测网站是否可用
* 检查网站页面的死链接

```bash
# 增加重试次数 
$ wget --tries=40 URL

# 下载多个文件 
$ wget -i filelist.txt 
# 首先，保存一份下载链接文件： 
$ cat > filelist.txt 
url1 
url2 
url3 
url4 
# 接着使用这个文件和参数-i下载。

# 过滤指定格式下载 
$ wget --reject=gif ur 
# 下载一个网站，但你不希望下载图片，可以使用这条命令。

# 把下载信息存入日志文件 
$ wget -o download.log URL 
# 不希望下载信息直接显示在终端而是在一个日志文件，可以使用。 

# 限制总下载文件大小 
$ wget -Q5m -i filelist.txt 
# 当你想要下载的文件超过5M而退出下载，你可以使用。注意：这个参数对单个文件下载不起作用，只能递归下载时才有效。
```

**镜像网站：**

```bash
$ wget --mirror -p --convert-links -P ./LOCAL URL 
```

下载整个网站到本地。

* --mirror 开户镜像下载
* -p 下载所有为了html页面显示正常的文件
* --convert-links 下载后，转换成本地的链接
* -P ./LOCAL URL 保存所有文件和目录到本地指定目录

**下载指定格式文件：**

```bash
$ wget -r -A.pdf url
```

可以在以下情况使用该功能：

* 下载一个网站的所有图片
* 下载一个网站的所有视频
* 下载一个网站的所有PDF文件

**FTP下载：**

```bash
$ wget ftp-url 
$ wget --ftp-user=USERNAME --ftp-password=PASSWORD url
```

可以使用wget来完成ftp链接的下载。 

使用wget匿名ftp下载：

```bash
$ wget ftp-url
```

使用wget用户名和密码认证的ftp下载： 

```bash
$ wget --ftp-user=USERNAME --ftp-password=PASSWORD url
```

### 5.2 curl 命令

常见参数：

```bash
-A/--user-agent <string>              # 设置用户代理发送给服务器
-b/--cookie <name=string/file>    	  # cookie字符串或文件读取位置
-c/--cookie-jar <file>                # 操作结束后把cookie写入到这个文件中
-C/--continue-at <offset>             # 断点续转
-D/--dump-header <file>               # 把header信息写入到该文件中
-e/--referer                          # 来源网址
-f/--fail                             # 连接失败时不显示http错误
-o/--output                           # 把输出写到该文件中
-O/--remote-name                      # 把输出写到该文件中，保留远程文件的文件名
-r/--range <range>                    # 检索来自HTTP/1.1或FTP服务器字节范围
-s/--silent                           # 静音模式。不输出任何东西
-T/--upload-file <file>               # 上传文件
-u/--user <user[:password]>           # 设置服务器的用户和密码
-w/--write-out [format]               # 什么输出完成后
-x/--proxy <host[:port]>              # 在给定的端口上使用HTTP代理
-#/--progress-bar                     # 进度条显示当前的传送状态
```

```bash
# 不显示进度信息使用--silent选项。
$ curl URL --silent

# 使用选项 -O 将下载的数据写入到文件，必须使用文件的绝对地址：
$ curl http://man.linuxde.net/text.iso --silent -O

# 选项-o将下载数据写入到指定名称的文件中，并使用--progress显示进度条：
$ curl http://man.linuxde.net/test.iso -o filename.iso --progress
######################################### 100.0%

# 断点续传
$ curl URL/File -C 偏移量 
# 偏移量是以字节为单位的整数，如果让curl自动推断出正确的续传位置使用-C -： 
$ curl -C -URL

# 使用--referer选项指定参照页字符串： 
$ curl --referer http://www.google.com http://man.linuxde.net 

# 用curl设置cookies 使用--cookie "COKKIES"选项来指定cookie，多个cookie使用分号分隔： 
$ curl http://man.linuxde.net --cookie "user=root;pass=123456" 
# 将cookie另存为一个文件，使用--cookie-jar选项： 
$ curl URL --cookie-jar cookie_file 

# 用curl设置用户代理字符串 有些网站访问会提示只能使用IE浏览器来访问，这是因为这些网站设置了检查用户代理，可以使用curl把用户代理设置为IE，这样就可以访问了。使用--user-agent或者-A选项：
$ curl URL --user-agent "Mozilla/5.0" curl URL -A "Mozilla/5.0" 
# 其他HTTP头部信息也可以使用curl来发送，使用-H"头部信息" 传递多个头部信息，例如： 
$ curl -H "Host:man.linuxde.net" -H "accept-language:zh-cn" URL 

# curl的带宽控制和下载配额 使用--limit-rate限制curl的下载速度： 
$ curl URL --limit-rate 50k 
# 命令中用k（千字节）和m（兆字节）指定下载速度限制。 

# 使用--max-filesize指定可下载的最大文件大小： 
$ curl URL --max-filesize bytes 
# 如果文件大小超出限制，命令则返回一个非0退出码，如果命令正常则返回0。 

# 用curl进行认证 使用curl选项 -u 可以完成HTTP或者FTP的认证，可以指定密码，也可以不指定密码在后续操作中输入密码： 
$ curl -u user:pwd http://man.linuxde.net 
$ curl -u user http://man.linuxde.net 

# 只打印响应头部信息 通过-I或者-head可以只打印出HTTP头部信息： 
$ curl -I http://man.linuxde.net 
HTTP/1.1 200 OK 
Server: nginx/1.2.5 
date: Mon, 10 Dec 2012 09:24:34 GMT 
Content-Type: text/html; charset=UTF-8 
Connection: keep-alive 
Vary: Accept-Encoding 
X-Pingback: http://man.linuxde.net/xmlrpc.php
```

其他参数：



```bash
-a/--append                    # 上传文件时，附加到目标文件
--anyauth                      # 可以使用“任何”身份验证方法
--basic                        # 使用HTTP基本验证
-B/--use-ascii                 # 使用ASCII文本传输
-d/--data <data>               # HTTP POST方式传送数据
--data-ascii <data>            # 以ascii的方式post数据
--data-binary <data>           # 以二进制的方式post数据
--negotiate                    # 使用HTTP身份验证
--digest                       # 使用数字身份验证
--disable-eprt                 # 禁止使用EPRT或LPRT
--disable-epsv                 # 禁止使用EPSV
--egd-file <file>              # 为随机数据(SSL)设置EGD socket路径
--tcp-nodelay                  # 使用TCP_NODELAY选项
-E/--cert <cert[:passwd]>      # 客户端证书文件和密码 (SSL)
--cert-type <type>             # 证书文件类型 (DER/PEM/ENG) (SSL)
--key <key>                    # 私钥文件名 (SSL)
--key-type <type>              # 私钥文件类型 (DER/PEM/ENG) (SSL)
--pass  <pass>                 # 私钥密码 (SSL)
--engine <eng>                 # 加密引擎使用 (SSL). "--engine list" for list
--cacert <file>                # CA证书 (SSL)
--capath <directory>           # CA目   (made using c_rehash) to verify peer against (SSL)
--ciphers <list>               # SSL密码
--compressed                   # 要求返回是压缩的形势 (using deflate or gzip)
--connect-timeout <seconds>    # 设置最大请求时间
--create-dirs                  # 建立本地目录的目录层次结构
--crlf                         # 上传是把LF转变成CRLF
--ftp-create-dirs              # 如果远程目录不存在，创建远程目录
--ftp-method [multicwd/nocwd/singlecwd]    # 控制CWD的使用
--ftp-pasv                     # 使用 PASV/EPSV 代替端口
--ftp-skip-pasv-ip             # 使用PASV的时候,忽略该IP地址
--ftp-ssl                      # 尝试用 SSL/TLS 来进行ftp数据传输
--ftp-ssl-reqd                 # 要求用 SSL/TLS 来进行ftp数据传输
-F/--form <name=content>       # 模拟http表单提交数据
-form-string <name=string>     # 模拟http表单提交数据
-g/--globoff                   # 禁用网址序列和范围使用{}和[]
-G/--get                       # 以get的方式来发送数据
-h/--help                      # 帮助
-H/--header <line>             # 自定义头信息传递给服务器
--ignore-content-length        # 忽略的HTTP头信息的长度
-i/--include                   # 输出时包括protocol头信息
-I/--head                      # 只显示文档信息
-j/--junk-session-cookies      # 读取文件时忽略session cookie
--interface <interface>        # 使用指定网络接口/地址
--krb4 <level>                 # 使用指定安全级别的krb4
-k/--insecure                  # 允许不使用证书到SSL站点
-K/--config                    # 指定的配置文件读取
-l/--list-only                 # 列出ftp目录下的文件名称
--limit-rate <rate>            # 设置传输速度
--local-port<NUM>              # 强制使用本地端口号
-m/--max-time <seconds>        # 设置最大传输时间
--max-redirs <num>             # 设置最大读取的目录数
--max-filesize <bytes>         # 设置最大下载的文件总量
-M/--manual                    # 显示全手动
-n/--netrc                     # 从netrc文件中读取用户名和密码
--netrc-optional               # 使用 .netrc 或者 URL来覆盖-n
--ntlm                         # 使用 HTTP NTLM 身份验证
-N/--no-buffer                 # 禁用缓冲输出
-p/--proxytunnel               # 使用HTTP代理
--proxy-anyauth                # 选择任一代理身份验证方法
--proxy-basic                  # 在代理上使用基本身份验证
--proxy-digest                 # 在代理上使用数字身份验证
--proxy-ntlm                   # 在代理上使用ntlm身份验证
-P/--ftp-port <address>        # 使用端口地址，而不是使用PASV
-Q/--quote <cmd>               # 文件传输前，发送命令到服务器
--range-file                   # 读取（SSL）的随机文件
-R/--remote-time               # 在本地生成文件时，保留远程文件时间
--retry <num>                  # 传输出现问题时，重试的次数
--retry-delay <seconds>        # 传输出现问题时，设置重试间隔时间
--retry-max-time <seconds>     # 传输出现问题时，设置最大重试时间
-S/--show-error                # 显示错误
--socks4 <host[:port]>         # 用socks4代理给定主机和端口
--socks5 <host[:port]>         # 用socks5代理给定主机和端口
-t/--telnet-option <OPT=val>   # Telnet选项设置
--trace <file>                 # 对指定文件进行debug
--trace-ascii <file>           # Like --跟踪但没有hex输出
--trace-time                   # 跟踪/详细输出时，添加时间戳
--url <URL>                    # Spet URL to work with
-U/--proxy-user <user[:password]>  	# 设置代理用户名和密码
-V/--version                   # 显示版本信息
-X/--request <command>         # 指定什么命令
-y/--speed-time                # 放弃限速所要的时间。默认为30
-Y/--speed-limit               # 停止传输速度的限制，速度时间'秒
-z/--time-cond                 # 传送时间设置
-0/--http1.0                   # 使用HTTP 1.0
-1/--tlsv1                     # 使用TLSv1（SSL）
-2/--sslv2                     # 使用SSLv2的（SSL）
-3/--sslv3                     # 使用的SSLv3（SSL）
--3p-quote                     # like -Q for the source URL for 3rd party transfer
--3p-url                       # 使用url，进行第三方传送
--3p-user                      # 使用用户名和密码，进行第三方传送
-4/--ipv4                      # 使用IP4
-6/--ipv6                      # 使用IP6
```

### 5.3 curl wget两种方法模拟http的get post请求

**get请求：**

```bash
# 使用curl命令：
$ curl "http://www.baidu.com"  		# 如果这里的URL指向的是一个文件或者一幅图都可以直接下载到本地
$ curl -i "http://www.baidu.com"  	# 显示全部信息
$ curl -l "http://www.baidu.com" 	# 只显示头部信息
$ curl -v "http://www.baidu.com" 	# 显示get请求全过程解析
```

```bash
# 使用wget命令：
$ wget "http://www.baidu.com"
```

**post请求：**

```bash
# 使用curl命令(通过-d参数，把访问参数放在里面)：
$ curl -d "param1=value1&param2=value2" "http://www.baidu.com"
```

```bash
# 使用wget命令：（--post-data参数来实现）
$ wget --post-data 'user=foo&password=bar'  http://server.com/auth.PHP
```

## 6 B计划

### 6.1 用tar归档

tar支持的参数包括： `A`、 `c`、 `d`、 `r`、 `u`、 `x`、 `f` 和 `v` 

```bash
# 用tar对文件进行归档：
$ tar -cf output.tar file1 file2 file3 folder1 ..

# 使用选项-t列出归档文件中所包含的文件：
$ tar -tf archive.tar
file1
file2

# 如果需要在归档或列出归档文件列表时获知更多的细节信息，可以使用-v或-vv参数
$ $ tar -tvf archive.tar
-rw-rw-r-- shaan/shaan 0 2013-04-08 21:34 file1
-rw-rw-r-- shaan/shaan 0 2013-04-08 21:34 file2
# 文件名必须紧跟在-f之后，而且-f应该是选项中的最后一个。

# 向归档文件中添加文件,追加选项-r
$ tar -rvf original.tar new_file

# 用下面的方法列出归档文件中的内容：
$ tar -tf archive.tar
hello.txt

# 从归档文件中提取文件或文件夹, -x 表示提取
$ tar -xf archive.tar

# 用选项-C来指定需要将文件提取到哪个目录：
$ tar -xf archive.tar -C /path/to/extraction_directory

# 可以通过将文件名指定为命令行参数来提取特定的文件：
$ tar -xvf file.tar file1 file4
# 上面的命令只提取file1和file4，忽略其他文件。

# 在tar中使用stdin和stdout
$ tar cvf - files/ | ssh user@example.com "tar xv -C Documents/"
# 在上面的例子中，对files目录中的内容进行了归档并输出到stdout（由'-'指明）。

# 拼接两个归档文件, -A 选项轻松地合并多个tar文件
$ tar -Af file1.tar file2.tar
# 查看内容，验证操作是否成功：
$ tar -tvf file1.tar

# 通过检查时间戳来更新归档文件中的内容
# 可以用更新选项-u指明：只有比归档文件中的同名文件更新时才会被添加。
$ tar -tf archive.tar
filea
fileb
filec

# 仅当filea自上次被加入archive.tar后出现了变动才对其进行追加，可以使用：
$ tar -uf archive.tar filea
# 如果两个filea的时间戳相同，则什么都不会发生。
# 可用touch命令修改文件的时间戳，然后再用tar命令：
$ tar -uvvf archive.tar filea
-rw-r--r-- slynux/slynux 0 2010-08-14 17:53 filea

# 比较归档文件与文件系统中的内容, 选项 -d 可以打印出两者之间的差别：
$ tar -df archive.tar
afile: Mod time differs
afile: Size differs

# 从归档文件中删除文件, --delete选项从给定的归档文件中删除文件
$ tar -tf archive.tar
filea
fileb
filec
# 删除filea：
$ tar --delete --file archive.tar filea
$ tar -tf archive.tar
fileb
filec
```

**压缩tar归档文件：**

归档文件通常被压缩成下列格式之一： 

* file.tar.gz 
* file.tar.bz2 
* file.tar.lzma 

不同的tar选项可以用来指定不同的压缩格式： 

* -j 指定bunzip2格式； 
* -z 指定gzip格式； 
* --lzma 指定lzma格式。 

```bash
# 为了让tar支持根据扩展名自动进行压缩，使用 -a或 --auto-compress选项：
$ tar acvf archive.tar.gz filea fileb filec

# 从归档中排除部分文件,  --exclude [PATTERN]排除匹配通配符样式的文件
$ tar -cf arch.tar * --exclude "*.txt"
# 样式应该使用双引号来引用，避免shell对其进行扩展。

# 也可以将需要排除的文件列表放入文件中，同时配合选项 -X：
$ cat list
filea
fileb
$ tar -cf arch.tar * -X list

# 排除版本控制目录， 可以使用tar的 --exclude-vcs选项。例如：
$ tar --exclude-vcs -czvvf source_code.tar.gz eye_of_gnome_svn

# 打印总字节数，用–totals就可以在归档完成之后打印出总归档字节数：
$ tar -cf arc.tar * --exclude "*.txt" --totals
Total bytes written: 20480 (20KiB, 12MiB/s)
```

### 6.2 用cpio归档

```bash
# 创建测试文件：
$ touch file1 file2 file3

# 将测试文件按照下面的方法进行归档：
$ echo file1 file2 file3 | cpio -ov > archive.cpio

# 列出cpio归档文件中的内容：
$ cpio -it < archive.cpio

# 从cpio归档文件中提取文件：
$ cpio -id < archive.cpio
```

对于归档命令： 

* -o 指定了输出； 
* -v 用来打印归档文件列表。 

在列出给定cpio归档文件所有内容的命令中： 

* -i 用于指定输入； 
* -t 表示列出归档文件中的内容。 

当使用命令进行提取时， -d用来表示提取。 cpio在覆盖文件时不会发出提示。 

### 6.3 使用gzip压缩数据

```bash
# 要使用gzip压缩文件，可以使用下面的命令：
$ gzip filename
$ ls
filename.gz

# 将gzip文件解压缩的方法如下：
$ gunzip filename.gz
$ ls
file

# 列出压缩文件的属性信息：
$ gzip -l test.txt.gz
compressed uncompressed ratio uncompressed_name
35 				6 		-33.3% 	test.txt

# gzip命令可以从stdin中读入文件，也可以将压缩文件写出到stdout，选项 -c用来将输出指定到stdout。
$ cat file | gzip -c > file.gz

# 我们可以指定gzip的压缩级别。用 --fast或 --best选项分别提供最低或最高的压缩比。
```

```bash
# 压缩归档文件
# 方法 1
$ tar -czvvf archive.tar.gz [FILES]
或者
$ tar -cavvf archive.tar.gz [FILES]
# 选项 -a表明从文件扩展名自动推断压缩格式。

# 方法 2
# 首先，创建一个tar归档文件：
$ tar -cvvf archive.tar [FILES]
# 压缩tar归档文件：
$ gzip archive.tar

# zcat——无需解压缩，直接读取gzip格式文件
$ ls
test.gz
$ zcat test.gz
A test file
# 文件test包含了一行文本"A test file"
$ ls
test.gz

# 压缩率
# 我们可以指定压缩率，它共有9级，其中：
# 1级的压缩率最低，但是压缩速度最快；
# 9级的压缩率最高，但是压缩速度最慢。
$ gzip -5 test.img
# 这应该能在压缩速度和压缩比之间获得一个不错的平衡。

# 使用bzip2，唯一的不同在于bzip2的压缩效率比gzip更高，但花费的时间比gzip更长
$ bzip2 filename
# 解压缩bzip2格式的文件：
$ bunzip2 filename.bz2
# 生成tar.bz2文件并从中提取内容的方法同之前介绍的tar.gz类似：
$ tar -xjvf archive.tar.bz2
# 其中-j表明该归档文件是bzip2格式。

# 使用lzma
# lzma是另一种压缩工具，它的压缩率甚至比gzip和bzip2更好。
$ lzma filename
# 解压缩lzma文件：
$ unlzma filename.lzma
# 可以使用tar命令的--lzma选项对生成的tar归档文件进行压缩或提取：
$ tar -cvvf --lzma archive.tar.lzma [FILES]
或者
$ tar -cavvf archive.tar.lzma [FILES]
# 如果要将经过lzma压缩过的tar归档文件中的内容提取到指定的目录中，可以使用：
$ tar -xvvf --lzma archive.tar.lzma -C extract_directory
# 其中， -x用于提取内容， --lzma指定使用lzma对归档文件进行解压缩。
# 我们也可以用：
$ tar -xavvf archive.tar.lzma -C extract_directory
```

### 6.4 用 zip 归档和压缩

```bash
# 对归档文件采用ZIP格式进行压缩：
$ zip file.zip file

# 对目录和文件进行递归操作, -r 用于指定递归操作：
$ zip -r archive.zip folder1 folder2

#  要从ZIP文件中提取内容，可以使用：
$ unzip file.zip
# 在完成提取操作之后， unzip并不会删除file.zip

# 如果需要更新压缩文件中的内容，使用选项 -u：
$ zip file.zip -u newfile

# 从压缩文件中删除内容，则使用-d：
$ zip -d arc.zip file.txt

# 列出压缩文件中的内容：
$ unzip -l archive.zip
```

### 6.5 更快的归档工具 pbzip2

```bash
# 压缩单个文件：
$ pbzip2 myfile.tar
# pbzip2会自动检测系统中处理器核心的数量，然后将myfile.tar压缩成myfile.tar.bz2。

# 要将多个文件或目录进行归档及压缩，可以使用tar配合pbzip2来实现：
$ tar cf myfile.tar.bz2 --use-compress-prog=pbzip2 dir_to_compress/
或者
$ tar -c directory_to_compress/ | pbzip2 -c > myfile.tar.bz2

# 从pbzip2格式的文件中进行提取。
# 如果是tar.bz2文件，我们可以一次性完成解压缩和提取工作：
$ pbzip2 -dc myfile.tar.bz2 | tar x
# 如果是经过pbzip2压缩过的归档文件，可以使用：
$ pbzip2 -d myfile.tar.bz2

# 手动指定处理器数量, 使用pbzip2的-p选项来手动指定处理器核心的数量
$ pbzip2 -p4 myfile.tar
# 上面的命令告诉pbzip2使用4个处理器核心。

# 指定压缩比
# 像其他压缩工具一样，我们可以使用从1到9的选项来分别指定最快和最优的压缩比。
```

### 6.6 创建压缩文件系统 

squashfs是一种具有超高压缩率的只读型文件系统，这种文件系统能够将2GB~3GB的数据压缩成一个700MB的文件。  

```bash
# 添加源目录和文件，创建一个squashfs文件：
$ sudo mksquashfs /etc test.squashfs
Parallel mksquashfs: Using 2 processors
Creating 4.0 filesystem on test.squashfs, block size 131072.
[=======================================] 1867/1867 100%

# 利用环回形式挂载squashfs文件：
$ mkdir /mnt/squash
$ mount -o loop compressedfs.squashfs /mnt/squash
# 你可以访问/mnt/squashfs访问其中的内容。

# 在创建squashfs文件时排除部分文件, 选项-e，将需要排除的文件列表以命令行参数的方式来指定。例如：
$ sudo mksquashfs /etc test.squashfs -e /etc/passwd /etc/shadow
# 也可以将需要排除的文件名列表写入文件，然后用 -ef指定该文件：
$ cat excludelist
/etc/passwd
/etc/shadow
$ sudo mksquashfs /etc test.squashfs -ef excludelist
```

### 6.7 使用 rsync 备份系统快照 

rsync可以对位于不同位置的文件和目录进行同步，它利用差异计算以及压缩技术来最小化数据传输量。 

rsync也支持压缩、加密等多种特性。 

```bash
# 将源目录复制到目的端：
$ rsync -av /home/slynux/data slynux@192.168.0.6:/home/backups/data
# 其中：
 -a表示要进行归档；
 -v表示在stdout上打印出细节信息或进度。

# 将数据备份到远程服务器或主机：
$ rsync -av source_dir username@host:PATH

# 用下面的方法将远程主机上的数据恢复到本地主机：
$ rsync -av username@host:PATH destination

# 通过网络进行传输时，压缩数据能够明显改善传输效率。我们可以用rsync的选项 -z 指定在网络传输时压缩数据。例如：
$ rsync -avz source destination

# 将一个目录中的内容同步到另一个目录：
$ rsync -av /home/test/ /home/backups
# 这条命令将源目录（/home/test）中的内容（不包括目录本身）复制到现有的backups目录中

# 在使用rsync进行归档的过程中排除部分文件
$ rsync -avz /home/code/some_code /mnt/disk/backup/code --exclude "*.txt"
# 或者我们可以通过一个列表文件指定需要排除的文件。
# 这可以利用--exclude-from FILEPATH。

# 在更新rsync备份时，删除不存在的文件, rsync并不会在目的端删除那些在源端已不存在的文件
$ rsync -avz SOURCE DESTINATION --delete

# 定期进行备份
$ crontab -ev
# 添加上这么一行：
0 */10 * * * rsync -avz /home/code user@IP_ADDRESS:/home/backups
# 上面的crontab条目将rsync调度为每10个小时运行一次。
```

### 6.8 用 fsarchiver 创建全盘镜像 

```bash
# 创建文件系统/分区备份。
# 使用fsarchiver的savefs选项：
$ fsarchiver savefs backup.fsa /dev/sda1

# 同时备份多个分区。
$ fsarchiver savefs backup.fsa /dev/sda1 /dev/sda2

# 从备份归档中恢复分区。
$ fsarchiver restfs backup.fsa id=0,dest=/dev/sda1
# id=0 表 明 我 们 希 望 从 备 份 归 档 中 提 取 第 一 个 分 区 的 内 容 ， 将 其 恢 复 到 由 dest=/dev/sda1所指定的分区中。

# 从备份归档中恢复多个分区。
# 像之前一样，使用restfs选项：
$ fsarchiver restfs backup.fsa id=0,dest=/dev/sda1 id=1,dest=/dev/sdb1
```

## 7 无网不利

### 7.1 设置网络

```bash
# 手动设置网络接口的IP地址：
$ ifconfig wlan0 192.168.0.80

# 使用以下命令设置比IP地址的子网掩码：
$ ifconfig wlan0 192.168.0.80 netmask 255.255.252.0

# 自动配置网络接口
$ dhclient eth0

# 打印网络接口列表
$ ifconfig | cut -c-10 | tr -d ' ' | tr -s '\n'
lo
wlan0

# 显示IP地址
$ ifconfig wlan0 | egrep -o "inet addr:[^ ]*" | grep -o "[0-9.]*"
192.168.0.82

# 硬件地址（MAC地址）欺骗
$ ifconfig eth0 hw ether 00:1c:bf:87:25:d5

# 名字服务器与DNS（域名服务）
$ cat /etc/resolv.conf
nameserver 8.8.8.8
# 我们可以像下面这样手动添加名字服务器：
$ echo nameserver IP_ADDRESS >> /etc/resolv.conf

# DNS查找
$ host google.com
google.com has address 64.233.181.105
google.com has address 64.233.181.99
google.com has address 64.233.181.147
google.com has address 64.233.181.106
google.com has address 64.233.181.103
google.com has address 64.233.181.104

$ nslookup google.com
Server: 8.8.8.8
Address: 8.8.8.8#53
Non-authoritative answer:
Name: google.com
Address: 64.233.181.105
Name: google.com
Address: 64.233.181.99
Name: google.com
Address: 64.233.181.147
Name: google.com
Address: 64.233.181.106
Name: google.com
Address: 64.233.181.103
Name: google.com
Address: 64.233.181.104
Server: 8.8.8.8
# 上面最后一行对应着用于DNS解析的默认名字服务器。

# 如果不使用DNS服务器，也可以为IP地址解析添加符号名，这只需要向文件 /etc/hosts中加入条目即可。
# 用下面的方法进行添加：
$ echo IP_ADDRESS symbolic_name >> /etc/hosts
# 例如：
$ echo 192.168.0.9 backupserver >> /etc/hosts
# 添加了条目之后，任何时候解析backupserver，都会返回192.168.0.9。

# 显示路由表信息
$ route
Kernel IP routing table
Destination 	Gateway 	Genmask 		Flags 	Metric 	Ref 	UseIface
192.168.0.0 	* 			255.255.252.0 	U 		2 		0 		0wlan0
link-local 		* 			255.255.0.0 	U 		1000 	0 		0wlan0
default 		p4.local 	0.0.0.0 		UG 		0 		0 		0wlan0
# 也可以使用：
$ route -n
Kernel IP routing table
Destination 	Gateway 	Genmask 		Flags 	Metric 	Ref 	Use 	Iface
192.168.0.0 	0.0.0.0 	255.255.252.0 	U 		2 		0 		0 		wlan0
169.254.0.0 	0.0.0.0 	255.255.0.0 	U 		1000 	0 		0 		wlan0
0.0.0.0 		192.168.0.4 0.0.0.0 		UG 		0 		0 		0 		wlan0
# -n指定以数字形式显示地址。如果使用-n， route会以数字形式的IP地址显示每一个条目；否则，如果IP地址具有对应的DNS条目，就会显示符号形式的主机名。

# 设置默认网关：
$ route add default gw 192.168.0.1 wlan0
```

### 7.2 traceroute 命令

traceroute，它可以显示分组途径的所有网关的地址。 traceroute信息可以帮助我们搞明白分组到达目的地需要经过多少跳（hop）。中途的网关或路由器的数量给出了一个测量网络上两个节点之间距离的度量
（metric）。 traceroute的输出如下： 

```bash
$ traceroute google.com
traceroute to google.com (74.125.77.104), 30 hops max, 60 byte packets
1 gw-c6509.lxb.as5577.net (195.26.4.1) 0.313 ms 0.371 ms 0.457 ms
2 40g.lxb-fra.as5577.net (83.243.12.2) 4.684 ms 4.754 ms 4.823 ms
3 de-cix10.net.google.com (80.81.192.108) 5.312 ms 5.348 ms 5.327 ms
4 209.85.255.170 (209.85.255.170) 5.816 ms 5.791 ms 209.85.255.172
(209.85.255.172) 5.678 ms
5 209.85.250.140 (209.85.250.140) 10.126 ms 9.867 ms 10.754 ms
6 64.233.175.246 (64.233.175.246) 12.940 ms 72.14.233.114
(72.14.233.114) 13.736 ms 13.803 ms
7 72.14.239.199 (72.14.239.199) 14.618 ms 209.85.255.166
(209.85.255.166) 12.755 ms 209.85.255.143 (209.85.255.143) 13.803 ms
8 209.85.255.98 (209.85.255.98) 22.625 ms 209.85.255.110
(209.85.255.110) 14.122 ms
*
9 ew-in-f104.1e100.net (74.125.77.104) 13.061 ms 13.256 ms 13.484 ms
```

### 7.3 列出网络上所有的活动主机 (fping) 

fping的选项如下： 

* 选项 -a指定打印出所有活动主机的IP地址； 
* 选项 -u指定打印出所有无法到达的主机； 
* 选项 -g指定从 "IP地址/子网掩码"记法或者"IP地址范围"记法中生成一组IP地址； 

```bash
$ fping -a 192.160.1/24 -g
# 或者
$ fping -a 192.160.1 192.168.0.255 -g

# 我们可以用已有的命令行工具来查询网络上的主机状态：
$ fping -a 192.160.1/24 -g 2> /dev/null
192.168.0.1
192.168.0.90
# 或者，使用：
$ fping -a 192.168.0.1 192.168.0.255 -g

# >/dev/null将由于主机无法到达所产生的错误信息打印到null设备。
$ fping -a 192.168.0.1 192.168.0.5 192.168.0.6
# 将IP地址作为参数传递
$ fping -a < ip.list
# 从文件中传递一组IP地址
```

### 7.4 ssh 命令

```bash
# SSH的压缩功能,选项-C启用这一功能：
$ ssh -C user@hostname COMMANDS

# 将数据重定向至远程shell命令的stdin
$ echo 'text' | ssh user@remote_host 'echo'
text
# 或者
# 将文件中的数据进行重定向
$ ssh user@remote_host 'echo' < file

# 在远程主机中执行图形化命令
# 对此，你需要像这样设置变量$DISPLAY：
$ ssh user@host "export DISPLAY=:0 ; command1; command2"""
# 这将启用远程主机上的图形化输出。如果你想在本地主机上也显示图形化输出，使用SSH的X11转发选项（forwarding option）：
$ ssh -X user@host "command1; command2
```

### 7.5 通过网络传输文件 

计算机联网的主要目的就是资源共享。在资源共享方面，使用最多的是文件共享。有多种方法可以用来在网络中传输文件。这则攻略就讨论了如何用常见的协议FTP、 SFTP、 RSYNC和SCP传输文件。 

通过FTP传输文件可以使用lftp命令，通过SSH连接传输文件可以使用sftp， RSYNC使用SSH与rsync命令， scp通过SSH进行传输。 

**文件传输协议（File Transfer Protocol， FTP） ：**

```bash
# 要连接FTP服务器传输文件，可以使用：
$ lftp username@ftphost
# 它会提示你输入密码，然后显示一个像下面那样的登录提示符：
lftp username@ftphost:~>
```

你可以在提示符后输入命令，如下所示。 

* 用cd directory改变目录。 
* 用lcd改变本地主机的目录。 
* 用mkdir创建目录。 
* 列出远程机器当前目录下的文件使用Is。 
* 用get filename下载文件：
  `lftp username@ftphost:~> get filename `
* 用put filename从当前目录上传文件：
  `lftp username@ftphost:~> put filename `
* 用quit退出lftp会话。 

**FTP自动传输 ：**

ftp是另一个可用于FTP文件传输的命令。相比较而言， lftp的用法更灵活。 lftp和ftp为用户启动一个交互式会话（通过显示消息来提示用户输入）。 

**SFTP（Secure FTP，安全FTP） ：**

```bash
$ cd /home/slynux
$ put testfile.jpg
$ get serverfile.jpg
# 运行sftp：
$ sftp user@domainname
```

**rsync命令 ：**

rsync广泛用于网络文件复制及系统备份。 

**SCP（Secure Copy Program，安全复制程序） ：**

```bash
$ scp filename user@remotehost:/home/path

$ scp user@remotehost:/home/path/filename filename
```

用SCP进行递归复制 :

```bash
$ scp -r /home/slynux user@remotehost:/home/backups
# 将目录/home/slynux递归复制到远程主机中
# scp的 -p 选项能够在复制文件的同时保留文件的权限和模式。
```

### 7.6 连接网线网络

我们需要用ifconfig分配IP地址和子网掩码才能连接上有线网络。对于无线网络来说，还需要其他工具（如iwconfig和iwlist）来配置更多的参数。 

iwlist工具扫描并列出可用的无线网络。用下面的命令进行扫描： 

```bash
$ iwlist scan
wlan0 		Scan completed :
			Cell 01 - Address: 00:12:17:7B:1C:65
					Channel:11
					Frequency:2.462 GHz (Channel 11)
					Quality=33/70 Signal level=-77 dBm
                    Encryption key:on
					ESSID:"model-2"
```

### 7.7 在本地挂载点上挂载远程驱动器 

sshfs允许你将远程文件系统挂载到本地挂载点上。 

```bash
# 将位于远程主机上的文件系统挂载到本地挂载点上：
$ sshfs -o allow_other user@remotehost:/home/path /mnt/mountpoint
Password:

# 完成任务后，可用下面的方法卸载：
$ umount /mnt/mountpoint
```

### 7.8 网络流量与端口分析 

列出系统中的开放端口以及运行在端口上的服务的详细信息，可以使用以下命令： 

```bash
$ lsof -i

# 要列出本地主机当前的开放端口，可以使用：
$ lsof -i | grep ":[0-9]\+->" -o | grep "[0-9]\+" -o | sort | uniq
```

用netstat查看开放端口与服务 ：

```bash
# netstat -tnp列出开放端口与服务：
$ netstat -tnp
```

### 7.9 创建套接字

最简单的方法就是使用netcat命令（或nc）。我们需要两个套接字：一个用来侦听，一个用来连接。 

```bash
# 设置侦听套接字：
$ nc -l 1234
# 这会在本地主机的端口1234上创建一个侦听套接字。

# 连接到该套接字：
$ nc HOST 1234

# 要想发送消息，只需要在执行第2步操作的主机终端中输入信息并按回车键就行了。消息会出现在执行第1步操作的主机终端中。
```

在网络上进行快速文件复制 ：

```bash
# 在接收端执行下列命令：
$ nc -l 1234 > destination_filename

# 在发送端执行下列命令：
$ nc HOST 1234 < source_filename
```

### 7.10 iptables防火墙设置



```bash
# 阻塞发送到特定IP地址的流量：
$ iptables -A OUTPUT -d 8.8.8.8 -j DROP

# 阻塞发送到特定端口的流量：
$ iptables -A OUTPUT -p tcp -dport 21 -j DROP

#  iptables中的第一个选项-A表明向链（chain）中添加一条新的规则，该规则由后续参数给出。OUTPUT链，它可以对所有出站（outgoing）的流量进行控制。-d指定了所要匹配的分组目的地址。-j来使iptables丢弃（DROP）符合条件的分组。-p指定该规则是适用于TCP， -dport指定了对应的端口。

# 清除对iptables链所做出的所有改动。
$ iptables --flush
```

## 8 当个好管家

### 8.1 监视磁盘使用情况 

`df` 是disk free的缩写， `du` 是disk usage的缩写。 

```bash
# 找出某个文件（或多个文件）占用的磁盘空间：
$ du file.txt

# 要获得某个目录中所有文件的磁盘使用情况，并在每一行中显示各个文件的磁盘占用详情，可以使用：
$ du -a DIRECTORY

# 以KB、 MB或块（block）为单位显示磁盘使用情况
$ du -h FILENAME

# 显示磁盘使用总计, -c 可以输出作为命令参数的所有文件和目录的磁盘使用情况
$ du -c process_log.shpcpu.sh
4 process_log.sh
4 pcpu.sh
8 total

# -s（summarize，合计）则只输出合计数据。它可以配合 -h打印出人们易读的格式。
$ du -sh slynux
680K slynux

# 打印以字节（默认输出）为单位的文件大小：
$ du -b FILE(s)

# 打印以KB为单位的文件大小：
$ du -k FILE(s)

# 打印以MB为单位的文件大小：
$ du -m FILE(s)

# 打印以指定块为单位的文件大小：
$ du -B BLOCK_SIZE FILE(s)

# 从磁盘使用统计中排除部分文件
$ du --exclude "*.txt" FILES(s)
# 排除所有的.txt文件
$ du --exclude-from EXCLUDE.txt DIRECTORY
# EXCLUDE.txt包含了需要排除的文件列表

# --max-depth指定du应该遍历的目录层次的最大深度。
$ du --max-depth 2 DIRECTORY

# 找出指定目录中最大的10个文件
$ du -ak /home/slynux | sort -nrk 1 | head -n 4

$ find . -type f -exec du -k {} \; | sort -nrk 1 | head
```

du提供磁盘使用情况信息，而df提供磁盘可用空间信息。 

```bash
$ df -h
Filesystem 			Size 	Used 	Avail 	Use% 	Mounted on
/dev/sda1 			9.2G 	2.2G 	6.6G 	25% 	/
none 				497M 	240K 	497M 	1% 		/dev
none 				502M 	168K 	501M 	1% 		/dev/shm
none 				502M 	88K 	501M 	1% 		/var/run
none 				502M 	0 		502M 	0% 		/var/lock
none 				502M 	0 		502M 	0% 		/lib/init/rw
none 				9.2G 	2.2G 	6.6G 	25% 	/var/lib/ureadahead/debugfs
```

### 8.2 计算命令执行时间

* real: %e 
* user: %U 
* sys: %S 

```bash
$ time COMMAND

# 可以用选项-o filename将相关的时间统计信息写入文件：
$ /usr/bin/time -o output.txt COMMAND

# 要将命令执行时间添加到文件而不影响其原有内容，使用选项-a以及-o：
$ /usr/bin/time -a -o output.txt COMMAND

# 创建格式化输出：
$ /usr/bin/time -f "Time: %U" -a -o timing.log uname
Linux

# 用错误重定向操作符（2>）对时间信息重定向。
$ /usr/bin/time -f "Time: %U" uname> command_output.txt 2>time.log
$ cat time.log
Time: 0.00
$ cat command_output.txt
Linux

# 使用参数%Z显示系统页面大小：
$ /usr/bin/time -f "Page size: %Z bytes" ls> /dev/null
Page size: 4096 bytes
```

三种不同类型的时：

* Real时间指的是挂钟时间（wall clock time），也就是命令从开始执行到结束的时间。这段时间包括其他进程所占用的时间片（time slice）以及进程被阻塞时所花费的时间（例如，为等待I/O操作完成所用的时间）。 
* User时间是指进程花费在用户模式（内核之外）中的CPU时间。这是唯一真正用于执行进程所花费的时间。执行其他进程以及花费在阻塞状态中的时间并没有计算在内。 
* Sys时间是指进程花费在内核中的CPU时间。它代表在内核中执行系统调用所使用的时间，这和库代码（library code）不同，后者仍旧运行在用户空间。与“user时间”类似，这也是真正由进程使用的CPU时间。 

time命令 一些可以使用的参数：

| 参数   | 描述                                       |
| ---- | ---------------------------------------- |
| %C   | 进行计时的命令名称以及命令行参数                         |
| %D   | 进程非共享数据区域的大小，以KB为单位                      |
| %E   | 进程使用的real时间（挂钟时间），显示格式为[小时:]分钟:秒         |
| %x   | 命令的退出状态                                  |
| %k   | 进程接收到的信号数量                               |
| %W   | 进程被交换出主存的次数                              |
| %Z   | 系统的页面大小。这是一个系统常量，但在不同的系统中，这个常量值也不同       |
| %P   | 进程所获得的CPU时间百分比。这个值等于user+system时间除以总运行时间。结果以百分比形式显示 |
| %K   | 进程的平均总（data+stack+text）内存使用量，以KB为单位      |
| %w   | 进程主动进行上下文切换的次数，例如等待I/O操作完成               |
| %c   | 进程被迫进行上下文切换的次数（由于时间片到期）                  |

### 8.3 收集与当前登录用户、启动日志及启动故障的相关信息 

```bash
# 获取当前登录用户的相关信息：
$ who
slynux 	pts/0 	2010-09-29 05:24 (slynuxs-macbook-pro.local)
slynux 	tty7 	2010-09-29 07:08 (:0)

# 获得有关登录用户更详细的信息：
$ w
  07:09:05 up 1:45, 2 users, load average: 0.12, 0.06, 0.02
USER 	TTY 	FROM 	LOGIN@ 	IDLE 	JCPU 	PCPU 	WHAT
slynux 	pts/0 	slynuxs 05:24 	0.00s 	0.65s 	0.11s 	sshd: slynux
slynux 	tty7 	:0		07:08 	1:45m 	3.28s 	0.26s 	gnome-session
# 第一行列出了当前时间，系统运行时间，当前登录的用户数量以及过去的1分钟、 5分钟、 15分钟内的系统平均负载。接下来的每一行显示了每一个登录用户的详细信息，其中包括登录名、 TTY、远程主机、登录时间、空闲时间、自该用户登录后所使用的总CPU时间、当前运行进程所使用的CPU时间以及进程所对应的命令行。

# 列出当前登录主机的用户列表：
$ users
slynux slynux slynux hacker
$ users | tr ' ' '\n' | sort | uniq
slynux
hacker

# 查看系统已经加电运行了多长时间：
$ uptime
21:44:33 up 3:17, 8 users, load average: 0.09, 0.14, 0.09
$ uptime | grep -Po '\d{2}\:\d{2}\:\d{2}'

# 获取上一次启动以及用户登录会话的信息：
$ last
slynux tty7 :0 Tue Sep 28 18:27 still logged in
reboot system boot 2.6.32-21-generic Tue Sep 28 18:10 - 21:46 (03:35)
slynux pts/0 :0.0 Tue Sep 28 05:31 - crash (12:39)
# last命令可以提供登录会话信息。它实际上是一个系统登录日志，包括了登录tty、登录时间、状态等信息。
# last命令以日志文件/var/log/wtmp作为输入日志数据。它也可以用选项-f明确地指定日志文件。例如：
$ last -f /var/log/wtmp

# 获取单个用户登录会话的信息：
$ last USER

# 获取重启会话（reboot session）信息：
$ last reboot
reboot system boot 2.6.32-21-generi Tue Sep 28 18:10 - 21:48 (03:37)
reboot system boot 2.6.32-21-generi Tue Sep 28 05:14 - 21:48 (16:33)

# 获取失败的用户登录会话信息：
$ lastb
test tty8 :0 Wed Dec 15 03:56 - 03:56 (00:00)
slynux tty8 :0 Wed Dec 15 03:55 - 03:55 (00:00)
```

### 8.4 使用 watch 监视命令输出 

watch命令可以用来在终端中以固定的间隔监视命令输出。 

```bash
$ watch ls

$ watch 'ls -l | grep "^d"'
# 只列出目录
# 命令默认每2秒更新一次输出。

# -n SECOND指定更新输出的时间间隔。例如：
$ watch -n 5 'ls -l'
# 以5秒为间隔，监视ls -l的输出

# 突出标示watch输出中的差异, -d 可以启用这一功能：
$ watch -d 'COMMANDS'
```

### 8.5 用 logrotate 管理日志文件 

用一种被称为轮替（rotation）的技术来限制日志文件的体积，一旦它超过了限定的大小，就对其内容进行抽取（strip），同时将 日志文件中的旧条目存储到日志目录中的归档文件内。旧的日志文件就会得以保存以便随后参阅。 

`logrotate` 的配置目录位于/etc/logrotate.d。 

```bash
$ cat /etc/logrotate.d/program
/var/log/program.log {
missingok
notifempty
size 30k
compress
weekly
rotate 5
create 0600 root root
}
```

配置文件中各个参数的含义：

| 参数                    | 描述                                       |
| --------------------- | ---------------------------------------- |
| missingok             | 如果日志文件丢失，则忽略；然后返回（不对日志文件进行轮替）            |
| notifempty            | 仅当源日志文件非空时才对其进行轮替                        |
| size 30k              | 限制实施轮替的日志文件的大小。可以用1M表示1MB                |
| compress              | 允许用gzip压缩较旧的日志                           |
| weekly                | 指定进行轮替的时间间隔。可以是weekly、 yearly或daily      |
| rotate 5              | 这是需要保留的旧日志文件的归档数量。在这里指定的是5，所以这些文件名将会是program.log.1.gz、 program.log.2.gz等直到program.log.5.gz |
| create 0600 root root | 指定所要创建的归档文件的模式、用户以及用户组                   |

### 8.6 用 syslog 记录日志 

每一个标准应用进程都可以利用syslog记录日志信息。 

使用命令logger通过syslogd记录日志。 

Linux中一些重要的日志文件 ：

| 日志文件                | 描述              |
| ------------------- | --------------- |
| /var/log/boot.log   | 系统启动信息          |
| /var/log/httpd      | Apache Web服务器日志 |
| /var/log/messages   | 发布内核启动信息        |
| /var/log/auth.log   | 用户认证日志          |
| /var/log/dmesg      | 系统启动信息          |
| /var/log/mail.log   | 邮件服务器日志         |
| /var/log/Xorg.0.log | X服务器日志          |

```bash
# 向系统日志文件/var/log/message中写入日志信息：
$ logger This is a test log line
$ tail -n 1 /var/log/messages
Sep 29 07:47:44 slynux-laptop slynux: This is a test log line
 
# 如果要记录特定的标记（tag），可以使用：
$ logger -t TAG This is a message
$ tail -n 1 /var/log/messages
Sep 29 07:48:42 slynux-laptop TAG: This is a message
# 但是当logger发送消息时，它用标记字符串来确定应该记录到哪一个日志文件中。 syslogd使用与日志相关联的TAG来决定应该将其记录到哪一个文件中。你可以从/etc/rsyslog.d/目录下的配置文件中看到标记字符串以及与其相关联的日志文件。

# 要将另一个日志文件的最后一行记录到系统日志中，可以使用：
$ logger -f /var/log/source.log
```

### 8.7 通过监视用户登录找出入侵者 

入侵者定义为：屡次试图登入系统达两分钟以上，并且期间的登录过程全部失败。凡是这类用户都应该被检测出来并生成包含以下细节信息的报告： 

* 试图登录的账户 
* 试图登录的次数 
* 攻击者的IP地址 
* IP地址所对应的主机 
* 进行登录的时间段 

为了处理SSH登录失败的情况，还得知道用户认证会话日志会被记录在日志文件/var/log/auth.log中。脚本需要扫描这个日志文件来检测出失败的登录信息，执行各种检查来获取所需要的数据。我们可以用host命令找出IP地址所对应的主机。 

### 8.8 监视磁盘活动 

```bash
# 交互式监视, iotop的-o选项只显示出那些正在进行I/O活动的进程：
$ iotop -o

# 用于shell脚本的非交互式用法：
$ iotop -b -n 2

# 监视特定进程
$ iotop -p PID
```

### 8.9 检查磁盘及文件系统错误 

使用fsck的各种选项对文件系统错误进行检查和修复。 

```bash
# 要检查分区或文件系统的错误，只需要将路径作为fsck的参数：
$ fsck /dev/sdb3
fsck from util-linux 2.20.1
e2fsck 1.42.5 (29-Jul-2012)
HDD2 has been mounted 26 times without being checked, check forced.
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
HDD2: 75540/16138240 files (0.7% non-contiguous), 48756390/64529088 blocks

# 检查/etc/fstab中所配置的所有文件系统：
$ fsck -A
# 该命令会依次检查/etc/fstab中列出的文件系统。 fstab文件对磁盘及其挂载点之间的映射关系进行了配置，以便于更便捷地挂载文件系统

# 指定fsck自动修复错误，无需询问是否进行修复：
$ fsck -a /dev/sda2

# 模拟fsck要执行的操作：
$ fsck -AN
fsck from util-linux 2.20.1
[/sbin/fsck.ext4 (1) -- /] fsck.ext4 /dev/sda8
[/sbin/fsck.ext4 (1) -- /home] fsck.ext4 /dev/sda7
[/sbin/fsck.ext3 (1) -- /media/Data] fsck.ext3 /dev/sda6
```

## 9 管理重任

### 9.1 收集进程信息  

```bash
# 为了包含更多的信息，可以使用-f（表示full）来显示多列，如下所示：
$ ps -f
UID PID PPID C STIME TTY TIME CMD
slynux 1220 1219 0 18:18 pts/0 00:00:00 -bash
slynux 1587 1220 0 18:59 pts/0 00:00:00 ps -f
# 使用选项 -e（every）。选项-ax（all）也可以生成同样的输出。

# 运行如下命令之一： ps –e， ps –ef， ps -ax或ps –axf。
$ ps -e | head
PID TTY TIME CMD
1 ? 00:00:00 init
2 ? 00:00:00 kthreadd
3 ? 00:00:00 migration/0
4 ? 00:00:00 ksoftirqd/0
5 ? 00:00:00 watchdog/0
6 ? 00:00:00 events/0
7 ? 00:00:00 cpuset
8 ? 00:00:00 khelper
9 ? 00:00:00 netns

# 用 -o 来指定想要显示的列，以便只打印出我们需要的内容。
# -o 的参数以逗号操作符（,）作为定界符。值得注意的是，逗号操作符与它分隔的参数之间是没有空格的。
# -e和过滤器结合使用没有任何实际效果，依旧会显示所有的进程。
# 示例如下，其中comm表示COMMAND， pcpu表示CPU占用率：
$ ps -eo comm,pcpu | head
COMMAND %CPU
init 0.0
kthreadd 0.0
migration/0 0.0
ksoftirqd/0 0.0
watchdog/0 0.0
events/0 0.0
cpuset 0.0
khelper 0.0
netns 0.0
```

选项-o可以使用不同的参数：

| 参数    | 描述         |
| ----- | ---------- |
| pcpu  | CPU占用率     |
| pid   | 进程ID       |
| ppid  | 父进程ID      |
| pmem  | 内存使用率      |
| comm  | 可执行文件名     |
| cmd   | 简单命令       |
| user  | 启动进程的用户    |
| nice  | 优先级        |
| time  | 累计的CPU时间   |
| etime | 进程启动后流逝的时间 |
| tty   | 所关联的TTY设备  |
| euid  | 有效用户ID     |
| stat  | 进程状态       |

```bash
# top, 默认会输出一个占用CPU最多的进程列表。输出结果每隔几秒就会更新。
$ top

# 根据参数对ps输出进行排序
$ ps -eo comm,pcpu --sort -pcpu | head
COMMAND 			%CPU
Xorg 				0.1
hald-addon-stor 	0.0
ata/0 				0.0
scsi_eh_0 			0.0
gnome-settings- 	0.0
init 				0.0
hald 				0.0
pulseaudio 			0.0
gdm-simple-gree 	0.0
$ ps -eo comm,pid,pcpu,pmem | grep bash
bash 		1255 	0.0 	0.3
bash 		1680 	5.5 	0.3

# 找出给定命令名所对应的进程ID，在参数后加上=就可以移除列名。
$ ps -C bash -o pid=
1255
1680
$ pgrep bash
1255
1680

# 如果不使用换行符作为定界符，而是要自行指定可以像下面这样：
$ pgrep bash -d ":"
1255:1680

# 指定进程的用户（拥有者）列表：
$ pgrep -u root,slynux COMMAND

# 根据真实用户或ID以及有效用户或ID过滤ps输出
 用 -u EUSER1,EUSER2 …，指定有效用户列表；
 用 -U RUSER1,RUSER2 …，指定真实用户列表
$ ps -u root -U root -o user,pcpu

# 用TTY过滤ps输出, 可以通过指定进程所属的TTY选择ps的输出。用选项 -t指定TTY列表：
$ ps -t pts/0,pts/1
PID TTY TIME CMD
1238 pts/0 00:00:00 bash
1835 pts/1 00:00:00 bash
1864 pts/0 00:00:00 ps

# 进程线程的相关信息
# 通常与进程线程相关的信息在ps输出中是看不到的。我们可以用选项 –L 在ps输出中显示线程的相关信息。这会显示出两列： NLWP和NLP。 NLWP是进程的线程数量， NLP是ps输出中每个条目的线程ID。例如：
$ ps -eLf

# 指定输出宽度以及所要显示的列
# 可以按照你自己的使用方式来进行应用。尝试以下选项:
 -f ps –ef
 u ps -e u
 ps ps -e w（w表示宽松输出）

# 显示进程的环境变量
# 了解某个进程依赖哪些环境变量，这类信息我们通常都用得着。进程的运行方式可能极其依赖某组环境变量。我们可以利用环境变量调试并修复与进程相关的问题。
$ ps -eo pid,cmd e | tail -n 3
1162 hald-addon-acpi: listening on acpid socket /var/run/acpid.socket
1172 sshd: slynux [priv]
1237 sshd: slynux@pts/0
1238 -bash USER=slynux LOGNAME=slynux HOME=/home/slynux
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games
MAIL=/var/mail/slynux SHELL=/bin/bash SSH_CLIENT=10.211.55.2 49277 22
SSH_CONNECTION=10.211.55.2 49277 10.211.55.4 22 SSH_TTY=/dev/pts/0 TERM=xterm-color
LANG=en_IN XDG_SESSION_COOKIE=d1e96f5cc8a7a3bc3a0a73e44c95121a-1286499339.
592429-1573657095
```

### 9.2 which、 whereis、 file、 whatis与平均负载 

```bash
# which, which命令用来找出某个命令的位置。
$ which ls
/bin/ls

# whereis
# whereis与which命令类似，但它不仅返回命令的路径，还能够打印出其对应的命令手册的位置以及命令源代码的路径（如果有的话）
$ whereis ls
ls: /bin/ls /usr/share/man/man1/ls.1.gz

# file
$ file FILENAME
# 该命令会打印出与该文件类型相关的细节信息。
$ file /bin/ls
/bin/ls: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked
(uses shared libs), for GNU/Linux 2.6.15, stripped

# whatis, whatis命令会输出作为参数的命令的简短描述信息。
$ whatis ls
ls (1) 			- list directory contents

# 平均负载
$ uptime
12:40:53 up 6:16, 2 users, load average: 0.00, 0.00, 0.00
```

### 9.3 杀死进程以及发送或响应信号 

信号是Linux中的一种进程间通信机制。 当进程接收到一个信号时，它会通过执行对应的信号处理程序（signal handler）来进行响应。 

```bash
# 列出所有可用的信号：
$ kill -l

# 终止进程：
$ kill PROCESS_ID_LIST
# kill命令默认发出一个TERM信号。进程ID列表使用空格作为进程ID之间的定界符。

# 要通过kill命令向进程发送指定的信号，可以使用：
$ kill -s SIGNAL PID
# 参数SIGNAL要么是信号名称，要么是信号编号。

# 我们经常要强行杀死进程，可以使用：
$ kill -s SIGKILL PROCESS_ID
或者
$ kill -9 PROCESS_ID
```

常用到的信号量：

* SIGHUP 1——对控制进程或终端的终结进行挂起检测（hangup detection）
* SIGINT 2——当按下Ctrl + C时发送该信号 
* SIGKILL 9——用于强行杀死进程 
* SIGTERM 15——默认用于终止进程 
* SIGTSTP 20——当按下Ctrl + Z时发送该信号 

```bash
# killall命令通过命令名终止进程：
$ killall process_name

# 通过名称向进程发送信号：
$ killall -s SIGNAL process_name

# 通过名称强行杀死进程：
$ killall -9 process_name

# pkill命令和kill命令类似，不过默认情况下pkill接受的是进程名，而非进程ID。例如：
$ pkill process_name
$ pkill -s SIGNAL process_name
# pkill不支持信号名称。

# 捕捉并响应信号
# trap命令在脚本中用来为信号分配信号处理程序。
$ trap 'signal_handler_function_name' SIGNAL LIST
```

### 9.4 向用户终端发送消息 

```bash
# wall命令用来向当前所有登录用户的终端写入消息。
$ cat message | wall
或者
$ wall< message
Broadcast Message from slynux@slynux-laptop
(/dev/pts/1) at 12:54 ...
This is a messag
```

### 9.5 采集系统信息 

```bash
# 打印当前系统的主机名：
$ hostname
或者
$ uname -n

# 打印Linux内核版本、硬件架构等详细信息：
$ uname -a

# 打印内核发行版本：
$ uname -r

# 打印主机类型：
$ uname -m

# 打印CPU相关信息：
$ cat /proc/cpuinfo
# 获取处理器名称：
$ cat /proc/cpuinfo | sed -n 5p

# 打印内存的详细信息：
$ cat /proc/meminfo
# 打印系统可用内存总量：
$ cat /proc/meminfo | head -1
MemTotal: 1026096 kB

# 列出系统的分区信息：
$ cat /proc/partitions
或者
$ fdisk -l #如果没有输出，切换到root用户执行该命令

# 获取系统的详细信息：
$ lshw #建议以root用户来执行
```

### 9.6 使用 proc 采集信息 

以Bash为例，它的进程ID是4295（pgrep bash），那么就会有一个对应的目录/proc/4295。进程对应的目录中包含了大量有关进程的信息。 /proc/PID中一些重要的文件如下所示。 

* environ：包含与进程相关的环境变量。使用cat /proc/4295/environ，可以显示所有传递给该进程的环境变量 

* cwd： 是一个到进程工作目录（working directory）的符号链接 

* exe：是一个到当前进程所对应的可执行文件的符号链接 

  $ readlink /proc/4295/exe
  /bin/bash

* fd：包含了进程所使用的文件描述符 

### 9.7 用 cron 进行调度 

**crontab任务配置基本格式：**

```
*  			*　 			*　 			*　 		  *　　					command
分钟(0-59)　小时(0-23)　	日期(1-31)　 月份(1-12)　星期(0-6,0代表星期天)　  命令
```

cron表中的每一个条目都由6部分组成，并按照下列顺序排列： 

- 分钟（0～59） 
- 小时（0～23） 
- 天（1～31） 
- 月份（1～12） 
- 工作日（0～6） 
- 命令（在指定时间执行的脚本或命令） 

星号（*）指定命令应该在每个时间段执行。 

除了数字还有几个个特殊的符号就是 `"*"` 、`"/"` 和 `"-"` 、`","` ，`*` 代表所有的取值范围内的数字，`"/"` 代表每的意思, `"*/5"` 表示每5个单位，`"-"` 代表从某个数字到某个数字, `","` 分开几个离散的数字。以下举几个例子说明问题： 

```bash
# 指定每小时的第5分钟执行一次ls命令
5 * * * * ls 

# 指定每天的 5:30 执行ls命令
30 5 * * * ls 

# 指定每月8号的7：30分执行ls命令
30 7 8 * * ls 

# 指定每年的6月8日5：30执行ls命令
30 5 8 6 * ls 

# 指定每星期日的6:30执行ls命令 [ 注：0表示星期天，1表示星期1，以此类推，也可以用英文来表示，sun表示星期天，mon表示星期一等。 ]
30 6 * * 0 ls 

# 每月10号及20号的3：30执行ls命令 [注：“，”用来连接多个不连续的时段 ]
30 3 10,20 * * ls 

# 每天8-11点的第25分钟执行ls命令 [注：“-”用来连接连续的时段 ]
25 8-11 * * * ls 

# 每15分钟执行一次ls命令 [即每个小时的第0 15 30 45 60分钟执行ls命令 ]
*/15 * * * * ls 

# 每个月中，每隔10天6:30执行一次ls命令[即每月的1、11、21、31日是的6：30执行一次ls命令。 ]
30 6 */10 * * ls 

# 每天7：50以root 身份执行/etc/cron.daily目录中的所有可执行文件
50 7 * * * root run-parts /etc/cron.daily   # [ 注：run-parts参数表示，执行后面目录中的所有可执行文件。 ]
```

**配置用户定时任务的语法：**

```bash
$ crontab [-u user]file

$ crontab -u user[-i]
```

参数与说明：

* crontab -u		//设定某个用户的cron服务
* crontab -l        //列出某个用户cron服务的详细内容
* crontab -r              //删除没个用户的cron服务
* crontab -e             //编辑某个用户的cron服务

### 9.8 从终端截图 

```bash
# 取整个屏幕：
$ import -window root screenshot.png

# 手动选择部分区域进行抓取：
$ import screenshot.png

# 抓取特定窗口：
$ import -window window_id screenshot.png
```
