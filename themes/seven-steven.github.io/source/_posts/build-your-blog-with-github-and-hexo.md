---
title: 使用 GitHub + Hexo 搭建个人博客
categories: coding
toc: true
tags:
  - Hexo
  - 博客
abbrlink: 17995
date: 2017-08-19 19:37:45
---
### 前言
很早之前就想搭建一个个人博客，一是作为笔记，记录自己学习路线上的各种心得；二是作为一个平台，帮助更多的人解决难题。但这个计划一直被搁浅，一方面是不想寄居于其他博客平台之下，具有轻微强迫症的我始终觉得自己的数据要攥在自己手里才够安全；另一方面，也确实是一直没有找到合适的博客程序，要么是功能繁杂，累赘不堪，要么是过度简单，平庸无奇。直到几天前看到了[Litten的博客](http://litten.me/)，我的心中才下定决心：嗯，这就是我想要的博客。于是在网上查阅各种资料，终于完成了自己的小心愿。瑾于此、记录下自己的建博历程，希望可以帮到其他和我有一样需求的人们。
![Litten的博客](https://qiniu.diqigan.cn/17-8-19/99518235.jpg)
<!-- more -->

### 背景知识
* #### 什么是Hexo？
> Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。      ———— [Hexo官方文档](https://hexo.io/zh-cn/docs/index.html)

* #### Github
 作为世界上最大的代码存放网站的开源社区，[Github](https://github.com/)的介绍我就不再赘述。
***
现在，我们开始动手搭建博客。

### 申请域名
域名是网站的唯一名称，如果想要别人记住你的网站，一个独特的域名是必不可少的。
国内比较好的域名注册商有：[易名](http://www.ename.net/)，[阿里云](https://wanwang.aliyun.com/domain/?spm=5176.8142029.388261.213.RYhs95)，[腾讯云](https://dnspod.qcloud.com/)等等，网络上也有一些免费的域名如[Dot TK](http://www.dot.tk/zh/index.html)等。
当然，如果你已经拥有了自己的空闲域名，直接使用即可。

### GitHub创建个人仓库
注册并登录[GitHub](https://github.com/)，点击GitHub中的New reository创建新仓库，仓库名应该为：**username**.github.io，这个**username**使用你的GitHub帐号名称代替，这是固定写法，比如我的仓库名为：diqigan777.github.io。

### 安装Git
从Git官网下载适合版本的Git并安装：[Git - Downloads](https://git-scm.com/downloads),安装成功后，需要将你的Git与GitHub账号绑定。

鼠标右键打开Git Bash

![Git Bash](https://qiniu.diqigan.cn/17-8-20/21283511.jpg)

设置user.name和user.email配置信息
```
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub注册邮箱"
```

生成ssh密钥文件：
```
ssh-keygen -t rsa -C "你的GitHub注册邮箱"
```

然后直接三个回车即可，默认不需要设置密码
然后找到生成的.ssh的文件夹中的id_rsa.pub密钥，将内容全部复制

![id_rsa.pub](https://qiniu.diqigan.cn/17-8-20/34806629.jpg)

打开[GitHub_Settings_keys](http://link.zhihu.com/?target=https%3A//github.com/settings/keys)页面，新建new SSH Key

![new SSH Key](https://qiniu.diqigan.cn/17-8-20/67683572.jpg)

Title为标题，任意填即可，将刚刚复制的id_rsa.pub内容粘贴进去，最后点击Add SSH key。

在Git Bash中检测GitHub公钥设置是否成功，输入 `ssh git@github.com`:

![GitHub公钥检验](https://qiniu.diqigan.cn/17-8-20/55411101.jpg)

显示如上则表示成功。
> 这里之所以设置GitHub密钥原因是，通过非对称加密的公钥与私钥来完成加密，公钥放置在GitHub上，私钥放置在自己的电脑里。GitHub要求每次推送代码都是合法用户，所以每次推送都需要输入账号密码验证推送用户是否是合法用户，为了省去每次输入密码的步骤，采用了ssh，当你推送的时候，git就会匹配你的私钥跟GitHub上面的公钥是否是配对的，若是匹配就认为你是合法用户，则允许推送。这样可以保证每次的推送都是正确合法的。

### 安装Node.js
Hexo基于Node.js，所以搭建Hexo之前，我们要先安装Node.js。

Node.js下载地址：[Download | Node.js](https://nodejs.org/en/download/)

![Node.js下载页面](https://qiniu.diqigan.cn/17-8-19/7130763.jpg)

我自己的电脑是Windows 10 64位，所以下载了Windows Binary(.zip)。下载完成后，直接将zip压缩包解压至合适目录，并将该目录添加进Windows环境变量。
环境变量设置方法：[Windows10 设置环境变量PATH](http://jingyan.baidu.com/article/8ebacdf02d3c2949f65cd5d0.html)
完成后，检测Node.js以及npm是否安装成功。

在命令行输入：`node -v`，显示当前Node.js版本号，表示安装成功。
![Node.js版本](https://qiniu.diqigan.cn/17-8-19/74271299.jpg)

在命令行输入：`npm -v`，显示当前npm版本号，表示npm安装成功。
![npm版本](https://qiniu.diqigan.cn/17-8-19/52440828.jpg)

至此，Hexo的需要的环境已经全部搭建完成。

npm 默认源速度奇慢, 可以使用如下命令将其更改为淘宝源:

```shell
npm config set registry https://registry.npm.taobao.org --global
npm config set disturl https://npm.taobao.org/dist --global
```

### 安装Hexo
Hexo就是我们的个人博客网站的框架， 这里需要自己在电脑常里创建一个文件夹，可以命名为Hexo，Hexo框架与以后你自己发布的网页都在这个文件夹中。创建好后，进入文件夹中，鼠标右击，打开Git Bash

使用npm命令安装Hexo，输入：
`npm install -g hexo-cli`

安装完成后，初始化我们的博客，输入：
`Hexo init`
*注意！这些命令都是在刚刚创建的Hexo文件夹下执行的。*

为了检测博客雏形，分别输入以下三条命令：
```
hexo new "Test"     # 新建一篇名为Test的博文
hexo g              # 生成网页
hexo s              # 启动服务预览
```

执行完毕后，在浏览器输入地址：`localhost：4000`即可看到我们博客的趋型。
*注意！若访问以上网址提示404错误，只需在Git Bash终端输入`ctrl + c`终止预览，
然后输入`Hexo s -p 端口号`*更换一个新的端口即可。

现在来介绍常用的Hexo 命令

npm install hexo -g #安装Hexo
npm update hexo -g #升级 
hexo init #初始化博客

命令简写
hexo n "我的博客" == hexo new "我的博客" #新建文章
hexo g == hexo generate #生成
hexo s == hexo server #启动服务预览
hexo d == hexo deploy #部署

hexo server #Hexo会监视文件变动并自动更新，无须重启服务器
hexo server -s #静态模式
hexo server -p 5000 #更改端口
hexo server -i 192.168.1.1 #自定义 IP
hexo clean #清除缓存，若是网页正常情况下可以忽略这条命令

### 推送网站
刚才我们已经可以在本地主机预览自己的网站，但是如果想要更多的人可以看到我们的博客，就需要将我们的网站推送到诸如GitHub这样的服务器。

在Hexo的根目录里，有一个名为**_config.yml**的文件，称为**站点配置文件**。
Hexo根目录下Themes文件夹下对应的每个主题文件夹中，也有一个名为**_config.yml**的文件，称为**主题配置文件**。

推送站点之前，需要将我们的Hexo和GitHub关联起来。
打开站点的配置文件**_config.yml**，将文件最后几行代码修改为：
```
deploy: 
type: git
repo: 这里填入你之前在GitHub上创建仓库的完整路径，记得加上 .git
branch: master
```
参考如下：
![deploy配置](https://qiniu.diqigan.cn/17-8-20/88627852.jpg)

其实就是给`hexo d`这个命令做相应的配置，让Hexo知道你要把博客部署在哪个位置，很显然，我们部署在我们GitHub的仓库里。
最后安装Git部署插件，输入命令：
```
npm install hexo-deployer-git --save
```

这时，分别输入三条命令：
```
hexo clean      # 清除缓存
hexo g          # 生成网页
hexo d          # 部署网站
```
完成后，打开浏览器，在地址栏输入你放置个人网站的仓库路径，即 [**username**.github.io](diqigan.github.io),其中，**username**需要替换为你自己的GitHub用户名。
此时，你就会发现你的博客已经可以在互联网上被访问了。

### 绑定域名
虽然我们的的博客已经可以在互联网上被访问，但网址是GitHub提供的二级域名 [**username**.github.io](diqigan.github.io),不方便记忆。此时、我们就需要绑定自己的域名。
* 解析域名
我这里使用的是[DNSPod](https://www.dnspod.cn/)，其他域名解析平台同理。
最简单的方法是添加一条CNAME记录：
![CNAME记录](https://qiniu.diqigan.cn/17-8-20/94760479.jpg)
主机记录是指域名前缀，按需求填写，@表示直接解析主域名；
记录类型选CNAME，表示别名解析；
记录值写自己的放置网站的仓库路径，也就是[**username**.github.io](diqigan.github.io)；
其他项保持默认即可。
* 修改GitHub设定
只在域名商处修改CNAME后，输入你设定的域名是会被导到你的Github pages页面没错，不过由于你的这个域名Github不知道，Github就会高冷地给你返回了一个404。其实Github很听话，你只要老实告诉它你的“新名字”就好了。
在{your_hexo_folder}/source/下，创建一个名字为CNAME的文件，内容即是你的个人域名。
```
diqigan.cn
```
保存文件，然后执行以下代码：
```
hexo g
hexo d
```
再次打开浏览器，输入自己的域名，你会发现自己已经可以通过自己的域名访问GitHub上自己的博客了。
### 更换主题
如果你不喜欢Hexo默认的主题，可以更换不同的主题。[Themes | Hexo](https://hexo.io/themes/)，我自己比较喜欢的是Litten的[Yilia](https://github.com/litten/hexo-theme-yilia)主题。
在Hexo目录下打开命令行，输入：
```
$ git clone https://github.com/litten/hexo-theme-yilia.git themes/yilia
```
修改Hexo目录下的站点配置文件**_config.yml**,将**theme**项修改为**yilia**。
然后进入主题文件夹Themes/yilia下，修改主题配置文件**_config.yml**。
配置文件里面注释写得很清楚，这里不再赘述。
*这里说一点，头像文件可以放在**Source**文件夹下，然后主题配置文件里的路径是从这里开始的。
比如我的目录结构是这样：
![头像目录](https://qiniu.diqigan.cn/17-8-20/37128785.jpg)
主题配置文件这样写：
```
#你的头像url
avatar: /pictures/personal/avatar.png
```
*

### 个性化设置
所谓的个性化设置就是根据个人需要添加不同的插件及功能。
基本的有：
在站点配置文件**_config.yml**修改基本的站点信息
```
# Site
title: Seven's blog
subtitle: 你不会找到路，除非你敢于迷路
description: Seven's Blog
author: Seven
email: 903481591@qq.com
language: zh-hans
timezone: Asia/Shanghai
```
依次是网站标题、副标题、网站描述、作者、网站头像外部链接、网站语言、时区等。

在主题配置文件**_config.yml**修改基本的主题信息，如：
博文打赏的微信、支付宝二维码图片等，以及社交外链的设置，即在侧栏展示你的个人社交网站信息。
我这里只完善了GitHub和邮箱信息：
```
subnav:
  github: "https://github.com/diqigan777"
  mail: "mailto:903481591@qq.com"
```
其他个性化设置可自行研究。

### 初识Markdown
> Markdown实际上是个非常简单、非常容易学习的语法。这个语法简单到每个人都可以在5分钟以内学会。应该是为数不多，你真的可以彻底学会的语言。
更重要的是，Markdown语法所有要素，是与写作的习惯一脉相承的，套用句俗语：仅为写作而生。

> 我们总结 Markdown 的优点如下：
* 纯文本，所以兼容性极强，可以用所有文本编辑器打开。
* 让你专注于文字而不是排版。
* 格式转换方便，Markdown 的文本你可以轻松转换为 html、电子书等。
* Markdown 的标记语法有极好的可读性。

关于Markdown的入门推荐参阅这篇文章：[献给写作者的 Markdown 新手指南](http://www.jianshu.com/p/q81RER)
Markdown的详细语法和参考：[Markdown 语法说明 (简体中文版)](http://wowubuntu.com/markdown/)

关于Markdown的编辑器，个人推荐使用[sublime text3](https://www.sublimetext.com/) + [MarkdownEditing](https://github.com/SublimeText-Markdown/MarkdownEditing)插件 + [OmniMarkupPreviewer](https://github.com/timonwong/OmniMarkupPreviewer)插件。
这两款插件的安装及使用参见：[介绍Sublime3下两款Markdown插件](http://www.jianshu.com/p/335b7d1be39e)
MarkdownEditing的快捷键参见：[MarkdownEditing快捷键](https://github.com/SublimeText-Markdown/MarkdownEditing#key-bindings)
*如果OmniMarkupPreviewer预览报404错误，参见：[关于OmniMarkupPreviewer 404
](http://www.jianshu.com/p/d8367fec0edf)*



### 删除博文
测试Hexo的时候我们创建了一篇测试文章“Test”，现在是删除它的时候了。
删除Hexo/source/_posts文件夹下的Test.md文件，
执行以下命令更新博客：
```
hexo g == hexo generate     #生成
hexo s == hexo server       #启动服务预览
hexo d == hexo deploy       #部署
```
博文就被删除了。
### 发布文章
在命令行输入：
```
hexo n "博客名字"   #新建文章
```
我们就会发现Hexo/source/_post文件夹下多了一个 **博客名字.md**文件，使用Markdown编辑器打开，就可以编辑我们自己的博客了。
这里是我的一篇博文示例：
![这里是我的一篇博文示例](https://qiniu.diqigan.cn/17-8-20/50020961.jpg)
编辑过程中可以通过**OmniMarkupPreviewer**插件实时预览，也可以通过命令`Hexo s`在本地浏览器预览博文效果。
编辑完成后，执行命令：
```
hexo g      #生成网页
hexo d      #部署网页
```
生成并部署网页，随后在浏览器中输入域名浏览。
### 使用图床
> 当博文中有图片时，若是少量图片，可以直接把图片存放在source文件夹中，但这显然不合理的，因为图片会占据大量的存储的空间，加载的时候相对缓慢 ，这时考虑把博文里的图片上传到某一网站，然后获得外部链接，使用Markdown语法，**!\[图片信息\](外部链接)** 完成图片的插入，这种网站就被成为图床。

我自己使用的是[极简图床](http://jiantuku.com) + [七牛云](http://link.zhihu.com/?target=https%3A//www.qiniu.com/)。
极简图床支持截图粘贴，拖拽粘贴，而且上传图片后会自动生成Markdown格式的图片链接，用户体验上佳；
七牛云是国内领先的云存储服务商，为普通用户提供了10G的免费空间，图片放在这里相对放心。
具体设置方法参见：[极简图床 + 七牛云设置方法](http://jiantuku.com/help/faq.html?src=settings_head)

### 截断显示
到这里，我们基本上可以写一篇图文并茂的文章了。但是如果文章篇幅过长，你会发现一个问题：博客首页文章列表的所有文章都是全文显示。诶？说好的截断呢？主题配置文件**_config.yml**里面明明有截断文章选项，为什么不起作用？
![截断配置](https://qiniu.diqigan.cn/17-8-20/30181873.jpg)
不用担心，这个配置是没问题的。此时、你只需要在文章合适位置添加代码：
```
<!-- more -->
```
代码之后的文字就不会显示在首页啦。比如：
![截断标记](https://qiniu.diqigan.cn/17-8-20/7242846.jpg)
现在，是不是方便多了呢？

### 后记
到这里，一个基本的Hexo博客已经建成了。
当然还有一些进阶的设置，包括各种插件的安装以及主题的优化等等。研究通彻之后，我会开另一篇博文来进行介绍。
谢阅！

### 参考文献
* [GitHub+Hexo 搭建个人网站详细教程](https://zhuanlan.zhihu.com/p/26625249) ———— 吴润
* [为部署在Github上的Hexo博客绑定个性域名](http://blog.zfan.me/2015/09/03/%E4%B8%BA%E9%83%A8%E7%BD%B2%E5%9C%A8Github%E4%B8%8A%E7%9A%84Hexo%E5%8D%9A%E5%AE%A2%E7%BB%91%E5%AE%9A%E4%B8%AA%E6%80%A7%E5%9F%9F%E5%90%8D/) ———— 小米飯
* [献给写作者的 Markdown 新手指南](http://www.jianshu.com/p/q81RER) ———— 简书
* [Markdown 语法说明 (简体中文版)](http://wowubuntu.com/markdown/) ———— wowubuntu
* [介绍Sublime3下两款Markdown插件](http://www.jianshu.com/p/335b7d1be39e) ———— chengkai
* [关于OmniMarkupPreviewer 404](http://www.jianshu.com/p/d8367fec0edf) ———— 城西丶
* [npm设置淘宝镜像源](https://www.jianshu.com/p/db55b68497af) ------ 野小火
