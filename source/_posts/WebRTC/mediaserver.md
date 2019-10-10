---
title: WebRTC 流媒体服务器
tags:
  - WebRTC
categories:
  - WebRTC
reward: true
abbrlink: 63461
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

### 内存地址空间与指针

![内存管理与指针](/images/imageWebRTC/mediaserver/内存管理与指针.png)

![内存地址空间](/images/imageWebRTC/mediaserver/内存地址空间.png)

### 堆空间与栈空间

![堆空间与栈空间](/images/imageWebRTC/mediaserver/堆空间与栈空间.png)

内存的申请与释放：

- new
- delete/delete[]

### 深拷贝与浅拷贝

![深拷贝与浅拷贝](/images/imageWebRTC/mediaserver/深拷贝与浅拷贝.png)

## 服务器基础编程

### Linux系统下的信号

<details><summary>server.h</summary>

```c++
/**
 * Server Class 
 *
 * @author 
 * @date 2019-08-07
 * @copyleft GPL 2.0
 */

#ifndef __SERVER_H__
#define __SERVER_H__

namespace avdance {

class Server {
public:
    Server();  //consrtuct
    ~Server(); //destruct
public:
    void run();
};

} //namespace avdance

#endif //__SERVER_H__
```

</details>

<details><summary>server.cpp</summary>

```c++
/**
 * the implement of Server Class 
 *
 * @author 
 * @date 2019-08-07
 * @copyleft GPL 2.0
 */

#include <iostream>
#include <unistd.h>

#include "server.h"

namespace avdance {

Server::Server(){
  std::cout << "Server construct..." << std::endl;
}

Server::~Server(){
  std::cout << "Server destruct..." << std::endl;
}

void Server::run(){
  while(1){  
    std::cout << "the server is runing..." << std::endl;
    ::usleep(1000000); //us sleep 1 second 
  }
}

} // namesapce avdance
```

</details>

<details><summary>main.cpp</summary>

```c++
/**
 * a server
 *
 * @author lichao
 * @date 2019-08-07
 * @copyleft GPL 2.0
 * g++ -std=c++11 -g -o server main.cpp server.cpp
 */

#include <iostream>
#include "server.h"

int main(int argc, char* argv[])
{
  avdance::Server* server = new avdance::Server();

  if(server){
    server->run();
  }

  return 0;
}
```

</details>

信号：

- 什么是信号
- 信号的处理方式：忽略、捕获、默认处理
- 都有哪些信号：man 7 signal

安装man中文手册：

- 安装依赖库和工具
- 下载、编译、安装man中文手册
- 修改配置文件
- 解决乱码问题

```shell
# Ubuntu 下查看中文man手册方法：
# 1. 打开终端，输入以下命令安装中文 man 手册
$ sudo apt-get install manpages-zh
# 2. 查看 man 手册安装到哪里
$ dpkg -L manpages-zh | less
# 查看到安装在 /usr/share/man/zh_CN
# 3. 设一个中文man别名
# 修改 ~/.bashrc 添加一个alias :
$ alias cman='man -M /usr/share/man/zh_CN'
# 4. 重启一个终端就可以用cman查看中文man手册了，当然查英文手册还是用man。
```

> [Mac 10.13 安装中文版 man 命令](https://blog.csdn.net/FungLeo/article/details/78522691)
>
> [[转]Mac 配置中文man手册](https://www.jianshu.com/p/307216b119c7)

### 几个重要的信号

- `SIGPIPE` 管道终止，当写入无人读取的管道时产生该信号，默认终止进程
- `SIGCHLD` 子进程结束或停止时发送
- `SIGALRM` 定时器信号，以秒为单位，默认终止进程
- `SIGUSR1/SIGUSR2` 自定义，默认终止进程
- `SIGINT` 键盘输入的退出信号
- `SIGQUIT` 键盘输入的退出信号
- `SIGHUP` 控制终端的挂起信号

**SIGPIPE：**

- 网络程序必须要处理 `SIGPIPE` 信号，否则当客户端退出后，服务器仍然向改 SOCKET 发送数据时，则会引起 Crash

**SIGCHLD：**

- 僵尸进程是一个早已死亡的进程，但在进程表中仍占有位置
- Linux 中当子进程结束的时候，他并没有完全销毁，因为父进程还要用它的信息
- 父进程没有处理 `SIGCHLD` 信号 或 调用 `wait/waitpid()` 等待子进程结束，就会出现僵尸进程

### 信号的发送与处理

发送信号：

- 硬件方式
  - 如 `ctrl + c`、`ctrl + \` 等
- 软件方式
  - `kill pid`

![安装信号](/images/imageWebRTC/mediaserver/安装信号.png)

### 通过 sigaction 安装信号

![sigaction](/images/imageWebRTC/mediaserver/sigaction.png)

<details><summary>testsig.cpp</summary>

```c++
#include <iostream>

#include <unistd.h>
#include <signal.h>

void sighandle(int sig) {
    std::cout << "sighup received :" 
              << sig
              << std::endl;
}
int main(int argc,char **argv)
{
    signal(SIGHUP, sighandle);
    signal(SIGINT, sighandle);
    signal(SIGQUIT, sighandle);
    pause();
    return 0;
}
```

</details>

<details><summary>server.h</summary>

```c++
#include <iostream>

#include <unistd.h>
#include <signal.h>

void sighandler(int sig){
  std::cout << "received signal: "
            << sig
            << std::endl;
}

int main(int argc, char *argv[])
{
  struct sigaction act, oact;

  act.sa_handler = sighandler;
  sigfillset(&act.sa_mask);
  act.sa_flags = 0;

  sigaction(SIGINT, &act, &oact);
  pause();

  return 0;
}
```

</details>

### 以 fork 的方式创建后台进程

后台进程：

- `fork` 方式
- 调用系统的 `daemon API`

Fork 方式：

- `fork` 一个子进程，父进程退出，子进程成为孤儿进程，被 `init` 进程接管
- 调用 setsid 建立新的进程会话
- 将当前工作目录切换到根目录
- 将标注输入、输出、出错重定向到 `/dev/null`

<details><summary>daemon.cpp</summary>

```c++
#include <stdio.h>
#include <syslog.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/resource.h>

/**
 * 注释1：因为我们从shell创建的daemon子进程，所以daemon子进程会继承shell的umask，如果不清除的话，会导致daemon进程创建文件时屏蔽某些权限。
 * 注释2：fork后让父进程退出，子进程获得新的pid，肯定不为进程组组长，这是setsid前提。
 * 注释3：调用setsid来创建新的进程会话。这使得daemon进程成为会话首进程，脱离和terminal的关联。
 * 注释4：最好在这里再次fork。这样使得daemon进程不再是会话首进程，那么永远没有机会获得控制终端。如果这里不fork的话，会话首进程依然可能打开控制终端。
 * 注释5：将当前工作目录切换到根目录。父进程继承过来的当前目录可能mount在一个文件系统上，如果不切换到根目录，那么这个文件系统不允许unmount。
 * 注释6：在子进程中关闭从父进程中继承过来的那些不需要的文件描述符。可以通过_SC_OPEN_MAX来判断最高文件描述符(不是很必须).
 * 注释7：打开/dev/null复制到0,1,2，因为dameon进程已经和terminal脱离了，所以需要重新定向标准输入，标准输出和标准错误(不是很必须).
 */
void daemonize(const char *cmd){
  int i, fd0, fd1, fd2;
  pid_t pid;
  //struct rlimit rl;
  //struct sigaction sa;

  /* * Clear file creation mask. */
  //umask(0);//注释1

  /* * Get maximum number of file descriptors. */
  //if (getrlimit(RLIMIT_NOFILE, &rl) < 0)
  //  err_quit("%s: can't get file limit", cmd);

  /* * Become a session leader to lose controlling TTY. */
  if ((pid = fork()) < 0) {//注释2
    printf("%s: can't fork", cmd);
    exit(-1);
  }
  else if (pid != 0) /* parent */
    exit(0);

  setsid();//注释3

  /* * Ensure future opens won't allocate controlling TTYs. */
  /*
  sa.sa_handler = SIG_IGN;
  sigemptyset(&sa.sa_mask);
  sa.sa_flags = 0;

  if (sigaction(SIGHUP, &sa, NULL) < 0)
    err_quit("%s: can't ignore SIGHUP", cmd);
  if ((pid = fork()) < 0)//注释4
    err_quit("%s: can't fork", cmd);
  */
  /*else if (pid != 0) *//* parent */
  /*
    exit(0);
  */

  /* * Change the current working directory to the root so * we won't prevent file systems from being unmounted. */
  if (chdir("/") < 0) {//注释5
    printf("%s: can't change directory to /", cmd);
    exit(-1);
  }

  /* * Close all open file descriptors. */
  /*
  if (rl.rlim_max == RLIM_INFINITY)
    rl.rlim_max = 1024;

  for (i = 0; i < rl.rlim_max; i++)
    close(i);//注释6
  */

  /* * Attach file descriptors 0, 1, and 2 to /dev/null. */
  fd0 = open("/dev/null", O_RDWR);//注释7
  //fd1 = dup(0);//注释7
  //fd2 = dup(0);//注释7
  dup2(fd0, STDIN_FILENO);
  dup2(fd0, STDOUT_FILENO);
  dup2(fd0, STDERR_FILENO);

  /* * Initialize the log file. */
  /*
  openlog(cmd, LOG_CONS, LOG_DAEMON);
  if (fd0 != 0 || fd1 != 1 || fd2 != 2) {
    syslog(LOG_ERR, "unexpected file descriptors %d %d %d",fd0, fd1, fd2);
    exit(1);
  }
  */
}

int main(int argc, char* argv[])
{
  daemonize("test");

  while(1)  {
    sleep(60);
  }
  return 0;
}
```

</details>

<details><summary>daemon_api.cpp</summary>

```c++
#include <unistd.h>
#include <stdlib.h>

int main(void)
{
    if(daemon(0,0) == -1)
        exit(EXIT_FAILURE);
    
    while(1) {
        sleep(60);
    }
    return 0;
}
```

</details>

## 网络编程基础

### TCPSerever 实现原理

**TCP Server 网络编程基本步骤：**

- 创建 socket，指定使用 TCP 协议
- 将 socket 与 地址和端口绑定
- 侦听端口
- 创建新的 socket
- 使用 recv 接收数据
- 使用 send 发送数据
- 使用 close 关闭连接

**TCP 常见套接字选项：**

- SO_REUSEADDR 端口处于 WAIT_TIME 仍然可以启动
- SO_RCVBUG -- 一般设置为4M或者8M
- SO_SNDBUF

![TCP通信](/images/imageWebRTC/mediaserver/TCP通信.png)

<details><summary>重要结构体</summary>

```c++
struct sockaddr_in
{
    sa_family_t		sin_family;
    uint16_t		sin_port;
    struct in_addr	sin_addr;
    char			sin_zero[8];
}

struct in_addr
{
    in_addr_t		s_addr;
}

struct sockaddr
{
    sa_family_t		sin_family;
    char 			sin_zero[14];
}
```

</details>

<details><summary>tcp_server.c</summary>

```c++
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 8444
#define MESSAGE_SIZE 1024

int main(){
    int ret = -1;
    int socket_fd = -1;
    int accept_fd = -1;

    int curpos = 0;
    int backlog = 10;
    int flag = 1;

    char in_buf[MESSAGE_SIZE] = {0,};
    struct sockaddr_in local_addr, remote_addr;

    //create a tcp socket
    socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if ( socket_fd == -1 ){
        perror("create socket error");
        exit(1);
    }

    //set option of socket
    ret = setsockopt(socket_fd, SOL_SOCKET, SO_REUSEADDR, &flag, sizeof(flag));
    if ( ret == -1 ){
        perror("setsockopt error");
    }

    //set local address
    local_addr.sin_family = AF_INET;
    local_addr.sin_port = htons(PORT);
    local_addr.sin_addr.s_addr = INADDR_ANY;
    bzero(&(local_addr.sin_zero), 8);

    //bind socket
    ret = bind(socket_fd, (struct sockaddr *)&local_addr, sizeof(struct sockaddr_in));
    if(ret == -1 ) {
        perror("bind error");
        exit(1);
    }

    ret = listen(socket_fd, backlog);
    if ( ret == -1 ){
        perror("listen error");
        exit(1);
    }

    //loop
    for(;;){
        int addr_len = sizeof( struct sockaddr_in );
        //accept an new connection
        accept_fd = accept( socket_fd, (struct sockaddr *)&remote_addr, &addr_len );
        for(;;){
            memset(in_buf, 0, MESSAGE_SIZE);

            //receive network data and print it
            ret = recv( accept_fd ,(void*)in_buf ,MESSAGE_SIZE ,0 );
            if(ret == 0 ){
                break; 
            } 
            printf( "receive message:%s\n", in_buf );
            send(accept_fd, (void*)in_buf, MESSAGE_SIZE, 0); 
        }
        printf("close client connection...\n");
        close(accept_fd);
    }

    printf("quit server...\n");
    close(socket_fd);

    return 0;
}
```

</details>

### TCPClient实现

TCP Client 网络编程基本步骤：

- 创建 socket，指定使用TCP协议
- 使用 connect 连接服务器
- 使用 recv/send 接收/发送 数据
- 关闭 socket

<details><summary>tcp_client.c</summary>

```c++
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>

#include <fcntl.h>
#include <errno.h>
#include <netdb.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define SERVER_PORT 8111
#define MESSAGE_LENGTH 1024

int main()
{
    int ret = -1;
    int socket_fd;
    
    //server addr
    struct sockaddr_in serverAddr;

    char sendbuf[MESSAGE_LENGTH];
    char recvbuf[MESSAGE_LENGTH];

    int data_len;

    if((socket_fd = socket(AF_INET, SOCK_STREAM, 0)) < 0){
        perror("socket");
        return 1;
    }

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(SERVER_PORT);
    //inet_addr()函数，将点分十进制IP转换成网络字节序IP
    serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");

    if(connect(socket_fd, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0){
        perror("connect");
        return 1;
    }
    printf("success to connect server...\n");

    while(1){
        memset(sendbuf, 0, MESSAGE_LENGTH);
        printf("<<<<send message:");
        gets(sendbuf);
        ret = send(socket_fd, sendbuf, strlen(sendbuf), 0);
        if(ret <= 0 ){
            printf("the connection is disconnection!\n"); 
            break;
        }

        if(strcmp(sendbuf, "quit") == 0){
            break;
        }

        printf(">>> echo message:");
        recvbuf[0] = '\0';
        data_len = recv(socket_fd, recvbuf, MESSAGE_LENGTH, 0);
        recvbuf[data_len] = '\0';
        printf("%s\n", recvbuf);
    }

    close(socket_fd);
    return 0;
}
```

</details>

### UDP服务端与客户端实现

UDP Server 网络编程基本步骤：

- 创建 socket，指定使用 UDP 协议
- 将 socket 与 地址和端口绑定
- 使用 recv/send 接收/发送数据
- 使用 close 关闭连接

![UDP通信](/images/imageWebRTC/mediaserver/UDP通信.png)

<details><summary>udp_server.c</summary>

```c++
#include <sys/types.h>
#include <sys/socket.h>
#include <pthread.h>
#include <netinet/in.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <arpa/inet.h>

int main(int argc, char * *argv)
{
    struct sockaddr_in addr;
    addr.sin_family     = AF_INET;
    addr.sin_port       = htons(9876);
    addr.sin_addr.s_addr = htonl(INADDR_ANY);

    char buff_recv[512] = {0};
    char buff_send[512] = "world";

    struct sockaddr_in clientAddr;
    int n;
    int len = sizeof(clientAddr);

    int sock;   

    printf("Welcome! This is a UDP server.\n");
    if ((sock = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
        printf("socket error.\n");
        exit(1);
    }

    if (bind(sock, (struct sockaddr *) &addr, sizeof(addr)) < 0) {
        printf("bind error.\n");
        exit(1);
    }

    while (1){
        n = recvfrom(sock, buff_recv, 511, 0, (struct sockaddr *) &clientAddr, &len);
        if (n > 0) {
            buff_recv[n] = 0;
            printf("recv data from client:%s %u says: %s\n", inet_ntoa(clientAddr.sin_addr), ntohs(clientAddr.sin_port), buff_recv);

            n = sendto(sock, buff_send, n, 0, (struct sockaddr *) &clientAddr, sizeof(clientAddr));
            if (n < 0){
                printf("sendto error.\n");
                break;
            }else {
                printf("recv error.\n");
                break;
            }
        }
    }
    return 0;
}
```

</details>

<details><summary>udp_client.c</summary>

```c++
#include <sys/types.h>
#include <sys/socket.h>
#include <pthread.h>
#include <netinet/in.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>

int main(int argc, char * *argv)
{   
    struct sockaddr_in addr;
    int sock;

    addr.sin_family     = AF_INET;
    addr.sin_port       = htons(9876);
    addr.sin_addr.s_addr = inet_addr("111.231.68.13");

    char buff_send[512] = "Hello";
    char buff_recv[512] = {0};
    int len = sizeof(addr);

    int n = 0;

    printf("This is a UDP client\n");
    if ((sock = socket(AF_INET, SOCK_DGRAM, 0)) < 0){
        printf("socket error.\n");
        exit(1);
    }

    if (addr.sin_addr.s_addr == INADDR_NONE){
        printf("Incorrect ip address!");
        close(sock);
        exit(1);
    }

    n = sendto(sock, buff_send, strlen(buff_send), 0, (struct sockaddr *) &addr, sizeof(addr));
    if (n < 0){
        printf("sendto error.\n");
        close(sock);
    }

    n = recvfrom(sock, buff_recv, 512, 0, (struct sockaddr *) &addr, &len);
    if (n > 0){
        buff_recv[n] = 0;
        printf("received from sever:");
        puts(buff_recv);
    }
    else if (n == 0)
        printf("server closed.\n");
    else if (n == -1)
        printf("recvfrom error.\n");

    close(sock);
    return 0;
}
```

</details>

## 异步 I/O 事件处理

### 通过fork的方式实现高性能网络服务器

高性能网络服务器：

- 通过 fork 实现高性能网络服务器
- 通过 select 实现高性能网络服务器
- 通过 epoll 实现高性能网络服务器
- 利用 I/O 事件处理库来实现高性能网络服务器

以 fork 方式实现高性能网络服务器：

- 每收到一个连接就创建一个子进程
- 父进程负责接收连接
- 通过 fork 创建子进程

<details><summary>fork_tcp_server.c</summary>

```c++
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 8888
#define MESSAGE_SIZE 1024

int main(){
    int ret = -1;
    int pid;
    int socket_fd = -1;
    int accept_fd = -1;

    int curpos = 0;
    int backlog = 10;
    int flag;

    struct sockaddr_in local_addr, remote_addr;
    
    char in_buf[MESSAGE_SIZE] = {0,};

    //create a tcp socket
    socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if ( socket_fd == -1 ){
        perror("create socket error");
        exit(1);
    }

    //set option of socket
    ret = setsockopt(socket_fd, SOL_SOCKET, SO_REUSEADDR, (char *)&flag, sizeof(flag));
    if ( ret == -1 ){
        perror("setsockopt error");
    }

    //set local address
    local_addr.sin_family = AF_INET;
    local_addr.sin_port = htons(PORT);
    local_addr.sin_addr.s_addr = INADDR_ANY;
    bzero(&(local_addr.sin_zero), 8);

    //bind socket
    ret = bind(socket_fd, (struct sockaddr *)&local_addr, sizeof(struct sockaddr_in));
    if(ret == -1 ) {
        perror("bind error");
        exit(1);
    }

    ret = listen(socket_fd, backlog);
    if ( ret == -1 ){
        perror("listen error");
        exit(1);
    }

    for(;;){
        int addr_len = sizeof( struct sockaddr_in );
        //accept an new connection
        accept_fd = accept( socket_fd, (struct sockaddr *)&remote_addr, &addr_len );

        //create a sub process
        pid = fork();
        //子进程
        if( pid == 0 ){
            for(;;){
                memset(in_buf, 0, MESSAGE_SIZE);
                ret = recv(accept_fd ,&in_buf, MESSAGE_SIZE, 0);
                if(ret == 0){
                    break; 
                } 

                printf( "receive message:%s\n", in_buf );
                send(accept_fd, (void*)in_buf, MESSAGE_SIZE, 0);
            }

            printf("close client connection...\n");
            close(accept_fd);
        } 
        //parent process
        //sleep(1000);
    }

    if(pid != 0 ){
        printf("quit server...\n");
        close(socket_fd);
    }

    return 0;
}
```

</details>

**fork 方式带来的问题：**

- 资源被长期占用
- 分配子进程花费时间长

### 通过select实现高性能服务器

**什么是异步 I/O：**

> 所谓异步 I/O，是指以事件触发的机制来对 I/O 操作进行处理。
>
> 与多进程和多线程技术相比，异步 I/O 技术的最大优势是系统开销小，系统不必创建进程/线程，也不必维护这些进程/线程，从而大大减小了系统的开销。

以 select 方式实现高性能网络服务器：

- 遍历文件描述符集中的所有描述符，找出有变化的描述符
- 对于侦听的 socket 和 数据处理的 socket 要区别对待
- socket 必须设置为非阻塞方式工作

**重要 API：**

- `FD_ZERO`、`FD_SET`、`FD_ISSET`
- `flag fcntl(fd, F_SETFL/F_GETFL, flag)`
- `events select(nfds, readfds, writefds, exceptfds, timeout)`



![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)

![](/images/imageWebRTC/mediaserver/)



<details><summary></summary>

```c++

```

</details>