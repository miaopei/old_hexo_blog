---
title: 为 Hexo 主题 next 添加图片背景
hide: false
categories:
  - coding
toc: true
tags:
  - hexo
  - next
abbrlink: 40629
date: 2018-12-05 16:58:50
---

# 前言

next 主题默认背景是白色, 看多了难免感觉乏味. 我们可以通过自定义样式为其添加背景图片. 

# 操作流程

我们直接在 NEXT 预留的自定义样式文件 "themes/next/source/css/_custom/custom.styl" 中添加自己的样式即可, 在自定义样式文件中写入以下代码: 

```css
// 添加背景图片
body {
  background: url(https://source.unsplash.com/random/1600x900?wallpapers);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: 50% 50%;
}

// 修改主体透明度
.main-inner {
  background: #fff;
  opacity: 0.8;
}

// 修改菜单栏透明度
.header-inner {
  opacity: 0.8;
}

```

<!-- more -->

其中:

* `background: url()` 中填写的是背景图片的 url 地址, 这里调用了 [Unsplash](https://unsplash.com/) 的 API, 随机选用该网站的高清美图作为博客背景. 该网站所有图片都是免费商用的, 所以无须担心侵权问题;
  网站 API 还有很多有趣的玩法, 参见: [Documentation](https://source.unsplash.com/)
* `opacity` 指定了对应元素的透明度, 这里是 "0.8", 可以按需更改.


看一下完成后的效果: 
![background-picture](https://qiniu.diqigan.cn/18-12-5/47718362.jpg)

# 参考文献 

1. [Next主题个性化之自动更换背景图片](https://www.jianshu.com/p/30bf702f533c)   ---   芒果浩明
2. [Hexo+Next主题优化](https://zhuanlan.zhihu.com/p/30836436)   ---   路人S
