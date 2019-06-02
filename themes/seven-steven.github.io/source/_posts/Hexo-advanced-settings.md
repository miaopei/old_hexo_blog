---
title: Hexo进阶设置
categories: coding
tags:
  - Hexo
abbrlink: 13290
date: 2017-08-23 18:09:55
---
### Hexo新建文章后立即打开Markdown编辑器编辑
我们都知道，在没有进行此项设置之前，我们新建博文的流程是：`Hexo new "博文名称"` → 进入到`{your_hexo_path}/source/_posts`文件夹 → 使用自己的markdown编辑器打开“博文名称.md”文件进行编辑。那么有没有什么方法可以简化这个流程呢？答案是肯定的。
* 新建文件：{your_hexo_path}/scripts/editArticle.js(*文件名任取，没有scripts文件夹就新建一个*)
* 然后在上述文件中填入以下代码：
```
var exec = require('child_process').exec;
hexo.on('new', function(data){
  exec('start  "C:/+++Software+++/Sublime Text 3/sublime_text.exe" ' + data.path);
});
```
**其中：把`C:/+++Software+++/Sublime Text 3/sublime_text.exe`替换为你自己的markdown编辑器的绝对路径。**
* 大功告成！在命令行输入`Hexo new "博文名称"`试试吧！
* Attention: 此方法只在Hexo 3.0之后的版本有效。

<!-- more -->
### 修改文章模板
Hexo的文章模板存放在`{your_hexo_path}/scaffolds/post.md`文件中，想要修改文章模板，直接修改此文件即可。
`post.md`原文件为：
```
---
title: {{ title }}
date: {{ date }}
tags:
---
```
如果我们需要自动生成目录和分类信息，就可以在代码中添加categories和toc属性：
```
---
title: {{ title }}
date: {{ date }}
categories: 
toc: true
tags:
---
```
以后的文章就会按照这个模板生成了。

### 参考文献
* [Hexo新建文章后立即打开文本编辑器](http://www.xyzardq.com/hexo%E6%96%B0%E5%BB%BA%E6%96%87%E7%AB%A0%E5%90%8E%E7%AB%8B%E5%8D%B3%E6%89%93%E5%BC%80%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91%E5%99%A8/) ———— xyzardq
* [hexo主题优化](http://www.voidking.com/2015/05/31/deve-hexo-theme-optimize/) ———— VoidKing
