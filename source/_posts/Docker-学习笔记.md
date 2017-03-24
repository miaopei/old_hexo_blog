---
title: Docker 学习笔记
date: 2016-12-23 10:14:50
tags: Docker
reward: true
---

# Docker基本命令

### 常用Docker命令

------

<!-- more -->

```bash
# 开启Docker守护进程调试模式
$ sudo docker daemon -D

# 查看Docker信息
$ sudo docker info 

# 停止或者启动Docker
$ sudo service docker stop/start 

# 以命令行模式运行一个容器
$ sudo docker run -i -t ubuntu /bin/bash 

# 给容器命名
$ sudo docker run --name Micheal_container -i -t ubuntu /bin/bash

# 启动或者停止运行的容器
$ sudo docker start/stop Micheal_container 

# 附着到正在运行的容器
$ sudo docker attach Micheal_container 
```

**创建守护式容器**

```bash
$ sudo docker run --name daemon_dave -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"
```

> 上面的docker run 使用了`-d`参数，因此Docker会将容器放到后台运行。

**Docker日志**

```bash
# 获取守护式容器的日志
$ sudo docker logs daemon_dave

# 跟踪守护式容器的日志
$ sudo docker logs -f daemon_dave

# 获取日志的最后10行
$ sudo docker logs --tail 10 daemon_dave 

# 跟踪某个容器的最新日志
$ sudo docker logs --tail 0 -f daemon_dave

# -t 标志为每条日志项加上时间戳
$ sudo docker logs -ft daemon_dave 
```

**Docker日志驱动**

```bash
$ sudo docker run --log-driver="syslog" --name daemon_dave -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"
```

> 使用syslog将会禁用docker logs命令，并且将所有容器的日志输出都重定向到Syslog。

**查看容器内的进程**

```bash
$ sudo docker top daemon_dave
```

**Docker统计信息**

```bash
$ sudo docker stats daemon_dave daemon_kate daemon_clear daemon_sarah
```

> 以上命令可以看到一个守护容器的列表，以及他们的CPU、内存、网络I/O以及存储I/O的性能和指标。这对快速监控一台主机上的一组容器非常有用。

**在容器内部运行进程**

```bash
$ sudo docker exec -d daemon_dave touch /etc/new_config_file
```

> `-d`表示需要运行一个后台进程

```bash
# 在容器内运行交互命令
$ sudo docker exec -t -i daemon_dave /bin/bash 
```

**自动重启容器**

```bash
$ sudo docker run --restart=always --name daemon_dave -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"
```

> `--restart`标志被设置为always。无论容器的退出代码是什么，Docker都会自动重启改容器。除了always，还可以将这个标志设为`on-failure`，这样，只有当容器的退出代码为非0值的时候，才会自动重启。另外，on-failure还接受一个可选的重启次数参数，`--restart=on-failure:5`,Docker会尝试自动重启改容器，最多重启5次。

**深入容器**

```bash
$ sudo docker inspect daemon_dave
```

> docker inspect命令会对容器进行详细的检查，然后返回其配置信息，包括名称、命令、网络配置以及很多有用的数据。可以使用`-f`或者`--format`标志来选定查看结果。

```bash
$ sudo docker inspect --format='{{ .State.Running }}' daemon_dave
```

> 查看多个容器

```bash
$ sudo docker inspect --format '{{.Name}} {{.State.Running}}' daemon_dave Micheal_container
```

**删除容器**
​    

```bash
$ sudo docker rm daemon_dave

# 删除所有容器
$ sudo docker rm `sudo docker ps -a -q`
```

**列出所有镜像**

```bash
$ sudo docker images
```

**拉去镜像**

```bash
$ sudo docker pull ubuntu:16.04
```

**运行一个带标签的Docker镜像**

```bash
$ sudo docker run -i -t --name new_container ubuntu:16.04 /bin/bash
```

**查找镜像**

```bash
$ sudo docker search puppet
```

**构建镜像**

- 使用`docker commit`命令
- 使用`docker build`命令和`Dockerfile`文件

**用Docker的commit命令创建镜像**

```bash
$ sudo docker run -i -t ubuntu /bin/bash

# 接下来安装需要安装的工具，安装完成后exit退出容器, eg：
$ apt-get -yqq update
$ apt-get -y install apache2

# 指定提交修改过的容器的ID（可以通过docker ps -l -q命令得到刚创建的容器的ID）
$ sudo docker commit 4aab3cecb76 micheal/apache2  

# 检查新创建的镜像
sudo docker images micheal/apache2  

# 提交另一个新定制容器
# -m 选项用来指定新创建的镜像的提交信息，-a 用来列出该镜像的作者信息。
$ sudo docker commit -m"A new custom image" -a"Micheal" 4aab3cecb76 micheal/apache2:webserver  
```

**用Dockerfile构建镜像**

Dockerfile文件示例：

```shell
# Vsersion: 0.0.1
FROM ubuntu:16.04
MAINTAINER Micheal "miaopei@baicells.com"
RUN apt-get -yqq update && apt-get -y install nginx
RUN echo 'Hi, I an in your container' > /usr/share/nginx/html/index.html
EXPOSE 80
```

> Dockerfile中的指令会按照顺序从上到下执行，所以根据需要合理安排指令的顺序。
>
> 如果Dockerfile由于某些原因没有正常结束，那么用户得到了一个可以使用的镜像。这对调试非常有帮助：可以基于改镜像运行一个具备交互功能的容器，使用最后创建的镜像对为什么用户指令会失败进行调试。
>
> __每个Dockerfile的第一条指令必须是FROM__,FROM指令指定一个已经存在的镜像，后续指令都将基于该镜像进行，这个镜像被称为基础镜像。
>
> MAINTAINER指令告诉Docker镜像的作者是谁，以及作者的电子邮件。有助于标识镜像的所有者和联系方式。



> 默认情况下，RUN指令会在shell里使用命令包装器`/bin/sh -c`来执行，如果是在一个不支持shell的平台上运行或者不希望在shell中运行（比如避免shell字符串篡改），也可以使用`exec`格式的RUN指令，如下所示：

```shell
RUN [ "apt-get", " install", "-y", "nginx" ]
```

> EXPOSE指令告诉Docker该容器内的应用程序将会使用该容器的指定端口。

**基于Dockerfile构建新镜像**

```bash
$ sudo docker build -t="micheal/static_web" .
$ sudo docker build -t="micheal/static_web:v1" .

# 这里Docker假设在这个Git仓库的根目录下存在Dockerfile文件
$ sudo docker build -t="micheal/static_web:v1" git@github.com:micheal/docker_static_web  

# 忽略Dockerfile的构建缓存
$ sudo docker build --no-cache -t="micheal/static_web" . 
```

**查看镜像**

```bash
# 列出Docker镜像
$ sudo docker images

# 查看镜像每一层，以及创建这些层的Dockerfile指令
$ sudo docker history micheal/static_web 

$ sudo docker run -d -p 80 --name statix_web micheal/static_web nginx -g "daemon off;"
```

> nginx -g "daemon off;",这将以前台的方式启动Nginx。
>
> `-p`标志用来控制Docker在运行时应该公开那些网络端口给外部（宿主机）。运行一个容器时，Docker可以通过两种方式来在宿主机上分配端口。
>
> - Docker可以在宿主机上随机选择一个位于32768 ~ 61000的一个比较大的端口号来映射到容器中的80端口上。
> - 可以在Docker宿主机只指定一个具体的端口号来映射到容器中的80端口上。

**查看Docker端口映射情况**

```bash
$ sudo docker ps -l

# 返回宿主机中映射的端口
$ sudo socker port static_web 80 

# -p会将容器内的80端口绑定到宿主机的8080端口上
$ sudo docker run -d -p 8080:80 --name statix_web micheal/static_web nginx -g "daemon off;" 
```

**Dockerfile指令**

1. CMD

> CMD指令用于指定一个容器启动时要运行的命令。这有点儿类似于RUN指令，只是RUN指令是指定容器镜像被构建时要运行的命令，而CMD是指定容器被启动时要运行的命令。

```bash
CMD ["/bin/bash/", "-l"]
```

1. ENTRYPOINT

> ENTRYPOINT和CMD指令非常类似，我们可在docker run命令行中覆盖CMD指令，而ENTRYPOINT指令提供的命令则不容易在启动容器的时候被覆盖。
>
> 可以组合使用ENTRYPOINT和CMD指令来完成一些巧妙的工作。

```bash
ENTRYPOINT ["/usr/sbin/nginx"]
CMD ["-h"]
```

1. WORKDIR

> WORKDIR指令用来在从镜像创建一个新容器时，在容器内部设置一个工作目录，ENTRYPOINT和/或CMD指定的程序会在这个目录下执行。

```bash
WORKDIR /opt/webapp/db
RUN bundle install
WORKDIR /opt/webapp
ENTRYPOINT ["rackup"]
```

> 可以通过`-w`标志在运行时覆盖工作目录

```bash
$ sudo docker run -ti -w /var/log ubuntu pwd/var/log
```

1. ENV

> ENV指令用来在镜像构建过程中设置环境变量。这些变量会持久保存到从我们镜像创建的任何容器中。

```bash
ENV RVM_PATH /home/rvm
```

> 也可以使用docker run命令行的`-e`标志来传递环境变量。这些环境变量只会在运行时有效。

```bash
$ sudo docker run -ti -e "WEB_PORT=8080" ubuntu env
```

1. USER

> USER指令用来指定该镜像会以什么样的用户身份来运行。我们可以指定用户名或者UID以及组或GID，甚至是两者的组合。

```bash
USER user
USER user:group
USER uid
USER uid:gid
USER user:gid
USER uid:group
```

> 也可以在docker run命令行中通过`-u`标志覆盖该指令指定的值。

1. VOLUME

> VOLUME指令用来向基于镜像创建的容器添加卷。一个卷可以存在于一个或者多个容器内特定的目录，这个目录可以绕过联合文件系统，并提供如下共享数据或者对数据进行持久化的功能。
>
> - 卷可以在容器间共享和重用
> - 一个容器可以不是必须和其他容器共享卷
> - 对卷的修改是立即生效的
> - 对卷的修改不会对更新镜像产生影响
> - 卷会一直存在直到没有任何容器再使用它
>
> 卷功能让我们可以将数据（如源代码）、数据库或者其他内容添加到镜像中而不是将这些内容提交到镜像中，并且允许我们在多个容器间共享这些内容，我们可以利用此功能来测试容器和内部应用程序代码，管理日志，或者处理容器内部的数据库。

```bash
VOLUME ["/opt/project"]
```

> 这条指令将会基于此镜像的任何容器创建一个名为/opt/project的挂载点。
>
> 也可以通过指定数组的方式指定多个卷

```bash
VOLUME ["/opt/project", "/data"]
```

1. ADD

> ADD指令用来将构建环境下的文件和目录复制到镜像中。不能对构建目录或者上下文之外的文件进行ADD操作。

```bash
ADD software.lic /opt/application/software.lic
ADD latest.tar.gz /var/www/wordpress/   //这条指令会将归档文件解开到指定的目录下
```

1. COPY

> COPY指令非常类似ADD，它们根本不同是COPY只关心构建上下文中复制本地文件，而不会去做文件提取（extraction）和解压（decompression）的工作。

```bash
COPY conf.d/ /etc/apache2/
```

1. LABEL

> LABEL指令用于为Docker镜像添加元数据。元数据以键值对的形式展现

```bash
LABEL version="1.0"
LABEL location="New York" type="Data Center" role="Web Server"
```

> 可以使用docker inspect命令查看容器标签

```bash
$ sudo docker inspect micheal/apache2
```

1. STOPSIGNAL

> STOPSIGNAL指令用来设置停止容器时发送什么系统调用信号给容器。

1. ARG

> ARG指令用来定义可以在docker build命令运行时传递给构建运行时的变量，我们只需要在构建时使用--build-arg标志即可。用户只能在构建时指定在Dockerfile文件汇总定义过的参数。

```bash
ARG build
ARG webapp_user=user

$ docker build --build-arg build=1234 -t micheal/webapp .
```

1. ONBUILD

> ONBUILD指令能为镜像添加触发器（trigger）。当一个镜像被用做其他镜像的基础镜像时（比如用户的镜像需要从某未准备好的位置添加源代码，或者用户需要执行特定于构建镜像的环境的构建脚本），该镜像中的触发器将会被执行。
>
> 触发器会在构建过程中插入新指令，我们可以认为这些指令是紧跟在FROM之后指定的。触发器可以是任何构建指令。

```bash
ONBUILD ADD . /app/src
ONBUILD RUN cd /app/src/ && make
```

> 上面的代码将会在创建的镜像中加入ONBUILD触发器，ONBUILD指令可以在镜像上运行docker inspect命令查看。

**Docker Networking**

> 容器之间的连接用网络创建，这被称为Docker Networking。Docker Networking允许用户创建自己的网络，容器可以通过这个网上互相通信。更重要的是，现在容器可以跨越不同的宿主机来通信，并且网络配置可以更灵活的定制。Docker Networking也和Docker Compose以及Swarm进行了集成。
>
> 要想使用Docker网络，需要先创建一个网络，然后在这个网络下启动容器。

```bash
$ sudo docker network create app
```

> 这里使用docker network命令创建了一个桥接网络，命名为app。可以使用docker network inspect命令查看新创建的这个网络。

```bash
$ sudo docker network inspect app
```

> 我们可以看到这个新网络是一个本地的桥接网络（这非常像docker0网络），而且现在没有容器再这个网络中运行。
>
> 可以使用`docker network ls`命令列出当前系统中所有的网络。

```bash
$ sudo docker network ls 
```

> 也可以使用 `docker network rm`命令删除一个Docker网络。
>
> 在Docker网络中创建Redis容器

```bash
$ sudo docker run -d --net=app --name db micheal/redis
```

> `--net`标志指定了新容器将会在那个网络中运行。

```bash
$ sudo docker network inspect app
```

> 将已有容器连接到Docker网络

```bash
$ sudo docker network connect app db2
```

> 可以通过`docker network disconnect` 命令断开一个容器与指定网络的连接

```bash
$ sudo docker network disconnect app db2
```

**通过Docker链接连接容器**

> 启动一个Redis容器

```bash
$ sudo docker run -d --name redis micheal/redis
```

> 注意：这里没有公开容器的任何端口。一会就能看到这么做的原因。



> 链接Redis容器

```bash
$ sudo docker run -p 4567 --name webapp --link redis:db -t -i -v $PWD/webapp_redis:/opt/webapp micheal/sinatra /bin/bash
```

> 这个命令做了不少事情，我们逐一解释。首先，我们使用`-p`标志公开4567端口，这样就能从外面访问web应用程序。
>
> 我们还使用`--name`标志给容器命名为webapp，并且使用了`-v`标志把web应用程序目录作为卷挂载到了容器里。
>
> 然而，这次我们使用了一个新标志`--link`。`--link`标志创建了两个容器间的客户-服务链接。这个标志需要两个参数：一个是要链接的容器的名字，另一个是链接的别名。这个例子中我们创建了客户联系，webapp容器是客户，redis容器是“服务”，并且为这个服务增加了db作为别名。这个别名让我们可以一致地访问容器公开信息，而无须关注底层容器的名字。链接让服务容器有能力与客户容器通信，并且能分享一些连接细节，这些细节有助于在应用程序中配置并使用这个链接。



> 连接也能得到一些安全上的好处。注意，启动 Redis 容器时，并没有使用`-p`标志公开Redis的端口。因为不需要这么做。通过把容器链接在一起，可以让客户直接访问任意服务容器的公开端口（即客户webapp容器可以连接到服务redis容器的6379端口）。更妙的是，只有使用`--link`标志链接到这个容器的容器才能连接到这个端口。容器的端口不需要对本地宿主机公开，现在我们已经拥有一个非常安全的模型。通过这个安全模型，就可以限制容器化应用程序被攻击面，减少应用暴露的网络。

