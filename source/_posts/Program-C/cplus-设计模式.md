---
title: CPlusPlus 设计模式
tags: c/c++
reward: true
categories: c/c++
toc: true
abbrlink: 58357
date: 2016-06-28 10:14:50
---

## 单例模式

> 单例模式(Singleton Pattern，也称为单件模式)，使用最广泛的设计模式之一。其意图是保证一个类仅有一个实例，并提供一个访问它的全局访问点，该实例被所有程序模块共享。
>
> 定义一个单例类：
>
> 1. 私有化它的构造函数，以防止外界创建单例类的对象；
> 2. 使用类的私有静态指针变量指向类的唯一实例；
> 3. 使用一个公有的静态方法获取该实例。

### 懒汉模式

> 即第一次调用该类实例的时候才产生一个新的该类实例，并在以后仅返回此实例。
>
> 需要用锁，来保证其线程安全性：原因：多个线程可能进入判断是否已经存在实例的 if 语句，从而non thread safety.
>
> 使用double-check来保证thread safety.但是如果处理大量数据时，该锁才成为严重的性能瓶颈。

<details><summary>1. 静态成员实例的懒汉模式：</summary>

```c++
class Singleton
{
public:
    static Singleton* getInstance();
private:
    static Singleton* m_instance;
    Singleton(){}
};

Singleton* Singleton::getInstance()
{
    if(NULL == m_instance)
    {
        Lock();//借用其它类来实现，如boost
        if(NULL == m_instance)
        {
            m_instance = new Singleton;
        }
        UnLock();
    }
    return m_instance;
}
```

</details>

<details><summary>2. 内部静态实例的懒汉模式：</summary>

```c++
class SingletonInside
{
public:
    static SingletonInside* getInstance()
    {
        Lock(); // not needed after C++0x
        static SingletonInside instance;
        UnLock(); // not needed after C++0x
        return instance; 
    }
private:
    SingletonInside(){}
};
```

</details>

###  饿汉模式

> 即无论是否调用该类的实例，在程序开始时就会产生一个该类的实例，并在以后仅返回此实例。
>
> 由静态初始化实例保证其线程安全性，WHY？因为静态实例初始化在程序开始时**进入主函数之前就由主线程以单线程方式完成了初始化**，不必担心多线程问题。
>
> 故在性能需求较高时，应使用这种模式，避免频繁的锁争夺。

<details><summary>饿汉模式：</summary>

```c++
class SingletonStatic
{
public:
    static const SingletonStatic* getInstance()
    {
        return m_instance;
    }
private:
    static const SingletonStatic* m_instance;
    SingletonStatic(){}
};

//外部初始化 before invoke main
const SingletonStatic* SingletonStatic::m_instance = new SingletonStatic;
```

</details>

**m_pInstance 指向的空间什么时候释放呢？更严重的问题是，该实例的析构函数什么时候执行？**

<details><summary>单例模式 - 线程安全</summary>

```c++
#include <iostream>>
using namespace std;
 
class Singleton 
{
public:
    static Singleton *GetInstance();
 
private: 
    Singleton() 
    { 
        cout << "Singleton ctor" << endl;
    }
    ~Singleton() 
    { 
        cout << "Singleton dtor" << endl; 
    } 
    static Singleton *m_pInstance;
    
    class Garbo
    { 
    public: 
        ~Garbo()
        {
            if (Singleton::m_pInstance)
            {
                cout << "Garbo dtor" << endl;
                delete Singleton::m_pInstance;
            }
        }
    };
    static Garbo garbo; 
};
 
Singleton::Garbo Singleton::garbo;  // 一定要初始化，不然程序结束时不会析构garbo
Singleton *Singleton::m_pInstance = NULL;
Singleton *Singleton::GetInstance()
{ 
    if (m_pInstance == NULL) 
        m_pInstance = new Singleton;
    return m_pInstance; 
}
 
int main()
{
    Singleton *p1 = Singleton::GetInstance();
    Singleton *p2 = Singleton::GetInstance();
 
    if (p1 == p2) 
        cout << "p1 == p2" << endl;
 
    return 0;
}
```

```shell
# 输出结果如下：
Singleton ctor
p1 == p2
Garbo dtor
Singleton dtor
```

</details>

类 CGarbo 被定义为 CSingleton 的私有内嵌类，以防该类被在其他地方滥用。

程序运行结束时，系统会调用 CSingleton的 静态成员 Garbo 的析构函数，该析构函数会删除单例的唯一实例。

使用这种方法释放单例对象有以下特征：

- 在单例类内部定义专有的嵌套类；

- 在单例类内定义私有的专门用于释放的静态成员；

- 利用程序在结束时析构全局变量的特性，选择最终的释放时机；

- 使用单例的代码不需要任何操作，不必关心对象的释放。

## 工厂模式

> [在C++中利用反射和简单工厂模式实现业务模块解耦](<http://blog.fatedier.com/2015/03/04/decoupling-by-using-reflect-and-simple-factory-pattern-in-cpp/>)

用一个单独的类来做创造实例的过程，就是工厂。

### 简单工厂模式

<details><summary>简单工厂模式基本代码：</summary>

```c++
#include <iostream>
using namespace std;

class AbstractProduct {
public:
    virtual ~AbstractProduct() {} 
    virtual void Operation() = 0;
};

class ProductA : public AbstractProduct {
public:
    void Operation() { cout << "ProductA" << endl; }
};

class ProductB : public AbstractProduct {
public:
    void Operation() { cout << "ProductB" << endl; }
};

class Factory {
public:
    AbstractProduct* createProduct(char product) {
        AbstractProduct* ap = NULL;
        switch(product) {
            case 'A': ap = new ProductA(); break;
            case 'B': ap = new ProductB(); break;
        }
        return ap;
    }
};

int main() {
    Factory* f = new Factory();
    AbstractProduct* apa = f->createProduct('A');
    apa->Operation();  // ProductA

    AbstractProduct* apb = f->createProduct('B');
    apb->Operation();  // ProductB

    delete apa;
    delete apb;
    delete f;

    return 0;
}
```

</details>

![简单运算工厂](/images/imageProgramC/简单运算工厂.png)

```c++
class OperationFactory {
public:
    Operation createOperate(string operate) {
        Operation oper = null;
        switch (operate) {
        case "+": oper = new OperationAdd(); break;
        case "-": oper = new OperationSub(); break;
        case "*": oper = new OperationMul(); break;
        case "/": oper = new OperationDiv(); break;
        }
        return oper;
    }
};
```

> 面向对象的编程，并不是类越多越好，类的划分是为了封装，但分类的基础是抽象，具有相同属性和功能的对象的抽象集合才是类。

### 工厂方法模式

工厂方法模式定义了一个用于创建对象的接口，让子类决定实例化哪一个类。工厂方法使一个类的实例化延迟到子类。

![工厂方法模式结构图](/images/imageProgramC/工厂方法模式结构图.png)

<details><summary>工厂方法模式基本代码：</summary>

```c++
#include <iostream>
using namespace std;

class Product {
public:
    virtual ~Product(){}
    virtual void Operation() = 0;
};

class ConcreteProductA : public Product {
public:
    void Operation() { cout << "ConcreteProductA" << endl; }
};

class ConcreteProductB : public Product {
public:
    void Operation() { cout << "ConcreteProductB" << endl; }
};

class Creator{
public:
    virtual Product* FactoryMethod() = 0;
    virtual ~Creator(){}
};

class ConcreteCreatorA : public Creator {
public:
    Product* FactoryMethod() { return new ConcreteProductA(); }
};

class ConcreteCreatorB : public Creator {
public:
    Product* FactoryMethod() { return new ConcreteProductB(); }
};

int main() {
    Creator* ca = new ConcreteCreatorA();
    Product* pa = ca->FactoryMethod();
    pa->Operation(); // ConcreteProductA

    Creator* cb = new ConcreteCreatorB();
    Product* pb = cb->FactoryMethod();
    pb->Operation(); // ConcreteProductB

    delete ca;
    delete pa;
    delete cb;
    delete pb;

    return 0;
}
```

</details>

把简单工厂模式中的工厂类抽象出一个接口，这个接口只有一个方法，就是创建抽象产品的工厂方法。然后所有的要生产具体类的工厂，就去实现这个接口，这样，一个简单工厂模式的工厂类，就变成了一个工厂抽象接口和多个具体生成对象的工厂。

![工厂方法模式结构图](/images/imageProgramC/工厂方法模式结构图-01.png)

这样整个工厂和产品体系就没有修改，而只是扩展，符合开放 - 封闭原则。

### 抽象工厂模式

抽象工厂模式是提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。

![抽象工厂模式结构图](/images/imageProgramC/抽象工厂模式结构图.png)

<details><summary>抽象工厂模式基本代码：</summary>

```c++
#include <iostream>
using namespace std;

class AbstractProductA {
public:
    virtual ~AbstractProductA(){}
    virtual void Operation() = 0;
};

class ProductA1 : public AbstractProductA {
public:
    void Operation() {
        cout << "ProductA1" << endl;
    }
};

class ProductA2 : public AbstractProductA {
public:
    void Operation() {
        cout << "ProductA2" << endl;
    }
};

class AbstractProductB {
public:
    virtual ~AbstractProductB(){}
    virtual void Operation() = 0;
};

class ProductB1 : public AbstractProductB {
public:
    void Operation() {
        cout << "ProductB1" << endl;
    }
};

class ProductB2 : public AbstractProductB {
public:
    void Operation() {
        cout << "ProductB2" << endl;
    }
};


class AbstractFactory {
public:
    virtual AbstractProductA* CreateProductA() = 0;
    virtual AbstractProductB* CreateProductB() = 0;
    virtual ~AbstractFactory(){}
};

class ConcreteFactory1 : public AbstractFactory {
public:
    ProductA1* CreateProductA() {
        return new ProductA1();
    }
    ProductB1* CreateProductB() {
        return new ProductB1();
    }
};

class ConcreteFactory2 : public AbstractFactory {
public:
    ProductA2* CreateProductA() {
        return new ProductA2();
    }
    ProductB2* CreateProductB() {
        return new ProductB2();
    }
};

int main() {
    AbstractFactory* af1 = new ConcreteFactory1();
    // 具体工厂创建对应的具体产品
    AbstractProductA* apa1 = af1->CreateProductA();  // 工厂1创建产品A
    apa1->Operation();  // ProductA1

    AbstractProductB* apb1 = af1->CreateProductB();  // 工厂1创建产品B
    apb1->Operation();  // ProductB1

    AbstractFactory* af2 = new ConcreteFactory2();
    AbstractProductA* apa2 = af2->CreateProductA();  // 工厂2创建产品A
    apa2->Operation();  // ProductA2

    AbstractProductB* apb2 = af2->CreateProductB();  // 工厂2创建产品B
    apb2->Operation();  // ProductB2

    delete apa1;
    delete apa2;
    delete af1;
    delete apb1;
    delete apb2;
    delete af2;
    return 0;
}
```

</details>

**抽象工厂函数的优缺点**

优点：

- 易于交换产品系列，由于具体工厂类在一个应用中只需要在初始化的时候出现一次，这样就使得改变一个应用的具体工厂变得非常容易，只需要改变具体工厂即可使用不同的产品配置。
- 让具体的创建实例过程与客户端分离，客户端是通过它们的抽象接口操纵实例，产品的具体类名也被具体工厂实现分离，不会出现在客户代码中。

缺点：增加新的产品时需要改动多处代码。

