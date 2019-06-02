---
title: Java 学习笔记
hide: false
categories:
  - notes
toc: true
tags:
  - java
abbrlink: 1359
date: 2018-11-04 22:14:24
---

1. static 关键字的用法

   * 声明 静态属性 和 静态方法;

   * 定义 静态内部类;

   * 导入某个类中的静态方法或属性:

     ```java
     // 导入 java.lang.System 下的 out 方法
     import static java.lang.System.out;
     // codes
     // 直接调用 out 方法
       out.println("balabala");
     ```

2. instance of 关键字

   用于判断一个对象是不是一个类的实例, 语法: ` 对象 instance of 类`.

   如果实例 a 是类 A 的一个实例, 那么它也是类 A 的父类的一个实例.

3. 抽象类和接口

   * 抽象类不一定有抽象方法, 但有抽象方法的类一定是抽象类;
   * 接口没有构造器 (因为接口不是类), 抽象类有构造器;
   * 接口可以继承接口, 类可以实现接口;
   * 接口可以**多继承**;

4. 多态

   * `Parent parent = new Son()`,  子类对象虽然可以赋给父类实例, 但是这时候编译器是按照 `=` 左边的类型来加载的, 所以通过实例 parent 不能调用类 Parent 中不存在的方法/属性;

5. 字符串

   关于字符串的比较:

   ```java
   String s1 = "AA", s2 = "AA", s3 = new String("AA");
   System.out.println(s1 == s2);    // true
   System.out.println(s1 == s3);    // false
   ```

   在 java 中, 对于**引用类型**变量, `==` 比较的是变量指向的内存地址.

   `s1 == s2` 为 `true` 是因为它们指向了同一个内存地址, `s1 != s3` 是因为它们指向的不是同一个内存地址. 这里牵涉到 java 内存结构和字符串常量池. 

6. try - catch -finally 语句块

   在 `try - catch -finally` 语句块中, `finally` 语句块中的 `return` 语句会覆盖掉 `try - catch` 语句块中的 `return` 语句.

### Java 集合框架简析

- {Collection}

  - {Set} --- 无序, 不可重复的集合

    - **[HashSet]** --- 先跟据对象的 hashcode() 方法判断元素是否重复, 如果 hashcode() 相同, 再根据 equals() 方法判断;

    - [LinkedSet] --- 内部使用链表实现, 方便添加和删除, 但是维护链表需要消耗一部分开支;

    - [TreeSet]

      1. TreeSet 强制集合元素必须属于同一类型

      1. TreeSet 集合元素所属的类必须实现 Comparable 接口, TreeSet 判断集合元素是否相同的依据是元素对象的 compareTo() 方法

      1. TreeSet 是有序的, 默认自然排序, 通过自然排序的元素必须实现 Comparable 接口的 compareTo() 方法; 也可以传入一个实现 Comparator 接口的对象来实现定制排序

  - {List} --- 有序, 可重复的集合

    - **[ArrayList]** --- ArrayList 底层是通过数组来实现的
    - [LinkedList] --- LinkedList 底层是通过链表来实现的, 方便频繁增删元素
    - [Vector] --- Vector 线程安全, 但是执行效率慢
- {Map} --- "键 - 值" 对

  - **[HashMap]** ---- key 的本质是 Set, value 的本质是 Collection, "key - value" 整体也可以当做是 Set
    - [LinkedHashMap] --- 同上, 内部使用 LinkedSet 实现
  - [TreeMap] --- 内部使用 TreeSet 实现
  - [Hashtable] --- 线程安全, 键和值都不允许为 "null"
    - [Properties] --- 键值对都为 String 类型, 常用于处理属性文件
- [Collections] --- 工具类, 用来对 Collection 进行操作
- <Iterator> --- 用于遍历 Collection 集合元素

### 泛型

#### 核心思想

泛型的核心思想是把一个集合中的数据内容限制为一种特定的数据类型

#### 作用

1. 解决元素存储的安全性问题
2. 解决获取数据元素时需要强制类型转换的问题

举一个例子: 引入泛型之前, List 中可以添加任意 object 类型的对象, 类型不安全; 取出 List 中的元素时也需要做强制类型转换, 有可能报 类型转换异常, 程序不够健壮. 泛型的出现, 限制了集合元素的数据类型, 解决了上述问题. 

#### 泛型类与泛型方法

格式:

```java
public class Exaple<T> {
    public T method1(T t) {
        return t;
    }
    public void method2(T t) {
        // TODO
    }
    public <E> E method3(E e) {
        return e;
    }
}
```

#### 泛型与继承的关系

尽管 Son 是 Parent 的子类, List<Son> 也不是 List<Parent> 的子接口, 他们是并列关系.

#### 通配符 " ? "

* List<?> 是所有 List<AnyClass> 共同的父接口.

* `? extends E` 代表类型 E 及其所有子类

* `? super E` 代表类型 E 及其所有父类

#### 注意事项

* 继承泛型类 / 接口的时候可以指明泛型类型, 也可以不指明
* 静态方法中不能使用类的泛型. 因为泛型类型的确定是在创建实例的时候, 而静态方法随类的加载而加载, 静态方法的加载时间早于实例的创建, 静态方法加载时泛型类型尚不确定, 所以在静态方法中不能使用泛型
* 不能在 catch 语句中捕获泛型

### 枚举类

枚举类是单例模式的延伸, 把单例模式中的 "一个实例" 扩展为 "多个实例" 即为枚举类.

* 枚举类需要私有化构造器
* 枚举类属性需要限制为 `private final` 类型, 可以在构造器中初始化
* 枚举类的对象需要声明为 `public static final` 类型

也可以使用 `enum` 关键字声明枚举类, 语法层面相对于自定义实现枚举类更加简洁.

枚举类实现接口时, 可以针对每个枚举类对象分别实现接口的抽象方法, 这样一来每个对象的方法实现可以不同.

### 注解

#### JDK 内置的基本注解类型

1. @Override: 限定 (显示表明) 重写父类方法, 该注解只能用于方法;
2. @Deprecated: 用于表示某个程序元素 (类 / 方法等) 已过时;
3. @SuppressWarnings: 抑制编译器警告;

#### 自定义注解

使用 `@interface` 关键字自定义注解

#### 元注解

用于对注解进行注解的注解叫元注解.

1. @Retention: 用于指定一个注解的生命周期, 包括 source, class, runtime 等;
2. @Target: 用于指定某个注解可以用于注解哪些结构;
3. @Documented: 被 `@Documented` 注解的注解将被 javadoc 工具写入文档 (被 `@Documented` 注解的注解的生命周期必须为 `RUNTIME`);
4. @Inherited: 被 `@Inherited` 注解的注解具有继承性, 如果一个类使用了被 `@Inherited` 注解的注解, 那么这个类的子类自动拥有该注解.

### 多线程

#### 多线程的实现方法:

1. 继承 Thread 类并实现其 run() 方法, 通过 Thread 类的 start() 方法启动多线程;

2. 实现 Runnable 接口并完善 run() 方法, 通过 Thread 类的 start() 方法启动多线程;

   Runnable 类型实例可作为参数传递给 Thread 类的构造方法.

#### 线程不安全

线程不安全可通过 **同步代码块** 和 **同步方法** 两种方式解决. 其中: 同步代码块需要传入一个对象实例作为锁.

线程通信

* wait()
* notify()
* notifyAll()

### Java 常用类

#### 字符串

* String 字符串常亮, 不可变; StringBuffer, StringBuilder 字符串变量;
* StringBuffer 线程安全; StringBuilder 线程不安全;
* 速度: StringBuilder > StringBuffer > String;

日期 / 时间

* System.surrentTimeMillis() - 获取当前时间戳
* java.util.Date - 日期类
* DateFormate类 - 日期格式化
* Calender类 - 日历

#### 数学

Math - 常用数学函数

BigInteger - 任意精度整数

BigDecimal - 任意精度定点数

### 反射

获取 Class 类实例的四种方式

1. 通过调用类本身的 `.class` 属性获取:

   ```java
   Class cl = Object.class;
   ```

2. 通过运行时类对象的 `getClass()` 方法获取:

   ```java
   Object o = new Object();
   Class cl = o.getClass();
   ```

3. 通过 Class 类的静态方法 `forName(String className)` 获取:

   ```java
   String className = "java.lang.String";
   Class cl = Class.forName(className);
   ```

4. 通过类加载器获取:

   ```java
   String className = "java.lang.String";
   ClassLoader classLoader = this.getClass().getClassLoader();
   Class cl = classLoader.loadClass(className);
   ```

   *注: 引导类加载器是不可获取的.*

#### Class 对象的应用:

1. 通过 Class 对象创建对象

   * newInstance()    ----    创建运行时类的对象 (运行时类必须有可见的无参构造器);

2. 获取运行时类的属性

   * getField(String s)    ----    获取运行时类及其父类的 public 属性;
   * getFields()    ----    获取运行时类及其父类的 public 属性列表;
   * getDeclaredFields()    ----    方法获取运行时类本身声明的所有属性列表;
   * 获取 `Field` 类型的属性信息: 
     * getmodifiers()    ----    获取属性的权限(int 型)
     * Modify.toString(int i)    ----    获取属性的权限修饰符
     * getType()    ----    获取属性的类型

3. 获取运行时类的方法

   * getMethods()    ----    获取运行时类及其父类中所有的 public 方法;
   * getDeclaredMethods()    ----    获取运行时类自身声明的所有方法;
     * 通过 Method 类获取方法的信息
       * getAnnotations()    ----    获取方法的注解列表
       * getModifiers()    ----    获取方法的权限修饰符
       * getReturnType()    ----    获取方法的返回值类型
       * getParameterTypes()    ----    获取方法的形参类型列表
       * getExceptionTypes()    ----    获取方法的异常类型列表

4. 获取运行时类的构造器

   * getConstructors()    ---    获取运行时类及其父类 public 的构造器列表;

   * getDeclaredConstructors()    ----    获取运行时类自身声明的所有构造器列表;

5. 获取运行时类的父类

   * getSuperClass()    ----    获取运行时类的父类
   * getGenericSuperClass()    ----    获取带泛型的父类
   * ParameterizedType.getActualTypeArguments()    ----    获取父类的泛型列表

6. 获取运行时类实现的接口

   * getInterfaces()    ----    获取运行时类实现的接口列表;

7. 获取运行时类所在的包

   * getPackage()    ----    获取运行时类所在的包

8. 获取运行时类的注解信息

   * getAnnotations()    ----    获取运行时类生命周期为 `RUNTIME` 的注解列表