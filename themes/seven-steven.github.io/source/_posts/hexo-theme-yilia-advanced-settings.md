---
title: Hexo Yilia主题进阶配置
categories: coding
<!-- toc: true -->
tags:
  - Hexo
  - Yilia
abbrlink: 51599
date: 2017-08-21 11:36:30
---
### 添加评论功能
Hexo生成的博客只是一个静态页面，想要添加评论功能，就要借助第三方平台。
Yilia支持的平台有多说，网易云跟帖，畅言和Disqus。但是截至今日，多说和网易云跟帖都已关闭，无法使用。Disqus是国外的系统，由于各种你懂的原因，在国内是使用不了的。所以我们的选择就只剩下[畅言](http://changyan.kuaizhan.com)。
畅言是搜狐提供的评论组件，功能丰富，体验优异。但必须进行域名备案。因为我们服务端使用的是Github Page，然而Github并没有提供备案服务。所以域名可以在其他IDC备案，备案成功后再解析到Github，亲测可以通过畅言审核。
但是这样做有一个很大的弊端，就是自己的备案随时有可能被管局注销。个中利弊，还需自己权衡。
有了已经备案的域名，畅言的配置就相当简单。
<!-- more -->
首先，我们要注册[畅言](http://changyan.kuaizhan.com)。注册的流程很简单，这里不作过多解释。
注册完成后，我们会得到一个 APP ID 和 APP KEY，如图：
![畅言密钥](https://qiniu.diqigan.cn/17-8-23/18834121.jpg)
分别将这两个值复制并粘贴到主题配置文件**{your_hexo_path}/themes/yilia/_config.yml**中的畅言配置部分：
```
#3、畅言
changyan_appid: '你的畅言APP ID'
changyan_conf: '你的畅言APP KEY'
```
保存配置文件并重新生成网页，你就会发现每篇文章后面都多出了畅言评论功能。
![畅言评论](https://qiniu.diqigan.cn/17-8-23/96016850.jpg)
但此时畅言评论的表情按钮不可用，原因是表情部分被左侧的div层覆盖了，这个问题也很容易解决。
找到**{your_hexo_path}/themes/yilia/layout/_partial/post/changyan.ejs**文件，将第一行代码：
```
<div id="SOHUCS" sid="<%=key%>"></div> 
```
修改为：
```
<div id="SOHUCS" sid="<%=key%>" style="padding: 0px 30px 0px 46px!important;"></div> 
```
再次重新生成并构建网页，你会发现评论功能已经可以完美使用了。

### 添加RSS
> [RSS](https://zh.wikipedia.org/wiki/RSS)（简易信息聚合）是一种消息来源格式规范，用以聚合经常发布更新数据的网站，例如博客文章、新闻、音频或视频的网摘。RSS文件（或称做摘要、网络摘要、或频更新，提供到频道）包含全文或是节录的文字，再加上发布者所订阅之网摘数据和授权的元数据。     ———— 维基百科

关于RSS的作用参见：[如何使用RSS](http://www.ruanyifeng.com/blog/2006/01/rss.html)
* 在Hexo根目录打开命令行工具，执行以下命令：
```
npm install hexo-generator-feed --sava
hexo clean
hexo g

```
* 查看`{your_hexo_path}/public`文件夹，可以看到**atom.xml**文件。
* 打开主题配置文件`{your_hexo_path}/themes/yilia/config.yml`，在`subnav`项目下添加RSS配置信息：
```
# SubNav
subnav:
  rss: /atom.xml
```
* 重新生成并构建页面，就可以看到RSS的信息了。

### 添加sitemap
* 在Hexo根目录打开命令行工具，执行以下命令：
```
npm install hexo-generator-sitemap --save
hexo clean
hexo g

```
* 查看`{your_hexo_path}/public`文件夹，可以看到**sitmap.xml**文件。
sitemap的初衷是给搜索引擎看的，为了提高搜索引擎对自己站点的收录效果，我们最好手动到google和百度等搜索引擎提交sitemap.xml。

<!-- ### 4. 添加“关于”
`hexo new page "about"`
编辑hexo/source/about/index.md，
编辑hexo/themes/yilia/_config.yml，添加如下：
```
menu:
  关于: /about
``` -->
### 参考文献
* [Hexo博客yilia主题更换畅言评论系统](http://www.luck666.cn/2017/03/22/hexo-yilia-changyan/) ———— Vincent
* [hexo主题优化](http://www.voidking.com/2015/05/31/deve-hexo-theme-optimize/) ———— VoidKing
