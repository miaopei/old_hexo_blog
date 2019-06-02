---
title: 使用 jenkins 完成 maven 项目自动化部署及回滚
hide: false
categories:
  - coding
toc: true
tags:
  - jenkins
  - maven
  - java
  - 自动化
abbrlink: 19941
date: 2018-08-20 10:43:39
---

### 前言

#### Jenkins 简介

> Jenkins is a self-contained, open source automation server which can be used to automate all sorts of tasks related to building, testing, and delivering or deploying software.
>
> Jenkins can be installed through native system packages, Docker, or even run standalone by any machine with a Java Runtime Environment (JRE) installed.
>
>                                                           													------ [jenkins.io](https://jenkins.io/doc/) 

Jenkins 是一个独立开源的自动化服务, 可以用来对软件进行自动化构建, 测试, 发布, 部署等操作. Jenkins 可以通过软件包管理器, Docker 安装, 或者在任意一台安装了 JRE 的机器上独立运行. 

**按照我的理解, jenkins 其实就是一个线性的指令集, 它所做的事情就是按照我们设置的流水线完成一些重复性的工作. jenkins 只是负责管理流水线的运行与否以及状态监控 , 在流水线各个节点上的任务依然需要由专业的 "工人" 去完成, 扮演 "工人" 角色的就是 jenkins 插件以及我们日常使用的诸如 Git, maven 等第三方工具. jenkins 根据预先设计好的指令调用第三方工具完成该部分的功能并监控其执行状态, 一个节点执行成功, 便跳转到下一个节点继续执行, 直到运行完流水线上的所有节点. 如果不巧有任意一个节点执行失败, jenkins 便会捕获异常状态并终止流水线的执行.**  

本文主要介绍如何使用 Jenkins 对 maven 项目进行自动化构建, 部署, 备份以及回滚操作.
<!-- more -->

### 环境搭建

#### 测试环境介绍:

我本地的测试环境罗列如下: 

```markdown
OS: Ubuntu Desktop 18.04.1 LTS
git: 2.17.1
jdk: 1.8.0.171
maven: 3.5.2
tomcat: 8.5.32
jenkins: 2.121.3
```

其中: OS, JDK, maven 的搭建我不再赘述, 这里主要说一下 jenkins 的安装及使用.

#### 测试本地环境

前面我们提到 jenkins 只是负责流水线的调度与监控工作, 具体每个节点的功能需要由插件、shell 或者第三方工具去完成. 所以, 在尝试 jenkins 之前, 我们需要确保这些第三方工具能够正常运行. 

##### 测试 git

这里不多说了吧, 确认一下你的电脑是可以从 git 服务器上面拉下代码的.

##### 测试 maven

已经把项目拉下来了? 嗯, 我们来测试一下手动构建是否能正常运行.

进入到项目所在目录, 执行 maven 构建命令, 构建命令因人而异, 我这里是: 

```shell
mvn clean package -f pom-war.xml -DskipTests
```

构建成功了? 完美!  失败的话....... 嘿嘿, 自己找原因去吧.

##### 测试 tomcat

maven 构建成功后, 你可以尝试手动把项目部署到 tomcat 并测试项目是否能正常运行, 如果一切无误, 就可以开始后面的步骤啦. 

#### Jenkins 安装

下载地址: [Jenkins | Download](https://jenkins.io/download/) 

可以挑选适合自己系统的版本进行下载, 本文使用的是 `.war` 包.

##### 通过 jre 运行

Jenkins 安装有很多种方式, 其中最简单的莫过于直接用 jre 运行 `jenkins.war` 文件. 

运行命令: 

```shell
java -jar jenkins.war
```

通过上面的命令运行 jenkins 默认使用 8080 端口, 如果需要修改端口, 可以通过指定 `HttpPort` 参数实现:

```shell
java -jar jenkins.war --httpPort=8081
```

首次运行 jenkins 系统会自动生成管理员密码:

![首次运行 jenkins](https://qiniu.diqigan.cn/18-8-20/34932006.jpg)

可以在上图位置直接复制, 也可以在 `~/.jenkins/secrets/initialAdminPassword` 文件中得到.

在浏览器输入 `localhost:8081` 即可进入 jenkins 后台界面: 

![解锁 jenkins](https://qiniu.diqigan.cn/18-8-20/54829612.jpg)

提示 "解锁 jenkins", 输入刚才得到的密码即可登录成功.

![安装插件](https://qiniu.diqigan.cn/18-8-20/64293848.jpg)

选择 "安装推荐的插件", 等待插件安装完成. 如果这一步有插件安装失败, 可以选择重试, 也可以先跳过, 等到需要这些插件的时候再手动安装. 

创建一个管理员用户, 这里不用我说了, 输入相应的信息即可. 

接着是 "Instance Configuration" 页面, 用于配置 jenkins url, 因为 jenkins 不允许设置 localhost, 这一步选择 "not now":

![Instance configuration](https://qiniu.diqigan.cn/18-8-20/61001579.jpg)

到此, Jenkins 安装完成, 点击 "开始使用 Jenkins", 开启新世界的大门吧! 

##### 通过 Tomcat 运行

Jenkins 也可以直接通过 tomcat 运行, 将 `jenkins.war` 文件放到 tomcat 的 `webapps` 目录下, 然后访问 `localhost:8080/jenkins` 即可, 初始化流程同上. 

### 使用 jenkins

#### 查看日志

想了一下, 还是决定把这段本应写在最后的段落提到了开头. 毕竟, debug 最重要的步骤就是看日志, isn't it? 

这一段先不必理解, 真正遇到问题了再回来看不迟. 

可以在工程页面点击对应的构建历史号查看构建信息.

![buildNumber](https://qiniu.diqigan.cn/18-8-20/80438785.jpg)

然后点击构建历史页面的 "控制台输出" 按钮查看控制台信息: 

![buildHistory](https://qiniu.diqigan.cn/18-8-20/20544218.jpg)

"控制台输出" 界面如下: 

![consoles](https://qiniu.diqigan.cn/18-8-20/65546601.jpg)

#### 拉取项目

现在, 你可以正式开始接触 jenkins 了.

1. 点击 "开始创建一个新任务";

2. 需要输入一个任务名称, 选择 "构建一个自由风格的软件项目", 点击确定.

3. 在 "源码管理" 栏目选择 "Git":

   ![git configuration](https://qiniu.diqigan.cn/18-8-20/94289250.jpg)

   - "Repository URL" 填入你的 git 仓库地址;

   - "Credentials" 是 git 仓库的认证证书:

     点击 "Add" - "jenkins" 添加凭证:

     - 如果你是使用用户名密码形式验证, 凭据类型选择 "Username with password", 然后填入 "username" 和 "password" 即可;
     - 如果你是使用 ssh 形式验证, 凭据类型选择 "SSH Username with private key", 写入 "username", 选中 "Private Key" 下的 "Enter directly", 然后在弹出的 "Key" 输入框中填入自己的 RSA**私钥**; 

   - "Branches Specifier" 中填入你要拉取的 git 分支.

4. 点击保存, 在对应的工程页面选择 "立即构建", 页面左下角就会开始执行构建任务, 因为我们只配了工程的 "源码管理", 所以此次构建任务只是从 git 服务器拉回代码而已, 不出意外的话, 此次构建会执行成功(毕竟我们之前已经测试过 git 了).

5. 执行成功之后, 你可以在 `.jenkins/workspace/${projectName}` 下看到拉取到本地的代码.

#### 构建预处理

有时候我们的开发环境和生产环境是不一样的, 项目发布前需要更改数据库配置等等参数, 我们可以使用 shell 脚本直接替换对应配置文本. 考虑到直接使用 shell 脚本作文本替换的可维护性不强, 我自己选择了先改好这部分需要配置的文件, 然后在项目构建前使用 shell 脚本直接替换文件, 这样处理的话如果以后配置文件需要再次修改的话, 便不需要更改 shell 脚本, 修改替换文件内容即可. 

如图:

![pre_build](https://qiniu.diqigan.cn/18-8-20/26459172.jpg)

#### 自动化构建

在 jenkins 中选中自己建立的工程, 然后点击左侧菜单栏中的 "配置" 菜单, 即可进入工程配置页面.

![project page](https://qiniu.diqigan.cn/18-8-20/62944768.jpg)

在配置页面选择 "构建" - "增加构建步骤" - "调用顶层 Maven 目标", "目标" 文本框中写入自己的构建命令, 如我的构建命令是:

```shell
mvn clean package -f pom-war.xml -DskipTests
```

那么我需要在 "目标" 文本框中填写:

```shell
clean package -f pom-war.xml -DskipTests
```

如果你有修改过 maven 配置, 点击下面的 "高级" 选项, 在 "配置文件" 或者 "全局配置文件" 中写入自己的配置文件路径即可.

点击保存, 再试一下 "立即构建", 构建完成后, 你可以在 `.jenkins/workspace/${projectName}/target/` 下看到构建生成的 .war 文件.

#### 处理构建结果

一些情况下我们需要处理构建结果, 比如我这里需要对 `.war` 文件进行重命名.

在工程配置页面选择 "构建" - "增加构建步骤" - "执行 shell" , 在命令一栏中写入:

```shell
mv target/reg-core-1.0.0.war.original target/reg-core.war
```

保存, 立即构建, 可以在工程目录看到重命名之后的结果.

#### 自动化部署

构建完成了, 接下来我们看一下怎么部署. 

1. 首先我们要配置一下 tomcat:

   编辑 tomcat 安装目录下的 `conf/tomcat-users.xml` 文件, 在 `<tomcat-users>` 和 `</tomcat-users>` 之间添加以下内容:

   ```json
   <role rolename="manager-gui"></role>
   <role rolename="manager-script"></role>
   <!-- 记住下面的用户名密码 -->
   <user username="username" password="password" roles="manager-gui,manager-script"/>
   ```

   将上面的 `username` 和 `password` 设置为自己的用户名密码.

   重启 tomcat.

2. 在 jenkins 安装 "Deploy to container" 插件:

   返回 jenkins 首页, 选择 "系统管理" - "管理插件" - "可选插件", 在 "过滤" 输入框输入 "Deploy to container", 选择对应的插件, 点击 "直接安装", 在插件安装界面勾选 "安装完成后重启 jenkins". 等待 jenkins 重启.

3. 配置 jenkins 自动化部署

   再次进入工程配置页面, 选择 "构建后操作" - "增加构建后操作步骤" - "Deploy war/ear to a container". 

   - "WAR/EAR files" 栏写入自己的 `.war` 文件路径, 我这里写的是 `target/reg-core.war`;
   - "Context path" 是指在 tomcat webapps 目录中的上下文路径, 此处留空即可;
   - "Containers" 栏选择 "Tomcat 8.x", 点击 "Credentials" 右边的 "Add" - "jenkins":
     - 类型选择 "Username with password";
     - "Username" 写入自己刚才配置的 tomcat 用户名;
     - "Password" 写入自己刚才配置的 tomcat 密码;
     - 保存.
   - "Credentials" 选择自己刚才添加的 tomcat 凭证;
   - "Tomcat URL" 写入自己的 tomcat 地址, 一般是 `http://localhost:8080`.
   - 保存.

   再次点击 "立即构建", 查看执行结果. 如果执行成功, 那么恭喜你, 你已经掌握了 jenkins 自动化部署的基础操作. 

#### 项目回滚

jenkins 自带的 maven 构建功能不足以完成项目回滚操作, 所以这里我们要借助 shell 脚本完成此部分功能. 

##### 添加构建参数

进入到工程配置页面, 在 "General" 选项卡下选中 "参数化构建" - "添加参数" - "选项参数"; 再选择 "添加参数" - "文本参数", 填写下图所示内容:

![参数化构建](https://qiniu.diqigan.cn/18-8-20/75808974.jpg)

这里的参数会被当作环境变量暴露给构建任务, 以便我们在构建任务脚本中确定要执行的操作. 

"选项参数" 用于区分本次操作是 "发布" 还是 "回滚";

"文本参数" 用于确定要回滚到哪个版本;

##### 编写构建 shell

删除 "构建" 选项卡中原有的构建步骤, 完善自己的 "预处理构建任务", 然后点击 "增加构建步骤" - "执行 shell", 在 "命令" 文本框中写入自己的构建脚本, eg:

```shell
case $action in
  # 如果当前 $action 为 `deploy`, 执行构建动作
  deploy)
    echo "action: $action"
    cd ${WORKSPACE}
    # 使用 maven 构建项目
    echo "Begining build project with maven..."
    mvn clean package -f pom-war.xml -DskipTests
    # 重命名 .war 文件
    echo "rename file reg-core-1.0.0.war.original to reg-core.war"
    mv target/reg-core-1.0.0.war.original target/reg-core.war
    # 备份文件
    # 定义备份文件夹
    backup="${WORKSPACE}/backup"
    ## 如果备份路径不存在, 新建备份路径
    if [ ! -d $backup ] ; then
      echo "create backup directory..."
      mkdir $backup -p
    fi
    # 备份文件到备份 backup 目录
    echo "backup reg-core.war..."
    cp target/reg-core.war backup/${BUILD_NUMBER}.war -f
    echo "Completion!"
    ;;
  # 如果当前 $action 为 `rollback`, 执行回滚动作 
  rollback)
    echo "action: $action"
    echo "version: $buildNumber"
    # 定义回滚文件
    rollbackFile="${WORKSPACE}/backup/$buildNumber.war"
    # 判断回滚文件是否存在
    if [ ! -f $rollbackFile ]; then
      echo "Error: rollbackFile doesn't exist!"
      # 返回异常状态
      return -1
    else
      echo "copy backup file..."
      cp $rollbackFile ${WORKSPACE}/target/reg-core.war
      # 因为 jenkins 会为回滚操作分配 builde_number, 但实际上我们没有构建项目, 此处创建软链指向恢复的节点
      echo "creating soft link..."
      ln -s $rollbackFile ${WORKSPACE}/backup/${BUILD_NUMBER}.war
      echo "SUCCESS!"
    fi
    ;;
  *)
    exit
    ;;
esac
```

实例 shell 中有详细的注释, 不再讲解, 这里提一下需要注意的地方:

- 命令文本框下有一个链接 "可用的环境变量列表", 这里提供了一些内置的环境变量, 可以在 shell 脚本中使用;
- 适量的 `echo` 可以使 debug 更加简单.

点击 "保存", 会看到工程配置页面的 "立即构建" 按钮变成了 "Build with Parameters", 点击该按钮, 会进入到工程构建页面. 

页面中的 "action" 选项卡使我们刚才添加的选项参数, 选择不同的参数, 会执行不同的流程;

- 选择 "deploy", 忽略文本参数 "bulidNumber", 执行构建过程;
- 选择 "rollback" 并填写 "buildNumber" 参数, 会回滚到 "buildNumber" 指定的版本.

![参数化构建](https://qiniu.diqigan.cn/18-8-20/85167827.jpg)

#### 从 git 服务器拉取指定 tag

从 git 服务器拉取指定 tag 的方法有很多, 这里简单介绍一下我觉得比较好用的方法:

首先我们需要安装插件 [Git Parameter Plug-In](http://updates.jenkins-ci.org/download/plugins/git-parameter/) , 在 "系统管理" - "管理插件" - "可选插件" 界面搜索 "Git Parameter Plug-In", 在搜索结果中点击安装即可. 插件安装完成之后需要重启 jenkins.

插件安装完成之后, 进入到项目配置页面, 在 "General" - "参数化构建过程" - "添加参数" 中选择 "Git Parameter", 填写对应参数, 其中:

* Name 参数是参数化构建页面会显示的变量名;
* Description 参数是描述信息;
* Parameter Type 参数按照自己的需要选择.

图示如下: 

![构建参数](https://qiniu.diqigan.cn/18-8-23/55734129.jpg) 

配置完成后点击 "保存", 在 "Build with Parameters" 页面会看到 "git_tags" 选项, 选择对应的 tag 即可部署对应版本. 

![参数化构建页面](https://qiniu.diqigan.cn/18-8-23/15302630.jpg)



### 后记

初识 Jenkins, 觉得确实好用, 所以写了这篇文章, 算是对自己这两天探索的总结, 也希望能够帮到有需要的人. 
作者算是 java 菜鸟, 知识体系尚不完整, 文中总结难免纰漏, 如有表述不当之处, 还请大佬不吝赐教. 

### 参考文献

1. [ jenkins发布回滚流程](https://blog.csdn.net/leo15561050003/article/details/79818176) ------- aaron是我啊
2. [使用jenkins进行项目的自动构建部署](https://www.jianshu.com/p/dceaa1c7bb49) ------- 寻梦的尕柳
3. [Jenkins获取git tags代码](https://blog.csdn.net/workdsz/article/details/77936256) ------- workdsz



<!--

[jenkins git 每次发布自动打tag方便备份回滚](https://www.iyunw.cn/archives/jenkins-git-mei-ci-fa-bu-zi-dong-da-tag-fang-bian-bei-fen-hui-gun/) ------- admin

 -->