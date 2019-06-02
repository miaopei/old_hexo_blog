---
title: html + css 学习笔记
toc: true
categories: notes
tags:
  - html
  - css
abbrlink: 33533
date: 2018-02-05 13:57:02
---
# 注释
css中使用 `/*注释内容*/` 来进行注释。
# CSS插入形式
1.内联式
   把 css 代码直接写在现有的 HTML 标签中：
   ```html
   <p style="color:red; font-size:12px"> 段落内容 </p>
   ```
   <!--more-->
2.嵌入式
   把 css 样式代码写在 `<style type="text/css"> </style>` 标签之间，实现某些样式的统一定义：
   ```html
   <style type="text/css">
   span {
     color: red;
   }
   </style>
   ```
3.外联式
   把 css 代码写进一个单独的外部文件中，这个 css 样式文件以 `.css` 为扩展名。
   在 `<head> </head>` 内使用 `<link>` 标签将 css 样式文件链接到 HTML 文件内：
   ```html
   <link href="base.css" rel="stylesheet" type="text/css" />
   ```
4.三种方法的优先级
   **就近原则** ：内联样式 > 嵌入样式 > 外部样式
   前提：
   - 嵌入样式 > 外部有一个前提 : 嵌入式 css 的位置一定在外部样式的后面。
   - 内联样式 > 嵌入样式 > 外部样式 的前提是：三种样式表中 css 样式的 *权值* 相同。
# 选择器
## 什么是选择器
每一条 css 样式声明由两部分组成：
```css
选择器 {
  样式：值；
}
```
{} 之前的部分就是 *选择器* 。
*选择器* 指明了大括号 {} 中包含的 *样式* 的*作用对象* 。
## 标签选择器
标签选择器其实就是 html 代码中的标签：
```css
p, h1 {
  font-size: 12px;
  line-height: 1.6em;
}
```
## 类选择器
类选择器在 css 样式编码中是最常用到的，语法为：
```css
.类选择器名称 {
  css 样式代码；
}
```
类选择器以 **英文圆点** 开头，作用范围为所有使用了**对应类名**的标签，即 `class=”类选择器名称“` 的标签。
## ID 选择器
ID 选择器的语法为：
```css
#id名称 {
  css 样式代码；
}
```
ID 选择器以 **#** 开头，作用范围为所有使用了 **对应ID名称** 标签，即 `id=“id名称”` 的标签。
## 类选择器 和 ID 选择器的区别
- ID选择器只能在*文档中* 使用一次！
- 可以使用**类选择器词列表**方法为一个元素同时设置多个样式并且只可以通过类选择器的方法实现，不可以使用 ID 选择器。如：
  ```html
  .stress {
    color: red;
  }
  .bigsize {
    font-size: 25px;
  }

  <p class="stress bigsize"> 段落内容 </p>
  ```
## 子选择器
子选择器使用大于符号 **>** 来选择指定标签元素的 **第一代子元素**：
```css
.food > li {
  border:1px solid red;
}
```
## 后代选择器
后代选择器使用 **空格** 来指定标签元素下的 **后辈元素**：
```css
.first span {
  color: red;
}
```
## 子选择器和后代选择器的区别
- 子选择器仅是指它的 **直接后代** ，或者说作用于 **第一代后代**；
- 后代选择器作用于 **所有后代元素**
## 通用选择器
通用选择器使用一个 **星号 *** 指定，它的作用范围是 html 标签中的所有元素：
```css
* {
  color:red;
}
```
## 伪类选择符
伪类选择符允许给 html 不存在的标签（即标签的某种状态）设置样式。
比如说我们给 html 中一个标签元素 *鼠标滑过的状态* 设置字体颜色：
```css
a:hover {
  color: red;
}
```
理论上所有的标签都支持伪类选择符，但是个别浏览器对伪类选择符的支持不是很好，考虑到浏览器兼容性的问题，伪类选择器的使用需要谨慎。
## 分组选择符
当你想为多个标签设置同一个样式时，可以使用分组选择符 **逗号 ,** ：
```css
h1, span {
  color: red;
}
```
# CSS 的继承、层叠和特殊性质
## 继承
css 的 **某些样式** 是具有继承性的。
继承是一种规则，它允许样式不仅作用于某个特定的 html 元素，而且作用于其后代。
比如下面的代码中，p 标签包裹着的文本以及 span 标签包裹着的文本都会被设置为红色：
```html
p {
  color:red;
}
<p> 段落文本 <span> span文本 </span> </p>
```
## 特殊性
有时候我们会为同一个元素设置不同的 css 样式代码，这种时候浏览器会根据权值来判断，优先使用权值较高的样式。
- 标签的权值为 1
- 类选择符的权值为 10
- ID 选择符的权值最高为 100
- 继承的权值为 0.1
```css
p {color: red;}			/*权值为 1 */
p span {color: green;}	/*权值为 1+1=2 */
.warning {color: white;}	/*权值为 10 */
p span.warning {color: purple;}	/*权值为 1+1+10=12 */
#footer .note p{color: yellow;}	/*权值为 100+10+1=111 */
```
## 层叠
层叠就是在 html 文件中对于同一个元素可以有多个 css 样式存在，当有相同权重的样式存在时，会根据这些 css 样式的前后顺序来决定，处于 **最后面** 的 css 样式会被应用。
```html
p {color: red;}
p {color: green;}
<p> 段落文本 </p>
```
上面代码中 p 标签中的文本会被设置为 green。
层叠可以理解为后面的样式会覆盖前面的样式，所以也就有了 `内联样式表 > 嵌入样式表 > 外部样式表` 的优先级排序。
## 重要性
在我们做网页代码时，有些特殊的情况需要为某些样式设置具有最高的权值，这时候可以使用 **!important** 来解决：
```css
p {color: red!important;}
p {color: green;}
<p> 段落文本 </p>
```
此时 p 标签中的文本会显示为红色。
这里需要注意：
当网页制作者不设置 css 样式时，浏览器会按照自己的一套样式来显示网页；
用户也可以在浏览器中设置自己习惯的样式；
这时样式的优先级为： 
​	用户自己设置的样式 > 网页制作者的样式 > 浏览器默认的样式
但是 **!important** 优先级（权值）高于用户自己设置的样式。
# css 格式化排版
    1.font-family:“Microsoft Yahei”;	→	字体
    2.font-size:12px;→	字号
    3.color:red;→颜色
    4.font-weight:bold;→粗体
    5.font-style:italix;→斜体
    6.text-decoration:underline;→下划线
    7.text-decotation:line-through;→删除线
    8.text-indent:2em;→首行缩进（其中：2em的意思是文字的2倍大小）
    9.line-height:1.5em;→行高
    10.letter-spacing:50px;→文字间距/字母间距
    11.word-spacing:50px;→英文单词间距
    12.text-align:center;→对齐
# CSS 盒模型
## 元素分类
1.块状元素
   - 每个块状元素都从新的一行开始，并且其后的元素也另起一行；
   - 块状元素的高度、宽度、行高以及顶和底边距都可以设置；
   - 块状元素在宽度不设置的情况下，是它本身父容器的100%，除非设定一个宽度；
   常见的块状元素有：
   `<div>, <p>, <hx>, <ol>, <ul>, <dl>, <table>, <address>, <blockquote>, <form>...`
   tips：
   可以通过 css 样式 `display:bolck` 将其它元素转换为块状元素。
2.内联元素
   - 和其他（内联）元素都在同一行上；
   - 元素的高度、宽度以及顶部和底部编剧不可设置；
   - 元素的宽度就是它包含的文字或图片的宽度，不可改变；
   - 内联元素之间会有一个间距问题。
   常见的内联元素有：
   `<a>, <span>, <br>, <i>, <em>, <stron>, <label>, <q>, <var>, <cite>, <code>...`
   tips:
   可以通过 css 样式 `display:inline` 将其它元素转换为内联元素。
3.内联块状元素
   内联块状元素同时具备内联元素和块状元素的特点：
   - 和其他元素都在同一行上；
   - 元素的高度、宽度、行高以及顶和底边距都可以设置。
   常见的内联元素有：
   `<img>, <input>...`
   tips:
   可以通过 css 样式 `display:inline-block` 将其它元素转换为内联块状元素。
## 盒模型特征
**块级标签** 具备盒子模型的特征。
1.边框
   盒模型的边框就是围绕着内容以及补白的线，你可以设置这条线的粗细、样式和颜色。
   ```css
   div {
     border: 2px solid red;
   }
   ```
   上面的代码可以分成三部分来写：
   ```css
   div {
     border-width: 2px;
     border-style: solid;
     boeder-color: red;
   }
   ```
   - border-style （边框样式）常见的样式有：
     - dash	    虚线
     - dotted   点线
     - solid    实线
   - border-color （边框颜色）中的颜色可以设置为十六进制颜色如 `#888` ；
   - border-width （边框宽度）中的宽度常用像素 px 表示。
   可以单独设置元素的上/下/左/右边框：
   - border-top:       上边框
   - border-bottom:    下边框
   - border-left:	    左边框
   - border-right:     右边框

2.宽度和高度
   盒模型的宽度和高度和我们平常所说的物体的宽度和高度理解是不一样的，css 样式中属性宽 (width) 和高 (height) 指的是填充 (padding) 以内的范围。
   因此，一个盒模型的实际宽度 = 左边界 + 左边框 + 左填充 + 内容宽度 + 右填充 + 有边框 + 右边界。
   如图：
   ![盒模型宽度](https://qiniu.diqigan.cn/18-1-30/40002844.jpg) 
   盒模型的高度同理。
3.填充
   在和模型中，元素内容与边框之间是可以设置距离的，这段距离称为 **填充** 。
   填充也可以分为上、右、下、左（顺时针），如下代码：
   ```css
   div {
     padding: 20px 10px 15px 20px;
   }
   ```
   注意顺序一定不要搞乱！！！
   上面的代码等价于：
   ```css
   div {
     padding-top: 20px;
     padding-right: 10px;
     padding-bottom: 15px;
     padding-left: 20px;
   }
   ```
   如果上下左右的填充都相同，可以简写为：

   ```css
   div {padding: 10px;}
   ```
   如果上下填充相同为10px，左右填充一样为20px，可以简写为：

   ```css
   div {
     padding: 10px 20px;
   }
   ```
4.边界
   元素与其它元素之间的距离可以用 **边界 （margin）** 来设置，边界的语法规则与 **填充 (margin)** 相同。
# CSS 布局模型
1.css 布局模型有三种：
   - 流动模型（Flow）
   - 浮动模型（Float）
   - 层模型（Layer）
2.流动模型（Flow）
   流动模型（Flow）是默认的网页布局样式，所以默认情况下 HTML 网页元素都是根据流动模型来分布的。
   流动模型具有 2 个比较典型的特种：
   - 块状元素 都会在 所处的包含元素内 自上而下按顺序垂直延伸分布；
   - 内联元素 都会在 所处的包含元素内 从左到右水平分布显示。
3.浮动模型（Flow）
   默认情况下块状元素都是独占一行的。设置元素浮动可以实现多个块状元素在同一行并排显示。
   对应的 css 代码为：
   ```css
   selector {
     float: left/right;
   }
   ```
4.层模型（Layer）
   层布局模型就像是 PhotoShop 中的图层编辑功能，每个图层都能够 **精确定位** 。
   css 定义了一组定位属性（position）来支持层布局模型。
   层模型有三种形式：
   - 绝对定位（position: absolute）
     如果想为元素设置层模型中的绝对定位，需要设置 `position: absolute` ，这条语句的作用是将元素从*文档流* 中拖出来，然后使用 `left / right / top / bottom` 属性相对于 **其最接近的一个具有定位属性的父包含块** 进行绝对定位。
     如果不存在这样的*包含块* ，则相对于 body 元素，即相对于浏览器窗口。
     如下代码可以实现 div 元素相对于浏览器窗口向右移动 100px ，向下移动 50px ：
     ```css
     div {
       width: 200px;
       height: 200px;
       position: absolute;
       left: 100px;
       top: 50px;
     }
     ```
     ![绝对定位效果图](http://img.mukewang.com/53a00b130001e86707360547.jpg)
   - 相对定位（position: relative）
     设置相对定位的元素是相对于该元素在 **原有布局** 中的位置进行移动，相对定位可以由 css 代码 `positin:relative` 设置，移动的方向和幅度由 `left / right / top / bottom` 属性确定。
     注意：设置相对定位的元素， **元素偏移前的位置保留不动！！！** 也就是说： **该元素依然占据着移动之前的位置** 。
   - 固定定位（positon: fixed）
     固定定位可以用 css 代码 `position: fixed` 表示，它与 absolute 定位类型相似，但它是相对于 **视图（屏幕内的网页窗口）** 本身进行定位的。
     除了改变浏览器窗口大小或者移动浏览器窗口的位置之外，视图本身是固定的，所以固定定位的元素会始终位于浏览器窗口中的某个位置，不受文档流影响。这与 `background-attachment: fixed;` 属性功能相同。
   - 绝对定位（absolute）与相对定位（relative）组合使用（雾，这里描述很不清楚，需实践）
     - 被参照元素（相对定位）必须是参照元素（绝对定位元素）的前辈元素；
     - 被参照元素必须设置相对定位；
     - 参照元素需要设置绝对定位。
     符合以上条件，就可以实现绝对定位和相对定位的组合使用了。
     
# CSS 代码缩写
## 盒模型代码简写
   盒模型的外边距（margin）、内填充（padding）和边框（border）设置上下左右四个方向的边距时是按顺时针方向设置的，也就是 `上→右→下→左` 的方向。
   - 如果 top、right、bottom、left 的值相同：
     ```css
       margin: 10px 10px 10px 10px;
     ```
     可缩写为：
   ```css
     margin: 10px;
   ```
   - 如果 top 和 bottom 值相同，left 和 right 值相同：
     ```css
     padding: 10px 20px 10px 20px;
     ```
     可缩写为：
     ```css
     padding: 10px 20px;
     ```
   - 如果 left 和 right 值相同：
     ```css
     margin: 10px 20px 30px 20px;
     ```
     可缩写为：
     ```css
     margin: 10px 20px 30px;
     ```
## 颜色值缩写
   关于颜色的 css 样式也是可以缩写的，如果你要设置的 16 进制的色彩值中每两位的值相同，可以缩写一半：
   ```css
   p {color: #112233;}
   ```
   可以缩写为：
   ```css
   p {color: #123;}
   ```
## 字体缩写
   设置字体的代码：
   ```css
   body {
     font-style: italic;
     font-variant: small-caps;
     font-weight: bold;
     font-size: 12px;
     lint-height: 1.5em;
     font-family: "宋体", sans-serif;
   }
   ```
   可缩写为：
   ```css
   body {
     font: italic small-caps bold 12px/1.5em “宋体”, sans-serif;
   }
   ```
   注意：
   - 使用简写方式时，至少要指定 `font-size` 和 `font-family` 属性，其它的属性如 `font-weight` 、 `font-style` 、 `fong-vatiant` 、 `line-height` 等如果未指定将自动使用默认值；
   - 在缩写时 `font-size` 和 `line-height` 之间要加入斜杠 `/` ；
# 单位和值
## 颜色值
颜色值可以使用英文颜色命令、RGB 颜色、十六进制颜色指定。
## 长度值
目前比价常用的长度单位有： px、 em、 %，要注意这三种单位都是相对单位。
1.像素 px
   像素指的是显示器上的小点，实际情况是浏览器会使用显示器的实际像素值有关，目前大多数设计者都倾向于使用像素 px 作为单位。
2.em
   em 就是本元素给定字体 font-size 的值，如果元素的 font-size 为 14px ，那么 1em = 14px； 如果 font-size 为 18px ，那么 1em = 18px。
   当 font-size 的值设置为 em 时，此时的计算标准以父元素的 font-size 为基础。
3.百分比 %
   代码：
   ```css
   p {
     font-size: 12px;
     lint-height: 130%;
   }
   ```
   设置行高为字体的130% 。
# CSS 样式设置小技巧
## 水平居中设置
1.行内元素
   行内元素如文本、图片等的水平居中是通过给 **父元素** 设置 `text-align: center;` 来实现的。
   `text-align: center;` 对块状元素不起作用。
2.定宽块状元素
   同时满足 **定宽** 和 **块状** 两个条件的元素是可以通过设置 **左右 margin 值为 auto ** 来实现居中的。
   ```css
   div {
     margin: 10px auto;
   }
   ```
3.不定宽块状元素（块状元素的宽度不确定）
   不定宽块状元素有三种方法居中：
   - 加入 table 标签
     之所以选择 table 标签是为了利用 table 标签的 **长度自适应** 性质，即不定义长度也不默认父元素 body 的长度，table 的长度根据其内文本长度决定，因此可以看做一个 *定宽度块状元素* ，然后再利用定宽块状元素居中的 magrin 方法使其水平居中。
     实现步骤：
     - 为需要设置居中的元素外面加入一个 table 标签（包括 `<tbody>、 <tr>、 <td>`）；
     - 为这个 table 设置左右 margin 居中。
   - 设置 display: inline
     改变块级元素的 display 为 inline 类型，转换为行内元素，然后使用 text-align:center 来实现居中效果。
     这种方法较第一种方法的优势是不增加 **无语义标签** ，但它将块级元素变成了行内元素，所以少了一些功能，比如设定长度值。
   - 设置 position: relative 和 left: 50%
     通过给父元素设置 float ，然后给父元素设置 `position: relative` 和 `left: 50%` ，子元素设置 `position: relative` 和 `left: -50%` 来实现水平居中。
## 垂直居中
1.父元素高度确定的单行文本
   通过设置父元素的 height 和 line-height 高度一致可以实现父元素高度确定的单行文本的居中。
   line-height 与 font-size 的计算值之差在 css 中称为 **行间距**。行间距分为两半，分别加到一个文本行内容的顶部和底部。
   这种文字行高与块高一致带来了一个弊端：当文字内容的长度大于快的宽度时，就有内容脱离了块。
2.父元素高度确定的多行文本
   父元素高度确定的多行文本、图片等的垂直居中的方法有两种：
   - 插入 table 标签（包括 `<tbody> 、<td>、 <tr>` ），同事设置 `vertical-align: middle` ;
     css 中有一个用于垂直居中的属性 `vertical-align` ，在父元素设置此样式时，会对 `inline-block` 类型的子元素都有用。
   - 在 chrome 、firefox 及 IE8 以上的浏览器下可以设置块级元素的 display 为 table-cell，将块级元素转换为表格单元显示，激活 vertical-align 属性。但注意 IE6、7 不支持这个样式，所以兼容性比较差。
     这个方法的好处是不用添加多余的无意义的标签，但缺点是兼容性比较差。
## 隐性改变 display 类型
有一个有趣的现象是当为元素设置为 `position: absolute;` 或者 `float: left;` 或者 `float: right;` 时，元素的 display 显示类型就会自动变为以 `display: inline-block` （块状元素）的方式显示，当然就可以设置元素的宽高了，且默认宽度不占满父元素。
# 课程连接
[HTML + CSS 基础课程](https://www.imooc.com/learn/9)	——	慕课网
