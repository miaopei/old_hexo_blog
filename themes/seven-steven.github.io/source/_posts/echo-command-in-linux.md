---
title: Linux 命令 --- echo
hide: false
categories:
  - coding
  - linux
toc: true
tags:
  - shell
abbrlink: 11884
date: 2018-12-31 16:10:49
---

### 简介

`echo` 命令用于在 shell 中打印 shell 变量的值, 或者直接输出指定的字符串. 

linux 的 echo 命令在 shell 编程中极为常用, 在终端下打印变量 value 的时候也是常常用到的, 因此有必要了解下 echo 的用法. 

<!-- more -->

### 语法

```shell
echo [选项] [参数]
```

#### 选项

* -n   ---   不打印尾部换行

* -e   ---   启用反斜线 `\` 转义

  使用 `-e` 选项时, 若参数中出现以下字符, 会加以特别处理: 

  * `\\` 反斜线
  * `\a` 警告音
  * `\b` 回退 (删除前一个字符)
  * `\e` 删除此标志后的一个字符
  * `\c` 不产生进一步输出 (\c 后面的字符不会被输出)
  * `\f` 换行但光标仍旧停留在原来的位置

  * `\r` 光标移至行首，但不换行

  * `\n` 换行
  * `\t` 水平制表符
  * `\v` 垂直制表符
  * `\0NNN` 打印八进制值为 NNN 的字符
  * `\xHH` 打印十六进制值为 HH 的字符

* -E   ---   禁用反斜线 `\` 转义 (默认选项)

  默认情况下, echo 命令不会对反斜线 `\` 进行转义

  *Ubuntu 18.10 环境下测试 `echo` 命令默认会对反斜线进行转义, 与文档说法相悖. 所以使用 `echo` 命令时最好指明参数.*

* --help   ---   显示帮助文档

  *Ubuntu 18.10 环境下测试此选项无效, 命令会输出 "--help" 字符串.*

* --version   ---   显示版本信息

  *Ubuntu 18.10 环境下测试此选项无效, 命令会输出 "--version"  字符串.*

#### 参数

* 常规字符串

  直接打印字符串. 

* 系统变量

  打印变量值. 

### 示例

* 打印字符串

  ```shell
  echo I love Linux
  ```

  ![echo](https://qiniu.diqigan.cn/19-1-5/84112940.jpg)

* 打印变量值

  ```shell
  echo $PATH
  ```

  ![$PATH](https://qiniu.diqigan.cn/19-1-5/2236821.jpg)

* 打印转义字符

  * 反斜线 `\\` 

    ```shell
    echo -e \\
    ```

    ![反斜线](https://qiniu.diqigan.cn/19-1-5/85267282.jpg)

  * 警告音 `\a` 

    ```shell
    echo -e \\a
    ```

    系统会发出警告音. 

  * 回退 `\b` 

    ```shell
    echo -e 123\\b456
    ```

    ![\b](https://qiniu.diqigan.cn/19-1-5/16871306.jpg)

    *Ubuntu 18.10 环境下测试, 当 `\\b` 位于字符串末尾时, 不会产生回退效果.*

  * 删除符 `\e` 

    ```shell
    echo -e \\e123
    ```

    ![删除符](https://qiniu.diqigan.cn/19-1-5/63546860.jpg)

  * 终止输出 `\c` 

    ```shell
    echo -e 1234\\c5678
    ```

    ![终止输出](https://qiniu.diqigan.cn/19-1-5/17588119.jpg)

  * 水平制表符 `\t` 

    ```shell
    echo -e aaa\\tbbb\\tccc\\tddd\\teee
    ```

    ![水平制表符](https://qiniu.diqigan.cn/19-1-5/52362312.jpg)

  * 垂直制表符 `\v` 

    ```shell
    echo -e aaa\\vbbb\\vccc\\vddd\\veee
    ```

    ![垂直制表符](https://qiniu.diqigan.cn/19-1-5/34692307.jpg)

  * 换行符 `\n` 

    ```shell
    echo -e 1\\n2\\n3\\n4\\n5
    ```

    ![换行符](https://qiniu.diqigan.cn/19-1-5/69802571.jpg)

  * 光标移至行首，但不换行 `\r` 

    ```shell
    echo -e 123456789\\rabcd
    ```

    ![\r](https://qiniu.diqigan.cn/19-1-5/73586171.jpg)

    `\r` 会将光标移至行首, 所以 "abcd" 覆盖掉了先前打印的 "1234", 产生了 "abcd456789" 的输出. 

  * 换行但光标仍旧停留在原来的位置 `\f` 

    ```shell
    echo -e 1\\f2\\f3\\f4\\f5
    ```

    ![\f](https://qiniu.diqigan.cn/19-1-5/43842110.jpg)

    `\f` 与垂直制表符 `\v` 并不一样, 命令行下展现不出他们之间的差异, 参照 `r` 符号理解即可. 

  * 八进制值为 NNN 的字符

    ```shell
    echo -e \\0101
    ```

    ![\0NNN](https://qiniu.diqigan.cn/19-1-5/30160840.jpg)

    八进制值 101 对应十进制值 65, 也就是字符 "A". 

  * 十六进制值为HH的字符

    ```shell
    echo -e \\x41
    ```

    ![A](https://qiniu.diqigan.cn/19-1-5/78588645.jpg)

    十六进制值 41 对应十进制值 65, 也是字符 "A". 

* 打印颜色 `"\e[M;NmString"` 
  * M 代表文字属性: 0 关闭所有属性、1 设置高亮度（加粗）、4 下划线、5 闪烁、7 反显、8 消隐
  * N 代表文字颜色: 
    * 前景色: 重置=0，黑色=30，红色=31，绿色=32，黄色=33，蓝色=34，洋红=35，青色=36，白色=37
    * 背景色: 重置=0，黑色=40，红色=41，绿色=42，黄色=43，蓝色=44，洋红=45，青色=46，白色=47
  * 必须使用双引号包围参数. 

* 设置文字颜色

  ```shell
  echo -e "\e[31mThis is red text"
  ```

  ![文字颜色](https://qiniu.diqigan.cn/19-1-5/88777676.jpg)

  使用 `\e[Nm` 设置文字颜色: 

  N 代表颜色码: 重置=0，黑色=30，红色=31，绿色=32，黄色=33，蓝色=34，洋红=35，青色=36，白色=37

* 设置文字背景色

  ```shell
  echo -e "\e[42mGreed Background"
  ```

  ![背景色](https://qiniu.diqigan.cn/19-1-5/40546717.jpg)

  使用 `\e[Nm` 设置文字背景色: 

  N 代表颜色码: 重置=0，黑色=40，红色=41，绿色=42，黄色=43，蓝色=44，洋红=45，青色=46，白色=47

* 文字闪动

  ```shell
  echo -e "\033[37;31;5mMySQL Server Stop...\033[39;49;0m"
  ```

### 参考文献

* man 文档
* [echo 命令，Linux echo 命令详解：输出指定的字符串或者变量 -  Linux 命令搜索引擎](https://wangchujiang.com/linux-command/c/echo.html) 
* [Linux中的15个‘echo’ 命令实例](https://linux.cn/article-3948-1.html)   ---    tecmint Avishek Kumar 