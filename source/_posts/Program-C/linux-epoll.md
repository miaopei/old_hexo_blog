---
title: 处理并发之一：LINUX Epoll 机制介绍
tags: c/c++
reward: true
categories: c/c++
toc: true
abbrlink: 39639
date: 2016-07-08 10:14:50
---


Epoll 可是当前在 Linux 下开发大规模并发网络程序的热门人选，Epoll 在 Linux2.6 内核中正式引入，和 select 相似，其实都 I/O 多路复用技术而已，并没有什么神秘的。

其实在 Linux 下设计并发网络程序，向来不缺少方法，比如典型的 Apache 模型（Process Per Connection，简称 PPC），TPC（Thread Per Connection）模型，以及 select 模型和 poll 模型，那为何还要再引入 Epoll 这个东东呢？那还是有得说说的…

<!-- more -->

## 常用模型的缺点

如果不摆出来其他模型的缺点，怎么能对比出 Epoll 的优点呢。

### PPC/TPC 模型

这两种模型思想类似，就是让每一个到来的连接一边自己做事去，别再来烦我。只是 PPC 是为它开了一个进程，而 TPC 开了一个线程。可是别烦我是有代价的，它要时间和空间啊，连接多了之后，那么多的进程 / 线程切换，这开销就上来了；因此这类模型能接受的最大连接数都不会高，一般在几百个左右。

### select模型

1. 最大并发数限制，因为一个进程所打开的 FD（文件描述符）是有限制的，由 FD_SETSIZE 设置，默认值是 1024/2048，因此 Select 模型的最大并发数就被相应限制了。自己改改这个FD_SETSIZE？想法虽好，可是先看看下面吧…

2. 效率问题，select 每次调用都会线性扫描全部的 FD 集合，这样效率就会呈现线性下降，把FD_SETSIZE 改大的后果就是，大家都慢慢来，什么？都超时了？？！！

3. 内核 / 用户空间 内存拷贝问题，如何让内核把 FD 消息通知给用户空间呢？在这个问题上 select 采取了内存拷贝方法。

### poll 模型

基本上效率和 select 是相同的，select 缺点的 2 和 3 它都没有改掉。

## Epoll 的提升

把其他模型逐个批判了一下，再来看看 Epoll 的改进之处吧，其实把 select 的缺点反过来那就是 Epoll 的优点了。

1. Epoll 没有最大并发连接的限制，上限是最大可以打开文件的数目，这个数字一般远大于 2048,  一般来说这个数目和系统内存关系很大，具体数目可以 `cat /proc/sys/fs/file-max` 察看。

2. 效率提升，Epoll 最大的优点就在于它只管你 “活跃” 的连接，而跟连接总数无关，因此在实际的网络环境中，Epoll 的效率就会远远高于 select 和 poll。

3. 内存拷贝，Epoll 在这点上使用了 “共享内存”，这个内存拷贝也省略了。

## Epoll为什么高效

Epoll 的高效和其数据结构的设计是密不可分的，这个下面就会提到。

首先回忆一下 select 模型，当有 I/O 事件到来时，select 通知应用程序有事件到了快去处理，而应用程序必须轮询所有的 FD 集合，测试每个 FD 是否有事件发生，并处理事件；

<details><summary>代码像下面这样：</summary>

```c
int res = select(maxfd+1, &readfds, NULL, NULL, 120);
if(res > 0)
{
    for(int i = 0; i < MAX_CONNECTION; i++)
    {
        if(FD_ISSET(allConnection[i],&readfds))
        {
            handleEvent(allConnection[i]);
        }
    }
}
// if(res == 0) handle timeout, res < 0 handle error
```

</details>

Epoll 不仅会告诉应用程序有 I/0 事件到来，还会告诉应用程序相关的信息，这些信息是应用程序填充的，因此根据这些信息应用程序就能直接定位到事件，而不必遍历整个 FD 集合。

```c
intres = epoll_wait(epfd, events, 20, 120);
for(int i = 0; i < res;i++)
{
    handleEvent(events[n]);
}
```

##  Epoll 关键数据结构

前面提到 Epoll 速度快和其数据结构密不可分，其关键数据结构就是：

```c
struct epoll_event {
    __uint32_t events;      // Epoll events
    epoll_data_t data;      // User datavariable
};

typedef union epoll_data {
   void *ptr;
   int fd;
   __uint32_t u32;
   __uint64_t u64;
} epoll_data_t;
```

结构体 `epoll_event` 被用于注册所感兴趣的事件和回传所发生待处理的事件. 

其中 `epoll_data` 联合体用来保存触发事件的某个文件描述符相关的数据. 

例如一个 client 连接到服务器，服务器通过调用 accept 函数可以得到于这个 client 对应的 socket 文件描述符，可以把这文件描述符赋给 epoll_data 的 fd 字段以便后面的读写操作在这个文件描述符上进行。epoll_event 结构体的 events 字段是表示感兴趣的事件和被触发的事件可能的取值为： 

 - EPOLLIN ：表示对应的文件描述符可以读；
 - EPOLLOUT：表示对应的文件描述符可以写；
 - EPOLLPRI：表示对应的文件描述符有紧急的数据可读
 - EPOLLERR：表示对应的文件描述符发生错误；
 - EPOLLHUP：表示对应的文件描述符被挂断；
 - EPOLLET：表示对应的文件描述符有事件发生；

**ET 和 LT 模式**

LT(level triggered) 是缺省的工作方式，并且同时支持 block 和 no-block socket. 在这种做法中，内核告诉你一个文件描述符是否就绪了，然后你可以对这个就绪的 fd 进行 IO 操作。如果你不作任何操作，内核还是会继续通知你的，所以，这种模式编程出错误可能性要小一点。传统的 select/poll 都是这种模型的代表。

ET (edge-triggered) 是高速工作方式，只支持 no-block socket。在这种模式下，当描述符从未就绪变为就绪时，内核通过 epoll 告诉你。然后它会假设你知道文件描述符已经就绪，并且不会再为那个文件描述符发送更多的就绪通知，直到你做了某些操作导致那个文件描述符不再为就绪状态了（比如，你在发送，接收或者接收请求，或者发送接收的数据少于一定量时导致了一个 EWOULDBLOCK 错误）。但是请注意，如果一直不对这个 fd 作 IO 操作（从而导致它再次变成未就绪），内核不会发送更多的通知(only once)，不过在 TCP 协议中，ET 模式的加速效用仍需要更多的 benchmark 确认。

ET 和 LT 的区别在于 LT 事件不会丢弃，而是只要读 buffer 里面有数据可以让用户读，则不断的通知你。而 ET 则只在事件发生之时通知。可以简单理解为 LT 是水平触发，而 ET 则为边缘触发。

ET 模式仅当状态发生变化的时候才获得通知,这里所谓的状态的变化并不包括缓冲区中还有未处理的数据,也就是说,如果要采用 ET 模式,需要一直 `read/write` 直到出错为止, 很多人反映为什么采用 ET 模式只接收了一部分数据就再也得不到通知了, 大多因为这样; 而 LT 模式是只要有数据没有处理就会一直通知下去的.

## 使用 Epoll

既然 Epoll 相比 select 这么好，那么用起来如何呢？会不会很繁琐啊…先看看下面的三个函数吧，就知道 Epoll 的易用了。

```c
int epoll_create(int size);
```

生成一个 Epoll 专用的文件描述符，其实是申请一个内核空间，用来存放你想关注的 socket fd 上是否发生以及发生了什么事件。size 就是你在这个 Epoll fd 上能关注的最大 socket fd 数，大小自定，只要内存足够。

```c
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);
```

epoll的事件注册函数，它不同与select()是在监听事件时告诉内核要监听什么类型的事件，而是在这里先注册要监听的事件类型。第一个参数是epoll_create()的返回值，第二个参数表示动作，用三个宏来表示：

 - EPOLL_CTL_ADD：注册新的 fd 到 epfd 中；
 - EPOLL_CTL_MOD：修改已经注册的 fd 的监听事件；
 - EPOLL_CTL_DEL：从 epfd 中删除一个 fd；

第三个参数是需要监听的 fd，第四个参数是告诉内核需要监听什么事

```c
int epoll_wait(int epfd,struct epoll_event * events,int maxevents,int timeout);
```

等待 I/O 事件的发生；参数说明：

 - epfd: 由 `epoll_create()` 生成的 Epoll 专用的文件描述符；
 - epoll_event: 用于回传代处理事件的数组；
 - maxevents: 每次能处理的事件数；
 - timeout: 等待 I/O 事件发生的超时值；
 - 返回发生事件数。

----------

## 测试程序
首先对服务端和客户端做下说明：

- 我想实现的是客户端和服务端并发的程序，客户端通过配置并发数，说明有多少个用户去连接服务端。

- 客户端会发送消息："Client: i send message Hello Server!”，其中 `i` 表示哪一个客户端；收到消息："Recv Server Msg Content:%s\n"。

例如：

```shell
发送：Client: 1 send message "Hello Server!"
接收：Recv Derver Msg Content:Hello, client fd: 6
服务端收到后给客户端回复消息："Hello, client fd: i"，其中 i 表示服务端接收的 fd, 用户区别是哪一个客户端。接收客户端消息："Terminal Received Msg Content:%s\n"
```

例如：

```shell
发送：Hello, client fd: 6
接收：Terminal Received Msg Content:Client: 1 send message "Hello Server!"
```

备注：这里在接收到消息后，直接打印出消息，如果需要对消息进行处理（如果消息处理比较占用时间，不能立即返回，可以将该消息放入一个队列中，然后开启一个线程从队列中取消息进行处理，这样的话不会因为消息处理而阻塞 epoll）。libenent 好像对这种有 2 中处理方式，一个就是回调，要求回调函数，不占用太多的时间，基本能立即返回，另一种好像也是一个队列实现的，这个还需要研究。

服务端代码说明：

服务端在绑定监听后，开启了一个线程，用于负责接收客户端连接，加入到 epoll 中，这样只要 accept 到客户端的连接，就将其 add EPOLLIN 到 epoll 中，然后进入循环调用 epoll_wait，监听到读事件，接收数据，并将事件修改为 EPOLLOUT；反之监听到写事件，发送数据，并将事件修改为EPOLLIN。

<details><summary>服务器代码：</summary>

```c++
//cepollserver.h  
#ifndef  C_EPOLL_SERVER_H  
#define  C_EPOLL_SERVER_H  
  
#include <sys/epoll.h>  
#include <sys/socket.h>  
#include <netinet/in.h>  
#include <fcntl.h>  
#include <arpa/inet.h>  
#include <stdio.h>  
#include <stdlib.h>  
#include <iostream>  
#include <pthread.h>  
  
#define _MAX_SOCKFD_COUNT 65535  
  
class CEpollServer  
{  
public:  
    CEpollServer();  
    ~CEpollServer();  

    bool InitServer(const char* chIp, int iPort);  
    void Listen();  
    static void ListenThread( void* lpVoid );  
    void Run();  
    
private:  
    int        m_iEpollFd;  
    int        m_isock;  
    pthread_t       m_ListenThreadId;// 监听线程句柄  
};  
  
#endif  
```

```c++
#include "cepollserver.h"  
  
using namespace std;  
  
CEpollServer::CEpollServer()  
{  
}  
  
CEpollServer::~CEpollServer()  
{  
    close(m_isock);  
}  
  
bool CEpollServer::InitServer(const char* pIp, int iPort)  
{  
    m_iEpollFd = epoll_create(_MAX_SOCKFD_COUNT);  

    //设置非阻塞模式  
    int opts = O_NONBLOCK;  
    if(fcntl(m_iEpollFd,F_SETFL,opts)<0) {  
        printf("设置非阻塞模式失败!\n");  
        return false;  
    }  

    m_isock = socket(AF_INET,SOCK_STREAM,0);  
    if ( 0 > m_isock ) {  
        printf("socket error!\n");  
        return false;  
    }  
　　  
    sockaddr_in listen_addr;  
    listen_addr.sin_family=AF_INET;  
    listen_addr.sin_port=htons ( iPort );  
    listen_addr.sin_addr.s_addr=htonl(INADDR_ANY);  
    listen_addr.sin_addr.s_addr=inet_addr(pIp);  

    int ireuseadd_on = 1;//支持端口复用  
    setsockopt(m_isock, SOL_SOCKET, SO_REUSEADDR, &ireuseadd_on, sizeof(ireuseadd_on) );  
　　  
    if ( bind ( m_isock, ( sockaddr * ) &listen_addr,sizeof ( listen_addr ) ) !=0 ) {  
        printf("bind error\n");  
        return false;  
    }  

    if ( listen ( m_isock, 20) <0 ) {  
        printf("listen error!\n");  
        return false;  
    }  
    else {  
        printf("服务端监听中...\n");  
    }  

    // 监听线程，此线程负责接收客户端连接，加入到epoll中  
    if ( pthread_create( &m_ListenThreadId, 0, ( void * ( * ) ( void * ) ) ListenThread, this ) != 0 ) {  
        printf("Server 监听线程创建失败!!!");  
        return false;  
    }  
}  

// 监听线程  
void CEpollServer::ListenThread( void* lpVoid )  
{  
    CEpollServer *pTerminalServer = (CEpollServer*)lpVoid;  
    sockaddr_in remote_addr;  
    int len = sizeof (remote_addr);  
    while ( true ) {  
        int client_socket = accept (pTerminalServer->m_isock, ( sockaddr * ) &remote_addr,(socklen_t*)&len );  
        if ( client_socket < 0 ) {  
            printf("Server Accept失败!, client_socket: %d\n", client_socket);  
            continue;  
        } else {  
            struct epoll_event    ev;  
            ev.events = EPOLLIN | EPOLLERR | EPOLLHUP;  
            ev.data.fd = client_socket;     //记录socket句柄  
            epoll_ctl(pTerminalServer->m_iEpollFd, EPOLL_CTL_ADD, client_socket, &ev);  
        }  
    }  
}  
　　  
void CEpollServer::Run()  
{  
    while ( true )  
    {  
        struct epoll_event    events[_MAX_SOCKFD_COUNT];  
        int nfds = epoll_wait( m_iEpollFd, events,  _MAX_SOCKFD_COUNT, -1 );  
        for (int i = 0; i < nfds; i++) 
        {  
            int client_socket = events[i].data.fd;  
            char buffer[1024];//每次收发的字节数小于1024字节  
            memset(buffer, 0, 1024);  
            if (events[i].events & EPOLLIN)//监听到读事件，接收数据  
            {  
                int rev_size = recv(events[i].data.fd,buffer, 1024,0);  
                if( rev_size <= 0 )  
                {  
                    cout << "recv error: recv size: " << rev_size << endl;  
                    struct epoll_event event_del;  
                    event_del.data.fd = events[i].data.fd;  
                    event_del.events = 0;  
                    epoll_ctl(m_iEpollFd, EPOLL_CTL_DEL, event_del.data.fd, &event_del);  
                }  
                else  
                {  
                    printf("Terminal Received Msg Content:%s\n",buffer);  
                    struct epoll_event    ev;  
                    ev.events = EPOLLOUT | EPOLLERR | EPOLLHUP;  
                    ev.data.fd = client_socket;     //记录socket句柄  
                    epoll_ctl(m_iEpollFd, EPOLL_CTL_MOD, client_socket, &ev);  
                }  
            }  
            else if(events[i].events & EPOLLOUT)//监听到写事件，发送数据  
            {  
                char sendbuff[1024];  
                sprintf(sendbuff, "Hello, client fd: %d\n", client_socket);  
                int sendsize = send(client_socket, sendbuff, strlen(sendbuff)+1, MSG_NOSIGNAL);  
                if(sendsize <= 0)  
                {  
                    struct epoll_event event_del;  
                    event_del.data.fd = events[i].data.fd;  
                    event_del.events = 0;  
                    epoll_ctl(m_iEpollFd, EPOLL_CTL_DEL, event_del.data.fd, &event_del);  
                }  
                else  
                {  
                    printf("Server reply msg ok! buffer: %s\n", sendbuff);  
                    struct epoll_event    ev;  
                    ev.events = EPOLLIN | EPOLLERR | EPOLLHUP;  
                    ev.data.fd = client_socket;     //记录socket句柄  
                    epoll_ctl(m_iEpollFd, EPOLL_CTL_MOD, client_socket, &ev);  
                }  
            }  
            else  
            {  
                cout << "EPOLL ERROR\n" <<endl;  
                epoll_ctl(m_iEpollFd, EPOLL_CTL_DEL, events[i].data.fd, &events[i]);  
            }  
        }  
    }  
}  
```

</details>

<details><summary>客户端代码：</summary>

说明：测试是两个并发进行测试，每一个客户端都是一个长连接。代码中在连接服务器（ConnectToServer）时将用户 ID 和 socketid 关联起来。用户 ID 和 socketid 是一一对应的关系。

```c++
#ifndef _DEFINE_EPOLLCLIENT_H_  
#define _DEFINE_EPOLLCLIENT_H_  
#define _MAX_SOCKFD_COUNT 65535  

#include<iostream>  
#include <sys/epoll.h>  
#include <sys/socket.h>  
#include <netinet/in.h>  
#include <fcntl.h>  
#include <arpa/inet.h>  
#include <errno.h>  
#include <sys/ioctl.h>  
#include <sys/time.h>  
#include <string>  

using namespace std;  

/** 
* @brief 用户状态 
*/  
typedef enum _EPOLL_USER_STATUS_EM  
{  
    FREE = 0,  
    CONNECT_OK = 1,//连接成功  
    SEND_OK = 2,//发送成功  
    RECV_OK = 3,//接收成功  
}EPOLL_USER_STATUS_EM;  

/*@brief 
*@CEpollClient class 用户状态结构体 
*/  
struct UserStatus  
{  
    EPOLL_USER_STATUS_EM iUserStatus;//用户状态  
    int iSockFd;//用户状态关联的socketfd  
    char cSendbuff[1024];//发送的数据内容  
    int iBuffLen;//发送数据内容的长度  
    unsigned int uEpollEvents;//Epoll events  
};  

class CEpollClient  
{  
public:  
    /** 
    * @brief 
    * 函数名:CEpollClient 
    * 描述:构造函数 
    * @param [in] iUserCount  
    * @param [in] pIP IP地址 
    * @param [in] iPort 端口号 
    * @return 无返回 
    */  
    CEpollClient(int iUserCount, const char* pIP, int iPort);  

    /** 
    * @brief 
    * 函数名:CEpollClient 
    * 描述:析构函数 
    * @return 无返回 
    */  
    ~CEpollClient();  

    /** 
    * @brief 
    * 函数名:RunFun 
    * 描述:对外提供的接口，运行epoll类 
    * @return 无返回值 
    */  
    int RunFun();  

private:  
    /** 
    * @brief 
    * 函数名:ConnectToServer 
    * 描述:连接到服务器 
    * @param [in] iUserId 用户ID 
    * @param [in] pServerIp 连接的服务器IP 
    * @param [in] uServerPort 连接的服务器端口号 
    * @return 成功返回socketfd,失败返回的socketfd为-1 
    */  
    int ConnectToServer(int iUserId,const char *pServerIp,unsigned short uServerPort);  

    /** 
    * @brief 
    * 函数名:SendToServerData 
    * 描述:给服务器发送用户(iUserId)的数据 
    * @param [in] iUserId 用户ID 
    * @return 成功返回发送数据长度 
    */  
    int SendToServerData(int iUserId);  

    /** 
    * @brief 
    * 函数名:RecvFromServer 
    * 描述:接收用户回复消息 
    * @param [in] iUserId 用户ID 
    * @param [in] pRecvBuff 接收的数据内容 
    * @param [in] iBuffLen 接收的数据长度 
    * @return 成功返回接收的数据长度，失败返回长度为-1 
    */  
    int RecvFromServer(int iUserid,char *pRecvBuff,int iBuffLen);  

    /** 
    * @brief 
    * 函数名:CloseUser 
    * 描述:关闭用户 
    * @param [in] iUserId 用户ID 
    * @return 成功返回true 
    */  
    bool CloseUser(int iUserId);  

    /** 
    * @brief 
    * 函数名:DelEpoll 
    * 描述:删除epoll事件 
    * @param [in] iSockFd socket FD 
    * @return 成功返回true 
    */  
    bool DelEpoll(int iSockFd);  

private:  
    int    m_iUserCount;//用户数量；  
    struct UserStatus *m_pAllUserStatus;//用户状态数组  
    int    m_iEpollFd;//需要创建epollfd  
    int    m_iSockFd_UserId[_MAX_SOCKFD_COUNT];//将用户ID和socketid关联起来  
    int    m_iPort;//端口号  
    char   m_ip[100];//IP地址  
};  

#endif  
```

```c++
#include "cepollclient.h"  

CEpollClient::CEpollClient(int iUserCount, const char* pIP, int iPort)  
{  
    strcpy(m_ip, pIP);  
    m_iPort = iPort;  
    m_iUserCount = iUserCount;  
    m_iEpollFd = epoll_create(_MAX_SOCKFD_COUNT);  
    m_pAllUserStatus = (struct UserStatus*)malloc(iUserCount*sizeof(struct UserStatus));  
    for(int iuserid=0; iuserid<iUserCount ; iuserid++) {  
        m_pAllUserStatus[iuserid].iUserStatus = FREE;  
        sprintf(m_pAllUserStatus[iuserid].cSendbuff, "Client: %d send message \"Hello Server!\"\r\n", iuserid);  
        m_pAllUserStatus[iuserid].iBuffLen = strlen(m_pAllUserStatus[iuserid].cSendbuff) + 1;  
        m_pAllUserStatus[iuserid].iSockFd = -1;  
    }  
    memset(m_iSockFd_UserId, 0xFF, sizeof(m_iSockFd_UserId));  
}  
  
CEpollClient::~CEpollClient()  
{  
    free(m_pAllUserStatus);  
}  

int CEpollClient::ConnectToServer(int iUserId,const char *pServerIp,unsigned short uServerPort)  
{  
    if( (m_pAllUserStatus[iUserId].iSockFd = socket(AF_INET,SOCK_STREAM,0) ) < 0 ) {  
        cout <<"[CEpollClient error]: init socket fail, reason is:"<<strerror(errno)<<",errno is:"<<errno<<endl;  
        m_pAllUserStatus[iUserId].iSockFd = -1;  
        return  m_pAllUserStatus[iUserId].iSockFd;  
    }  
  
    struct sockaddr_in addr;  
    bzero(&addr, sizeof(addr));  
    addr.sin_family = AF_INET;  
    addr.sin_port = htons(uServerPort);  
    addr.sin_addr.s_addr = inet_addr(pServerIp);  
  
    int ireuseadd_on = 1;//支持端口复用  
    setsockopt(m_pAllUserStatus[iUserId].iSockFd, SOL_SOCKET, SO_REUSEADDR, &ireuseadd_on, sizeof(ireuseadd_on));  
  
    unsigned long ul = 1;  
    ioctl(m_pAllUserStatus[iUserId].iSockFd, FIONBIO, &ul); //设置为非阻塞模式   
    connect(m_pAllUserStatus[iUserId].iSockFd, (const sockaddr*)&addr, sizeof(addr));  
    m_pAllUserStatus[iUserId].iUserStatus = CONNECT_OK;  
    m_pAllUserStatus[iUserId].iSockFd = m_pAllUserStatus[iUserId].iSockFd;  
    return m_pAllUserStatus[iUserId].iSockFd;  
}  

int CEpollClient::SendToServerData(int iUserId)  
{  
    sleep(1);//此处控制发送频率，避免狂打日志，正常使用中需要去掉  
    int isendsize = -1;  
    if( CONNECT_OK == m_pAllUserStatus[iUserId].iUserStatus || RECV_OK == m_pAllUserStatus[iUserId].iUserStatus) {  
        isendsize = send(m_pAllUserStatus[iUserId].iSockFd, m_pAllUserStatus[iUserId].cSendbuff, m_pAllUserStatus[iUserId  
].iBuffLen, MSG_NOSIGNAL);  
        if(isendsize < 0) {  
            cout <<"[CEpollClient error]: SendToServerData, send fail, reason is:"<<strerror(errno)<<",errno is:"<<errno<  
<endl;  
        } else {  
            printf("[CEpollClient info]: iUserId: %d Send Msg Content:%s\n", iUserId, m_pAllUserStatus[iUserId].cSendbuff  
);  
            m_pAllUserStatus[iUserId].iUserStatus = SEND_OK;  
        }  
    }  
    return isendsize;  
}  

int CEpollClient::RecvFromServer(int iUserId,char *pRecvBuff,int iBuffLen) 
{  
    int irecvsize = -1;  
    if(SEND_OK == m_pAllUserStatus[iUserId].iUserStatus) {  
        irecvsize = recv(m_pAllUserStatus[iUserId].iSockFd, pRecvBuff, iBuffLen, 0);  
        if(0 > irecvsize) {  
            cout <<"[CEpollClient error]: iUserId: " << iUserId << "RecvFromServer, recv fail, reason is:"<<strerror(errn  
o)<<",errno is:"<<errno<<endl;  
        } else if(0 == irecvsize) {  
            cout <<"[warning:] iUserId: "<< iUserId << "RecvFromServer, STB收到数据为0，表示对方断开连接,irecvsize:"<<ire  
cvsize<<",iSockFd:"<< m_pAllUserStatus[iUserId].iSockFd << endl;  
        } else {  
            printf("Recv Server Msg Content:%s\n", pRecvBuff);  
            m_pAllUserStatus[iUserId].iUserStatus = RECV_OK;  
        }  
    }  
    return irecvsize;  
}  
  
bool CEpollClient::CloseUser(int iUserId)  
{  
    close(m_pAllUserStatus[iUserId].iSockFd);  
    m_pAllUserStatus[iUserId].iUserStatus = FREE;  
    m_pAllUserStatus[iUserId].iSockFd = -1;  
    return true;  
}  
      
int CEpollClient::RunFun()  
{  
    int isocketfd = -1;  
    for(int iuserid=0; iuserid<m_iUserCount; iuserid++) {  
        struct epoll_event event;  
        isocketfd = ConnectToServer(iuserid, m_ip, m_iPort);  
        if(isocketfd < 0)  
            cout <<"[CEpollClient error]: RunFun, connect fail" <<endl;  
        m_iSockFd_UserId[isocketfd] = iuserid;//将用户ID和socketid关联起来  
  
        event.data.fd = isocketfd;  
        event.events = EPOLLIN|EPOLLOUT|EPOLLERR|EPOLLHUP;  
  
        m_pAllUserStatus[iuserid].uEpollEvents = event.events;  
        epoll_ctl(m_iEpollFd, EPOLL_CTL_ADD, event.data.fd, &event);  
　　}  
    while(1)  
    {  
        struct epoll_event events[_MAX_SOCKFD_COUNT];  
        char buffer[1024];  
        memset(buffer,0,1024);  
        int nfds = epoll_wait(m_iEpollFd, events, _MAX_SOCKFD_COUNT, 100 );//等待epoll事件的产生  
        for (int ifd=0; ifd<nfds; ifd++)//处理所发生的所有事件  
        {  
            struct epoll_event event_nfds;  
            int iclientsockfd = events[ifd].data.fd;  
            cout << "events[ifd].data.fd: " << events[ifd].data.fd << endl;  
            int iuserid = m_iSockFd_UserId[iclientsockfd];//根据socketfd得到用户ID  
            if( events[ifd].events & EPOLLOUT )  
            {  
                int iret = SendToServerData(iuserid);  
                if( 0 < iret )  
                {  
                    event_nfds.events = EPOLLIN|EPOLLERR|EPOLLHUP;  
                    event_nfds.data.fd = iclientsockfd;  
                    epoll_ctl(m_iEpollFd, EPOLL_CTL_MOD, event_nfds.data.fd, &event_nfds);  
                }  
                else  
                {  
                    cout <<"[CEpollClient error:] EpollWait, SendToServerData fail, send iret:"<<iret<<",iuserid:"<<iuser  
                        id<<",fd:"<<events[ifd].data.fd<<endl;  
                    DelEpoll(events[ifd].data.fd);  
                    CloseUser(iuserid);  
                }  
            }  
            else if( events[ifd].events & EPOLLIN )//监听到读事件，接收数据  
            {  
                int ilen = RecvFromServer(iuserid, buffer, 1024);  
                if(0 > ilen)  
                {  
                    cout <<"[CEpollClient error]: RunFun, recv fail, reason is:"<<strerror(errno)<<",errno is:"<<errno<<e  
                        ndl;  
                    DelEpoll(events[ifd].data.fd);  
                    CloseUser(iuserid);  
                }  
                else if(0 == ilen)  
                {  
                    cout <<"[CEpollClient warning:] server disconnect,ilen:"<<ilen<<",iuserid:"<<iuserid<<",fd:"<<events[  
                        ifd].data.fd<<endl;  
                    DelEpoll(events[ifd].data.fd);  
                    CloseUser(iuserid);  
                }  
                else  
                {  
                    m_iSockFd_UserId[iclientsockfd] = iuserid;//将socketfd和用户ID关联起来  
                    event_nfds.data.fd = iclientsockfd;  
                    event_nfds.events = EPOLLOUT|EPOLLERR|EPOLLHUP;  
                    epoll_ctl(m_iEpollFd, EPOLL_CTL_MOD, event_nfds.data.fd, &event_nfds);  
                }  
            }  
            else  
            {  
                cout <<"[CEpollClient error:] other epoll error"<<endl;  
                DelEpoll(events[ifd].data.fd);  
                CloseUser(iuserid);  
            }  
        }  
    }  
}  
　　  
bool CEpollClient::DelEpoll(int iSockFd)  
{  
    bool bret = false;  
    struct epoll_event event_del;  
    if(0 < iSockFd)  
    {  
        event_del.data.fd = iSockFd;  
        event_del.events = 0;  
        if( 0 == epoll_ctl(m_iEpollFd, EPOLL_CTL_DEL, event_del.data.fd, &event_del) )  
        {  
            bret = true;  
        }  
        else  
        {  
            cout <<"[SimulateStb error:] DelEpoll,epoll_ctl error,iSockFd:"<<iSockFd<<endl;  
        }  
        m_iSockFd_UserId[iSockFd] = -1;  
    }  
    else  
    {  
        bret = true;  
    }  
    return bret;  
}
```

</details>

<details><summary>服务器主程序：</summary>

```c++
#include <iostream>  
#include "cepollserver.h"  
  
using namespace std;  
  
int main()  
{  
    CEpollServer  theApp;  
    theApp.InitServer("127.0.0.1", 8000);  
    theApp.Run();  

    return 0;  
}  
```

</details>

<details><summary>客户端主程序：</summary>

```c++
#include "cepollclient.h"  

int main(int argc, char *argv[])  
{  
    CEpollClient *pCEpollClient = new CEpollClient(2, "127.0.0.1", 8000);  
    if(NULL == pCEpollClient)  
    {  
        cout<<"[epollclient error]:main init"<<"Init CEpollClient fail"<<endl;  
    }  

    pCEpollClient->RunFun();  

    if(NULL != pCEpollClient)  
    {  
        delete pCEpollClient;  
        pCEpollClient = NULL;  
    }  

    return 0;  
}  
```

</details>

