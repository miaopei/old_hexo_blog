---
title: WebRTC 流媒体服务器
tags: [WebRTC]
categories: [WebRTC]
reward: true
#password: Miaow
#abstract: Welcome to my blog, enter password to read.
#message: Welcome to my blog, enter password to read.
date: 2019-10-09 11:39:14
---

# WebRTC 流媒体服务器

百万级高并发WebRTC流媒体服务器设计与开发

<!-- more -->

## 导学

![webrtc介绍](/images/imageWebRTC/mediaserver/webrtc介绍.png)

![webrtc流媒体服务器设计](/images/imageWebRTC/mediaserver/webrtc流媒体服务器设计.png)

![流媒体服务器特点](/images/imageWebRTC/mediaserver/流媒体服务器特点.png)

![学习流媒体服务器的难点](/images/imageWebRTC/mediaserver/学习流媒体服务器的难点.png)

![整个流媒体服务器的构成](/images/imageWebRTC/mediaserver/整个流媒体服务器的构成)

![学习内容](/images/imageWebRTC/mediaserver/学习内容.png)

![学习收获](/images/imageWebRTC/mediaserver/学习收获.png)

![涉及知识](/images/imageWebRTC/mediaserver/涉及知识.png)

## C++ 知识回顾

```shell
# macos 下编译 c++
$ clang++ -std=c++11 -g -o hello helloworld.cpp
```

### 类的定义和实现

**C++基础**

- 类
- 继承
- 多态

**类**

- 构造函数
- 析构函数
- 成员变量
- 成员函数

![类的定义](/images/imageWebRTC/mediaserver/类的定义.png)

### 类的使用

![创建类对象](/images/imageWebRTC/mediaserver/创建类对象.png)

### 命名空间

命名空间格式：

```c++
namespace avdance
{
    ...
}
```

例子：

<details><summary>Human.h</summary>

```c++
#ifndef __HUMAN_H__
#define __HUMAN_H__
#include <iostream>

namespace avdance {
    
class Human {
public:
    Human(){
        std::cout << "construct human..." << std::endl;
        age = 0;
        sex = 0;
    };

    ~Human(){
        std::cout << "destruct human..."  << std::endl;
    }
public:
    void setAge(int a);
    int getAge();

    void setSex(int s);
    int getSex(); 
private:
    int age; //
    int sex; // 0:male 1:fmale
};
    
} // namespace avdance

#endif // __HUMAN_H__
```

</details>

<details><summary>Human.cpp</summary>


```c++
// Human.cpp
#include <iostream>
#include "Human.h"

namespace avdance {
    
void Human::setAge(int a){
    age = a;
}

int Human::getAge(){
    return age;
}

void Human::setSex(int s){
    sex = s;
}

int Human::getSex(){
    return sex;
}
    
} // namespace avdance
```

</details>

<details><summary>class.cpp</summary>


```c++
// class.cpp
/**
 * for testing class and use it
 * 
 * @author xxx
 * @date 2019-08-10
 * @copyleft GPL 2.0
 */
#include <iostream>
#include "Human.h"

using namespace avdance;

int main(int argc, char* argv[])
{
#if 0
	Human human; 
    human.setAge(28);
    human.setSex(1);

    std::cout << "human:" << human.getAge() << ", " << human.getSex() << std::endl;
#endif
    
    Human* human = new Human(); 
    // avdance::Human* human = new avdance::Human(); 
    human->setAge(28);
    human->setSex(1);

    std::cout << "human:" << human->getAge() << ", " << human->getSex() << std::endl;
}
```

</details>


```shell
$ clang++ -std=c++11 -g -o class Human.cpp class.cpp
```

### 继承

![继承关系](/images/imageWebRTC/mediaserver/继承-01.png)

![继承方式图标](/images/imageWebRTC/mediaserver/继承-02.png)

![多层继承](/images/imageWebRTC/mediaserver/继承-03.png)

![多重继承](/images/imageWebRTC/mediaserver/继承-04.png)

### 多态

![多态性](/images/imageWebRTC/mediaserver/多态-01.png)

![C++的多态](/images/imageWebRTC/mediaserver/多态-02.png)

析构函数一般都是多态的





![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)