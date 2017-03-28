---
title: hexo 使用指南
tags: hexo
toc: true
reward: true
date: 2017-03-28 16:53:46
---

## 安装、初始化和配置

### 准备工作

* git
* node.js
* github

<!-- more -->

### 安装和初始化

首先确定已经安装好了 `nodejs` 和 `npm` 以及 `git`

```bash
$ npm install hexo -g
$ hexo init blog
$ cd blog
$ npm install
$ hexo server
```

访问[http://localhost:4000](http://localhost:4000)，会看到生成好的博客。

### 主目录结构

```python
|-- _config.yml
|-- package.json
|-- scaffolds
|-- source
   |-- _posts
|-- themes
|-- .gitignore
|-- package.json
```

**_config.yml**

全局配置文件，网站的很多信息都在这里配置，诸如网站名称，副标题，描述，作者，语言，主题，部署等等参数。这个文件下面会做较为详细的介绍。

**package.json**

hexo框架的参数和所依赖插件，如下：  

```json
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "hexo": {
    "version": "3.2.0"
  },
  "dependencies": {
    "hexo": "^3.2.0",
    "hexo-generator-archive": "^0.1.4",
    "hexo-generator-category": "^0.1.3",
    "hexo-generator-index": "^0.2.0",
    "hexo-generator-tag": "^0.2.0",
    "hexo-renderer-ejs": "^0.2.0",
    "hexo-renderer-stylus": "^0.3.1",
    "hexo-renderer-marked": "^0.2.10",
    "hexo-server": "^0.2.0"
  }
}
```

**scaffold**

scaffolds是“脚手架、骨架”的意思，当你新建一篇文章（hexo new 'title'）的时候，hexo是根据这个目录下的文件进行构建的。基本不用关心。

**_config.yml文件**

_config.yml 采用YAML语法格式，[具体语法自行学习](http://my.oschina.net/u/1861837/blog/526142?p=%7B%7BtotalPage%7D%7D) 。
具体配置可以参考[官方文档](https://hexo.io/zh-cn/docs/configuration.html)，_config.yml 文件中的内容，并对主要参数做简单的介绍

```yaml
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: Hexo   #网站标题
subtitle:     #网站副标题
description:  #网站描述
author: John Doe  #作者
language:    #语言
timezone:    #网站时区。Hexo 默认使用您电脑的时区。时区列表。比如说：America/New_York, Japan, 和 UTC 。

# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://yoursite.com   #你的站点Url
root: /                    #站点的根目录
permalink: :year/:month/:day/:title/   #文章的 永久链接 格式   
permalink_defaults:    #永久链接中各部分的默认值

# Directory   
source_dir: source         #资源文件夹，这个文件夹用来存放内容
public_dir: public         #公共文件夹，这个文件夹用于存放生成的站点文件。
tag_dir: tags              #标签文件夹     
archive_dir: archives      #归档文件夹
category_dir: categories   #分类文件夹
code_dir: downloads/code   #Include code 文件夹
i18n_dir: :lang            #国际化（i18n）文件夹
skip_render:               #跳过指定文件的渲染，您可使用 glob 表达式来匹配路径。    

# Writing
new_post_name: :title.md   #新文章的文件名称
default_layout: post       #预设布局
titlecase: false           #把标题转换为 title case
external_link: true        #在新标签中打开链接
filename_case: 0           #把文件名称转换为 (1) 小写或 (2) 大写
render_drafts: false       #是否显示草稿
post_asset_folder: false   #是否启动 Asset 文件夹
relative_link: false       #把链接改为与根目录的相对位址    
future: true               #显示未来的文章
highlight:                 #内容中代码块的设置    
  enable: true
  line_number: true
  auto_detect: false
  tab_replace:

# Category & Tag
default_category: uncategorized
category_map:          #分类别名
tag_map:               #标签别名

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD         #日期格式
time_format: HH:mm:ss           #时间格式    

# Pagination
## Set per_page to 0 to disable pagination
per_page: 10    #分页数量
pagination_dir: page  

# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: landscape   #主题名称

# Deployment
## Docs: https://hexo.io/docs/deployment.html
#  部署部分的设置
deploy:     
  type: git  #类型，常用的git
  repo: https://github.com/nanshanyi/nanshanyi.github.io.git #github仓库的地址
```

### 注意

**如果页面中出现中文，应以UTF-8无BOM编码格式，所以不要用win自带的记事本，而是用notepad++这种支持编码转换的编辑器。**

由于google在天朝大陆被墙，进入 `themes\landscape\layout\_partial` ，打开 `head.ejs` ，删掉第31行 `fonts.googleapis.com` 的链接。

下载下来 `jQuery-2.0.3.min.js` ，放到 `themes\landscape\source\js` 文件夹中。之后进入 `themes\landscape\layout\_partial` ，打开 `after-footer.ejs` ，将第17行的路径替换为 `/js/jquery-2.0.3.min.js` 。

至此大功告成。

## 写文章&草稿

### 文章

命令行输入：

```bash
$ hexo new post "new article"
```

之后在 `soource/_posts` 目录下面多了一个 `new-article.md` 的文件。

### 文章属性 

| Setting    | Description | Default   |
| ---------- | ----------- | --------- |
| layout     | Layout      | post或page |
| title      | 文章的标题       |           |
| date       | 穿件日期        | 文件的创建日期   |
| updated    | 修改日期        | 文件的修改日期   |
| comments   | 是否开启评论      | true      |
| tags       | 标签          |           |
| categories | 分类          |           |
| permalink  | url中的名字     | 文件名       |
| toc        | 是否开启目录      | true      |
| reward     | 是否开启打赏      | true      |

### 分类和标签

```text
categories:
  - 日记
tags:
  - Hexo
  - node.js
```

### 摘要

`<!--more-->` 之上的内容为摘要。

### 草稿

草稿相当于很多博客都有的“私密文章”功能。

```bash
$ hexo new draft "new draft"
```

会在 `source/_drafts` 目录下生成一个 `new-draft.md` 文件。但是这个文件不被显示在页面上，链接也访问不到。也就是说如果你想把某一篇文章移除显示，又不舍得删除，可以把它移动到 `_drafts` 目录之中。

如果你希望强行预览草稿，更改配置文件：

```text
render_drafts: true
```

或者，如下方式启动server：

```bash
$ hexo server --drafts
```

下面这条命令可以把草稿变成文章，或者页面：

```bash
$ hexo publish [layout] <filename>

eg:
$ hexo publish drafts hexo-使用指南
```

## Blog中出入图片和音乐

文章推介：[Hexo 博客中插入音乐/视频](http://www.jianshu.com/p/53e0d2a617da)

​		   [使用七牛为Hexo存储图片](http://blog.shiqichan.com/use-qiniu-store-image-for-hexo/)

  		   [hexo主题中添加相册功能](http://www.cnblogs.com/xljzlw/p/5137622.html)

​		   [为 Hexo 主题添加多种图片样式(主题不错考虑移植)](http://wuchong.me/blog/2014/12/13/hexo-theme-creating-image-styles/?utm_source=tuicool&utm_medium=referral#)

​		   [Hexo折腾记——基本配置篇](https://yq.aliyun.com/articles/8607)

​		   [hexo博客进阶－相册和独立域名](http://www.cnblogs.com/jarson-7426/p/5515870.html)

插入图片基本分为两种办法** ：

（1） 放在本地文件

首先在根目录下确认 `_config.yml` 中有 `post_asset_folder:true` 。
在 hexo 目录，执行：

```bash
$ npm install https://github.com/CodeFalling/hexo-asset-image --save
```

之后再使用 `hexo new 'new' `创建新博客的时候，会在 `source/_posts` 里面创建 `.md` 文件的同时生成一个相同的名字的文件夹。把该文章中需要使用的图片放在该文件夹下即可。
使用的时候

```markdown
![“图片描述”（可以不写）](/文件夹名/你的图片名字.JPG)
例如：
！[ ] (new/text.jpg)
```

（2）放在[七牛](https://portal.qiniu.com/signup?code=3lglas6pgi2qa)上，需要先注册，上传图片生成链接，直接在文章中使用链接即可。

**插入音乐** ：

可以使用网易云音乐，搜索想要的歌曲，点击歌曲名字进入播放器页面，点击生成外链播放器；复制代码，直接粘贴到博文中即可。这样会显示一个网易的播放器，可以把

```html
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=298 height=52 src="http://music.163.com/outchain/player?type=2&id=32192436&auto=1&height=32"></iframe>
//其中的width=298 height=52 均改为0就看不到了，依然可以播放音乐
```

![](http://i.imgur.com/Y60twn8.png)

![](http://i.imgur.com/i42cvBI.png)

##  代码高亮highlight.js支持

[highlightjs官网](https://highlightjs.org/)

[highlightjs主题风格](https://highlightjs.org/static/demo/)



## 其他

[Hexo，Yilia主题添加站内搜索功能](http://www.yehbeats.com/2015/04/08/hexo-search/)

[为Hexo博客添加目录](http://kuangqi.me/tricks/enable-table-of-contents-on-hexo/)

[Hexo站点中添加文章目录以及归档](http://www.ituring.com.cn/article/199624)

[使用LeanCloud平台为Hexo博客添加文章浏览量统计组件](http://crescentmoon.info/2014/12/11/popular-widget/)

[使用hexo搭建静态博客](http://www.tuicool.com/articles/ABFn2qU)

[Hexo Docs中文 ： （二）基本用法](http://www.ituring.com.cn/article/199035?utm_source=tuicool&utm_medium=referral)

