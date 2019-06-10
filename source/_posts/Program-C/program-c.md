---
title: Program-C 基础
tags: Program-C
reward: true
categories: Program-C
toc: true
abbrlink: 39639
date: 2016-05-10 10:14:50
---

# C 语言基础

## 一、C 语言概述

<!-- more -->

<img src="/images/imageProgramC/03_C语言概述.png">

## 二、数据类型



<img src="/images/imageProgramC/04_数据类型.png">

## 三、字符串处理和函数

- 声明变量不需要建立存储空间，如：extern int a;

- 定义变量需要建立存储空间，如：int b;

- 全局数组若不初始化，编译器将其初始化为零。局部数组若不初始化，内容为随机值。

- 数字 0 (和字符 ‘\0’ 等价)结尾的char数组就是一个字符串，但如果char数组没有以数字0结尾，那么就不是一个字符串，只是普通字符数组，所以字符串是一种特殊的char的数组。

gets(str)与scanf(“%s”,str)的区别：

- gets(str)允许输入的字符串含有空格

- scanf(“%s”,str)不允许含有空格

- 注意：由于scanf()和gets()无法知道字符串s大小，必须遇到换行符或读到文件结尾为止才接收输入，因此容易导致字符数组越界(缓冲区溢出)的情况。

gets() 、puts()

```c
#include <stdio.h>
char *gets(char *s);
功能：从标准输入读入字符，并保存到s指定的内存空间，直到出现换行符或读到文件结尾为止。

int puts(const char *s);
功能：标准设备输出s字符串，在输出完成后自动输出一个'\n'。
```

fgets() 、fputs()

```c
#include <stdio.h>
char *fgets(char *s, int size, FILE *stream);
功能：从stream指定的文件内读入字符，保存到s所指定的内存空间，直到出现换行字符、读到文件结尾或是已读了size - 1个字符为止，最后会自动加上字符 '\0' 作为字符串结束。
fgets()在读取一个用户通过键盘输入的字符串的时候，同时把用户输入的回车也做为字符串的一部分。通过scanf和gets输入一个字符串的时候，不包含结尾的“\n”，但通过fgets结尾多了“\n”。fgets()函数是安全的，不存在缓冲区溢出的问题。

int fputs(const char * str, FILE * stream);
功能：将str所指定的字符串写入到stream指定的文件中， 字符串结束符 '\0'  不写入文件。
fputs()是puts()的文件操作版本，但fputs()不会自动输出一个'\n'。
```

strlen() 、strcpy() 、strncpy() 、strcat() 、strncat() 、strcmp() 、strncmp() 、sprintf() 、sscanf() 、strchr() 、strstr() 、strtok() 、atoi()

```c
#include <string.h>
size_t strlen(const char *s);
功能：计算指定指定字符串s的长度，不包含字符串结束符‘\0’

char *strcpy(char *dest, const char *src);
功能：把src所指向的字符串复制到dest所指向的空间中，'\0'也会拷贝过去
注意：如果参数dest所指的内存空间不够大，可能会造成缓冲溢出的错误情况。

char *strncpy(char *dest, const char *src, size_t n);
功能：把src指向字符串的前n个字符复制到dest所指向的空间中，是否拷贝结束符看指定的长度是否包含'\0'。

char *strcat(char *dest, const char *src);
功能：将src字符串连接到dest的尾部，‘\0’也会追加过去

char *strncat(char *dest, const char *src, size_t n);
功能：将src字符串前n个字符连接到dest的尾部，‘\0’也会追加过去

int strcmp(const char *s1, const char *s2);
功能：比较 s1 和 s2 的大小，比较的是字符ASCII码大小。

int strncmp(const char *s1, const char *s2, size_t n);
功能：比较 s1 和 s2 前n个字符的大小，比较的是字符ASCII码大小。

#include <stdio.h>
int sprintf(char *_CRT_SECURE_NO_WARNINGS, const char *format, ...);
功能：根据参数format字符串来转换并格式化数据，然后将结果输出到str指定的空间中，直到出现字符串结束符 '\0'  为止。

#include <stdio.h>
int sscanf(const char *str, const char *format, ...);
功能：从str指定的字符串读取数据，并根据参数format字符串来转换并格式化数据。

#include <string.h>
char *strchr(const char *s, int c);
功能：在字符串s中查找字母c出现的位置

char *strstr(const char *haystack, const char *needle);
功能：在字符串haystack中查找字符串needle出现的位置

char *strtok(char *str, const char *delim);
功能：来将字符串分割成一个个片段。当strtok()在参数s的字符串中发现参数delim中包含的分割字符时, 则会将该字符改为\0 字符，当连续出现多个时只替换第一个为\0。

#include <stdlib.h>
int atoi(const char *nptr);
功能：atoi()会扫描nptr字符串，跳过前面的空格字符，直到遇到数字或正负号才开始做转换，而遇到非数字或字符串结束符('\0')才结束转换，并将结果返回返回值。
类似的函数有：
- atof()：把一个小数形式的字符串转化为一个浮点数。
- atol()：将一个字符串转化为long类型
```

形参列表

- 在定义函数时指定的形参，**在未出现函数调用时，它们并不占内存中的存储单元**，因此称它们是形式参数或虚拟参数，简称形参，表示它们并不是实际存在的数据，所以，形参里的变量不能赋值。

如果函数返回的类型和return语句中表达式的值不一致，则以函数返回类型为准，即**函数返回类型决定返回值的类型**。对数值型数据，可以自动进行类型转换。

**注意**：如果函数返回的类型和return语句中表达式的值不一致，而它又无法自动进行类型转换，程序则会报错。



**当我们同时编译多个文件时，所有未加static前缀的全局变量和函数都具有全局可见性。** 

**extern告诉编译器这个变量或函数在其他文档里已被定义了。**

static法则：

- A、若全局变量仅在单个C文档中访问，则能够将这个变量修改为静态全局变量，以降低模块间的耦合度; 
- B、若全局变量仅由单个函数访问，则能够将这个变量改为该函数的静态局部变量，以降低模块间的耦合度； 
- C、设计和使用访问动态全局变量、静态全局变量、静态局部变量的函数时，需要考虑重入问题；

```c
// 多文件编译
gcc -o 可执行程序 文件1.c 文件2.c 头文件.h
```

## 四、指针和指针变量

- **内存区的每一个字节都有一个编号，这就是“地址”**。
- 如果在程序中定义了一个变量，在对程序进行编译或运行时，系统就会给这个变量分配内存单元，并确定它的内存地址(编号)
- 指针的实质就是内存“地址”。指针就是地址，地址就是指针。
- **指针是内存单元的编号，指针变量是存放地址的变量**。
- 通常我们叙述时会把指针变量简称为指针，实际他们含义并不一样。
- 指针也是一种数据类型，指针变量也是一种变量
- 指针变量指向谁，就把谁的地址赋值给指针变量
- **“*” 操作符操作的是指针变量指向的内存空间**

指针大小

- **使用sizeof()测量指针的大小，得到的总是：4或8**
- sizeof()测的是指针变量指向存储地址的大小
- 在32位平台，所有的指针（地址）都是32位(4字节)
- 在64位平台，所有的指针（地址）都是64位(8字节)

野指针和空指针

- 指针变量也是变量，是变量就可以任意赋值，不要越界即可（32位为4字节，64位为8字节），但是，**任意数值赋值给指针变量没有意义，因为这样的指针就成了野指针**，此指针指向的区域是未知(操作系统不允许操作此指针指向的内存区域)。所以，**野指针不会直接引发错误，操作野指针指向的内存区域才会出问题**。
- 但是，野指针和有效指针变量保存的都是数值，为了标志此指针变量没有指向任何变量(空闲可用)，C语言中，可以把NULL赋值给此指针，这样就标志此指针为空指针，没有任何指针。
- NULL是一个值为0的宏常量：`#define NULL    ((void *)0)`

万能指针 `void *`

`void *` 指针可以指向任意变量的内存空间：

```c
void *p = NULL;

int a = 10;
p = (void *)&a; //指向变量时，最好转换为void *

//使用指针变量指向的内存时，转换为int *
*( (int *)p ) = 11;
printf("a = %d\n", a);
```

const修饰的指针变量

```c
int a = 100;
int b = 200;

//指向常量的指针
//修饰*，指针指向内存区域不能修改，指针指向可以变
const int *p1 = &a; //等价于int const *p1 = &a;
//*p1 = 111; //err
p1 = &b; //ok

//指针常量
//修饰p1，指针指向不能变，指针指向的内存可以修改
int * const p2 = &a;
//p2 = &b; //err
*p2 = 222; //ok
```

指针操作数组元素

```c
#include <stdio.h>

int  main()
{
	int a[] = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
	int i = 0;
	int n = sizeof(a) / sizeof(a[0]);
	
	for (i = 0; i < n; i++)
	{
		//printf("%d, ", a[i]);
		printf("%d, ", *(a+i));
	}
	printf("\n");

	int *p = a; //定义一个指针变量保存a的地址
	for (i = 0; i < n; i++)
	{
		p[i] = 2 * i;
	}

	for (i = 0; i < n; i++)
	{
		printf("%d, ", *(p + i));
	}
	printf("\n");

	return 0;
}
```

指针加减运算

- 指针计算不是简单的整数相加
- 如果是一个`int *`，+1的结果是增加一个int的大小
- 如果是一个`char *`，+1的结果是增加一个char大小

通过改变指针指向操作数组元素：

```c
#include <stdio.h>

int main()
{
	int a[] = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
	int i = 0;
	int n = sizeof(a) / sizeof(a[0]);

	int *p = a;
	for (i = 0; i < n; i++)
	{
		printf("%d, ", *p);
		p++;
	}
	printf("\n");
	
	return 0;
}
```

指针数组

- 指针数组，它是数组，数组的每个元素都是指针类型。

```c
#include <stdio.h>

int main()
{
	//指针数组
	int *p[3];
	int a = 1;
	int b = 2;
	int c = 3;
	int i = 0;

	p[0] = &a;
	p[1] = &b;
	p[2] = &c;

	for (i = 0; i < sizeof(p) / sizeof(p[0]); i++ )
	{
		printf("%d, ", *(p[i]));
	}
	printf("\n");
	
	return 0;
}
```

多级指针 

- C语言允许有多级指针存在，在实际的程序中一级指针最常用，其次是二级指针。
- 二级指针就是指向一个一级指针变量地址的指针。
- 三级指针基本用不着，但考试会考。

```c
int a = 10;
int *p = &a; //一级指针
*p = 100; //*p就是a

int **q = &p;
//*q就是p
//**q就是a

int ***t = &q;
//*t就是q
//**t就是p
//***t就是a
```

数组名做函数参数

- 数组名做函数参数，函数的形参会退化为指针：

```c
#include <stdio.h>

//void printArrary(int a[10], int n)
//void printArrary(int a[], int n)
void printArrary(int *a, int n)
{
	int i = 0;
	for (i = 0; i < n; i++)
	{
		printf("%d, ", a[i]);
	}
	printf("\n");
}

int main()
{
	int a[] = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
	int n = sizeof(a) / sizeof(a[0]);

	//数组名做函数参数
	printArrary(a, n); 
	return 0;
}
```

指针做为函数的返回值

```c
#include <stdio.h>

int a = 10;

int *getA()
{
	return &a;
}

int main()
{
	*( getA() ) = 111;
	printf("a = %d\n", a);

	return 0;
}
```

指针和字符串

- 字符指针

```c
#include <stdio.h>

int main()
{
	char str[] = "hello world";
	char *p = str;
	*p = 'm';
	p++;
	*p = 'i';
	printf("%s\n", str);  // millo world

	p = "mike jiang";
	printf("%s\n", p); // mike jiang

	char *q = "test";
	printf("%s\n", q); // test

	return 0;
}
```

const修饰的指针变量

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
	//const修饰一个变量为只读
	const int a = 10;
	//a = 100; //err

	//指针变量， 指针指向的内存， 2个不同概念
	char buf[] = "aklgjdlsgjlkds";

	//从左往右看，跳过类型，看修饰哪个字符
	//如果是*， 说明指针指向的内存不能改变
	//如果是指针变量，说明指针的指向不能改变，指针的值不能修改
	const char *p = buf;
	// 等价于上面 char const *p1 = buf;
	//p[1] = '2'; //err
	p = "agdlsjaglkdsajgl"; //ok

	char * const p2 = buf;
	p2[1] = '3';
	//p2 = "salkjgldsjaglk"; //err

	//p3为只读，指向不能变，指向的内存也不能变
	const char * const p3 = buf;

	return 0;
}
```

## 五、内存管理

### 5.1 作用域

C语言变量的作用域分为：

- 代码块作用域(代码块是{}之间的一段代码)
- 函数作用域
- 文件作用域

局部变量也叫auto自动变量(auto可写可不写)，一般情况下代码块{}内部定义的变量都是自动变量，它有如下特点：

- 在一个函数内定义，只在函数范围内有效
- 在复合语句中定义，只在复合语句中有效
- **随着函数调用的结束或复合语句的结束局部变量的声明声明周期也结束**
- 如果没有赋初值，内容为随机

```c
#include <stdio.h>

void test()
{
	//auto写不写是一样的
	//auto只能出现在{}内部
	auto int b = 10; 
}

int main(void)
{
	//b = 100; //err， 在main作用域中没有b

	if (1)
	{
		//在复合语句中定义，只在复合语句中有效
		int a = 10;
		printf("a = %d\n", a);
	}

	//a = 10; //err离开if()的复合语句，a已经不存在
	
	return 0;
}
```

静态(static)局部变量

- static局部变量的作用域也是在定义的函数内有效
- static局部变量的生命周期和程序运行周期一样，同时staitc局部变量的值**只初始化一次，但可以赋值多次**
- static局部变量若未赋以初值，则由系统自动赋值：数值型变量自动赋初值0，字符型变量赋空字符

全局变量

- 在函数外定义，可被本文件及其它文件中的函数所共用，**若其它文件中的函数调用此变量,须用extern声明**
- 全局变量的生命周期和程序运行周期一样
- 不同文件的全局变量不可重名

静态(static)全局变量

- 在函数外定义,作用范围被限制在所定义的文件中
- 不同文件静态全局变量可以重名,但作用域不冲突
- static全局变量的生命周期和程序运行周期一样，同时staitc全局变量的值只初始化一次

extern全局变量声明

- extern int a; 声明一个变量，这个变量在别的文件中已经定义了，这里只是声明，而不是定义

全局函数和静态函数

- 在C语言中函数默认都是全局的，使用关键字static可以将函数声明为静态，函数定义为static就意味着这个函数只能在定义这个函数的文件中使用，在其他文件中不能调用，即使在其他文件中声明这个函数都没用。

**注意**：

- 允许在不同的函数中使用相同的变量名，它们代表不同的对象，分配不同的单元，互不干扰。
- 同一源文件中,允许全局变量和局部变量同名，在局部变量的作用域内，全局变量不起作用。
- 所有的函数默认都是全局的，意味着所有的函数都不能重名，但如果是staitc函数，那么作用域是文件级的，所以不同的文件static函数名是可以相同的。

总结：

| **类型**       | **作用域** | **生命周期**   |
| -------------- | ---------- | -------------- |
| auto变量       | 一对{}内   | 当前函数       |
| static局部变量 | 一对{}内   | 整个程序运行期 |
| extern变量     | 整个程序   | 整个程序运行期 |
| static全局变量 | 当前文件   | 整个程序运行期 |
| extern函数     | 整个程序   | 整个程序运行期 |
| static函数     | 当前文件   | 整个程序运行期 |
| register变量   | 一对{}内   | 当前函数       |

### 5.2 内存布局

内存分区

- C代码经过**预处理、编译、汇编、链接**4步后生成一个可执行程序。

在 Linux 下，程序是一个普通的可执行文件，以下列出一个二进制可执行文件的基本情况：

<img src="/images/imageProgramC/fileinfo.png">

通过上图可以得知，在没有运行程序前，也就是说**程序没有加载到内存前**，可执行程序内部已经分好3段信息，分别为**代码区（text）、数据区（data）和未初始化数据区（bss）**3 个部分（有些人直接把data和bss合起来叫做静态区或全局区）。

- **代码区**
  - 存放 CPU 执行的机器指令。通常代码区是可共享的（即另外的执行程序可以调用它），使其可共享的目的是对于频繁被执行的程序，只需要在内存中有一份代码即可。**代码区通常是只读的**，使其只读的原因是防止程序意外地修改了它的指令。另外，代码区还规划了局部变量的相关信息。

- **全局初始化数据区/静态数据区（data段）**
  - 该区包含了在程序中明确被初始化的全局变量、已经初始化的静态变量（包括全局静态变量和局部静态变量）和常量数据（如字符串常量）。

- **未初始化数据区（又叫 bss 区）**
  - 存入的是全局未初始化变量和未初始化静态变量。未初始化数据区的数据在程序开始执行之前被内核初始化为 0 或者空（NULL）。

 程序在加载到内存前，**代码区和全局区(data和bss)的大小就是固定的**，程序运行期间不能改变。然后，运行可执行程序，系统把程序加载到内存，**除了根据可执行程序的信息分出代码区（text）、数据区（data）和未初始化数据区（bss）之外，还额外增加了栈区、堆区**。

<img src="/images/imageProgramC/内存分区.png">

- 代码区（text segment）
  - 加载的是可执行文件代码段，所有的可执行代码都加载到代码区，这块内存是不可以在运行期间修改的。

- 未初始化数据区（BSS）
  - 加载的是可执行文件BSS段，位置可以分开亦可以紧靠数据段，存储于数据段的数据（全局未初始化，静态未初始化数据）的生存周期为整个程序运行过程。

- 全局初始化数据区/静态数据区（data segment）
  - 加载的是可执行文件数据段，存储于数据段（全局初始化，静态初始化数据，文字常量(只读)）的数据的生存周期为整个程序运行过程。

- 栈区（stack）
  -  **栈是一种先进后出的内存结构**，由编译器自动分配释放，存放函数的参数值、返回值、局部变量等。在程序运行过程中实时加载和释放，因此，局部变量的生存周期为申请到释放该段栈空间。

- 堆区（heap）
  - 堆是一个大容器，它的容量要远远大于栈，但没有栈那样先进后出的顺序。用于动态内存分配。**堆在内存中位于BSS区和栈区之间**。一般由程序员分配和释放，若程序员不释放，程序结束时由操作系统回收。

存储类型总结：

| **类型**       | **作用域** | **生命周期**   | **存储位置**                    |
| -------------- | ---------- | -------------- | ------------------------------- |
| auto变量       | 一对{}内   | 当前函数       | 栈区                            |
| static局部变量 | 一对{}内   | 整个程序运行期 | 初始化在data段，未初始化在BSS段 |
| extern变量     | 整个程序   | 整个程序运行期 | 初始化在data段，未初始化在BSS段 |
| static全局变量 | 当前文件   | 整个程序运行期 | 初始化在data段，未初始化在BSS段 |
| extern函数     | 整个程序   | 整个程序运行期 | 代码区                          |
| static函数     | 当前文件   | 整个程序运行期 | 代码区                          |
| register变量   | 一对{}内   | 当前函数       | 运行时存储在CPU寄存器           |
| 字符串常量     | 当前文件   | 整个程序运行期 | data段                          |

**存储类型总结内存操作函数**：

```c
#include <string.h>
void *memset(void *s, int c, size_t n);
功能：将s的内存区域的前n个字节以参数c填入

void *memcpy(void *dest, const void *src, size_t n);
功能：拷贝src所指的内存内容的前n个字节到dest所值的内存地址上。

memmove()
memmove()功能用法和memcpy()一样，区别在于：dest和src所指的内存空间重叠时，memmove()仍然能处理，不过执行效率比memcpy()低些。

int memcmp(const void *s1, const void *s2, size_t n);
功能：比较s1和s2所指向内存区域的前n个字节
```

**堆区内存分配和释放**：

```c
#include <stdlib.h>
void *malloc(size_t size);
功能：在内存的动态存储区(堆区)中分配一块长度为size字节的连续区域，用来存放类型说明符指定的类型。分配的内存空间内容不确定，一般使用memset初始化。

void free(void *ptr);
功能：释放ptr所指向的一块内存空间，ptr是一个任意类型的指针变量，指向被释放区域的首地址。对同一内存空间多次释放会出错。
```

```c
#include <stdlib.h> 
#include <stdio.h>
#include <string.h>

int main()
{
	int count, *array, n;
	printf("请输入要申请数组的个数:\n");
	scanf("%d", &n);

	array = (int *)malloc(n * sizeof (int));
	if (array == NULL)
	{
		printf("申请空间失败!\n");
		return -1;
	}
	//将申请到空间清0
	memset(array, 0, sizeof(int)*n);

	for (count = 0; count < n; count++) /*给数组赋值*/
		array[count] = count;

	for (count = 0; count < n; count++) /*打印数组元素*/
		printf("%2d", array[count]);

	free(array);

	return 0;
}
```

返回堆区地址：

```c
#include <stdio.h>
#include <stdlib.h>

int *fun()
{
	int *tmp = NULL;
	tmp = (int *)malloc(sizeof(int));
	*tmp = 100;
	return tmp;//返回堆区地址，函数调用完毕，不释放
}

int main(int argc, char *argv[])
{
	int *p = NULL;
	p = fun();
	printf("*p = %d\n", *p);//ok

	//堆区空间，使用完毕，手动释放
	if (p != NULL)
	{
		free(p);
		p = NULL;
	}

	return 0;
}
```

## 六、复合类型(自定义类型)

### 6.1 结构体

定义结构体变量的方式：

- 先声明结构体类型再定义变量名
- 在声明类型的同时定义变量
- 直接定义结构体类型变量（无类型名）

<img src="/images/imageProgramC/结构体.png">

结构体类型和结构体变量关系：

- 结构体类型：指定了一个结构体类型，它相当于一个模型，但其中并无具体数据，系统对之也不分配实际内存单元。
- 结构体变量：系统根据结构体类型（内部成员状况）为之分配空间。

```c
//结构体类型的定义
struct stu
{
	char name[50];
	int age;
};

//先定义类型，再定义变量（常用）
struct stu s1 = { "mike", 18 };


//定义类型同时定义变量
struct stu2
{
	char name[50];
	int age;
}s2 = { "lily", 22 };

struct
{
	char name[50];
	int age;
}s3 = { "yuri", 25 };
```

结构体成员的使用：

```c
#include<stdio.h>
#include<string.h>

//结构体类型的定义
struct stu
{
	char name[50];
	int age;
};

int main()
{
	struct stu s1;

	//如果是普通变量，通过点运算符操作结构体成员
	strcpy(s1.name, "abc");
	s1.age = 18;   
	printf("s1.name = %s, s1.age = %d\n", s1.name, s1.age);

	//如果是指针变量，通过->操作结构体成员
	strcpy((&s1)->name, "test");
	(&s1)->age = 22;
	printf("(&s1)->name = %s, (&s1)->age = %d\n", (&s1)->name, (&s1)->age);

	return 0;
}
```

结构体套结构体：

```c
#include <stdio.h>

struct person
{
	char name[20];
	char sex;
};

struct stu
{
	int id;
	struct person info;
};

int main()
{
	struct stu s[2] = { 1, "lily", 'F', 2, "yuri", 'M' };

	int i = 0;
	for (i = 0; i < 2; i++)
	{
		printf("id = %d\tinfo.name=%s\tinfo.sex=%c\n", s[i].id, s[i].info.name, s[i].info.sex);
	}

	return 0;
}
```

结构体套一级指针：

```c
#include<stdio.h>
#include <string.h>
#include <stdlib.h>

//结构体类型的定义
struct stu
{
	char *name; //一级指针
	int age;
};

int main()
{
	struct stu *p = NULL;

	p = (struct stu *)malloc(sizeof(struct  stu));
	p->name = malloc(strlen("test") + 1);
	strcpy(p->name, "test");
	p->age = 22;

	printf("p->name = %s, p->age=%d\n", p->name, p->age);
	printf("(*p).name = %s, (*p).age=%d\n", (*p).name, (*p).age);

	if (p->name != NULL)
	{
		free(p->name);
		p->name = NULL;
	}

	if (p != NULL)
	{
		free(p);
		p = NULL;
	}

	return 0;
}
```

结构体普通变量做函数参数：

```c
#include<stdio.h>
#include <string.h>

//结构体类型的定义
struct stu
{
	char name[50];
	int age;
};

//函数参数为结构体普通变量
void set_stu(struct stu tmp)
{
	strcpy(tmp.name, "mike");
	tmp.age = 18;
	printf("tmp.name = %s, tmp.age = %d\n", tmp.name, tmp.age);
}

int main()
{
	struct stu s = { 0 };
	set_stu(s); //值传递
	printf("s.name = %s, s.age = %d\n", s.name, s.age);
	return 0;
}
```

结构体指针变量做函数参数：

```c
#include<stdio.h>
#include <string.h>

//结构体类型的定义
struct stu
{
	char name[50];
	int age;
};

//函数参数为结构体指针变量
void set_stu_pro(struct stu *tmp)
{
	strcpy(tmp->name, "mike");
	tmp->age = 18;
}

int main()
{
	struct stu s = { 0 };
	set_stu_pro(&s); //地址传递
	printf("s.name = %s, s.age = %d\n", s.name, s.age);

	return 0;
}
```

结构体数组名做函数参数：

```c
#include<stdio.h>

//结构体类型的定义
struct stu
{
	char name[50];
	int age;
};

//void set_stu_pro(struct stu tmp[100], int n)
//void set_stu_pro(struct stu tmp[], int n)
void set_stu_pro(struct stu *tmp, int n)
{
	int i = 0;
	for (i = 0; i < n; i++)
	{
		sprintf(tmp->name, "name%d%d%d", i, i, i);
		tmp->age = 20 + i;
		tmp++;
	}
}

int main()
{
	struct stu s[3] = { 0 };
	int i = 0;
	int n = sizeof(s) / sizeof(s[0]);
	set_stu_pro(s, n); //数组名传递

	for (i = 0; i < n; i++)
	{
		printf("%s, %d\n", s[i].name, s[i].age);
	}

	return 0;
}
```

### 6.2 共用体(联合体)

- 联合union是一个能在同一个存储空间存储不同类型数据的类型；
- 联合体所占的内存长度等于其最长成员的长度，也有叫做共用体；
- 同一内存段可以用来存放几种不同类型的成员，但每一瞬时只有一种起作用；
- 共用体变量中起作用的成员是最后一次存放的成员，在存入一个新的成员后原有的成员的值会被覆盖；
- 共用体变量的地址和它的各成员的地址都是同一地址。

### 6.3 枚举

枚举：将变量的值一一列举出来，变量的值只限于列举出来的值的范围内。

枚举类型定义：

```c
enum  枚举名
{
	枚举值表
};
```

- 在枚举值表中应列出所有可用值，也称为枚举元素。
- 枚举值是常量，不能在程序中用赋值语句再对它赋值。
- 枚举元素本身由系统定义了一个表示序号的数值从0开始顺序定义为0，1，2 …

### 6.4 typedef

typedef为C语言的关键字，作用是为一种数据类型(基本类型或自定义数据类型)定义一个新名字，**不能创建新类型**。

- 与#define不同，typedef仅限于数据类型，而不是能是表达式或具体的值

- #define发生在预处理，typedef发生在编译阶段

## 七、文件操作

磁盘文件和设备文件

- 磁盘文件
  - 指一组相关数据的有序集合,通常存储在外部介质(如磁盘)上，使用时才调入内存。
- 设备文件
  - 在操作系统中把每一个与主机相连的输入、输出设备看作是一个文件，把它们的输入、输出等同于对磁盘文件的读和写。

### 7.1 文件的打开和关闭

文件指针

- 在C语言中用一个指针变量指向一个文件，这个指针称为文件指针。 

```c
typedef struct
{
	short           level;	//缓冲区"满"或者"空"的程度 
	unsigned        flags;	//文件状态标志 
	char            fd;		//文件描述符
	unsigned char   hold;	//如无缓冲区不读取字符
	short           bsize;	//缓冲区的大小
	unsigned char   *buffer;//数据缓冲区的位置 
	unsigned        ar;	 //指针，当前的指向
	unsigned        istemp;	//临时文件，指示器
	short           token;	//用于有效性的检查 
}FILE;
```

FILE是系统使用typedef定义出来的有关文件信息的一种结构体类型，**结构中含有文件名、文件状态和文件当前位置等信息**。

声明FILE结构体类型的信息包含在头文件“stdio.h”中，一般设置一个指向FILE类型变量的指针变量，然后通过它来引用这些FILE类型变量。通过文件指针就可对它所指的文件进行各种操作。 

文件的打开：

```c
#include <stdio.h>
FILE * fopen(const char * filename, const char * mode);
功能：打开文件
```

第二个参数的几种形式(打开文件的方式)：

| **打开模式** | **含义**                                                     |
| ------------ | ------------------------------------------------------------ |
| r或rb        | 以只读方式打开一个文本文件（不创建文件，若文件不存在则报错） |
| w或wb        | 以写方式打开文件(如果文件存在则清空文件，文件不存在则创建一个文件) |
| a或ab        | 以追加方式打开文件，在末尾添加内容，若文件不存在则创建文件   |
| r+或rb+      | 以可读、可写的方式打开文件(不创建新文件)                     |
| w+或wb+      | 以可读、可写的方式打开文件(如果文件存在则清空文件，文件不存在则创建一个文件) |
| a+或ab+      | 以添加方式打开文件，打开文件并在末尾更改文件,若文件不存在则创建文件 |

注意：

- b是二进制模式的意思，b只是在Windows有效，在Linux用r和rb的结果是一样的
- Unix和Linux下所有的文本文件行都是\n结尾，而Windows所有的文本文件行都是\r\n结尾
- 在Windows平台下，以“文本”方式打开文件，不加b：
  - 当读取文件的时候，系统会将所有的 "\r\n" 转换成 "\n"
  - 当写入文件的时候，系统会将 "\n" 转换成 "\r\n" 写入 
  - **以"二进制"方式打开文件，则读\写都不会进行这样的转换**

- 在Unix/Linux平台下，“文本”与“二进制”模式没有区别，"\r\n" 作为两个字符原样输入输出

```c
int main(void)
{
    FILE *fp = NULL;

	// 路径可以是相对路径，也可是绝对路径
	fp = fopen("../test", "w");
	//fp = fopen("..\\test", "w");

	if (fp == NULL) //返回空，说明打开失败
	{
		//perror()是标准出错打印函数，能打印调用库函数出错原因
		perror("open");
		return -1;
	}

    fclose(fp);
	return 0;
}
```

### 7.2 文件的顺序读写

- 按照字符读写文件fgetc、fputc

```c
#include <stdio.h>
int fputc(int ch, FILE * stream);
功能：将ch转换为unsigned char后写入stream指定的文件中

int fgetc(FILE * stream);
功能：从stream指定的文件中读取一个字符
```

在C语言中，EOF表示文件结束符(end of file)。在while循环中以EOF作为文件结束标志，**这种以EOF作为文件结束标志的文件，必须是文本文件**。在文本文件中，数据都是以字符的ASCII代码值的形式存放。我们知道，ASCII代码值的范围是0~127，不可能出现-1，因此可以用EOF作为文件结束标志。`#define EOF    (-1)`

当把数据以二进制形式存放到文件中时，就会有-1值的出现，因此不能采用EOF作为二进制文件的结束标志。为解决这一个问题，ANSI C提供一个feof函数，用来判断文件是否结束。**feof函数既可用以判断二进制文件又可用以判断文本文件**。

```c
#include <stdio.h>
int feof(FILE * stream);
功能：检测是否读取到了文件结尾。**判断的是最后一次“读操作的内容”，不是当前位置内容(上一个内容)**。
```

- 按照行读写文件fgets、fputs

```c
#include <stdio.h>
int fputs(const char * str, FILE * stream);
功能：将str所指定的字符串写入到stream指定的文件中，字符串结束符 '\0'  不写入文件。 

char * fgets(char * str, int size, FILE * stream);
功能：从stream指定的文件内读入字符，保存到str所指定的内存空间，直到出现换行字符、读到文件结尾或是已读了size - 1个字符为止，最后会自动加上字符 '\0' 作为字符串结束。
```

- 按照格式化文件fprintf、fscanf

```c
#include <stdio.h>
int fprintf(FILE * stream, const char * format, ...);
功能：根据参数format字符串来转换并格式化数据，然后将结果输出到stream指定的文件中，指定出现字符串结束符 '\0'  为止。

int fscanf(FILE * stream, const char * format, ...);
功能：从stream指定的文件读取字符串，并根据参数format字符串来转换并格式化数据。
```

- 按照块读写文件fread、fwrite

```c
#include <stdio.h>
size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);
功能：以数据块的方式给文件写入内容
参数：
	ptr：准备写入文件数据的地址
	size： size_t 为 unsigned int类型，此参数指定写入文件内容的块数据大小
	nmemb：写入文件的块数，写入文件数据总大小为：size * nmemb
	stream：已经打开的文件指针
返回值：
	成功：实际成功写入文件数据的块数目，此值和nmemb相等
	失败：0

#include <stdio.h>
size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream);
功能：以数据块的方式从文件中读取内容
```

### 7.3 文件的随机读写

```c
#include <stdio.h>
int fseek(FILE *stream, long offset, int whence);
功能：移动文件流（文件光标）的读写位置。
参数：
	stream：已经打开的文件指针
	offset：根据whence来移动的位移数（偏移量），可以是正数，也可以负数，如果正数，则相对于whence往右移动，如果是负数，则相对于whence往左移动。如果向前移动的字节数超过了文件开头则出错返回，如果向后移动的字节数超过了文件末尾，再次写入时将增大文件尺寸。
	whence：其取值如下：
		SEEK_SET：从文件开头移动offset个字节
		SEEK_CUR：从当前位置移动offset个字节
		SEEK_END：从文件末尾移动offset个字节
返回值：
	成功：0
	失败：-1

#include <stdio.h>
long ftell(FILE *stream);
功能：获取文件流（文件光标）的读写位置。
参数：
	stream：已经打开的文件指针
返回值：
	成功：当前文件流（文件光标）的读写位置
	失败：-1

#include <stdio.h>
void rewind(FILE *stream);
功能：把文件流（文件光标）的读写位置移动到文件开头。
参数：
	stream：已经打开的文件指针
返回值：
	无返回值
```

### 7.4 获取文件状态

```c
#include <sys/types.h>
#include <sys/stat.h>
int stat(const char *path, struct stat *buf);
功能：获取文件状态信息
参数：
	path：文件名
	buf：保存文件信息的结构体
返回值：
	成功：0
	失败-1
```

```c
struct stat {
	dev_t         st_dev;         //文件的设备编号
	ino_t         st_ino;          //节点
	mode_t        st_mode;   //文件的类型和存取的权限
	nlink_t       st_nlink;     //连到该文件的硬连接数目，刚建立的文件值为1
	uid_t         st_uid;         //用户ID
	gid_t         st_gid;         //组ID
	dev_t         st_rdev;      //(设备类型)若此文件为设备文件，则为其设备编号
	off_t         st_size;        //文件字节数(文件大小)
	unsigned long st_blksize;   //块大小(文件系统的I/O 缓冲区大小)
	unsigned long st_blocks;    //块数
	time_t        st_atime;     //最后一次访问时间
	time_t        st_mtime;    //最后一次修改时间
	time_t        st_ctime;     //最后一次改变时间(指属性)
};
```

```c
#include <sys/types.h>
#include <sys/stat.h>
#include <stdio.h>

int main(int argc, char **args)
{
	if (argc < 2)
		return 0;

	struct stat st = { 0 };

	stat(args[1], &st);
	int size = st.st_size;//得到结构体中的成员变量
	printf("%d\n", size);
	return 0;
}
```

### 7.5 删除文件、重命名文件名

```c
#include <stdio.h>
int remove(const char *pathname);
功能：删除文件
参数：
	pathname：文件名
返回值：
	成功：0
	失败：-1

#include <stdio.h>
int rename(const char *oldpath, const char *newpath);
功能：把oldpath的文件名改为newpath
参数：
	oldpath：旧文件名
	newpath：新文件名
返回值：
	成功：0
	失败： - 1
```

### 7.6 文件缓冲区

ANSI C标准采用“缓冲文件系统”处理数据文件。

所谓缓冲文件系统是指系统自动地在内存区为程序中每一个正在使用的文件开辟一个文件缓冲区从内存向磁盘输出数据必须先送到内存中的缓冲区，装满缓冲区后才一起送到磁盘去。

如果从磁盘向计算机读入数据，则一次从磁盘文件将一批数据输入到内存缓冲区(充满缓冲区)，然后再从缓冲区逐个地将数据送到程序数据区(给程序变量) 。

磁盘文件的存取：

<img src="/images/imageProgramC/磁盘文件的读取.png">

- 磁盘文件，一般保存在硬盘、U盘等掉电不丢失的磁盘设备中，在需要时调入内存
- 在内存中对文件进行编辑处理后，保存到磁盘中

- 程序与磁盘之间交互，不是立即完成，系统或程序可根据需要设置缓冲区，以提高存取效率

更新缓冲区：

```c
#include <stdio.h>
int fflush(FILE *stream);
功能：更新缓冲区，让缓冲区的数据立马写到文件中。
参数：
stream：文件指针
返回值：
	成功：0
	失败：-1
```







