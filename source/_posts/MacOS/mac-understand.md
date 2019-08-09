---
title: understand 快捷键
tags: [MacOS]
categories: [MacOS]
reward: true
date: 2019-08-09 16:01:01
---

## UnderStand 介绍

- 支持多语言：`Ada, C, C++, C#, Java, FORTRAN, Delphi, Jovial, and PL/M` ，混合语言的 project 也支持
- 多平台： `Windows/Linux/Solaris/HP-UX/IRIX/MAC OS X`
- 代码语法高亮、代码折迭、交叉跳转、书签等基本阅读功能。
- 可以对整个 project 的 architecture、metrics 进行分析并输出报表。
- 可以对代码生成多种图（`butterfly graph、call graph、called by graph、control flow graph、UML class graph等`），在图上点击节点可以跳转到对应的源代码位置。
- 提供 `Perl API` 便于扩展。作图全部是用 Perl 插件实现的，直接读取分析好的数据库作图。
- 内置的目录和文件比较器。
- 支持 project 的 `snapshot`，并能和自家的 `TrackBack` 集成便于监视 project 的变化。

**软件说明**

功能比 sourceinsight 多些 ( 比如 enum 的值的显示 ), 而且 `#ifdef` 包含的比较多嵌套, sourceinsight 如果太多嵌套, 有 bug.  流程图之类也比 sourceinsight 完整. 

sourceinsight 的显示明显好多了, 而且体积比较小, 编辑速度快, 可能是用熟的关系, 还是 sourceinsight 比较顺手.

可惜 sourceinsight 太长时间没有更新了. 现在我一般用 sourceinsight , 需要看某些 SI 没有的用 understand. 另外好像两个软件都不太支持 `#if (defined(MACRO) || defined(MACRO1))` 这样的解析.

## 导入项目

导入项目有两种方法，一种是从菜单栏点击 `File–>New–>Project` 另一种是点击下面界面中间的 `New Project`

## 搜索功能

- 左侧项目结构中搜索：在这个搜索中你可以快速搜索你要查看的类，快捷键，鼠标点击左侧上面项目结构窗口，然后按 `command + F` 键会出现如下图所示的搜索框，在框中输入你想要的类回车即可



- 类中方法搜索：将鼠标定位到右侧代码中，点击 `command + F`，会弹出搜索框，输入方法回车即可：



- 在文件中搜索：也就是全局搜索，快捷键 `F5` 或者去上面菜单栏中的 `search栏` 中查找，输入你想要的类或者方法，回车查找，下面会列出所有使用的地方：



- 实体类查找：软件菜单栏 `search` 中最后一项– `Find Entity`，点击输入你要查找的实体类，回车查找：



快速搜索是软件快速使用必备的技能，包括我们常用的 idea一样，快速定位类，方法，常量等，可以快速帮助我们解决问题。

## 项目视图

项目视图包含很多的功能，能够自动生成各种流程图结构图，帮助你快速理清代码逻辑、结构等，以便快速理解项目流程，快速开发，视图查看方式有两种，一种是鼠标点击你要查看的类或者方法等上面，然后右键弹出菜单，鼠标移动到Graphical Views，然后弹出二级菜单，如下图所示：



另一种方式是点击要查看的类或者方法，然后找到代码上面菜单栏中的如下图标：



然后点击图标右下角的下拉箭头，弹出如下菜单，即可选择查看相关视图：



### 层级关系视图分类：

1.Butterfly：如果两个实体间存在关系，就显示这两个实体间的调用和被调用关系；如下图为Activity中的一个方法的关系图：



2.Calls：展示从你选择的这个方法开始的整个调用链条；



3.Called By：展示了这个实体被哪些代码调用，这个结构图是从底部向上看或者从右到左看；



4.Calls Relationship/Calledby Relationship:展示了两个实体之间的调用和被调用关系，操作方法：首先右键你要选择的第一个实体，然后点击另一个你要选择的实体，如果选择错误，可以再次点击其他正确即可，然后点击ok；





5.Contains:展示一个实体中的层级图，也可以是一个文件，一条连接线读作”x includes y“；



6.Extended By:展示这个类被哪些类所继承，



7.Extends:展示这个类继承自那个类：



### 结构关系视图分类：

1.Graph Architecture：展示一个框架节点的结构关系；

2.Declaration:展示一个实体的结构关系，例如：展示参数，则返回类型和被调用函数，对于类，则展示私有成员变量（谁继承这个类，谁基于这个类）

3.Parent Declaration:展示这个实体在哪里被声明了的结构关系；

4.Declaration File:展示所选的文件中所有被定义的实体（例如函数，类型，变量，常量等）；

5.Declaration Type:展示组成类型；

6.Class Declaration:展示定义类和父类的成员变量；

7.Data Members:展示类或者方法的组成，或者包含的类型；

8.Control Flow:展示一个实体的控制流程图或者类似实体类型；



9.Cluster Control Flow:展示一个实体的流程图或者类似实体类型，这个比上一个更具有交互性；

10.UML Class Diagram:展示这个项目中或者一个文件中定义的类以及与这个类关联的类



11.UML Sequence Diagram:展示两个实体之间的时序关系图；



12.Package:展示给定包名中声明的所有实体

13.Task:展示一个任务中的参数，调用，实体

14.Rename Declaration:展示实体中被重命名的所有实体

由于视图比较多，所以就一一贴上代码，主要还是需要自己去调试，查看各个功能视图的展示结构以及作用，孰能生巧，多操作几下就会了，所以不再做过多的解释。最终希望这款软件能够帮助你快速开发，快速阅读别人的或者自己的代码。










> [Understand:高效代码静态分析神器详解](<https://www.cnblogs.com/sky-heaven/p/6860057.html>)
>
> [understand软件使用教程](<https://blog.csdn.net/u011776903/article/details/73563957>)