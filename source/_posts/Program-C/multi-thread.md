---
title: 多线程编程
tags: c/c++
reward: true
categories: c/c++
toc: true
abbrlink: 39639
date: 2016-07-11 10:14:50
---

> [怎么样才算得上熟悉多线程编程？](<https://www.zhihu.com/question/22375509>)
>
> [C++多线程模型与锁](<https://my.oschina.net/u/1864567/blog/340471>)













1. 了解进程线程的基本概念，能用一种语言在一个平台上实现一个多线程的例子。（这些不会还写熟悉多线程就太大无畏了）
2. 了解为什么要用Mutex之类的工具做锁来同步和保护资源。弄懂诸如racing condition，死锁之类的概念。50%公司的见面题，用来砍死大无畏。
3. 了解编译器优化带来的影响，了解cache的影响，了解volatile，memory barrier之类的概念。如果是主Java的话，去了解一下JVM的内存模型。以上这些偏硬偏系统端的公司喜欢问，不过由于太基础，稍稍好奇一点的多线程领域程序员都应该会了解，否则略显大无畏。
4. 了解一下你主攻平台＋语言所提供的工具库，知道常用的工具的用法和使用场景：Mutex，Semaphore，原子操作集，Condition Variable，spin lock。这几个算是比较常用的，在各个平台＋语言也都有对应实现。老实说，spinlock，condition variable是我工作里从没用过的，但是也被问过，其他几个都太常用了，如果是java的话再多看一组Executor相关的，以及Java多线程相关的keywords，和object本身提供的同步函数，wait notify之类的，在主Java的公司问过。
5. 了解常用的多线程设计范式，比如读写锁（Reader/Writer Lock，非常经典的范式，有偏向读和写的不同变形，至少被要求写过3次），生产消费范式（写过2次），一些常用容器的实现，比如BlockingQueue（写过3次）或者concurrentHashmap（写过2次）。如果是主Java的话可以看看JDK的实现。熟悉一下一些算不上多线程设计模式的小技巧，比如传递只读对象可以避免加锁，或者Copy传递以防外部修改之类的（讨论环节被问过）。另外值得特别一提的一个小细节是，Singleton的线程安全是个很有意思而且容易出错的话题，值得一看（只被问过一次，不过我答挂了，所以印象及其深）。还有可能会问的是一些有趣的小场景让你实现一些功能需要线程安全，无法特别准备，但是你能了解上面说的这些范式，不傻的话大多数都能想出来。
如果和我一样多线程方面是主Java的话，记得Doug Lea的书写的很明白，不过不记得当时读完的是哪本，70%可能是下面这个
http://www.amazon.com/Java-Concurrency-Practice-Brian-Goetz/dp/0321349601
否则就是
Concurrent Programming in Java: Design Principles and Pattern (2nd Edition): Doug Lea: 0785342310092: Amazon.com: Books

这个大致是一些公司对多线程部分的要求，如果应聘者声称熟悉这个部分。上面所有点都是本人面试被问到的，基本上能看完上面这些，可以做到不用很心虚在简历上写自己熟悉多线程而不会被揭穿。