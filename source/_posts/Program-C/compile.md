---
title: Program-C 交叉编译
tags: c/c++
reward: true
categories: c/c++
toc: true
abbrlink: 39639
date: 2016-05-05 10:14:50
---

<!-- more -->

<img src="/images/imageProgramC/03_C语言概述.png">

# 建立ARM交叉编译环境arm-none-linux-gnueabi-gcc

```shell
# add2line：将你要找的地址转成文件和行号，它要使用 debug 信息
arm-none-linux-gnueabi-addr2line 

# ar：产生、修改和解开一个存档文件
arm-none-linux-gnueabi-ar 

# as：gnu的汇编器
arm-none-linux-gnueabi-as   

# ld：gnu 的连接器
arm-none-linux-gnueabi-ld 

# gprof：gnu 汇编器预编译器
arm-none-linux-gnueabi-gprof 

# nm：列出目标文件的符号和对应的地址
arm-none-linux-gnueabi-nm      

# objdump：显示目标文件的信息
arm-none-linux-gnueabi-objdump 

# readelf：显示 elf 格式的目标文件的信息
arm-none-linux-gnueabi-readelf 

# strings：打印出目标文件中可以打印的字符串，有个默认的长度，为4
arm-none-linux-gnueabi-strings 

# c++filt：C++ 和 java 中有一种重载函数，所用的重载函数最后会被编译转化成汇编的标，c++filt 就是实现这种反向的转化，根据标号得到函数名
arm-none-linux-gnueabi-c++filt 

# objcopy：将某种格式的目标文件转化成另外格式的目标文件
arm-none-linux-gnueabi-objcopy 

# ranlib：为一个存档文件产生一个索引，并将这个索引存入存档文件中
arm-none-linux-gnueabi-ranlib  

# size：显示目标文件各个节的大小和目标文件的大小
arm-none-linux-gnueabi-size    

# strip：剥掉目标文件的所有的符号信息
arm-none-linux-gnueabi-strip
```

# C调用C++库和C++调用C库的方法

> [C调用C++库和C++调用C库的方法](https://blog.csdn.net/shaosunrise/article/details/81176880)

## C++调用C的静态库/动态库

C++ 调用 C 的函数比较简单，直接使用 `extern "C" {}` 告诉编译器用 C 的规则去调用 C 函数就可以了。

**CAdd.h**

```c
int cadd(int x, int y);
```

**CAdd.c**

```c
#include "CAdd.h"
#include <stdio.h>

int cadd(int x, int y) {
	printf("from C function.\n");
	return (x + y);
}
```

**编译libCAdd.a**

```shell
gcc -c CAdd.c           # 生成CAdd.o
ar -r libCAdd.a CAdd.o  # 归档生成libCAdd.a
```

**编译动态库 libCAdd.so**

```shell
gcc -shared -o libCAdd.so CAdd.c
```

**cppmain.cpp**

```c
#include <stdio.h>

extern "C" {
	#include "CAdd.h"
}

int main()
{
    int sum = cadd(1, 2);
    printf("1+2 = %d\n", sum);
    return 0;
}
```

**编译main**

`-l` 指定库名称，优先链接so动态库，没有动态库再链接 `.a` 静态库。

```shell
g++ -o cppmain cppmain.cpp -L. -lCAdd
```

**运行** 

如果链接的是静态库就可以直接运行了，如果链接的是动态库可能会提示 

```sehll
./cppmain: error while loading shared libraries: libCAdd.so: cannot open shared object file: No such file or directory
```

是因为Linux系统程序和Windows不一样，Linux系统只会从系统环境变量指定的路径加载动态库，可以把生成的动态库放到系统目录，或者执行 `export LD_LIBRARY_PATH=./` 设置当前路径为系统链接库目录就可以了。

**注释 **

这里是在 include 头文件的外面包裹了 `extern "C" { }`，是告诉编译器以 C 语言的命名方式去加载这个符号。还有一种比较常见的方式是在头文件中进行编译声明，如下所示，这样的话，无论 C 还是 C++ 直接正常include就可以使用了。

**CAdd.h**

```c

```

## C 调用 C++ 的静态库

C 语言没法直接调用 C++ 的函数，**但可以使用包裹函数来实现**。C++ 文件 `.cpp` 中可以调用 C 和 C++ 的函数，但是 C 代码 `.c` 只能调用 C 的函数，所以可以用包裹函数去包裹C ++ 函数，然后把这个包裹函数以 C 的规则进行编译，这样 C 就可以调用这个包裹函数了。

**CppAdd.h**

```c
int cppadd(int x, int y);
```

**CppAdd.cpp**

```c
#include "CppAdd.h"
#include <stdio.h>

int cppadd(int x, int y) {
    printf("from C++ function.\n");
    return (x + y);
}
```

**编译静态库 libCppAdd.a**

```shell
g++ -c CppAdd.cpp
ar -r libCppAdd.a CppAdd.o
```

**CppAddWrapper.h**

```c
#ifdef __cplusplus
extern "C" {
#endif

int cppaddwrapper(int x, int y);

#ifdef __cplusplus
}
#endif
```

**CppAddWrapper.cpp**

```c
#include "CppAddWrapper.h"
#include <stdio.h>
#include "CppAdd.h"

int cppaddwrapper(int x, int y) {
    printf("from wrapper.\n");
    int sum = cppadd(x, y);
    return sum;
}
```

**编译 wrapper 静态库 libCppAddWrapper.a**

```shell
g++ -c CppAddWrapper.cpp
ar -r libCppAddWrapper.a CppAddWrapper.o
```

**main.c**

```c
#include "CppAddWrapper.h"
#include <stdio.h>

int main()
{
  int sum = cppaddwrapper(1, 2);
  printf("1+2 = %d\n", sum);
  return 0;
}
```

**编译 main，同时指定 libCppAdd.a 和 libCppAddWrapper.a。**

```shell
gcc -o main main.c -L. -lCppAddWrapper -lCppAdd
```

或者把 libCppAdd.a 合并到 libCppAddWrapper.a 中

```shell
ar -x libCppAdd.a         # 提取CppAdd.o
ar -x libCppAddWrapper.a  # 提取CppAddWrapper.o
ar -r libCppAddWrapper.a CppAdd.o CppAddWrapper.o # 打包libCppAddWrapper.a
gcc -o main main.c -L. -lCppAddWrapper  # 只需要连接libCppAddWrapper.a即可
```


如果是 C 调用 C++ 的 so 动态库的话，类似于调用静态库的方法应该也是有效的，太麻烦我没试过。

## 总结

**C/C++ 函数符号的区别**

C++ 可以兼容 C 的语法，C/C++ 主要的区别是编译函数符号规则不一样，C 语言代码编译后的函数名还是原来函数名，C++ 代码编译后的函数名带有参数信息。 

做个测试来检验一下。一个简单的函数，分别用 C 和 C++ 进行编译。 

**hello1.c**

```c
int test(int a, char* b){
    return a;
}
```

**hello2.cpp**

```c
int test(int a, char* b){
    return a;
}
```

**编译**

```shell
gcc -c hello1.c     # 生成hello1.o
g++ -c hello1.cpp   # 生成hello2.o
```

**查看符号表**

```shell
$ nm hello1.o
0000000000000000 T test
$ nm hello2.o
0000000000000000 T _Z4testiPc
```

从上面信息可以看出，C 语言编译后的函数符号还是原函数名，而 C++ 编译后的函数符号由test变成了 `_Z4testiPc`，从这个符号名字可以看出 test 前面有个数字 4 应该是函数名长度，test 后面 `iPc` 应该就是函数的参数签名。C++ 之所以这样规定编译后的函数符号是因为对面对象的 C++ 具有函数重载功能，以此来区分不同的函数。

**.so 动态库、.a 静态库和 .o 中间文件的关系**

程序的运行都要经过**编译和链接**两个步骤。假如有文件 `add.c`，可以使用命令 `gcc -c add.c` 进行编译，生成 add.o 中间文件，使用命令 `ar -r libadd.a add.o` 可以生成 `libadd.a` 静态库文件。静态库文件其实就是对 `.o` 中间文件进行的封装，使用 `nm libadd.a` 命令可以查看其中封装的中间文件以及函数符号。 

链接静态库就是链接静态库中的 `.o` 文件，这和直接编译多个文件再链接成可执行文件一样。 

动态链接库是程序执行的时候直接调用的“插件”，使用命令 `gcc -shared -o libadd.so add.c` 生成 so 动态库。动态库链接的时候可以像静态库一样链接，告诉编译器函数的定义在这个静态库中（避免找不到函数定义的错误），只是不把这个 so 打包到可执行文件中。如果没有头文件的话，可以使用 `dlopen/dlsum` 函数手动去加载相应的动态库。详细做法参考上一篇文章《[C语言调用so动态库的两种方式](https://blog.csdn.net/shaosunrise/article/details/81161064)》。



# ar nm 命令的详细解释

功能说明：建立或修改备存文件，或是从备存文件中抽取文件。

语　　法：`ar[-dmpqrtx][cfosSuvV][a<成员文件>][b<成员文件>][i<成员文件>][备存文件][成员文件]`

补充说明：ar 可让您集合许多文件，成为单一的备存文件。在备存文件中，所有成员文件皆保有原来的属性与权限。

参　　数：

```shell
# 指令参数
　-d 　删除备存文件中的成员文件。
　-m 　变更成员文件在备存文件中的次序。
　-p 　显示备存文件中的成员文件内容。
　-q 　将问家附加在备存文件末端。
　-r 　将文件插入备存文件中。
　-t 　显示备存文件中所包含的文件。
　-x 　自备存文件中取出成员文件。

# 选项参数
　a<成员文件> 　将文件插入备存文件中指定的成员文件之后。
　b<成员文件> 　将文件插入备存文件中指定的成员文件之前。
　c 　建立备存文件。
　f 　为避免过长的文件名不兼容于其他系统的ar指令指令，因此可利用此参数，截掉要放入备存文件中过长的成员文件名称。
　i<成员文件> 　将问家插入备存文件中指定的成员文件之前。
　o 　保留备存文件中文件的日期。
　s 　若备存文件中包含了对象模式，可利用此参数建立备存文件的符号表。
　S 　不产生符号表。
　u 　只将日期较新文件插入备存文件中。
　v 　程序执行时显示详细的信息。
　V 　显示版本信息。
```

## ar基本用法

ar命令可以用来创建、修改库，也可以从库中提出单个模块。库是一单独的文件，里面包含了按照特定的结构组织起来的其它的一些文件（称做此库文件的member）。原始文件的内容、模式、时间戳、属主、组等属性都保留在库文件中。

下面是ar命令的格式：

```shell
$ ar [-]{dmpqrtx}[abcfilNoPsSuvV][membername] [count] archive files...
```

例如我们可以用**ar rv libtest.a hello.o hello1.o**来生成一个库，库名字是test，链接时可以用-ltest链接。该库中存放了两个模块hello.o和hello1.o。选项前可以有‘-'字符，也可以没有。下面我们来看看命令的操作选项[和任](https://www.baidu.com/s?wd=%E5%92%8C%E4%BB%BB&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)选项。现在我们把{dmpqrtx}部分称为操作选项，而[abcfilNoPsSuvV]部分称为任选项。

{dmpqrtx} 中的操作选项在命令中只能并且必须使用其中一个，它们的含义如下：

- d：从库中删除模块。按模块原来的文件名指定要删除的模块。如果使用了任选项v则列出被删除的每个模块。
- m：该操作是在一个库中移动成员。当库中如果有若干模块有相同的符号定义(如函数定义)，则成员的位置顺序很重要。如果没有指定任选项，任何指定的成员将移到库的最后。也可以使用'a'，'b'，或'I'任选项移动到指定的位置。
- p：显示库中指定的成员到标准输出。如果指定任选项v，则在输出成员的内容前，将显示成员的名字。如果没有指定成员的名字，所有库中的文件将显示出来。
- q：快速追加。增加新模块到库的结尾处。并不检查是否需要替换。'a'，'b'，或'I'任选项对此操作没有影响，模块总是追加的库的结尾处。如果使用了任选项v则列出每个模块。 这时，库的符号表没有更新，可以用'ar s'或ranlib来更新库的符号表索引。
- r：在库中插入模块(替换)。当插入的模块名已经在库中存在，则替换同名的模块。如果若干模块中有一个模块在库中不存在，ar显示一个错误消息，并不替换其他同名模块。默认的情况下，新的成员增加在库的结尾处，可以使用其他任选项来改变增加的位置。
- t：显示库的模块表清单。一般只显示模块名。
- x：从库中提取一个成员。如果不指定要提取的模块，则提取库中所有的模块。

　　下面在看看可与操作选项结合使用的任选项：

- a：在库的一个已经存在的成员后面增加一个新的文件。如果使用任选项a，则应该为命令行中membername参数指定一个已经存在的成员名。
- b：在库的一个已经存在的成员前面增加一个新的文件。如果使用任选项b，则应该为命令行中membername参数指定一个已经存在的成员名。
- c：创建一个库。不管库是否存在，都将创建。
- f：在库中截短指定的名字。缺省情况下，文件名的长度是不受限制的，可以使用此参数将文件名截短，以保证与其它系统的兼容。
- i：在库的一个已经存在的成员前面增加一个新的文件。如果使用任选项i，则应该为命令行中membername参数指定一个已经存在的成员名(类似任选项b)。
- l：暂未使用
- N：与count参数一起使用，在库中有多个相同的文件名时指定提取或输出的个数。
- o：当提取成员时，保留成员的原始数据。如果不指定该任选项，则提取出的模块的时间将标为提取出的时间。
- P：进行文件名匹配时使用全路径名。ar在创建库时不能使用全路径名（这样的库文件不符合POSIX标准），但是有些工具可以。
- s：写入一个目标文件索引到库中，或者更新一个存在的目标文件索引。甚至对于没有任何变化的库也作该动作。对一个库做ar s等同于对该库做ranlib。
- S：不创建目标文件索引，这在创建较大的库时能加快时间。
- u：一般说来，命令ar r...插入所有列出的文件到库中，如果你只想插入列出文件中那些比库中同名文件新的文件，就可以使用该任选项。该任选项只用于r操作选项。
- v：该选项用来显示执行操作选项的附加信息。
- V：显示ar的版本。

## nm基本用法命令

nm用来列出目标文件的符号清单。下面是nm命令的格式：

```shell
nm [-a|--debug-syms][-g|--extern-only] [-B][-C|--demangle] [-D|--dynamic][-s|--print-armap][-o|--print-file-name][-n|--numeric-sort][-p|--no-sort][-r|--reverse-sort] [--size-sort][-u|--undefined-only] [-l|--line-numbers][--help][--version][-t radix|--radix=radix][-P|--portability][-f format|--format=format][--target=bfdname][objfile...]
```

如果没有为 nm 命令指出目标文件，则 nm 假定目标文件是a.out。下面列出该命令的任选项，大部分支持"-"开头的短格式和"—"开头的长格式。

- -A、-o或--print-file-name：在找到的各个符号的名字前加上文件名，而不是在此文件的所有符号前只出现文件名一次。

  例如nm libtest.a的输出如下：

  ```shell
  CPThread.o:
  00000068 T Main__8CPThreadPv
  00000038 T Start__8CPThread
  00000014 T _._8CPThread
  00000000 T __8CPThread
  00000000 ? __FRAME_BEGIN__
  .......................................
  # 则nm -A 的输出如下：
  libtest.a:CPThread.o:00000068 T Main__8CPThreadPv
  libtest.a:CPThread.o:00000038 T Start__8CPThread
  libtest.a:CPThread.o:00000014 T _._8CPThread
  libtest.a:CPThread.o:00000000 T __8CPThread
  libtest.a:CPThread.o:00000000 ? __FRAME_BEGIN__
  ..................................................................
  ```

- -a或--debug-syms：显示调试符号。

- -B：等同于--format=bsd，用来兼容MIPS的nm。

- -C或--demangle：将低级符号名解码(demangle)成用户级名字。这样可以使得C++函数名具有可读性。

- -D或--dynamic：显示动态符号。该任选项仅对于动态目标(例如特定类型的共享库)有意义。

- -f format：使用format格式输出。format可以选取bsd、sysv或posix，该选项在GNU的nm中有用。默认为bsd。

- -g或--extern-only：仅显示外部符号。

- -n、-v或--numeric-sort：按符号对应地址的顺序排序，而非按符号名的字符顺序。

- -p或--no-sort：按目标文件中遇到的符号顺序显示，不排序。

- -P或--portability：使用POSIX.2标准输出格式代替默认的输出格式。等同于使用任选项-f posix。

- -s或--print-armap：当列出库中成员的符号时，包含索引。索引的内容包含：哪些模块包含哪些名字的映射。

- -r或--reverse-sort：反转排序的顺序(例如，升序变为降序)。

- --size-sort：按大小排列符号顺序。该大小是按照一个符号的值与它下一个符号的值进行计算的。

- -t radix或--radix=radix：使用radix进制显示符号值。radix只能为"d"表示十进制、"o"表示八进制或"x"表示十六进制。

- --target=bfdname：指定一个目标代码的格式，而非使用系统的默认格式。

- -u或--undefined-only：仅显示没有定义的符号(那些外部符号)。

- -l或--line-numbers：对每个符号，使用调试信息来试图找到文件名和行号。对于已定义的符号，查找符号地址的行号。对于未定义符号，查找指向符号重定位入口的行号。如果可以找到行号信息，显示在符号信息之后。

- -V或--version：显示nm的版本号。

- --help：显示nm的任选项。

