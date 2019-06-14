---
title: C 进阶
tags: c/c++
reward: true
categories: c/c++
toc: true
abbrlink: 39639
date: 2016-05-24 10:14:50
---

# C 语言进阶

## 一、 内存分区

栈区

- 由系统进行内存的管理。主要存放函数的参数以及局部变量。在函数完成执行，系统自行释放栈区内存，不需要用户管理。

<!-- more -->

堆区

- 由编程人员手动申请，手动释放，若不手动释放，程序结束后由系统回收，生命周期是整个程序运行期间。使用malloc或者new进行堆的申请。

```c
#include <stdlib.h>
void *calloc(size_t nmemb, size_t size);
功能：在内存动态存储区中分配nmemb块长度为size字节的连续区域。calloc自动将分配的内存置0。
参数：
	nmemb：所需内存单元数量
	size：每个内存单元的大小（单位：字节）
返回值：
	成功：分配空间的起始地址
	失败：NULL

#include <stdlib.h>
void *realloc(void *ptr, size_t size);
功能：重新分配用malloc或者calloc函数在堆中分配内存空间的大小。realloc不会自动清理增加的内存，需要手动清理，如果指定的地址后面有连续的空间，那么就会在已有地址基础上增加内存，如果指定的地址后面没有空间，那么realloc会重新分配新的连续内存，把旧内存的值拷贝到新内存，同时释放旧内存。
参数：
	ptr：为之前用malloc或者calloc分配的内存地址，如果此参数等于NULL，那么和realloc与malloc功能一致
	size：为重新分配内存的大小, 单位：字节
返回值：
	成功：新分配的堆内存地址
	失败：NULL
```

全局/静态区

- 全局静态区内的变量在编译阶段已经分配好内存空间并初始化。这块内存在程序运行期间一直存在,它主要存储**全局变量**、**静态变量**和**常量**。

  **注意**：

  - 这里不区分初始化和未初始化的数据区，是因为静态存储区内的变量若不显示初始化，则编译器会自动以默认的方式进行初始化，即静态存储区内不存在未初始化的变量。
  - 全局静态存储区内的常量分为常变量和字符串常量，一经初始化，不可修改。静态存储内的常变量是全局变量，与局部常变量不同，区别在于局部常变量存放于栈，实际可间接通过指针或者引用进行修改，而全局常变量存放于静态常量区则不可以间接修改。
  - 字符串常量存储在全局/静态存储区的常量区。

```c
int v1 = 10;//全局/静态区
const int v2 = 20; //常量，一旦初始化，不可修改
static int v3 = 20; //全局/静态区
char *p1; //全局/静态区，编译器默认初始化为NULL

//那么全局static int 和 全局int变量有什么区别？

void test(){
	static int v4 = 20; //全局/静态区
}
```

**字符串常量是否可修改？字符串常量优化**：

| ANSI C中规定：修改字符串常量，结果是未定义的。<br />ANSI C并没有规定编译器的实现者对字符串的处理，例如：<br />1. 有些编译器可修改字符串常量，有些编译器则不可修改字符串常量。<br />2. 有些编译器把多个相同的字符串常量看成一个（这种优化可能出现在字符串常量中，节省空间），有些则不进行此优化。如果进行优化，则可能导致修改一个字符串常量导致另外的字符串常量也发生变化，结果不可知。<br />**所以尽量不要去修改字符串常量**！ |
| ------------------------------------------------------------ |
| C99标准：<br />char *p = "abc"; defines p with type ‘‘pointer to char’’ and initializes it to point to an object with type ‘‘array of char’’ with length 4 whose elements are initialized with a character string literal. **If an attempt is made to use p to modify the contents of the array, the behavior is undefined**. |

**总结**

在理解C/C++内存分区时，常会碰到如下术语：数据区，堆，栈，静态区，常量区，全局区，字符串常量区，文字常量区，代码区等等，初学者被搞得云里雾里。在这里，尝试捋清楚以上分区的关系。

**数据区包括**：堆，栈，全局/静态存储区。

**全局/静态存储区包括**：常量区，全局区、静态区。

**常量区包括**：字符串常量区、常变量区。

**代码区**：存放程序编译后的二进制代码，不可寻址区。

**可以说，C/C++内存分区其实只有两个，即代码区和数据区**。



函数调用模型：

- 在经典的操作系统中，栈总是向下增长的。压栈的操作使得栈顶的地址减小，弹出操作使得栈顶地址增大。

栈在程序运行中具有极其重要的地位。最重要的，栈保存一个函数调用所需要维护的信息，这通常被称为堆栈帧(Stack Frame)或者活动记录(Activate Record).一个函数调用过程所需要的信息一般包括以下几个方面：

- 函数的返回地址；
- 函数的参数；
- 临时变量；
- 保存的上下文：包括在函数调用前后需要保持不变的寄存器。

<img src="/images/imageProgramC/函数调用流程.png">

栈的生长方向和内存存放方向：

<img src="/images/imageProgramC/栈的生长方向和内存存放方向.png">

## 二、指针强化

**指针是一种数据类型，占用内存空间，用来保存内存地址**。

### 2.1 野指针和空指针

#### 2.1.1 空指针

标准定义了NULL指针，它作为一个特殊的指针变量，表示不指向任何东西。要使一个指针为NULL,可以给它赋值一个零值。为了测试一个指针百年来那个是否为NULL,你可以将它与零值进行比较。

对指针解引用操作可以获得它所指向的值。但从定义上看，NULL指针并未执行任何东西，因为对一个NULL指针因引用是一个非法的操作，在解引用之前，必须确保它不是一个NULL指针。

如果对一个NULL指针间接访问会发生什么呢？结果因编译器而异。

**不允许向NULL和非法地址拷贝内存**：

```c
void test(){
	char *p = NULL;
	//给p指向的内存区域拷贝内容
	strcpy(p, "1111"); //err

	char *q = 0x1122;
	//给q指向的内存区域拷贝内容
	strcpy(q, "2222"); //err		
}
```

#### 2.1.2 野指针

**在使用指针时，要避免野指针的出现**：

野指针指向一个已删除的对象或未申请访问受限内存区域的[指针](http://baike.baidu.com/view/159417.htm)。与空指针不同，野指针无法通过简单地判断是否为 [NULL](http://baike.baidu.com/view/329484.htm)避免，而只能通过养成良好的编程习惯来尽力减少。对野指针进行操作很容易造成程序错误。

**什么情况下会导致野指针**？

- **指针变量未初始化**
  - 任何指针变量刚被创建时不会自动成为NULL指针，它的缺省值是随机的，它会乱指一气。所以，指针变量在创建的同时应当被初始化，要么将指针设置为NULL，要么让它指向合法的内存。

- **指针释放后未置空**
  - 有时指针在free或delete后未赋值 NULL，便会使人以为是合法的。别看free和delete的名字（尤其是delete），它们只是把指针所指的内存给释放掉，但并没有把指针本身干掉。此时指针指向的就是“垃圾”内存。释放后的指针应立即将指针置为NULL，防止产生“野指针”。

- **指针操作超越变量作用域**
  - **不要返回指向栈内存的指针或引用，因为栈内存在函数结束时会被释放**。

**操作野指针是非常危险的操作，应该规避野指针的出现**：

- **初始化时置 NULL**
  - 指针变量一定要初始化为NULL，因为任何指针变量刚被创建时不会自动成为NULL指针，它的缺省值是随机的。

- **释放时置 NULL**
  - 当指针p指向的内存空间释放时，没有设置指针p的值为NULL。delete和free只是把内存空间释放了，但是并没有将指针p的值赋为NULL。通常判断一个指针是否合法，都是使用if语句测试该指针是否为NULL。

**用指针作为函数返回值时需要注意的一点是，函数运行结束后会销毁在它内部定义的所有局部数据，包括局部变量、局部数组和形式参数，函数返回的指针请尽量不要指向这些数据**，C语言没有任何机制来保证这些数据会一直有效，它们在后续使用过程中可能会引发运行时错误。请看下面的例子：

```c
#include <stdio.h>
int *func(){
    int n = 100;
    return &n;
}
int main(){
    int *p = func(), n;
    n = *p;
    printf("value = %d\n", n);
    return 0;
}
```

运行结果：

```c
value = 100
```

 n 是 func() 内部的局部变量，func() 返回了指向 n 的指针，根据上面的观点，func() 运行结束后 n 将被销毁，使用 `*p` 应该获取不到 n 的值。但是从运行结果来看，我们的推理好像是错误的，func() 运行结束后 `*p` 依然可以获取局部变量 n 的值，这个上面的观点不是相悖吗？

为了进一步看清问题的本质，不妨将上面的代码稍作修改，在第9~10行之间增加一个函数调用，看看会有什么效果：  

```c
#include <stdio.h>
int *func(){
    int n = 100;
    return &n;
}
int main(){
    int *p = func(), n;
    printf("c.biancheng.net\n");
    n = *p;
    printf("value = %d\n", n);
    return 0;
}
```

运行结果：

```c
c.biancheng.net
value = -2
```

可以看到，现在 p 指向的数据已经不是原来 n 的值了，它变成了一个毫无意义的甚至有些怪异的值。与前面的代码相比，该段代码仅仅是在 `*p` 之前增加了一个函数调用，这一细节的不同却导致运行结果有天壤之别，究竟是为什么呢？

前面我们说函数运行结束后会销毁所有的局部数据，这个观点并没错，大部分C语言教材也都强调了这一点。但是，这里所谓的销毁并不是将局部数据所占用的内存全部抹掉，而是程序放弃对它的使用权限，弃之不理，后面的代码可以随意使用这块内存。对于上面的两个例子，func() 运行结束后 n 的内存依然保持原样，值还是 100，如果使用及时也能够得到正确的数据，如果有其它函数被调用就会覆盖这块内存，得到的数据就失去了意义。

> 关于函数调用的原理以及函数如何占用内存的更多细节，我们将在《[C语言和内存](http://c.biancheng.net/cpp/u/c20/)》专题中深入探讨，相信你必将有所顿悟，解开心中的谜团。

第一个例子在调用其他函数之前使用 `*p` 抢先获得了 n 的值并将它保存起来，第二个例子显然没有抓住机会，有其他函数被调用后才使用 `*p` 获取数据，这个时候已经晚了，内存已经被后来的函数覆盖了，而覆盖它的究竟是一份什么样的数据我们无从推断（一般是一个没有意义甚至有些怪异的值）。

**总结**：

常规程序中，函数返回的指针通常应该是：

- 指向静态（static）变量；
- 指向专门申请分配的（如用malloc）空间；
- 指向常量区（如指向字符串"hello"）；
- 指向全局变量；
- 指向程序代码区（如指向函数的指针）。 

除这5项以外，其它怪技巧不提倡。

**函数内的变量，没有关键字static修饰的变量的生命周期只在本函数内，函数结束后变量自动销毁**。当返回为指针的时候需要特别注意，因为**函数结束后指针所指向的地址依然存在，但是该地址可以被其他程序修改，里面的内容就不确定了，有可能后面的操作会继续用到这块地址，有可能不会用到，所以会出现时对时错的情况，如果需要返回一个指针而又不出错的话只能调用内存申请函数**

### 2.2 间接访问操作符

通过一个指针访问它所指向的地址的过程叫做间接访问，或者叫解引用指针，这个用于执行间接访问的操作符是 `*`。

注意：对一个`int*`类型指针解引用会产生一个整型值，类似地，对一个`float*`指针解引用会产生了一个float类型的值。

- 在指针声明时，`*` 号表示所声明的变量为指针

- 在指针使用时，`*` 号表示操作指针所指向的内存空间
  - `*` 相当通过地址(指针变量的值)找到指针指向的内存，再操作内存
  - `*` 放在等号的左边赋值（给内存赋值，写内存）
  - `*` 放在等号的右边取值（从内存中取值，读内存）

```c
//解引用
void test01(){

	//定义指针
	int* p = NULL;
	//指针指向谁，就把谁的地址赋给指针
	int a = 10;
	p = &a;
	*p = 20;//*在左边当左值，必须确保内存可写
	//*号放右面，从内存中读值
	int b = *p;
	//必须确保内存可写
	char* str = "hello world!";
	*str = 'm';
    printf("a:%d\n", a);
	printf("*p:%d\n", *p);
	printf("b:%d\n", b);
}
```

### 2.3 **指针的步长**

指针是一种数据类型，是指它指向的内存空间的数据类型。指针所指向的内存空间决定了指针的步长。指针的步长指的是，当指针+1时候，移动多少字节单位。

### 2.4 指针的意义_间接赋值

通过指针间接赋值成立的三大条件：

- 2个变量（一个普通变量一个指针变量、或者一个实参一个形参）

- 建立关系

- 通过 `*` 操作指针指向的内存

```c
void test(){
	int a = 100;	//两个变量
	int *p = NULL;
	//建立关系
	//指针指向谁，就把谁的地址赋值给指针
	p = &a;
	//通过*操作内存
	*p = 22;
}
```

间接赋值：从1级指针到2级指针：

```c
void AllocateSpace(char** p){
	*p = (char*)malloc(100);
	strcpy(*p, "hello world!");
}

void FreeSpace(char** p){

	if (p == NULL){
		return;
	}
	if (*p != NULL){
		free(*p);
		*p = NULL;
	}

}

void test(){
	
	char* p = NULL;

	AllocateSpace(&p);
	printf("%s\n",p);
	FreeSpace(&p);
    if (p == NULL){
		printf("p内存释放!\n");
	}
}
```

**间接赋值的推论**：

- 用 1 级指针形参，去间接修改了 0 级指针(实参)的值。

- 用 2 级指针形参，去间接修改了 1 级指针(实参)的值。

- 用 3 级指针形参，去间接修改了 2 级指针(实参)的值。

- 用 n 级指针形参，去间接修改了 n-1 级指针(实参)的值。

### 2.5 指针做函数参数

指针做函数参数，具备输入和输出特性：

- 输入：主调函数分配内存

- 输出：被调用函数分配内存

输入特性：

```c
void fun(char *p /* in */)
{
	//给p指向的内存区域拷贝内容
	strcpy(p, "abcddsgsd");
}

void test(void)
{
	//输入，主调函数分配内存
	char buf[100] = { 0 };
	fun(buf);
	printf("buf  = %s\n", buf);
}
```

输出特性：

```c
void fun(char **p /* out */, int *len)
{
	char *tmp = (char *)malloc(100);
	if (tmp == NULL)
	{
		return;
	}
	strcpy(tmp, "adlsgjldsk");

	//间接赋值
	*p = tmp;
	*len = strlen(tmp);
}

void test(void)
{
	//输出，被调用函数分配内存，地址传递
	char *p = NULL;
	int len = 0;
	fun(&p, &len);
	if (p != NULL)
	{
		printf("p = %s, len = %d\n", p, len);
	}
}
```

### 2.6 字符串指针强化

**字符串是以0或者'\0'结尾的字符数组，(数字0和字符'\0'等价)**

**如果以字符串初始化，那么编译器默认会在字符串尾部添加'\0'**

```c
char str3[] = "hello";
```

- sizeof 计算数组大小，数组包含'\0'字符

- strlen 计算字符串的长度，到'\0'结束

字符串拷贝功能实现：

```c
//1）应该判断下传入的参数是否为NULL
//2）最好不要直接使用形参
int copy_string04(char* dest, char* source){
	if (dest == NULL){
        return -1;
	}
	if (source == NULL){
		return -2;
	}

	char* src = source;
	char* tar = dest;

	while (*tar++ = *src++){}

	return 0;
}
```

字符串的格式化：

```c
#include <stdio.h>
int sprintf(char *str, const char *format, ...);
功能：
     根据参数format字符串来转换并格式化数据，然后将结果输出到str指定的空间中，直到出现字符串结束符 '\0' 为止。
参数： 
	str：字符串首地址
	format：字符串格式，用法和printf()一样
返回值：
	成功：实际格式化的字符个数
	失败： - 1
```

```c
//1. 格式化字符串
char buf[1024] = { 0 };
sprintf(buf, "你好,%s,欢迎加入我们!", "John");
printf("buf:%s\n",buf);

memset(buf, 0, 1024);
sprintf(buf, "我今年%d岁了!", 20);
printf("buf:%s\n", buf);

//2. 拼接字符串
memset(buf, 0, 1024);
char str1[] = "hello";
char str2[] = "world";
int len = sprintf(buf,"%s %s",str1,str2);
printf("buf:%s len:%d\n", buf,len);

//3. 数字转字符串
memset(buf, 0, 1024);
int num = 100;
sprintf(buf, "%d", num);
printf("buf:%s\n", buf);
//设置宽度 右对齐
memset(buf, 0, 1024);
sprintf(buf, "%8d", num);
printf("buf:%s\n", buf);
//设置宽度 左对齐
memset(buf, 0, 1024);
sprintf(buf, "%-8d", num);
printf("buf:%s\n", buf);
```

```c
#include <stdio.h>
int sscanf(const char *str, const char *format, ...);
功能：
    从str指定的字符串读取数据，并根据参数format字符串来转换并格式化数据。
参数：
	str：指定的字符串首地址
	format：字符串格式，用法和scanf()一样
返回值：
	成功：实际读取的字符个数
	失败： - 1
```

| **格式**   | **作用**                           |
| ---------- | ---------------------------------- |
| `%*s或%*d` | 跳过数据                           |
| %[width]s  | 读指定宽度的数据                   |
| %[a-z]     | 匹配a到z中任意字符(尽可能多的匹配) |
| %[aBc]     | 匹配a、B、c中一员，贪婪性          |
| `%[^a]`    | 匹配非a的任意字符，贪婪性          |
| `%[^a-z]`  | 表示读取除a-z以外的所有字符        |

```c
//1. 跳过数据
void test01(){
	char buf[1024] = { 0 };
	//跳过前面的数字
	//匹配第一个字符是否是数字，如果是，则跳过
	//如果不是则停止匹配
	sscanf("123456aaaa", "%*d%s", buf); 
	printf("buf:%s\n",buf);
}

//2. 读取指定宽度数据
void test02(){
	char buf[1024] = { 0 };
	//跳过前面的数字
	sscanf("123456aaaa", "%7s", buf);
	printf("buf:%s\n", buf);
}

//3. 匹配a-z中任意字符
void test03(){
	char buf[1024] = { 0 };
	//跳过前面的数字
  	//先匹配第一个字符，判断字符是否是a-z中的字符，如果是匹配
	//如果不是停止匹配
	sscanf("abcdefg123456", "%[a-z]", buf);
	printf("buf:%s\n", buf);
}

//4. 匹配aBc中的任何一个
void test04(){
	char buf[1024] = { 0 };
	//跳过前面的数字
	//先匹配第一个字符是否是aBc中的一个，如果是，则匹配，如果不是则停止匹配
	sscanf("abcdefg123456", "%[aBc]", buf);
	printf("buf:%s\n", buf);
}

//5. 匹配非a的任意字符
void test05(){
	char buf[1024] = { 0 };
	//跳过前面的数字
	//先匹配第一个字符是否是aBc中的一个，如果是，则匹配，如果不是则停止匹配
	sscanf("bcdefag123456", "%[^a]", buf);
	printf("buf:%s\n", buf);
}

//6. 匹配非a-z中的任意字符
void test06(){
	char buf[1024] = { 0 };
	//跳过前面的数字
	//先匹配第一个字符是否是aBc中的一个，如果是，则匹配，如果不是则停止匹配
	sscanf("123456ABCDbcdefag", "%[^a-z]", buf);
	printf("buf:%s\n", buf);
}  
```

#### 2.6.1 一级指针易错点

- 越界
- 指针叠加会不断改变指针指向 `p++`

- 返回局部变量地址

```c
char *get_str()
{
	char str[] = "abcdedsgads"; //栈区，
	printf("[get_str]str = %s\n", str);
	return str;
}
```

- 同一块内存释放多次
  - free()函数的功能只是告诉系统 p 指向的内存可以回收了。就是说，p 指向的内存使用权交还给系统。但是，p的值还是原来的值(野指针)，p还是指向原来的内存

### 2.7 const使用

```c
//const修饰变量
void test01(){
	//1. const基本概念
	const int i = 0;
	//i = 100; //错误，只读变量初始化之后不能修改

	//2. 定义const变量最好初始化
	const int j;
	//j = 100; //错误，不能再次赋值

	//3. c语言的const是一个只读变量，并不是一个常量，可通过指针间接修改
	const int k = 10;
	//k = 100; //错误，不可直接修改，我们可通过指针间接修改
	printf("k:%d\n", k);
	int* p = &k;
	*p = 100;
	printf("k:%d\n", k);
}

//const 修饰指针
void test02(){

	int a = 10;
	int b = 20;
	//const放在*号左侧 修饰p_a指针指向的内存空间不能修改,但可修改指针的指向
	const int* p_a = &a;
	//*p_a = 100; //不可修改指针指向的内存空间
	p_a = &b; //可修改指针的指向

	//const放在*号的右侧， 修饰指针的指向不能修改，但是可修改指针指向的内存空间
	int* const p_b = &a;
	//p_b = &b; //不可修改指针的指向
	*p_b = 100; //可修改指针指向的内存空间

	//指针的指向和指针指向的内存空间都不能修改
	const int* const p_c = &a;
}
//const指针用法
struct Person{
	char name[64];
	int id;
	int age;
	int score;
};

//每次都对对象进行拷贝，效率低，应该用指针
void printPersonByValue(struct Person person){
	printf("Name:%s\n", person.name);
	printf("Name:%d\n", person.id);
	printf("Name:%d\n", person.age);
	printf("Name:%d\n", person.score);
}

//但是用指针会有副作用，可能会不小心修改原数据
void printPersonByPointer(const struct Person *person){
	printf("Name:%s\n", person->name);
	printf("Name:%d\n", person->id);
	printf("Name:%d\n", person->age);
	printf("Name:%d\n", person->score);
}
void test03(){
	struct Person p = { "Obama", 1101, 23, 87 };
	//printPersonByValue(p);
	printPersonByPointer(&p);
}
```

## 三、指针的指针(二级指针)

```c
int a = 12;
int *b = &a;
int **c = &b;
```

它在内存中的大概模样大致如下：

<img src="/images/imageProgramC/二级指针.png">

### 3.1 二级指针做形参输出特性

二级指针做参数的输出特性是指由被调函数分配内存。

```c
//被调函数,由参数n确定分配多少个元素内存
void allocate_space(int **arr,int n){
	//堆上分配n个int类型元素内存
	int *temp = (int *)malloc(sizeof(int)* n);
	if (NULL == temp){
		return;
	}
	//给内存初始化值
	int *pTemp = temp;
	for (int i = 0; i < n;i ++){
		//temp[i] = i + 100;
		*pTemp = i + 100;
		pTemp++;
	}
	//指针间接赋值
	*arr = temp;
}
//打印数组
void print_array(int *arr,int n){
	for (int i = 0; i < n;i ++){
		printf("%d ",arr[i]);
	}
	printf("\n");
}
//二级指针输出特性(由被调函数分配内存)
void test(){
	int *arr = NULL;
	int n = 10;
	//给arr指针间接赋值
	allocate_space(&arr,n);
	//输出arr指向数组的内存
	print_array(arr, n);
	//释放arr所指向内存空间的值
	if (arr != NULL){
		free(arr);
		arr = NULL;
	}
}
```

### 3.2 二级指针做形参输入特性

二级指针做形参输入特性是指由主调函数分配内存。

```c
//打印数组
void print_array(int **arr,int n){
	for (int i = 0; i < n;i ++){
		printf("%d ",*(arr[i]));
	}
	printf("\n");
}
//二级指针输入特性(由主调函数分配内存)
void test(){
	
	int a1 = 10;
	int a2 = 20;
	int a3 = 30;
	int a4 = 40;
	int a5 = 50;

	int n = 5;

	int** arr = (int **)malloc(sizeof(int *) * n);
	arr[0] = &a1;
	arr[1] = &a2;
	arr[2] = &a3;
	arr[3] = &a4;
	arr[4] = &a5;

	print_array(arr,n);

	free(arr);
	arr = NULL;
}
```

## 四、位运算

### 4.1 位逻辑运算符

4个位运算符用于整型数据，包括char.将这些位运算符成为位运算的原因是它们对每位进行操作，而不影响左右两侧的位。请不要将这些运算符与常规的逻辑运算符(&& 、||和!)相混淆，常规的位的逻辑运算符对整个值进行操作。

- **按位取反~**

```c
unsigned char a = 2;   //00000010
unsigned char b = ~a;  //11111101
printf("ret = %d\n", a); //ret = 2
printf("ret = %d\n", b); //ret = 253
```

- **位与（AND）: &**
  - 二进制运算符&通过对两个操作数逐位进行比较产生一个新值。对于每个位，只有两个操作数的对应位都是1时结果才为1。

- **位或（OR）: |**
  - 二进制运算符|通过对两个操作数逐位进行比较产生一个新值。对于每个位，如果其中任意操作数中对应的位为1，那么结果位就为1.

- **位异或:**
  - 二进制运算符 `^` 对两个操作数逐位进行比较。对于每个位，如果操作数中的对应位有一个是1(但不是都是1)，那么结果是1.如果都是0或者都是1，则结果位0.

```c
  (10010011) 
^ (00111101)
= (10101110)
```

**用法**：

- 打开位

已知：10011010：
1. 将位2打开

   `flag | 10011010`

```c
  (10011010)
| (00000100)
= (10011110)
```

2. 将所有位打开。

   `flag | ~flag`

```c
  (10011010)
| (01100101)
= (11111111)
```

- 关闭位

  `flag & ~flag`

```c
  (10011010)
& (01100101)
= (00000000)
```

- 转置位

  - 转置(toggling)一个位表示如果该位打开，则关闭该位；如果该位关闭，则打开。您可以使用位异或运算符来转置。其思想是如果b是一个位(1或0)，那么如果b为1则 `b^1` 为0，如果b为0，则 `1^b` 为1。无论b的值是0还是1, `0^b` 为b.

  `flag ^ 0xff`

``` c
  (10010011)
^ (11111111)
= (01101100)
```

- 交换两个数不需要临时变量

```c
//a ^ b = temp;
//a ^ temp = b;
//b ^ temp = a
  (10010011)
^ (00100110)
= (10110101)

  (10110101)
^ (00100110)
   10010011

#include <stdio.h>
int main(int argc, char *argv[])
{
    int a = 2, b = 6;

    a = a ^ b;
    b = b ^ a;
    a = a ^ b;

    printf("a = %d b = %d/n", a, b);

    return 0;
}
```

### 4.2 移位运算符

- **左移 <<**

  - 左移运算符 `<<` 将其左侧操作数的值的每位向左移动，移动的位数由其右侧操作数指定。空出来的位用0填充，并且丢弃移出左侧操作数末端的位。在下面例子中，每位向左移动两个位置。

  - 左移一位相当于原值 `*2`.

```c
(10001010) << 2
(00101000)
    
1 << 1 = 2;
2 << 1 = 4;
4 << 1 = 8;
8 << 2 = 32
```

- **右移 >>**
  - 右移运算符 `>>` 将其左侧的操作数的值每位向右移动，移动的位数由其右侧的操作数指定。丢弃移出左侧操作数有段的位。对于unsigned类型，使用0填充左端空出的位。**对于有符号类型，结果依赖于机器。空出的位可能用0填充，或者使用符号(最左端)位的副本填充**。

```c
//有符号值
(10001010) >> 2
(00100010)     //在某些系统上的结果值

(10001010) >> 2
(11100010)     //在另一些系统上的解雇

//无符号值
(10001010) >> 2
(00100010)    //所有系统上的结果值
```

**用法：移位运算符**：

- 移位运算符能够提供快捷、高效（依赖于硬件）对2的幂的乘法和除法。

| number << n | number乘以2的n次幂                     |
| ----------- | -------------------------------------- |
| number >> n | 如果number非负，则用number除以2的n次幂 |

## 五、多维数组

### 5.1 一维数组

- 元素类型角度：数组是相同类型的变量的有序集合
- 内存角度：连续的一大片内存空间

**请问：指针和数组是等价的吗？**

答案是**否定**的。数组名在表达式中使用的时候，编译器才会产生一个指针常量。那么数组在什么情况下不能作为指针常量呢？在以下两种场景下：

- 当数组名作为sizeof操作符的操作数的时候，此时sizeof返回的是整个数组的长度，而不是指针数组指针的长度。
- 当数组名作为&操作符的操作数的时候，此时返回的是一个指向数组的指针，而不是指向某个数组元素的指针常量。

```c
int arr[10];
//arr = NULL; //arr作为指针常量，不可修改
int *p = arr; //此时arr作为指针常量来使用
printf("sizeof(arr):%d\n", sizeof(arr)); //此时sizeof结果为整个数组的长度
printf("&arr type is %s\n", typeid(&arr).name()); //int(*)[10]而不是int*
```

**下标引用**：

```c
int arr[] = { 1, 2, 3, 4, 5, 6 };
```

- ***(arr + 3)** ,这个表达式是什么意思呢？
  - 首先，我们说数组在表达式中是一个指向整型的指针，所以此表达式表示arr指针向后移动了3个元素的长度。然后通过间接访问操作符从这个新地址开始获取这个位置的值。这个和下标的引用的执行过程完全相同。所以如下表达式是等同的：

```c
*(arr + 3)
arr[3]
```

**问题 1**：数组下标可否为负值？

**问题 2**：请阅读如下代码，说出结果：

```c
int arr[] = { 5, 3, 6, 8, 2, 9 };
int *p = arr + 2;
printf("*p = %d\n", *p); 		// 6
printf("*p = %d\n", p[-1]);		// 3
```

#### 5.1.1 数组和指针

指针和数组并不是相等的。为了说明这个概念，请考虑下面两个声明

```c
int a[10];
int *b;
```

声明一个数组时，编译器根据声明所指定的元素数量为数组分配内存空间，然后再创建数组名，指向这段空间的起始位置。声明一个指针变量的时候，编译器只为指针本身分配内存空间，并不为任何整型值分配内存空间，指针并未初始化指向任何现有的内存空间。

因此，表达式 `*a` 是完全合法的，但是表达式 `*b` 却是非法的。`*b` 将访问内存中一个不确定的位置，将会导致程序终止。另一方面 b++ 可以通过编译，a++ 却不行，因为 a 是一个常量值。

#### 5.1.2 作为函数参数的数组名

当一个数组名作为一个参数传递给一个函数的时候发生什么情况呢？我们现在知道数组名其实就是一个指向数组第1个元素的指针，所以很明白此时传递给函数的是一份指针的拷贝。所以函数的形参实际上是一个指针。但是为了使程序员新手容易上手一些，编译器也接受数组形式的函数形参。因此下面两种函数原型是相等的：

```c
int print_array(int *arr);
int print_array(int arr[]);
```

我们可以使用任何一种声明，但哪一个更准确一些呢？答案是指针。因为实参实际上是个指针，而不是数组。**同样sizeof arr值是指针的长度，而不是数组的长度**。

现在我们清楚了，**为什么一维数组中无须写明它的元素数目了，因为形参只是一个指针，并不需要为数组参数分配内存。另一方面，这种方式使得函数无法知道数组的长度。如果函数需要知道数组的长度，它必须显式传递一个长度参数给函数**。

### 5.2 多维数组

**数组名**：

- 一维数组名的值是一个指针常量，它的类型是“指向元素类型的指针”，它指向数组的第1个元素。多维数组也是同理，多维数组的数组名也是指向第一个元素，只不过第一个元素是一个数组。例如：

```c
int arr[3][10]
```

可以理解为这是一个一维数组，包含了3个元素，只是每个元素恰好是包含了10个元素的数组。arr就表示指向它的第1个元素的指针，所以arr是一个指向了包含了10个整型元素的数组的指针。

**指向数组的指针(数组指针)**：

数组指针，它是指针，指向数组的指针。

数组的类型由**元素类型**和**数组大小**共同决定：int array[5]  的类型为  int[5]；C语言可通过typedef定义一个数组类型：

定义数组指针有一下三种方式：

```c
//方式一
void test01(){

	//先定义数组类型，再用数组类型定义数组指针
	int arr[10] = {1,2,3,4,5,6,7,8,9,10};
	//有typedef是定义类型，没有则是定义变量,下面代码定义了一个数组类型ArrayType
	typedef int(ArrayType)[10];
	//int ArrayType[10]; //定义一个数组，数组名为ArrayType

	ArrayType myarr; //等价于 int myarr[10];
	ArrayType* pArr = &arr; //定义了一个数组指针pArr，并且指针指向数组arr
	for (int i = 0; i < 10;i++){
		printf("%d ",(*pArr)[i]);
	}
	printf("\n");
}

//方式二
void test02(){

	int arr[10];
	//定义数组指针类型
	typedef int(*ArrayType)[10];
	ArrayType pArr = &arr; //定义了一个数组指针pArr，并且指针指向数组arr
	for (int i = 0; i < 10; i++){
		(*pArr)[i] = i + 1;
	}
	for (int i = 0; i < 10; i++){
		printf("%d ", (*pArr)[i]);
	}
	printf("\n");

}

//方式三
void test03(){
	
	int arr[10];
	int(*pArr)[10] = &arr;

	for (int i = 0; i < 10; i++){
		(*pArr)[i] = i + 1;

	}
	for (int i = 0; i < 10; i++){
		printf("%d ", (*pArr)[i]);
	}
	printf("\n");
}
```

#### 5.2.1 指针数组(元素为指针)

**栈区指针数组**：

```c
//数组做函数函数，退化为指针
void array_sort(char** arr,int len){

	for (int i = 0; i < len; i++){
		for (int j = len - 1; j > i; j --){
			//比较两个字符串
			if (strcmp(arr[j-1],arr[j]) > 0){
				char* temp = arr[j - 1];
				arr[j - 1] = arr[j];
				arr[j] = temp;
			}
		}
	}
}

//打印数组
void array_print(char** arr,int len){
	for (int i = 0; i < len;i++){
		printf("%s\n",arr[i]);
	}
	printf("----------------------\n");
}

void test(){
	//主调函数分配内存
	//指针数组
	char* p[] = { "bbb", "aaa", "ccc", "eee", "ddd"};
	//char** p = { "aaa", "bbb", "ccc", "ddd", "eee" }; //错误
	int len = sizeof(p) / sizeof(char*);
	//打印数组
	array_print(p, len);
	//对字符串进行排序
	array_sort(p, len);
	//打印数组
	array_print(p, len);
}
```

**堆区指针数组**：

```c
//分配内存
char** allocate_memory(int n){
	if (n < 0 ){
		return NULL;
	}

	char** temp = (char**)malloc(sizeof(char*) * n);
	if (temp == NULL){
		return NULL;
	}

	//分别给每一个指针malloc分配内存
	for (int i = 0; i < n; i ++){
		temp[i] = malloc(sizeof(char)* 30);
		sprintf(temp[i], "%2d_hello world!", i + 1);
	}
	return temp;
}

//打印数组
void array_print(char** arr,int len){
	for (int i = 0; i < len;i++){
		printf("%s\n",arr[i]);
	}
	printf("----------------------\n");
}

//释放内存
void free_memory(char** buf,int len){
	if (buf == NULL){
		return;
	}
	for (int i = 0; i < len; i ++){
		free(buf[i]);
		buf[i] = NULL;
	}
	free(buf);
}

void test(){
	int n = 10;
	char** p = allocate_memory(n);
	//打印数组
	array_print(p, n);
	//释放内存
	free_memory(p, n);
}
```

**二维数组的线性存储特性式**：

```c
void PrintArray(int* arr, int len){
	for (int i = 0; i < len; i++){
		printf("%d ", arr[i]);
	}
	printf("\n");
}

//二维数组的线性存储
void test(){
	int arr[][3] = {
		{ 1, 2, 3 },
		{ 4, 5, 6 },
		{ 7, 8, 9 }
	};

	int arr2[][3] = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
	int len = sizeof(arr2) / sizeof(int);

	//如何证明二维数组是线性的？
	//通过将数组首地址指针转成Int*类型，那么步长就变成了4，就可以遍历整个数组
	int* p = (int*)arr;
	for (int i = 0; i < len; i++){
		printf("%d ", p[i]);
	}
	printf("\n");

	PrintArray((int*)arr, len);
	PrintArray((int*)arr2, len);
}
```

**二维数组的3种形式参数**：

```c
//二维数组的第一种形式
void PrintArray01(int arr[3][3]){
	for (int i = 0; i < 3; i++){
		for (int j = 0; j < 3; j++){
			printf("arr[%d][%d]:%d\n", i, j, arr[i][j]);
		}
	}
}

//二维数组的第二种形式
void PrintArray02(int arr[][3]){
	for (int i = 0; i < 3; i++){
		for (int j = 0; j < 3; j++){
			printf("arr[%d][%d]:%d\n", i, j, arr[i][j]);
		}
	}
}

//二维数组的第二种形式
void PrintArray03(int(*arr)[3]){
	for (int i = 0; i < 3; i++){
		for (int j = 0; j < 3; j++){
			printf("arr[%d][%d]:%d\n", i, j, arr[i][j]);
		}
	}
}

void test(){
	int arr[][3] = { 
		{ 1, 2, 3 },
		{ 4, 5, 6 },
		{ 7, 8, 9 }
	};
	
	PrintArray01(arr);
	PrintArray02(arr);
	PrintArray03(arr);
}
```

### 5.3 总结

**编程提示**：

- 源代码的可读性几乎总是比程序的运行时效率更为重要
- **只要有可能，函数的指针形参都应该声明为const**
- 在多维数组的初始值列表中使用完整的多层花括号提供可读性

**内容总结**：

- 在绝大多数表达式中，数组名的值是指向数组第1个元素的指针。**这个规则只有两个例外，sizeof和对数组名&**。
- 指针和数组并不相等。当我们声明一个数组的时候，同时也分配了内存。但是声明指针的时候，只分配容纳指针本身的空间。
- 当数组名作为函数参数时，实际传递给函数的是一个指向数组第1个元素的指针。
- 我们不单可以创建指向普通变量的指针，也可创建指向数组的指针。

## 六、结构体

### 6.1 结构体基础知识

结构体类型的定义

```c
struct Person{
	char name[64];
	int age;
};

typedef struct _PERSON{
	char name[64];
	int age;
}Person;
```

**注意：**定义结构体类型时不要直接给成员赋值，结构体只是一个类型，编译器还没有为其分配空间，只有根据其类型定义变量时，才分配空间，有空间后才能赋值。

**结构体变量的定义**

```c
struct Person{
	char name[64];
	int age;
}p1; //定义类型同时定义变量

struct{
	char name[64];
	int age;
}p2; //定义类型同时定义变量

struct Person p3; //通过类型直接定义
```

**结构体成员的使用**

```c
struct Person{
	char name[64];
	int age;
};
void test(){
	//在栈上分配空间
	struct Person p1;
	strcpy(p1.name, "John");
	p1.age = 30;
	//如果是普通变量，通过点运算符操作结构体成员
	printf("Name:%s Age:%d\n", p1.name, p1.age);

	//在堆上分配空间
	struct Person* p2 = (struct Person*)malloc(sizeof(struct Person));
	strcpy(p2->name, "Obama");
	p2->age = 33;
	//如果是指针变量，通过->操作结构体成员
	printf("Name:%s Age:%d\n", p2->name, p2->age);
}
```

**深拷贝和浅拷贝**

```c
//一个老师有N个学生
typedef struct _TEACHER{
	char* name;
}Teacher;

void test(){
	Teacher t1;
	t1.name = malloc(64);
	strcpy(t1.name , "John");

	Teacher t2;
	t2 = t1;

	//对手动开辟的内存，需要手动拷贝
	t2.name = malloc(64);
	strcpy(t2.name, t1.name);

	if (t1.name != NULL){
		free(t1.name);
		t1.name = NULL;
	}
	if (t2.name != NULL){
		free(t2.name);
		t1.name = NULL;
	}
}
```

**结构体数组**

```c
struct Person{
	char name[64];
	int age;
};

void test(){
	//在栈上分配空间
	struct Person p1[3] = {
		{ "John", 30 },
		{ "Obama", 33 },
		{ "Edward", 25}
	};

	struct Person p2[3] = { "John", 30, "Obama", 33, "Edward", 25 };
	for (int i = 0; i < 3;i ++){
		printf("Name:%s Age:%d\n",p1[i].name,p1[i].age);
	}
	printf("-----------------\n");
	for (int i = 0; i < 3; i++){
		printf("Name:%s Age:%d\n", p2[i].name, p2[i].age);
	}
	printf("-----------------\n");
	//在堆上分配结构体数组
	struct Person* p3 = (struct Person*)malloc(sizeof(struct Person) * 3);
	for (int i = 0; i < 3;i++){
		sprintf(p3[i].name, "Name_%d", i + 1);
		p3[i].age = 20 + i;
	}
	for (int i = 0; i < 3; i++){
		printf("Name:%s Age:%d\n", p3[i].name, p3[i].age);
	}
}
```

### 6.2 结构体嵌套指针

**结构体嵌套一级指针**

```c
struct Person{
	char* name;
	int age;
};

void allocate_memory(struct Person** person){
	if (person == NULL){
		return;
	}
	struct Person* temp = (struct Person*)malloc(sizeof(struct Person));
	if (temp == NULL){
		return;
	}
	//给name指针分配内存
	temp->name = (char*)malloc(sizeof(char)* 64);
	strcpy(temp->name, "John");
	temp->age = 100;

	*person = temp;
}

void print_person(struct Person* person){
	printf("Name:%s Age:%d\n",person->name,person->age);
}

void free_memory(struct Person** person){
	if (person == NULL){
		return;
	}
	struct Person* temp = *person;
	if (temp->name != NULL){
		free(temp->name);
		temp->name = NULL;
	}

	free(temp);
}

void test(){
	struct Person *p = NULL;
	allocate_memory(&p);
	print_person(p);
	free_memory(&p);
}
```

**结构体嵌套二级指针**

```c
//一个老师有N个学生
typedef struct _TEACHER{
	char name[64];
	char** students;
}Teacher;

void create_teacher(Teacher** teacher,int n,int m){
	if (teacher == NULL){
		return;
	}

	//创建老师数组
	Teacher* teachers = (Teacher*)malloc(sizeof(Teacher)* n);
	if (teachers == NULL){
		return;
	}

	//给每一个老师分配学生
	int num = 0;
	for (int i = 0; i < n; i ++){
		sprintf(teachers[i].name, "老师_%d", i + 1);
		teachers[i].students = (char**)malloc(sizeof(char*) * m);
		for (int j = 0; j < m;j++){
			teachers[i].students[j] = malloc(64);
			sprintf(teachers[i].students[j], "学生_%d", num + 1);
			num++;
		}
	}
	*teacher = teachers;	
}

void print_teacher(Teacher* teacher,int n,int m){
	for (int i = 0; i < n; i ++){
		printf("%s:\n", teacher[i].name);
		for (int j = 0; j < m;j++){
			printf("  %s",teacher[i].students[j]);
		}
		printf("\n");
	}
}

void free_memory(Teacher** teacher,int n,int m){
	if (teacher == NULL){
		return;
	}

	Teacher* temp = *teacher;
	for (int i = 0; i < n; i ++){		
		for (int j = 0; j < m;j ++){
			free(temp[i].students[j]);
			temp[i].students[j] = NULL;
		}
		free(temp[i].students);
		temp[i].students = NULL;
	}
	free(temp);
}

void test(){
	Teacher* p = NULL;
	create_teacher(&p,2,3);
	print_teacher(p, 2, 3);
	free_memory(&p,2,3);
}
```

### 6.3 结构体成员偏移量

```c
//一旦结构体定义下来，则结构体中的成员内存布局就定下了
typedef struct Teacher {
	char a;  
	int b;      
	int c;        

} Teacher;

void test(){
	Teacher  t1;
	Teacher*p = NULL;
	p = &t1;

	int offsize1 = (int)&(p->b) - (int)p;  //age 相对于结构体 Teacher的偏移量
	int offsize2 = (int)&(((Teacher *)0)->b);//绝对0地址 age的偏移量
	int offsize3 = offsetof(Teacher, b);

	printf("offsize1:%d \n", offsize1);
	printf("offsize2:%d \n", offsize2);
	printf("offsize3:%d \n", offsize3);
}
```

### 6.4 结构体字节对齐

在用sizeof运算符求算某结构体所占空间时，并不是简单地将结构体中所有元素各自占的空间相加，这里涉及到内存字节对齐的问题。

从理论上讲，对于任何变量的访问都可以从任何地址开始访问，但是事实上不是如此，实际上访问特定类型的变量只能在特定的地址访问，这就需要各个变量在空间上按一定的规则排列， 而不是简单地顺序排列，这就是**内存对齐**。

#### 6.4.1 内存对齐原因

我们知道内存的最小单元是一个字节，当cpu从内存中读取数据的时候，是一个一个字节读取，但是实际上cpu将内存当成多个块，每次从内存中读取一个块，这个块的大小可能是2、4、8、16等

内存对齐是操作系统为了提高访问内存的策略。操作系统在访问内存的时候，每次读取一定长度(这个长度是操作系统默认的对齐数，或者默认对齐数的整数倍)。如果没有对齐，为了访问一个变量可能产生二次访问。

**为什么要简单内存对齐？**

- 提高存取数据的速度。比如有的平台每次都是从偶地址处读取数据，对于一个int型的变量，若从偶地址单元处存放，则只需一个读取周期即可读取该变量；但是若从奇地址单元处存放，则需要2个读取周期读取该变量。
- 某些平台只能在特定的地址处访问特定类型的数据，否则抛出硬件异常给操作系统。

#### 6.4.2 如何内存对齐

- 对于标准数据类型，它的地址只要是它的长度的整数倍。
- 对于非标准数据类型，比如结构体，要遵循一下对齐原则：
  - 数组成员对齐规则。第一个数组成员应该放在offset为0的地方，以后每个数组成员应该放在offset为**min（当前成员的大小，#pargama pack(n)）**整数倍的地方开始（比如int在32位机器为４字节，#pargama pack(2)，那么从2的倍数地方开始存储）。
  - 结构体总的大小，也就是sizeof的结果，必须是**min（结构体内部最大成员，#pargama pack(n)）**的整数倍，不足要补齐。
  - 结构体做为成员的对齐规则。如果一个结构体B里嵌套另一个结构体A,还是以最大成员类型的大小对齐，但是结构体A的起点为A内部最大成员的整数倍的地方。（struct B里存有struct A，A里有char，int，double等成员，那A应该从8的整数倍开始存储。），结构体A中的成员的对齐规则仍满足原则1、原则2。

手动设置对齐模数:

- **#pragma pack(show)**
  - 显示当前packing alignment的字节数，以warning message的形式被显示。
- **#pragma pack(push)** 
  - 将当前指定的packing alignment数组进行压栈操作，这里的栈是the internal compiler stack,同事设置当前的packing alignment为n；如果n没有指定，则将当前的packing alignment数组压栈。
- **#pragma pack(pop)** 
  - 从internal compiler stack中删除最顶端的reaord; 如果没有指定n,则当前栈顶record即为新的packing alignement数值；如果指定了n，则n成为新的packing alignment值
- **#pragma pack(n)**
  - 指定packing的数值，以字节为单位，缺省数值是8，合法的数值分别是1,2,4,8,16。 

内存对齐案例

```c
#pragma pack(4)
typedef struct _STUDENT{
	int a;
	char b;
	double c;
	float d;
}Student;

typedef struct _STUDENT2{
	char a;
	Student b; 
	double c;
}Student2;

void test01(){
	//Student
	//a从偏移量0位置开始存储
	//b从4位置开始存储
	//c从8位置开始存储
	//d从12位置开存储
	//所以Student内部对齐之后的大小为20 ，整体对齐，整体为最大类型的整数倍 也就是8的整数倍 为24
	printf("sizeof Student:%d\n",sizeof(Student));
    
	//Student2 
	//a从偏移量为0位置开始 8
	//b从偏移量为Student内部最大成员整数倍开始，也就是8开始 24
	//c从8的整数倍地方开始,也就是32开始
	//所以结构体Sutdnet2内部对齐之后的大小为：40 ， 由于结构体中最大成员为8，必须为8的整数倍 所以大小为40
	printf("sizeof Student2:%d\n", sizeof(Student2));
}
```

## 七、文件操作

文件在今天的计算机系统中作用是很重要的。文件用来存放程序、文档、数据、表格、图片和其他很多种类的信息。作为一名程序员，您必须编程来创建、写入和读取文件。编写程序从文件读取信息或者将结果写入文件是一种经常性的需求。C提供了强大的和文件进行通信的方法。使用这种方法我们可以在程序中打开文件，然后使用专门的I/O函数读取文件或者写入文件。

**文件的概念**

- 一个文件通常就是磁盘上一段命名的存储区。但是对于操作系统来说，文件就会更复杂一些。例如，一个大文件可以存储在一些分散的区段中，或者还会包含一些操作系统可以确定其文件类型的附加数据，但是这些是操作系统，而不是我们程序员所要关心的事情。我们应该考虑如何在C程序中处理文件。

**流的概念**

流是一个动态的概念，可以将一个字节形象地比喻成一滴水，字节在设备、文件和程序之间的传输就是流，类似于水在管道中的传输，可以看出，流是对输入输出源的一种抽象，也是对传输信息的一种抽象。

C语言中，I/O操作可以简单地看作是从程序移进或移出字节，这种搬运的过程便称为流(stream)。程序只需要关心是否正确地输出了字节数据，以及是否正确地输入了要读取字节数据，特定I/O设备的细节对程序员是隐藏的。

**文本流**

- 文本流，也就是我们常说的以文本模式读取文件。文本流的有些特性在不同的系统中可能不同。其中之一就是文本行的最大长度。标准规定至少允许254个字符。另一个可能不同的特性是文本行的结束方式。例如在Windows系统中，文本文件约定以一个回车符和一个换行符结尾。但是在Linux下只使用一个换行符结尾。
- 标准C把文本定义为零个或者多个字符，后面跟一个表示结束的换行符(\n).对于那些文本行的外在表现形式与这个定义不同的系统上，库函数负责外部形式和内部形式之间的翻译。例如，在Windows系统中，在输出时，文本的换行符被写成一对回车/换行符。在输入时，文本中的回车符被丢弃。这种不必考虑文本的外部形势而操纵文本的能力简化了可移植程序的创建。

**二进制流**

- 二进制流中的字节将完全根据程序编写它们的形式写入到文件中，而且完全根据它们从文件或设备读取的形式读入到程序中。它们并未做任何改变。这种类型的流适用于非文本数据，但是如果你不希望I/O函数修改文本文件的行末字符，也可以把它们用于文本文件。

c语言在处理这两种文件的时候并不区分，都看成是字符流，按字节进行处理。

**我们程序中，经常看到的文本方式打开文件和二进制方式打开文件仅仅体现在换行符的处理上**。

比如说，在widows下，文件的换行符是 `\r\n`，而在Linux下换行符则是 `\n`.

当对文件使用文本方式打开的时候，读写的windows文件中的换行符\r\n会被替换成\n读到内存中，当在windows下写入文件的时候，\n被替换成\r\n再写入文件。如果使用二进制方式打开文件，则不进行\r\n和\n之间的转换。 那么由于Linux下的换行符就是\n, 所以文本文件方式和二进制方式无区别。

### 7.1 文件的操作

**文件流总览**

标准库函数是的我们在C程序中执行与文件相关的I/O任务非常方便。下面是关于文件I/O的一般概况。

- 程序为同时处于活动状态的每个文件声明一个指针变量，其类型为 `FILE*`。这个指针指向这个FILE结构，当它处于活动状态时由流使用。
- 流通过fopen函数打开。为了打开一个流，我们必须指定需要访问的文件或设备以及他们的访问方式(读、写、或者读写)。Fopen和操作系统验证文件或者设备是否存在并初始化FILE。
- 根据需要对文件进行读写操作。
- 最后调用fclose函数关闭流。关闭一个流可以防止与它相关的文件被再次访问，保证任何存储于缓冲区中的数据被正确写入到文件中，并且释放FILE结构。

标准I/O更为简单，因为它们并不需要打开或者关闭。

I/O函数以三种基本的形式处理数据：**单个字符**、**文本行**和**二进制数据**。对于每种形式都有一组特定的函数对它们进行处理。

**输入/输出函数家族**

| 家族名  | 目的       | 可用于所有流 | 只用于stdin和stdout |
| ------- | ---------- | ------------ | ------------------- |
| getchar | 字符输入   | fgetc、getc  | getchar             |
| putchar | 字符输出   | fputc、putc  | putchar             |
| gets    | 文本行输入 | fgets        | gets                |
| puts    | 文本行输出 | fputs        | puts                |
| scanf   | 格式化输入 | fscanf       | scanf               |
| printf  | 格式化输出 | fprintf      | printf              |

### 7.2 文件打开关闭

文件的打开操作表示将给用户指定的文件在内存分配一个FILE结构区，并将该结构的指针返回给用户程序，以后用户程序就可用此FILE指针来实现对指定文件的存取操作了。当使用打开函数时，必须给出文件名、文件操作方式(读、写或读写)。

```c
FILE * fopen(const char * filename, const char * mode);
功能：打开文件
参数：
	filename：需要打开的文件名，根据需要加上路径
	mode：打开文件的权限设置
返回值：
	成功：文件指针
	失败：NULL
```

| 方式  | 含义                                                         |
| ----- | ------------------------------------------------------------ |
| “r”   | 打开，只读，文件必须已经存在。                               |
| “w”   | 只写,如果文件不存在则创建,如果文件已存在则把文件长度截断(Truncate)为0字节。再重新写,也就是替换掉原来的文件内容文件指针指到头。 |
| “a”   | 只能在文件末尾追加数据,如果文件不存在则创建                  |
| “rb”  | 打开一个二进制文件，只读                                     |
| “wb”  | 打开一个二进制文件，只写                                     |
| “ab"  | 打开一个二进制文件，追加                                     |
| “r+”  | 允许读和写,文件必须已存在                                    |
| “w+”  | 允许读和写,如果文件不存在则创建,如果文件已存在则把文件长度截断为0字节再重新写 。 |
| “a+”  | 允许读和追加数据,如果文件不存在则创建                        |
| “rb+” | 以读/写方式打开一个二进制文件                                |
| “wb+” | 以读/写方式建立一个新的二进制文件                            |
| “ab+” | 以读/写方式打开一个二进制文件进行追加                        |

```c
void test(){
	FILE *fp = NULL;

	// "\\"这样的路径形式，只能在windows使用
	// "/"这样的路径形式，windows和linux平台下都可用，建议使用这种
	// 路径可以是相对路径，也可是绝对路径
	fp = fopen("../test", "w");
	//fp = fopen("..\\test", "w");

	if (fp == NULL) //返回空，说明打开失败
	{
		//perror()是标准出错打印函数，能打印调用库函数出错原因
		perror("open");
		return -1;
	}
}
```

**注意**：应该检查fopen的返回值!如何函数失败，它会返回一个NULL值。如果程序不检查错误，这个NULL指针就会传给后续的I/O函数。它们将对这个指针执行间接访问，并将失败.

```c
int fclose(FILE * stream);
功能：关闭先前fopen()打开的文件。此动作让缓冲区的数据写入文件中，并释放系统所提供的文件资源。
参数：
	stream：文件指针
返回值：
	成功：0
	失败：-1
```

它表示该函数将关闭FILE指针对应的文件，并返回一个整数值。若成功地关闭了文件，则返回一个0值，否则返回一个非0值.

**文件读写函数回顾**

- 按照字符读写文件：fgetc(), fputc()
- 按照行读写文件：fputs(), fgets()
- 按照块读写文件：fread(), fwirte()
- 按照格式化读写文件：fprintf(), fscanf()
- 按照随机位置读写文件：fseek(), ftell(), rewind()	

**块读写函数回顾**

```c
size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);
功能：以数据块的方式给文件写入内容
参数：
	ptr：准备写入文件数据的地址
	size： size_t 为 unsigned int类型，此参数指定写入文件内容的块数据大小
	nmemb：写入文件的块数，写入文件数据总大小为：size * nmemb
	stream：已经打开的文件指针
返回值：
	成功：实际成功写入文件数据的块数，此值和nmemb相等
	失败：0

size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream);
功能：以数据块的方式从文件中读取内容
参数：
	ptr：存放读取出来数据的内存空间
	size： size_t 为 unsigned int类型，此参数指定读取文件内容的块数据大小
	nmemb：读取文件的块数，读取文件数据总大小为：size * nmemb
	stream：已经打开的文件指针
返回值：
	成功：实际成功读取到内容的块数，如果此值比nmemb小，但大于0，说明读到文件的结尾。
	失败：0
```

**格式化读写函数回顾**

```c
int fprintf(FILE * stream, const char * format, ...);
功能：根据参数format字符串来转换并格式化数据，然后将结果输出到stream指定的文件中，指定出现字符串结束符 '\0'  为止。
参数：
	stream：已经打开的文件
	format：字符串格式，用法和printf()一样
返回值：
	成功：实际写入文件的字符个数
	失败：-1

int fscanf(FILE * stream, const char * format, ...);
功能：从stream指定的文件读取字符串，并根据参数format字符串来转换并格式化数据。
参数：
	stream：已经打开的文件
	format：字符串格式，用法和scanf()一样
返回值：
	成功：实际从文件中读取的字符个数
	失败： - 1
```

**注意**：**fscanf遇到空格和换行时结束。**

### 7.3 读写配置文件

<img src="/images/imageProgramC/文件读写案例.png">

```c
struct info{
	char key[64];
	char val[128];
};

struct config{
	FILE *fp; //保存文件指针
	struct info *list; //保存配置信息
	int lines; //配置信息条数
};

//加载配置文件
int load_file(char *path, struct config **myconfig){
	if (NULL == path){
		return -1;
	}
	//以读写的方式打开文件
	FILE *fp = fopen(path, "r+");
	if (NULL ==fp){
		printf("文件打开失败!\n");
		return -2;
	}
	//配置文件信息分配内存
	struct config *conf = (struct config *)malloc(sizeof(struct config));
	conf->fp = fp;
	conf->list = NULL;

	//指针的间接赋值
	*myconfig = conf;

	return 0;
}

//统计文件行数
int count_file(struct config *config){
	if (NULL == config){
		return -1;
	}
	char buf[1024] = { 0 };
	int lines = 0;
	while (fgets(buf, 1024, config->fp)){
		//如果是注释则不统计
		if (buf[0] == '#'){ continue; }
		lines++;
	}
	//将文件指针重置到开始位置
	fseek(config->fp,0, SEEK_SET);

	return lines;
}

//解析配置文件
int parse_file(struct config *config){
	if (NULL == config){
		return -1;
	}
	//获得配置文件行数
	config->lines = count_file(config);
	//给每一行配置信息分配内存
	config->list = (struct info *)malloc(sizeof(struct info) * config->lines);
	int index = 0;
	char buf[1024] = { 0 };
	while (fgets(buf, 1024, config->fp)){
		//去除每一行最后的\n字符
		buf[strlen(buf) - 1] = '\0';
		//如果是注释则不显示
		if (buf[0] == '#'){
			continue;
		}
		memset(config->list[index].key, 0, 64);
		memset(config->list[index].val, 0, 128);
	
		char *delimit = strchr(buf, ':');
		strncpy(config->list[index].key, buf, delimit - buf);
		strncpy(config->list[index].val, delimit + 1, strlen(delimit + 1));
		memset(buf, 0 , 1024);
		index++;
	}
	return 0;
}

const char *get_file(struct config *config, char *key){
	if (NULL == config){
		return NULL;
	}
	if (NULL == key){
		return NULL;
	}
	
	for (int i = 0; i < config->lines;i ++){
		if (strcmp(config->list[i].key,key) == 0){
			return config->list[i].val;
		}
	}
	return NULL;
}

void destroy_file(struct config *config){
	if (NULL == config){
		return;
	}
	//关闭文件指针
	fclose(config->fp);
	config->fp = NULL;
	//释放配置信息
	free(config->list);
	config->list = NULL;
	free(config);
}

void test(){
	char *path = "./my.ini";
	struct config *conf = NULL;
	load_file(path, &conf);
	parse_file(conf);
	printf("%s\n", get_file(conf, "username"));
	printf("%s\n", get_file(conf, "password"));
	printf("%s\n", get_file(conf, "server_ip"));
	printf("%s\n", get_file(conf, "server_port"));
	printf("%s\n", get_file(conf, "aaaa"));
	destroy_file(conf);
}
```

## 八、链表

### 8.1 链表基本概念

<img src="/images/imageProgramC/链表.png">

- 链表是一种常用的数据结构，它通过指针将一些列数据结点，连接成一个数据链。相对于数组，链表具有更好的动态性（**非顺序存储**）。
- 数据域用来存储数据，指针域用于建立与下一个结点的联系。
- 建立链表时无需预先知道数据总量的，可以随机的分配空间，可以高效的在链表中的任意位置实时插入或删除数据。
- **链表的开销，主要是访问顺序性和组织链的空间损失**。

**数组和链表的区别**：

- 数组：一次性分配一块连续的存储区域。

  优点：随机访问元素效率高

  缺点：

  - 需要分配一块连续的存储区域（很大区域，有可能分配失败）
  - 删除和插入某个元素效率低

- 链表：无需一次性分配一块连续的存储区域，只需分配n块节点存储区域，通过指针建立关系。

  优点：

  - 不需要一块连续的存储区域
  - 删除和插入某个元素效率高

  缺点：随机访问元素效率低

#### 8.1.1 有关结构体的自身引用

问题1：请问结构体可以嵌套本类型的结构体变量吗？

问题2：请问结构体可以嵌套本类型的结构体指针变量吗？

```c
typedef struct _STUDENT{
	char name[64];
	int age;
}Student;

typedef struct _TEACHER{
	char name[64];
	Student stu; //结构体可以嵌套其他类型的结构体
	//Teacher stu;
	//struct _TEACHER teacher; //此时Teacher类型的成员还没有确定，编译器无法分配内存
	struct _TEACHER* teacher; //不论什么类型的指针，都只占4个字节，编译器可确定内存分配
}Teacher;
```

- 结构体可以嵌套另外一个结构体的任何类型变量;
- **结构体嵌套本结构体普通变量（不可以）**。本结构体的类型大小无法确定，类型本质：固定大小内存块别名;
- **结构体嵌套本结构体指针变量（可以）**, 指针变量的空间能确定，32位， 4字节， 64位， 8字节;

#### 8.1.2 **链表节点**

大家思考一下，我们说链表是由一系列的节点组成，那么如何表示一个包含了数据域和指针域的节点呢？

**链表的节点类型实际上是结构体变量，此结构体包含数据域和指针域**：

- 数据域用来存储数据；

- 指针域用于建立与下一个结点的联系，**当此节点为尾节点时，指针域的值为NULL**；

```c
typedef struct Node 
{
	//数据域
	int id;
	char name[50];

	//指针域
	struct Node *next;       
}Node;
```

<img src="/images/imageProgramC/链表-01.png">

#### 8.1.3 链表的分类

链表分为：

- 静态链表
- 动态链表

静态链表和动态链表是线性表链式存储结构的两种不同的表示方式：

- 所有结点都是在程序中定义的，不是临时开辟的，也不能用完后释放，这种链表称为“静态链表”。

- 所谓动态链表，是指在程序执行过程中从无到有地建立起一个链表，即一个一个地开辟结点和输入各结点数据，并建立起前后相链的关系。

**静态链表**

```c
typedef struct Stu {
	int id;	//数据域
	char name[100];

	struct Stu *next; //指针域
}Stu;

void test() {
	//初始化三个结构体变量
	Stu s1 = { 1, "yuri", NULL };
	Stu s2 = { 2, "lily", NULL };
	Stu s3 = { 3, "lilei", NULL };

	s1.next = &s2; //s1的next指针指向s2
	s2.next = &s3;
	s3.next = NULL; //尾结点

	Stu *p = &s1;
	while (p != NULL) {
		printf("id = %d, name = %s\n", p->id, p->name);
		//结点往后移动一位
		p = p->next; 
	}
}
```

**动态链表**

```c
typedef struct Stu {
	int id;	//数据域
	char name[100];

	struct Stu *next; //指针域
}Stu;

void test() {
	//动态分配3个节点
	Stu *s1 = (Stu *)malloc(sizeof(Stu));
	s1->id = 1;
	strcpy(s1->name, "yuri");

	Stu *s2 = (Stu *)malloc(sizeof(Stu));
	s2->id = 2;
	strcpy(s2->name, "lily");

	Stu *s3 = (Stu *)malloc(sizeof(Stu));
	s3->id = 3;
	strcpy(s3->name, "lilei");

	//建立节点的关系
	s1->next = s2; //s1的next指针指向s2
	s2->next = s3;
	s3->next = NULL; //尾结点

	//遍历节点
	Stu *p = s1;
	while (p != NULL){
		printf("id = %d, name = %s\n", p->id, p->name);
		//结点往后移动一位
		p = p->next; 
	}

	//释放节点空间
	p = s1;
	Stu *tmp = NULL;
	while (p != NULL)
	{
		tmp = p;
		p = p->next;

		free(tmp);
		tmp = NULL;
	}
}
```

**带头和不带头链表**

- 带头链表：固定一个节点作为头结点(数据域不保存有效数据)，起一个标志位的作用，以后不管链表节点如何改变，此头结点固定不变。

<img src="/images/imageProgramC/链表-02.png">

- 不带头链表：头结点不固定，根据实际需要变换头结点(如在原来头结点前插入新节点，然后，新节点重新作为链表的头结点)。

<img src="/images/imageProgramC/链表-03.png">

**单向链表、双向链表、循环链表**

- 单向链表：

<img src="/images/imageProgramC/链表-04.png">

- 双向链表：

<img src="/images/imageProgramC/链表-05.png">

- 循环链表：

<img src="/images/imageProgramC/链表-06.png">

### 8.2 链表基本操作

#### 8.2.1 **创建链表**

使用结构体定义节点类型：

```c
typedef struct _LINKNODE
{
	int id; //数据域
	struct _LINKNODE *next; //指针域
}link_node;
```

编写函数：`link_node* init_linklist()`

建立带有头结点的单向链表，循环创建结点，结点数据域中的数值从键盘输入，以 -1 作为输入结束标志，链表的头结点地址由函数值返回.

```c
typedef struct _LINKNODE{
	int data;
	struct _LINKNODE *next;
}link_node;

link_node *init_linklist(){
	//创建头结点指针
	link_node* head = NULL;
	//给头结点分配内存
	head = (link_node*)malloc(sizeof(link_node));
	if (head == NULL){
		return NULL;
	}
	head->data = -1;
	head->next = NULL;

	//保存当前节点
	link_node* p_current = head;
	int data = -1;
	//循环向链表中插入节点
	while (1){
		printf("please input data:\n");
		scanf("%d",&data);

		//如果输入-1，则退出循环
		if (data == -1){
			break;
		}
		//给新节点分配内存
		link_node* newnode = (link_node*)malloc(sizeof(link_node));
		if (newnode == NULL){
			break;
		}
		//给节点赋值
		newnode->data = data;
		newnode->next = NULL;
		//新节点入链表，也就是将节点插入到最后一个节点的下一个位置
		p_current->next = newnode;
		//更新辅助指针p_current
		p_current = newnode;
	}
	return head;
}
```

#### 8.2.2 遍历链表

编写函数：`void foreach_linklist(link_node* head)`

顺序输出单向链表各项结点数据域中的内容：

```c
//遍历链表
void foreach_linklist(link_node* head){
	if (head == NULL){
		return;
	}
	//赋值指针变量
	link_node* p_current = head->next;
	while (p_current != NULL){
		printf("%d ",p_current->data);
		p_current = p_current->next;
	}
	printf("\n");
}
```

#### 8.2.3 **插入节点**

编写函数: `void insert_linklist(link_node* head,int val,int data).`

在指定值后面插入数据data,如果值val不存在，则在尾部插入。

```c
//在值val前插入节点
void insert_linklist(link_node* head, int val, int data){
	if (head == NULL){
		return;
	}
	//两个辅助指针
	link_node* p_prev = head;
	link_node* p_current = p_prev->next;
	while (p_current != NULL){
		if (p_current->data == val){
			break;
		}
		p_prev = p_current;
		p_current = p_prev->next;
	}
	//如果p_current为NULL，说明不存在值为val的节点
	if (p_current == NULL){
		printf("不存在值为%d的节点!\n",val);
		return;
	}
	//创建新的节点
	link_node* newnode = (link_node*)malloc(sizeof(link_node));
	newnode->data = data;
	newnode->next = NULL;

	//新节点入链表
	newnode->next = p_current;
	p_prev->next = newnode;
}
```

#### 8.2.4 **删除节点**

编写函数: `void remove_linklist(link_node* head,int val)`

删除第一个值为val的结点.

```c
//删除值为val的节点
void remove_linklist(link_node* head,int val){
	if (head == NULL){
		return;
	}

	//辅助指针
	link_node* p_prev = head;
	link_node* p_current = p_prev->next;

	//查找值为val的节点
	while (p_current != NULL){
		if (p_current->data == val){
			break;
		}
		p_prev = p_current;
		p_current = p_prev->next;
	}
	//如果p_current为NULL，表示没有找到
	if (p_current == NULL){
		return;
	}
	
	//删除当前节点： 重新建立待删除节点(p_current)的前驱后继节点关系
	p_prev->next = p_current->next;
	//释放待删除节点的内存
	free(p_current);
}
```

#### 8.2.5 **销毁链表**

编写函数: `void destroy_linklist(link_node* head)`

销毁链表，释放所有节点的空间.

```c
//销毁链表
void destroy_linklist(link_node* head){
	if (head == NULL){
		return;
	}
	//赋值指针
	link_node* p_current = head;
	while (p_current != NULL){
		//缓存当前节点下一个节点
		link_node* p_next = p_current->next;
		free(p_current);
		p_current = p_next;
	}
}
```

## 九、函数指针

### 9.1 函数类型

通过什么来区分两个不同的函数？

一个函数在编译时被分配一个入口地址，这个地址就称为函数的指针，**函数名代表函数的入口地址**。

函数三要素： 名称、参数、返回值。C语言中的函数有自己特定的类型。

c 语言中通过 typedef 为函数类型重命名：

```c
typedef int f(int, int);	// f 为函数类型
typedef void p(int);		// p 为函数类型
```

这一点和数组一样，因此我们可以用一个指针变量来存放这个入口地址，然后通过该指针变量调用函数。

**注意：**通过函数类型定义的变量是不能够直接执行，因为没有函数体。只能通过类型定义一个函数指针指向某一个具体函数，才能调用。

```c
typedef int(p)(int, int);

void my_func(int a,int b){
	printf("%d %d\n",a,b);
}

void test(){
	p p1;
	//p1(10,20); //错误，不能直接调用，只描述了函数类型，但是并没有定义函数体，没有函数体无法调用
	p* p2 = my_func;
	p2(10,20); //正确，指向有函数体的函数入口地址
}
```

### 9.2 函数指针(指向函数的指针)

- 函数指针定义方式(先定义函数类型，根据类型定义指针变量);
- 先定义函数指针类型，根据类型定义指针变量;
- 直接定义函数指针变量;

```c
int my_func(int a,int b){
	printf("ret:%d\n", a + b);
	return 0;
}

//1. 先定义函数类型，通过类型定义指针
void test01(){
	typedef int(FUNC_TYPE)(int, int);
	FUNC_TYPE* f = my_func;
	//如何调用？
	(*f)(10, 20);
	f(10, 20);
}

//2. 定义函数指针类型
void test02(){
	typedef int(*FUNC_POINTER)(int, int);
	FUNC_POINTER f = my_func;
	//如何调用？
	(*f)(10, 20);
	f(10, 20);
}

//3. 直接定义函数指针变量
void test03(){
	int(*f)(int, int) = my_func;
	//如何调用？
	(*f)(10, 20);
	f(10, 20);
}
```

### 9.3 **函数指针数组**

函数指针数组，每个元素都是函数指针。

```c
void func01(int a){
	printf("func01:%d\n",a);
}
void func02(int a){
	printf("func02:%d\n", a);
}
void func03(int a){
	printf("func03:%d\n", a);
}

void test(){
#if 0
	//定义函数指针
	void(*func_array[])(int) = { func01, func02, func03 };
#else
	void(*func_array[3])(int);
	func_array[0] = func01;
	func_array[1] = func02;
	func_array[2] = func03;
#endif

	for (int i = 0; i < 3; i ++){
		func_array[i](10 + i);
		(*func_array[i])(10 + i);
	}
}
```

### 9.4 **函数指针做函数参数(回调函数)**

函数参数除了是普通变量，还可以是函数指针变量。

```c
//形参为普通变量
void fun( int x ){}
//形参为函数指针变量
void fun( int(*p)(int a) ){}
```

函数指针变量常见的用途之一是把指针作为参数传递到其他函数，指向函数的指针也可以作为参数，以实现函数地址的传递。

```c
//加法计算器
int plus(int a,int b){
	return a + b;
}

//减法计算器
int minus(int a,int b){
	return a - b;
}

//计算器
#if 0
int caculator(int a,int b,int(*func)(int,int)){
	return func(a, b);
}
#else
typedef int(*FUNC_POINTER)(int, int);
int caculator(int a, int b, FUNC_POINTER func){
	return func(a, b);
}
#endif
```

**注意：**函数指针和指针函数的区别：

- 函数指针是指向函数的指针；

- 指针函数是返回类型为指针的函数；

## 十、预处理

### 10.1 预处理的基本概念

C 语言对源程序处理的四个步骤：**预处理、编译、汇编、链接**。

预处理是在程序源代码被编译之前，由预处理器（Preprocessor）对程序源代码进行的处理。这个过程并不对程序的源代码语法进行解析，但它会把源代码分割或处理成为特定的符号为下一步的编译做准备工作。

### 10.2 文件包含指令(#include)

“文件包含处理”是指一个源文件可以将另外一个文件的全部内容包含进来。Ｃ语言提供了 #include 命令用来实现“文件包含”的操作。

**#incude<> 和 #include"" 区别**

- **""** 表示系统先在 file1.c 所在的当前目录找 file1.h，如果找不到，再按系统指定的目录检索。

- **< >** 表示系统直接按系统指定的目录检索。

注意：

​	1. #include <> 常用于包含库函数的头文件；

​	2. #include "" 常用于包含自定义的头文件；

​	3. 理论上 #include 可以包含任意格式的文件(.c .h等) ，但一般用于头文件的包含；

### 10.3 宏定义

#### 10.3.1 无参数的宏定义(宏常量)

如果在程序中大量使用到了100这个值，那么为了方便管理，我们可以将其定义为：

const int num = 100; 但是如果我们使用num定义一个数组，在不支持c99标准的编译器上是不支持的，因为num不是一个编译器常量，如果想得到了一个编译器常量，那么可以使用：

\#define num 100

在编译预处理时，将程序中在该语句以后出现的所有的num都用100代替。这种方法使用户能以一个简单的名字代替一个长的字符串，在预编译时将宏名替换成字符串的过程称为“宏展开”。**宏定义，只在宏定义的文件中起作用**。

```c
#define PI 3.1415
void test(){
	double r = 10.0;
	double s = PI * r * r;
	printf("s = %lf\n", s);
}
```

说明：

- 1)宏名一般用大写，以便于与变量区别；

- 2) 宏定义可以是常数、表达式等；

- 3) 宏定义不作语法检查，只有在编译被宏展开后的源程序才会报错；

- 4) 宏定义不是C语言，不在行末加分号；

- 5) **宏名有效范围为从定义到本源文件结束**；

- 6) **可以用#undef命令终止宏定义的作用域**；

- 7) 在宏定义中，可以引用已定义的宏名；

#### 10.3.2 带参数的宏定义(宏函数)

在项目中，经常把一些短小而又频繁使用的函数写成宏函数，这是由于宏函数没有普通函数参数压栈、跳转、返回等的开销，可以调高程序的效率。

宏通过使用参数，可以创建外形和作用都与函数类似地类函数宏(function-like macro). 宏的参数也用圆括号括起来。

```c
#define SUM(x,y) ((x)+(y))
void test(){
	//仅仅只是做文本替换 下例替换为 int ret = ((10)+(20));
	//不进行计算
	int ret = SUM(10, 20);
	printf("ret:%d\n",ret);
}
```

**注意:**

- 1) 宏的名字中不能有空格，但是在替换的字符串中可以有空格。ANSI C允许在参数列表中使用空格；

- 2) 用括号括住每一个参数，并括住宏的整体定义。

- 3) 用大写字母表示宏的函数名。

- 4) 如果打算宏代替函数来加快程序运行速度。假如在程序中只使用一次宏对程序的运行时间没有太大提高。

### 10.4 条件编译

一般情况下，源程序中所有的行都参加编译。但有时希望对部分源程序行只在满足一定条件时才编译，即对这部分源程序行指定编译条件。

<img src="/images/imageProgramC/条件编译.png">

**条件编译**

- 防止头文件被重复包含引用；

```c
#ifndef _SOMEFILE_H
#define _SOMEFILE_H

//需要声明的变量、函数
//宏定义
//结构体

#endif
```

### 10.5 **一些特殊的预定宏**

C 编译器，提供了几个特殊形式的预定义宏，在实际编程中可以直接使用，很方便。

```c
//	__FILE__			宏所在文件的源文件名 
//	__LINE__			宏所在行的行号
//	__DATE__			代码编译的日期
//	__TIME__			代码编译的时间

void test()
{
	printf("%s\n", __FILE__);
	printf("%d\n", __LINE__);
	printf("%s\n", __DATE__);
	printf("%s\n", __TIME__);
}
```

## 十一、动态库的封装和使用

### 11.1 库的基本概念

库是已经写好的、成熟的、可复用的代码。每个程序都需要依赖很多底层库，不可能每个人的代码从零开始编写代码，因此库的存在具有非常重要的意义。

在我们的开发的应用中经常有一些公共代码是需要反复使用的，就把这些代码编译为库文件。

库可以简单看成一组目标文件的集合，将这些目标文件经过压缩打包之后形成的一个文件。像在Windows这样的平台上，最常用的 c 语言库是由集成按开发环境所附带的运行库，这些库一般由编译厂商提供。

库：就是已经编写好的，后续可以直接使用的代码。

c++静态库：会合入到最终生成的程序，**使得结果文件比较大**。优点是不再有任何依赖。

c++动态库：动态库，**一个文件可以多个代码同时使用内存中只有一份，节省内存**，可以随主代码一起编译。缺点是需要头文件。

**网友说：库就是除了main函数之外的其他代码，都可以组成库**。

### 11.2 静态库优缺点

- **静态库对函数库的链接是放在编译时期完成的，静态库在程序的链接阶段被复制到了程序中，和程序运行的时候没有关系**；

- 程序在运行时与函数库再无瓜葛，移植方便。

- **浪费空间和资源，所有相关的目标文件与牵涉到的函数库被链接合成一个可执行文件**。

**内存和磁盘空间**

- 静态链接这种方法很简单，原理上也很容易理解，在操作系统和硬件不发达的早期，绝大部门系统采用这种方案。随着计算机软件的发展，这种方法的缺点很快暴露出来，那就是静态链接的方式对于计算机内存和磁盘空间浪费非常严重。特别是多进程操作系统下，静态链接极大的浪费了内存空间。在现在的linux系统中，一个普通程序会用到c语言静态库至少在1MB以上，那么如果磁盘中有2000个这样的程序，就要浪费将近2GB的磁盘空间。

**程序开发和发布**

- 空间浪费是静态链接的一个问题，另一个问题是静态链接对程序的更新、部署和发布也会带来很多麻烦。比如程序中所使用的mylib.lib是由一个第三方厂商提供的，当该厂商更新容量mylib.lib的时候，那么我们的程序就要拿到最新版的mylib.lib，然后将其重新编译链接后，将新的程序整个发布给用户。这样的做缺点很明显，即一旦程序中有任何模块更新，整个程序就要重新编译链接、发布给用户，用户要重新安装整个程序。

要解决空间浪费和更新困难这两个问题，最简单的办法就是把程序的模块相互分割开来，形成独立的文件，而不是将他们静态的链接在一起。简单地讲，就是不对哪些组成程序的目标程序进行链接，等程序运行的时候才进行链接。也就是说，**把整个链接过程推迟到了运行时再进行，这就是动态链接的基本思想**。

### 11.3 Linux 下 gcc 编译器生成和使用静态库和动态库

我们通常把一些公用函数制作成函数库，供其它程序使用。函数库分为静态库和动态库两种。

- 静态库**在程序编译时会被链接并拷贝到目标代码中，程序运行时将不再需要该静态库**。

- 动态库**在程序编译时并不会被拷贝到目标代码中，而是在程序运行时才被载入**，因此在程序运行时还需要动态库存在。本质上说库是一种可执行代码的二进制形式，可以被操作系统载入内存执行。

windows 和 linux 库的二进制是不兼容的（主要是编译器、汇编器和连接器的不同）。

#### 11.3.1 基本概念

**库的种类**：

linux下的库有两种：

- 静态库
- 共享库（动态库）。

二者区别在于代码被载入的时刻不同。静态库的代码在编译过程中已经被载入可执行程序，因此体积较大。共享库的代码是在可执行程序运行时才载入内存的，在编译过程中仅简单的引用，因此代码体积较小。

**库文件是如何产生的**：

静态库的后缀是 `.a`，它的产生分两步:

- Step 1. 由源文件编译生成一堆 `.o`，每个 `.o` 里都包含这个编译单元的符号表

- Step 2. ar 命令将很多 `.o` 转换成 `.a`，成为静态库

动态库的后缀是 `.so`，它由 gcc 加特定参数编译产生。

**库文件命名规范**：

库文件一般放在 `/usr/local/lib`，`/usr/lib`，`/lib`，或者其他自定义的 `lib` 下。

- 静态库的名字一般为 `libxxxx.a`，其中 `xxxx` 是该 `lib` 的名称

- 动态库的名字一般为 `libxxxx.so.major.minor`， `xxxx` 是该 `lib` 的名称，`major` 是主版本号， `minor` 是副版本号

**如何知道一个可执行程序依赖哪些库**：

`ldd` 命令可以查看一个可执行程序依赖的共享库，例如：

```shell
$ ldd /lib/i386-linux-gnu/libc.so.6
/lib/ld-linux.so.2 (0xf7740000)
linux-gate.so.1 =>  (0xf773f000)
```

可以看到 `libc` 命令依赖于 `linux-gate` 库和 `ld-linux` 库

**可执行程序在执行的时候如何定位共享库文件**：

当系统加载可执行代码时候，能够知道其所依赖的库的名字，但是还需要知道绝对路径。此时就需要系统动态载入器(`dynamic linker/loader`)

对于 `elf` 格式的可执行程序，是由 `ld-linux.so*` 来完成的，它先后搜索 `elf` 文件的 `DT_RPATH` 段—环境变量 `LD_LIBRARY_PATH—/etc/ld.so.cache` 文件列表— `/lib/,/usr/lib` 目录找到库文件后将其载入内存

如：`export LD_LIBRARY_PATH=’pwd’`

将当前文件目录添加为共享目录

**在新安装一个库之后如何让系统能够找到他**：

如果安装在 `/lib` 或者 `/usr/lib` 下，那么 `ld` 默认能够找到，无需其他操作。如果安装在其他目录，需要将其添加到 `/etc/ld.so.cache` 文件中，步骤如下：

1. 编辑 `/etc/ld.so.conf` 文件，加入库文件所在目录的路径

2. 运行 `ldconfig`，该命令会重建 `/etc/ld.so.cache` 文件

#### 11.3.2 用 gcc 生成静态和动态链接库的示例

假设有1个类 hello，和一个 main 函数。如下：

**hello.h**

```c
#ifndef HELLO_H 
#define HELLO_H 

void hello(const char *name); 

#endif
```

**hello.c**

```c
#include <stdio.h> 
void hello(const char *name) { 
    printf("Hello %s!\n", name);
}
```

**main.c**

```c
#include "hello.h" 
int main() 
{ 
    hello("world!"); 
    return 0; 
}
```

hello.c 是一个没有 main 函数的 `.c` 程序，因此不够成一个完整的程序，如果使用 `gcc –o` 编译并连接它，`gcc` 将报错，无法通过编译。

前面提过，无论静态库，还是动态库，都是由 `.o`文件创建的。那么我们如何才能让 main.c 调用 hello 类呢？也就是说该如何才能将 hello.c 通过 gcc 先编译成 `.o` 文件，并且让 main.c 在编译时能找到它？有三种途径可以实现：

- 1）通过编译多个源文件，直接将目标代码合成一个 `.o` 文件。

- 2）通过创建静态链接库 `libmyhello.a`，使得 main 函数调用 hello 函数时可调用静态链接库。

- 3）通过创建动态链接库 `libmyhello.so`，使得 main 函数调用 hello 函数时可调用动态链接库。

##### 11.3.2.1 途径一：编译多个源文件

执行命令：

```shell
$ gcc -c hello.c
$ gcc -c main.c
```

这里提醒一下：`gcc –o` 是将 `.c` 源文件编译成为一个可执行的二进制代码。而 `gcc –c` 是使用GNU汇编器将源文件转化为目标代码。更多 gcc 编译选项的常识点[这里](https://blog.csdn.net/arackethis/article/details/43370307)。

这时可以看到生成了 hello.o 和 main.o 文件。

```shell
$ ls
hello.c  hello.h  hello.o  main.c  main.o

# 将两个文件链接成一个 `.o` 文件：
$ gcc -o sayhello main.o hello.o

# 查看此时已经生成了可执行文件sayhello
$ ls
hello.c  hello.h  hello.o  main.c  main.o  sayhello

# 运行
$ ./sayhello
Hello world!!
```

##### 11.3.2.2 途径二：静态链接库


静态库文件名是以 lib 为前缀，紧接着是静态库名，扩展名为 `.a`。例如：我们将创建的静态库名为myhello，则静态库文件名就是 `libmyhello.a` 。创建静态库用 `ar` 命令。

删除途径一中生成的3个文件，回到原始的三个文件：

```shell
$ rm hello.o main.o sayhello
$ ls
hello.c  hello.h  main.c

# 开始尝试途径二，创建静态库文件libmyhello.a：
$ gcc -c hello.c
$ ar rcs libmyhello.a hello.o

# 查看一下已经生成了：
$ ls
hello.c  hello.h  hello.o  libmyhello.a  main.c
```

静态库制作完了，如何使用它内部的函数呢？

**只需要在使用到这些公用函数的源程序中包含这些公用函数的原型声明，然后在用 gcc 命令生成目标文件时指明静态库名，gcc 将会从静态库中将公用函数连接到目标文件中**。

**注意**，gcc 会在静态库名前加上前缀 lib，然后追加扩展名 `.a` 得到的静态库文件名来查找静态库文件。

因此，我们在写需要连接的库时，只写静态库名就可以，如 `libmyhello.a` 的库，只写: `-lmyhello`
在 main.c 中，我们已包含了该静态库的头文件 hello.h。现在在主程序 main.c 中直接调用它内部的函数：

```shell
# 这里-L.告诉 gcc 先在当前目录下查找库文件。
$ gcc -o sayhello main.c -static -L. -lmyhello       

# 查看一下，已经生成可执行文件sayhello
$ ls
hello.c  hello.h  hello.o  libmyhello.a  main.c  sayhello

$ ./sayhello
Hello world!!
```

前面提过静态库在编译过程中会被拷贝到目标程序中，运行时不再需要静态库的存在。这里可以简单验证一下：我们删除静态库文件，然后再试着调用函数 hello 看是否还能调用成功。

```shell
$ rm libmyhello.a

$ ./sayhello
Hello world!!
```

程序照常运行，静态库中的函数已经被复制到目标程序中了，编译完成后，静态库就没用了，执行时不再需要静态库的存在。

**静态链接库的一个缺点是**：

- 如果我们同时运行了许多程序，并且它们使用了同一个库函数，这样，在内存中会大量拷贝同一库函数。这样，就会浪费内存和存储空间。

使用了共享链接库的Linux就可以避免这个问题。共享函数库和静态函数在同一个地方，只是后缀不同。比如，在Linux系统，标准的共享数序函数库是 `/usr/lib/libm.so`。**当一个程序使用共享函数库时，在连接阶段并不把函数代码连接进来，而只是链接函数的一个引用。当最终的函数导入内存开始真正执行时，函数引用被解析，共享函数库的代码才真正导入到内存中**。这样，共享链接库的函数就可以被许多程序同时共享，并且只需存储一次就可以了。**共享函数库的另一个优点是，它可以独立更新，与调用它的函数毫不影响**。

##### 11.3.2.3 途径三：动态链接库（共享函数库）


动态库文件名和静态库类似，也是在动态库名增加前缀 lib，但其文件扩展名为 `.so`。例如：我们将创建的动态库名为 myhello，则动态库文件名就是 `libmyhello.so` 。用 gcc 来创建动态库。

删除途径二中生成的2个文件，回到原始的三个文件：

```shell
$ rm hello.o sayhello
$ ls
hello.c  hello.h  main.c

# 开始尝试途径三，创建静态库文件libmyhello.so：
# 按教程里，会报错：
$ gcc -c hello.c
$ ls
hello.c  hello.h  hello.o  main.c

$ gcc -shared -fPIC -o libmyhello.so hello.o
/usr/bin/ld: hello.o: relocation R_X86_64_32 against `.rodata' can not be used when making a shared object; recompile with -fPIC
hello.o: could not read symbols: Bad value
collect2: ld returned 1 exit status
```

正确方法是，这样就可以了：

```shell
$ gcc -fPIC -shared -o libmyhello.so hello.c

# 已生成libmyhello.so，是绿色。
$ ls
hello.c  hello.h  libmyhello.so  main.c
```

最主要的是 GCC 命令行的选项:

- `-shared`：指定生成动态连接库（让连接器生成T类型的导出符号表，有时候也生成弱连接W类型的导出符号），不用该标志外部程序无法连接。相当于一个可执行文件

- `-fPIC`：表示编译为位置独立的代码，不用此选项的话编译后的代码是位置相关的所以动态载入时是通过代码拷贝的方式来满足不同进程的需要，而不能达到真正代码段共享的目的。

下面调用该动态链接库：

```shell
$ gcc -o sayhello main.c -L. -lmyhello
$ ls
hello.c  hello.h  libmyhello.so  main.c  sayhello

$ ./sayhello
Hello world!!
成功！
```

按教程里说的：他以这种方式调用动态链接库出错，找不到动态库文件 `libmyhello.so`：

```shell
./sayhello: error while loading shared libraries: libmyhello.so: cannot open shared object file: No such file or directory
```


程序在运行时，会在 /usr/lib 和 /lib 等目录中查找需要的动态库文件。若找到，则载入动态库，否则将提示类似上述错误而终止程序运行。解决此类问题有如下三种方法：

- （1）我们将文件 libmyhello.so复制到目录/usr/lib中。

- （2）既然连接器会搜寻LD_LIBRARY_PATH所指定的目录，那么我们只要将当前目录添加到环境变量：

  `export LD_LIBRARY_PATH=$(pwd)`

- （3）执行： `ldconfig /usr/zhsoft/lib `

说明：当用户在某个目录下面创建或拷贝了一个动态链接库，若想使其被系统共享，可以执行一下 "ldconfig 目录名" 这个命令。此命令的功能在于让 ldconfig 将指定目录下的动态链接库被系统共享起来，意即：在缓存文件 `/etc/ld.so.cache` 中追加进指定目录下的共享库。该命令会重建 `/etc/ld.so.cache` 文件。

参考教程：

http://blog.csdn.net/jiayouxjh/article/details/7602729

http://blog.sina.com.cn/s/blog_54f82cc20101153x.html

http://navyaijm.blog.51cto.com/4647068/809424

## 十二、递归函数

### 12.1 **递归函数基本概念**

C通过运行时堆栈来支持递归函数的实现。递归函数就是直接或间接调用自身的函数。

### 12.2 普通函数调用

```c
void funB(int b){
	printf("b = %d\n", b);
}

void funA(int a){
	funB(a - 1);
	printf("a = %d\n", a);
}

int main(void){
	funA(2);
    printf("main\n");
	return 0;
}
```

函数的调用流程如下：

<img src="/images/imageProgramC/递归函数.png">

### 12.3 递归函数调用

```c
void fun(int a){
	if (a == 1){
		printf("a = %d\n", a);
		return; //中断函数很重要
	}
	fun(a - 1);
	printf("a = %d\n", a);
}

int main(void){
	fun(2);
	printf("main\n");
	return 0;
}
```

函数的调用流程如下：

<img src="/images/imageProgramC/递归函数-01.png">

**递归实现给出一个数8793，依次打印千位数字8、百位数字7、十位数字9、个位数字3。**

```c
void recursion(int val){
	if (val == 0){
		return;
	}
	int ret = val / 10;
	recursion(ret);
	printf("%d ",val % 10);
}
```

### 12.4 递归实现字符串反转

```c
int reverse1(char *str){
	if (str == NULL){
		return -1;
	}
	if (*str == '\0') {  // 函数递归调用结束条件
		return 0;
	}
	
	reverse1(str + 1);
	printf("%c", *str);
	return 0;
}

char buf[1024] = { 0 };  //全局变量

int reverse2(char *str){
	if (str == NULL) {
		return -1;
	}

	if ( *str == '\0' ) {	// 函数递归调用结束条件
		return 0;
	}

	reverse2(str + 1);
	strncat(buf, str, 1);
	return 0;
}

int reverse3(char *str, char *dst){
	if (str == NULL || dst == NULL) {
		return -1;
	}

	if (*str == '\0') {		// 函数递归调用结束条件
		return 0;
	}

	reverse3(str + 1);
	strncat(dst, str, 1);
	return 0;
}
```

### 12.5 递归实现链表逆序打印

TODO

## 十三、面向接口编程

### 13.1 案例背景

一般的企业信息系统都有成熟的框架。软件框架一般不发生变化，能自由的集成第三方厂商的产品。

### 13.2 案例需求

要求在企业信息系统框架中集成第三方厂商的socket通信产品和第三方厂商加密产品。软件设计要求：模块要求松、接口要求紧。

### 13.3 案例要求

- 1）能支持多个厂商的 socket 通信产品入围

- 2）能支持多个第三方厂商加密产品的入围

- 3）企业信息系统框架不轻易发生框架

### 13.4 编程提示

- 1）抽象通信接口结构体设计（CSocketProtocol）

- 2）框架接口设计（framework）

- 3）   a) 通信厂商1入围（CSckImp1）  b) 通信厂商2入围（CSckImp2）

- 4）   a) 抽象加密接口结构体设计（CEncDesProtocol） b) 升级框架函数（增加加解密功能）  c) 加密厂商1入围(CHwImp)、加密厂商2入围(CCiscoImp)

- 5）框架接口分文件

























