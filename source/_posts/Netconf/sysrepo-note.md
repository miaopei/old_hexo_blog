---
title: sysrepo note
tags:
  - Netconf
categories:
  - Netconf
reward: true
toc: true
p: Netconf/sysrepo-note
abbrlink: 63382
date: 2020-09-23 19:50:28
---

# sysrepo 

> sysrepo - 1.4.2 笔记

## 1. sysrepo 概述

`Sysrepo` 是 `Linux/Unix` 系统下一个基于 `YANG` 模型的配置和操作数据库，为应用程序提供统一的操作数据的接口。应用程序使用 `YANG` 模型来建模，通过利用 `YANG` 模型完成数据合法性的检查，保证的风格的一致，不需要应用程序直接操作配置文件的一种数据管理方式。

<!-- more -->

### 1.1 基本特性与原则

- `sysrepo` 只是一个库，不是一个独立的进程
- 全部的数据始终由 `Yang` 模型区分，这就可能造成许多严重的后果，例如，允许同时使用不同的模型进行工作，这将可 导致数据访问时异常。
- 在所有有 `IPC` 中使用共享内存的方式，取代了之前的 UNIX中进程间通信的方式，这样更高效，性能更优，扩展性更强
- 在 `sysrepo` 中几乎不存在 CPU 时间浪费，没有活动等待或者定期检查
- 完全可定制化的事件处理，从定期检查或者 `poll/select` 到自动线程处理
- 访问控制严格受制于文件系统的权限
- `sysrepo` 操作期间可以修改 `Yang` 模型

### 1.2 主要特点

- `sysrepo` 的主要功能是使用 `YANG` 模型对数据进行操作并订阅各种事件。但是，在执行任何操作时，都需要创建会话，连接会话，并要 `install` 所支持的各类 `Yang` 模型。假如设置了日志操作记录，`sysrepo` 在运行时，也可以保留它的行为记录。
- 通过 `Yang` 的 `xpath` 来修改与获取数据，所以要求了解 `xpath` 的基础知识。
- 最常见的操作订阅事件和修改订阅事件，订阅事件是允许应用程序根据特定的事件回调相应的数据执行，更改操作。操作执行成功后，会将对应配置操作保存，这样 `sysrepo` 可以充当更智能的配置文件，从而保证配置的可恢复性。
- 也支持 `Rpc/Action/Notify` 的订阅，这样可以通过执行特别的 `Rpc` ，就可以分别向其他 `sysrepo` 客户端通知各种生成的事件。

### 1.3 访问方法

应用程序可以通过两种方法来访问 `sysrepo`，一种是直接的方法，即当应用程序需要配置数据或者执行相应的 `callback` 来响应配置变化时，可以通过 `sysrepo` 自带的应用程序来触发用 `sysrepo` 的功能函数来实现。这种方法一般用于开发人员自测或验证某个模块时使用；另一种是间接的方法，即应用程序通过创建 `Deamon` 进程的方法，该方法是通过将对 `sysrepo` 的调用转化为对应用程序的特定操作，该方法也最容易扩展，也无需为了使用 `sysrepo` 数据库而做相应的更改。如果有多个类似的 `Deamon` 进程，可以将这些进程合成一个 `plugind`，最后由一个进程统一纳管。可扩展性得到大大的提高。间接方法的使用如图所示：

![sysrepo 使用方法](/images/images_sr/sr_apps.png)

### 1.4 数据库

数据库结构大多是遵循 `NMDA`（网络管理数据存储区体）所定义的体系架构。`sysrepo` 同样也不例外，`sysrepo` 中定义了四类数据库，分别是 `startup`，`running`，`candidate` 和 `operational`。

1. `startup` 库，是 `sysrepo` 中唯一的持久性数据存储库，它包含设备启动时的配置文件，系统启动后创建的第一个 `sysrepo` 连接（共享内存）时，会将配置文件从 `startup` 库 `copy` 到 `running` 库；
2. `running` 数据库，是保存当前所运行时系统配置，当一个配置发生变化时并且设备需要重新配置时， `running` 数据库需要修改。系统重启时不会存在，如果需要，可以将配置 `copy` 到 `startup` 库。
3. `candidate` 数据库，候选库，顾名思义，它是一个准备配置的数据但又不影响实际设备使用。虽然该库中的数据不限制设备的正常使用，可以不必严格按照 NETCONF协议的定义，但也是需要遵循一般的数据存储规则。该库正常是无效的，实际使用时，需要将该库 `mirror` 到 `running`，由 `running` 完成修改和配置下发，最后通过 `sr_copy_config()`, 将 `candidate` 库重置。整个会话的过程中可能需要相应的 `lock` 操作，来保证操作的一致与完整性。
4. `operational` 库，维护当前使用的配置，并且该库只可读。它通常与对应的 `running` 库有所不同，而且，只包含任何状态数据结点。在默认的情况下，该库是空的，对于用户来说，全部的订阅数据和操作数据都存储于 `operational` 库中。并且 `Notificationg RPC/Action` 数据的校验都是在 `operational` 库是完成。

### 1.5 运行模式

- 对于连接与会话来说，会话是不同步的，所以不会在多个线程中共享一个会话。每个线程都需要建立属于自己的会话，来确保本线程运行的正确。
- 对于订阅来说，可以由应用程序对感兴趣的事件通过 `*_subscribe()` 函数来做相应的订阅。订阅在原则上是将全部的的事件一并处理，应用程序也可以将根据不同的事件类型拆分成多个不同的订阅，用于保证事件的并发处理。
- 每个订阅可以由不同的方式处理，这个由 `sysrepo` 做统一管理。`sysrepo` 创建一个单独的线程来捕获各种订阅事件的发生，然后通过订阅所注册的回调函数不处理它们。

## 2. sysrepo 常用操作命令

`sysrepo` 提供两个独立的，非常实用的程序。方便开发者便捷地使用 `sysrepo` 来开发与调试自己的应用。

### 2.1 Sysrepoctl

`sysrepoctl`，它用于列出，安装，卸载或更新 `sysrepo` 模块，也能用于修改一个 `sysrepo` 模块的特性，权限等。开发过程中经常使用的命令如下

```shell
# 列出全部已经安装在 sysrepo 中的 Yang 模块，并包含模块的基本信息
$ sysrepoctl -l, --list     
# 例如：
$ sysrepoctl -l
```

```shell
# 安装指定 Yang 模型
$ sysrepoctl -i， --install  
# 例如：
# 以默认权限安装 ietf-interfaces.yang 模型
$ sysrepoctl --install /root/ietf-interfaces.yang  

# 为特定 admin 用户安装可访问权限为 644 的 ietf-interfaces.yang 模型
$ sysrepoctl --install /root/ietf-interfaces.yang --owner=admin:admin --permissions=644
```

```shell
# 卸载已安装的 Yang 模型
$ sysrepoctl -u, --uninstall 
# 例如：
$ sysrepoctl --uninstall ietf-interfaces
```

```shell
# 修改 Yang 模型，常用的是设置模型支持的特性
$ sysrepoctl -c, --chang 
# 例如：
$ sysrepoctl --change ietf-interfaces --(disable|enable)-feature if-mib
```

```shell
# 更新 Yang 模型，如果已安装的 Yang 模型有更新，可以执行该命令
$ sysrepoctl -U, --update
# 例如：
$ sysrepoctl --update /root/ietf-netconf@2013-09-29.yang
```

更多 `sysrepoctl` 的使用，请参考 `sysrepoctl -h`。

### 2.2 sysrepocfg

`sysrepocfg` 是用于 `importing`，`exporting`，`editing`，`replacing` 配置到指定的数据库中。命令默认是操作 `running` 库，也支持多种数据格式，`json` , `xml` , `lyb` ，除非通过 `–format` 特定指出，默认的采用 `xml` 格式。常用的命令如下：

```shell
# 导入一个配置
$ sysrepocfg -I, --import[=]
# 例如：
# 将 ietf-interfaces 配置导入默认 running 下的 ietf-interfaces 模块
$ sysrepocfg --import=/root/ietf-interfaces.xml

# 将 json 格式的 ietf-interfaces 配置导入 startup 的 ietf-interfaces 模块
$ sysrepocfg --import=/root/ietf-interfaces_startup.json --datastore startup --module ietf-interfaces
```

```shell
# 导出一个配置
$ sysrepocfg -X, --export[=]
# 例如：
# 将 running 库 ietf-interfaces 的配置 xml 的格式导入，并以 ietf-interfaces_running.xml 名字命令配置文件
$ sysrepocfg --export=ietf-interfaces_running.xml --format xml --module ietf-interfaces
```

```shell
# 编辑或修改配置文件，应用到指定的数据库
$ sysrepocfg -E, --edit[=/]
# 例如：
$ sysrepocfg --edit=candidate.xml --datastore candidate
# 如果是修改 running 库，需要加相应的锁
$ sysrepocfg --edit=vim --lock
```

```shell
# 发一个 RPC 请求，RPC 返回的结果直接输出于终端
$ sysrepocfg -R, --rpc[=/]
# 例如：
$ sysrepocfg --rpc=vim
```

更多 `sysrepocfg` 的使用，请参考 `sysrepocfg -h`。

## 3. sysrepo-plugind 源码分析

应用程序通过将对 `sysrepo` 的调用通过 `sysrepo` 提供的相应的 API接口访问方法，称为 `syrepo` 的间接访问方法。该方法是应用程序通过创建 Deamon进程，通过 `IPC Shm` 机制与 `sysrepo` 通信。可以做到对 `sysrepo` 的即插即用，最后由 `sysrepo` 纳管，这就是 `Plugind`，命名为 `sysrepo-plugind`。要快速的使用 `sysrepo`，并快速开发出适配于 `sysrepo` 的插件，就要先了解 `sysrepo-plugind` 的实现原理与机制，就需要先从实现 `sysrepo-plugind` 的源码处着手。`sysrepo` 源码路径：`git clone https://github.com/sysrepo/sysrepo.git` 。 `Sysrepo-plugind` 实现的路径为 `sysrepo/src/executables/sysrepo-plugind.c` 。下面也就从该文件开始说。

### 3.1 数据结构

```c++
struct srpd_plugin_s {
    void *handle;
    srp_init_cb_t init_cb;
    srp_cleanup_cb_t cleanup_cb;
    void *private_data;
};
/*结构参数说明*/
handle: 动态库句柄,在load_plugin中细说
 
srp_init_cb_t:
/*Sysrepo plugin initialization callback.*/
typedef int (*srp_init_cb_t)(sr_session_ctx_t *session, void **private_data);
 
srp_cleanup_cb_t :
/*brief Sysrepo plugin cleanup callback.*/
typedef void (*srp_cleanup_cb_t)(sr_session_ctx_t *session, void *private_data);
 
private_data:  Private context opaque to sysrepo
```

### 3.2 main 函数实现

```c++
int main(int argc, char** argv)
{
    struct srpd_plugin_s *plugins = NULL;       /*plugin结构*/
    sr_conn_ctx_t *conn = NULL;                 /*sysrepo连接的上下文，该结构定义于common.h.in*/
    sr_session_ctx_t *sess = NULL;              /*sysrepo会话的上下文，该结构定义于common.h.in中*/
    sr_log_level_t log_level = SR_LL_ERR;       /*输出log等级，默认是ERR*/
    int plugin_count = 0, i, r, rc = EXIT_FAILURE, opt, debug = 0;
    struct option options[] = {
        {"help",      no_argument,       NULL, 'h'},
        {"version",   no_argument,       NULL, 'V'},
        {"verbosity", required_argument, NULL, 'v'},
        {"debug",     no_argument,       NULL, 'd'},
        {NULL,        0,                 NULL, 0},
    };                                          /*命令行支持的参数*/
 
    /* process options */
    opterr = 0;
 
    /*整个while循环是解析命令的参数，例如，在调试时，输入“sysrepo-plugind -d -v 4” 是debug模式        
     *下log级别DBG级，将会打印全部的调试信息
     */
    while ((opt = getopt_long(argc, argv, "hVv:d", options, NULL)) != -1) {
        switch (opt) {
        case 'h':
            version_print();
            help_print();
            rc = EXIT_SUCCESS;
            goto cleanup;
        case 'V':
            version_print();
            rc = EXIT_SUCCESS;
            goto cleanup;
        case 'v':
            if (!strcmp(optarg, "none")) {
                log_level = SR_LL_NONE;
            } else if (!strcmp(optarg, "error")) {
                log_level = SR_LL_ERR;
            } else if (!strcmp(optarg, "warning")) {
                log_level = SR_LL_WRN;
            } else if (!strcmp(optarg, "info")) {
                log_level = SR_LL_INF;
            } else if (!strcmp(optarg, "debug")) {
                log_level = SR_LL_DBG;
            } else if ((strlen(optarg) == 1) && (optarg[0] >= '0') && (optarg[0] <= '4')) {
                log_level = atoi(optarg);
            } else {
                error_print(0, "Invalid verbosity \"%s\"", optarg);
                goto cleanup;
            }
            break;
        case 'd':
            debug = 1;
            break;
        default:
            error_print(0, "Invalid option or missing argument: -%c", optopt);
            goto cleanup;
        }
    }
 
    /* check for additional argument */
    if (optind < argc) {
        error_print(0, "Redundant parameters");
        goto cleanup;
    }
 
    /* load plugins：将所有的pluginl加载，这是整个main第一处核心点，这关系用户开发的plugin能否正确加载*/
    if (load_plugins(&plugins, &plugin_count)) {
        goto cleanup;
    }
 
    /* daemonize, sysrepo-plugind no longer directly logs to stderr */
    daemon_init(debug, log_level);
 
    /* create connection (after we have forked so that our PID is correct) */
    /*调用sysrepo API(sr_connect)创建与sysrepo的连接，并将返回创建连接的上下发*/
    if ((r = sr_connect(0, &conn)) != SR_ERR_OK) {
        error_print(r, "Failed to connect");
        goto cleanup;
    }
 
    /* create session */
    /*调用sysrepo API(sr_session_start)创建与sysrepo running库的会话，并启动该会话*/
    if ((r = sr_session_start(conn, SR_DS_RUNNING, &sess)) != SR_ERR_OK) {
        error_print(r, "Failed to start new session");
        goto cleanup;
    }
    /*sr_connect(), sr_session_start(),是连接sysrepo基础，这两点基础实现，在后面sysrepo源码 
     *分析做详细说明，不在sysrepo-plugin中说明
     */
 
    /* init plugins */
    /*对所有已加载的plugin通过调用init_cb注册的回调初始化，这是整个main第二处核心点，与用户是强 
     *相关用户开发的插件，注册，订阅，初始化都通过init_cb，否则不能将sysrepol通信连接*/
    for (i = 0; i < plugin_count; ++i) {
        r = plugins[i].init_cb(sess, &plugins[i].private_data);
        if (r != SR_ERR_OK) {
            SRP_LOG_ERR("Plugin initialization failed (%s).", sr_strerror(r));
            goto cleanup;
        }
    }
 
    /* wait for a terminating signal */
    pthread_mutex_lock(&lock);
    while (!loop_finish) {
        pthread_cond_wait(&cond, &lock);
    }
    pthread_mutex_unlock(&lock);
 
    /* cleanup plugins */
    /* sysrepo-plugindf正常结束后，回收plugin初始化时分配的资源*/
    for (i = 0; i < plugin_count; ++i) {
        plugins[i].cleanup_cb(sess, plugins[i].private_data);
    }
 
    /* success */
    rc = EXIT_SUCCESS;
 
    /*结束后，回收已分配的全部资源*/
cleanup:
    for (i = 0; i < plugin_count; ++i) {
        dlclose(plugins[i].handle);
    }
    free(plugins);
 
    sr_disconnect(conn);
    return rc;
}
```

### 3.3 load_plugins

```c++
static int
load_plugins(struct srpd_plugin_s **plugins, int *plugin_count)
{
    void *mem, *handle;
    DIR *dir;
    struct dirent *ent;
    const char *plugins_dir;
    char *path;
    int rc = 0;
 
    *plugins = NULL;
    *plugin_count = 0;
 
    /* get plugins dir from environment variable, or use default one */
    /* bin_common.h.in #define SRPD_PLUGINS_PATH "@PLUGINS_PATH@"
     * @PLUGINS_PATH@在CMakeList.txt中定义，在编译时也可以自定义
     * CMakeList.txt对其定义如下
     * if(NOT PLUGINS_PATH)
     * set(PLUGINS_PATH             
     *    "${CMAKE_INSTALL_PREFIX}/${CMAKE_INSTALL_LIBDIR}/sysrepo/plugins/" CACHE PATH
     *   "Sysrepo plugin daemon plugins path.")
     *   endif()
     *  用户不指定plugin的路径时，debian系统默认将plugin的动态库文件*.so安装 
     *    于/usr/lib/x86_64-linux-gnu/sysrepo/plugins/目录下，
     *  而Centos系统的默认安装路径为/usr/lib/sysrepo/plugins，在开发plugind时，安装路径也需要 
     *  指定到该路径下，否则，*.so找不到，则load不成功。
     */
    plugins_dir = getenv("SRPD_PLUGINS_PATH");
    if (!plugins_dir) {
        plugins_dir = SRPD_PLUGINS_PATH;
    }
 
    /* create the directory if it does not exist */
    /* access函数，:检查调用进程是否可以对指定的文件执行某种操作， F_OK文件是否存在
     * 本段代码是检测SRPD_PLUGINS_PATH目录是否存在，如果不存在，调用sr_mkpath创建目录，并设置*            
     * 目录的访问权限000777。本段代码是安全性代码，确保指定的路径存在。对于实际开发中，是通过编 
     * 译是指定，不存在路径的动态库无法安装。
     */
    if (access(plugins_dir, F_OK) == -1) {
        if (errno != ENOENT) {
            error_print(0, "Checking plugins dir existence failed (%s).", strerror(errno));
            return -1;
        }
        if (sr_mkpath(plugins_dir, 00777) == -1) {
            error_print(0, "Creating plugins dir \"%s\" failed (%s).", plugins_dir, strerror(errno));
            return -1;
        }
    }
    
    /* opendir函数，找开指定的目录文件，并返回DIR*形态的目录流，
     * 目录的读取与搜查也都需要此目录流 
     */
    dir = opendir(plugins_dir);
    if (!dir) {
        error_print(0, "Opening \"%s\" directory failed (%s).", plugins_dir, strerror(errno));
        return -1;
    }
    
    /*readdir函数，读取目录，返回参数dir目录流的下个目录进入点
     * 返回的结果是struct dirent的内容*/
    while ((ent = readdir(dir))) {
        /*Linux系统中存在"." ".."两类目录，这两类目录名结构，在实际是不需要使用，需要跳过。*/
        if (!strcmp(ent->d_name, ".") || !strcmp(ent->d_name, "..")) {
            continue;
        }
        
        /* open the plugin */
        /*将SRPD_PLUGINS_PATH与也读取的目录文件名，组成一个完成的动态库路径，供后面操作。*/
        if (asprintf(&path, "%s/%s", plugins_dir, ent->d_name) == -1) {
            error_print(0, "asprintf() failed (%s).", strerror(errno));
            rc = -1;
            break;
        }
        
        /*RTLD_LAZY:暂缓决定，等有需要时再解出符号 
         *以RTLD_LAZY模式打开动态库，返回一个句柄给调用进程，如果失败，则返回。
         */
        handle = dlopen(path, RTLD_LAZY);
        if (!handle) {
            error_print(0, "Opening plugin \"%s\" failed (%s).", path, dlerror());
            free(path);
            rc = -1;
            break;
        }
        free(path);
        
        /* allocate new plugin */
        /* 分配一个新的plugin空间，并将新分配的men挂载plugins结构下*/
        mem = realloc(*plugins, (*plugin_count + 1) * sizeof **plugins);
        if (!mem) {
            error_print(0, "realloc() failed (%s).", strerror(errno));
            dlclose(handle);
            rc = -1;
            break;
        }
        *plugins = mem;
 
        /* find required functions */
        /* plugins结构中有两个必须的回调函数，一个是init_cb,另一个是cleanup_cb
         * 通过 void *dlsym(void *handle, const char* symbol);，
         * handle是使用dlopen函数之后返回的句柄，
         * symbol是要求获取的函数的名称。
         * SRP_INIT_CB定义如下：#define SRP_INIT_CB     "sr_plugin_init_cb"
         * SRP_CLEANUP_CB定义下：#define SRP_CLEANUP_CB  "sr_plugin_cleanup_cb"
         * 此两个CB函数，也就是在开发插件中必须实现的两个入口函数，如果不存在，则加载失败。
         */
        *(void **)&(*plugins)[*plugin_count].init_cb = dlsym(handle, SRP_INIT_CB);
        if (!(*plugins)[*plugin_count].init_cb) {
            error_print(0, "Failed to find function \"%s\" in plugin \"%s\".", SRP_INIT_CB, ent->d_name);
            dlclose(handle);
            rc = -1;
            break;
        }
 
        *(void **)&(*plugins)[*plugin_count].cleanup_cb = dlsym(handle, SRP_CLEANUP_CB);
        if (!(*plugins)[*plugin_count].cleanup_cb) {
            error_print(0, "Failed to find function \"%s\" in plugin \"%s\".", SRP_CLEANUP_CB, ent->d_name);
            dlclose(handle);
            rc = -1;
            break;
        }
        
        /* finally store the plugin */
        /*最后，本次so解析成功，保存本次so的解析结果，执行一下次目录文件的读取*/
        (*plugins)[*plugin_count].handle = handle;
        (*plugins)[*plugin_count].private_data = NULL;
        ++(*plugin_count);
    }
    /*目录文件读取结束，关闭目录读取流，返回的参考中有插件结构plugins。*/
    closedir(dir);
    return rc;
}
```

### 3.4 init_cb

```c++
// srpd_plugin_s 结构中定义了 init 的回调函数
// 如下：
typedef int (*srp_init_cb_t)(sr_session_ctx_t *session, void **private_data);
// 在 load plugin 时，
#define SRP_INIT_CB     "sr_plugin_init_cb"
init_cb = dlsym(handle, SRP_INIT_CB);
// 在 sysrepo-plugind 的 main 实现时，需要对 plugin 的初始化，实际就是需要用户对sr_plugin_init_cb() 实现，是完成该 plugin 的资源分配，用户感兴趣的事情做订阅，Ｍodule change RPC/Action, Notify, get——items 等操作，均在此处完成。有如下例子，请参考。
 
int sr_plugin_init_cb(sr_session_ctx_t *session, void **private_ctx)
{
    int rc;
    struct plugind_ctx *ctx;
    ctx = calloc(1, sizeof *ctx);
    if (!ctx) 
    {
        rc = SR_ERR_NOMEM;
        goto error;
    }
 
    /*在下面初始与之有关的操作，例如，本地数据结构的初始化，sysrepo的订阅初始化*/
    ...
  
    SRP_LOG_DBGMSG("plugin initialized successfully.");
    ctx->session = session;
    *private_ctx = ctx;
    return SR_ERR_OK;
 
error:
    SRP_LOG_ERR("plugin initialization failed (%s).", sr_strerror(rc));
    sr_unsubscribe(ctx->subscription);
    free(ctx);
    return rc;
}
```

### 3.5 cleanup_cb

```c++
// srpd_plugin_s 结构中定义了 cleanup 的回调函数
// 如下：
typedef void (*srp_cleanup_cb_t)(sr_session_ctx_t *session, void *private_data);
// 在 load plugin 时，
#define SRP_CLEANUP_CB  "sr_plugin_cleanup_cb"
cleanup_cb = dlsym(handle, SRP_CLEANUP_CB);
// 所以，对于用户来就，是需要对 sr_plugin_cleanup_cb() 实现，回收 plugin 在初始化时分配的资源。例如下面的 cleanup 实现，可以参考
 
void sr_plugin_cleanup_cb(sr_session_ctx_t *session, void *private_ctx)
{
    (void)session;
 
    struct plugind_ctx *ctx = (struct plugind_ctx *)private_ctx;
    sr_unsubscribe(ctx->subscription);
    free(ctx);
    
    nb_terminate();
    yang_terminate();
    
    SRP_LOG_DBGMSG("plugin cleanup finished.");
}
```

整个 `sysrepo-plugind.c` 代码结构简单，注释丰富，没有使用复杂的语法，还是非常容易理解的。

## 4. sysrepo 连接与会话

### 4.1 何为连接与会话

开发者要开始使用 `sysrepo` ，首先必须创建一个连接。一个应用程序或者进程即使可以允许创建多个连接，但是一般情况只会创建一个连接。`sysrepo` 允许同时创建多个连接。简单的举个例子，通常情况下，`sysrepo-plugin` 在 `init_cb` 初始时就会创建一个连接，这是一个由 `sysrepo-plugin` 与 `sysrepo` 所创建的连接，只要发生异常不释放，该连接会一直存在整个 `sysrepo-plugin` 进程的生命周期，此外，例如用户通过 `sysrepoctl -l |grep ***`  看某个 `Yang` 模型是否已经加载，`sysrepoctl` 应用程序也创建一个短连接，该连接在命令执行结束后立即释放，假如是极端修改，不释放该连接，再使用 `sysrepocfg` 来配置 `runing` 库，这时有 3 个与 `sysrepo` 连接。并且 3 个连接不干扰，也不影响 `sysrepo` 的正常工作。

而会话，是建立在连接之下，一个连接下可以创建多个会话，每个会话都有一个唯一的标识，每个会话总是可以选择一个可随时更改的数据库，使用些会话的所有 API 调用都将在该数据库下操作。

连接与会话的关系如下所示，可能不是特别准备，但大概就是这个意思。

![连接与会话关系](/images/images_sr/connect_session.png)

### 4.2 核心数据结构

`connection` 的数据结构主要是存储 `sysrepo` 连接与 `Libyang` 的上下文，该连接所创建的共享内存结构。数据结构定义如下

```c++

/**
 * @brief Sysrepo connection.
 */
struct sr_conn_ctx_s {
    struct ly_ctx *ly_ctx;          /**< Libyang context, also available to user. */
    sr_conn_options_t opts;         /**< Connection options. */
    sr_diff_check_cb diff_check_cb; /**< Connection user diff check callback. */
 
    pthread_mutex_t ptr_lock;       /**< Session-shared lock for accessing pointers to sessions. */
    sr_session_ctx_t **sessions;    /**< Array of sessions for this connection. */
    uint32_t session_count;         /**< Session count. */
 
    int main_create_lock;           /**< Process-shared file lock for creating main/ext SHM. */
    sr_rwlock_t ext_remap_lock;     /**< Session-shared lock for remapping ext SHM. */
    sr_shm_t main_shm;              /**< Main SHM structure. */
    sr_shm_t ext_shm;               /**< External SHM structure (all stored offsets point here). */
 
    struct sr_mod_cache_s {
        sr_rwlock_t lock;           /**< Session-shared lock for accessing the module cache. */
        struct lyd_node *data;      /**< Data of all cached modules, */
 
        struct {
            const struct lys_module *ly_mod;    /**< Libyang module in the cache. */
            uint32_t ver;           /**< Version of the module data in the cache, 0 is not valid */
        } *mods;                    /**< Array of cached modules. */
        uint32_t mod_count;         /**< Cached modules count. */
    } mod_cache;                    /**< Module running data cache. */
}
```

`cache` 需要特别说明：如果一个会话工作在 `running` 的数据库下操作，并且该会话的连接使能 `cache` 功能，则不会每次都从 `sysrepo` 中加载数据，可以从 `cache` 中复制数据，这样，可以大幅度提高 `sysrepo` 的处理性能。

`session` 的主要数据结构

```c++
/**
 * @brief Sysrepo session.
 */
struct sr_session_ctx_s {
    sr_conn_ctx_t *conn;            /**< Connection used for creating this session. */
    sr_datastore_t ds;              /**< Datastore of the session. */
    sr_sub_event_t ev;              /**< Event of a callback session. ::SR_EV_NONE for standard user sessions. */
    sr_sid_t sid;                   /**< Session information. */
    sr_error_info_t *err_info;      /**< Session error information. */
 
    pthread_mutex_t ptr_lock;       /**< Lock for accessing pointers to subscriptions. */
    sr_subscription_ctx_t **subscriptions;  /**< Array of subscriptions of this session. */
    uint32_t subscription_count;    /**< Subscription count. */
 
    struct {
        struct lyd_node *edit;      /**< Prepared edit data tree. */
        struct lyd_node *diff;      /**< Diff data tree, used for module change iterator. */
    } dt[SR_DS_COUNT];              /**< Session-exclusive prepared changes. */
 
    struct sr_sess_notif_buf {
        ATOMIC_T thread_running;    /**< Flag whether the notification buffering thread of this session is running. */
        pthread_t tid;              /**< Thread ID of the thread. */
        sr_rwlock_t lock;           /**< Lock for accessing thread_running and the notification buffer
                                         (READ-lock is not used). */
        struct sr_sess_notif_buf_node {
            char *notif_lyb;        /**< Buffered notification to be stored in LYB format. */
            time_t notif_ts;        /**< Buffered notification timestamp. */
            const struct lys_module *notif_mod; /**< Buffered notification modules. */
            struct sr_sess_notif_buf_node *next;    /**< Next stored notification buffer node. */
        } *first;                   /**< First stored notification buffer node. */
        struct sr_sess_notif_buf_node *last;    /**< Last stored notification buffer node. */
    } notif_buf;                    /**< Notification buffering attributes. */
}
```

从 `session` 结构中主要是用于该次 `session` 的连接，该次 `session` 要连接的数据库类型（4种，`runing` , `startup` , `candidate` , `operation`），以及重中之重的 `sr_subscription_ctx_t **subscriptions`， `sysrepo` 的所支持操作的订阅都在该结构中定义，不多说，直接看数据结构定义：

```c++
/**
 * @brief Sysrepo subscription.
 */
struct sr_subscription_ctx_s {
    sr_conn_ctx_t *conn;            /**< Connection of the subscription. */
    uint32_t evpipe_num;            /**< Event pipe number of this subscription structure. */
    int evpipe;                     /**< Event pipe opened for reading. */
    ATOMIC_T thread_running;        /**< Flag whether the thread handling this subscription is running. */
    pthread_t tid;                  /**< Thread ID of the handler thread. */
    pthread_mutex_t subs_lock;      /**< Session-shared lock for accessing specific subscriptions. */
 
    struct modsub_change_s {
        char *module_name;          /**< Module of the subscriptions. */
        sr_datastore_t ds;          /**< Datastore of the subscriptions. */
        struct modsub_changesub_s {
            char *xpath;            /**< Subscription XPath. */
            uint32_t priority;      /**< Subscription priority. */
            sr_subscr_options_t opts;   /**< Subscription options. */
            sr_module_change_cb cb; /**< Subscription callback. */
            void *private_data;     /**< Subscription callback private data. */
            sr_session_ctx_t *sess; /**< Subscription session. */
 
            uint32_t request_id;    /**< Request ID of the last processed request. */
            sr_sub_event_t event;   /**< Type of the last processed event. */
        } *subs;                    /**< Configuration change subscriptions for each XPath. */
        uint32_t sub_count;         /**< Configuration change module XPath subscription count. */
 
        sr_shm_t sub_shm;           /**< Subscription SHM. */
    } *change_subs;                 /**< Change subscriptions for each module. */
    uint32_t change_sub_count;      /**< Change module subscription count. */
 
    struct modsub_oper_s {
        char *module_name;          /**< Module of the subscriptions. */
        struct modsub_opersub_s {
            char *xpath;            /**< Subscription XPath. */
            sr_oper_get_items_cb cb;    /**< Subscription callback. */
            void *private_data;     /**< Subscription callback private data. */
            sr_session_ctx_t *sess; /**< Subscription session. */
 
            uint32_t request_id;    /**< Request ID of the last processed request. */
            sr_shm_t sub_shm;       /**< Subscription SHM. */
        } *subs;                    /**< Operational subscriptions for each XPath. */
        uint32_t sub_count;         /**< Operational module XPath subscription count. */
    } *oper_subs;                   /**< Operational subscriptions for each module. */
    uint32_t oper_sub_count;        /**< Operational module subscription count. */
 
    struct modsub_notif_s {
        char *module_name;          /**< Module of the subscriptions. */
        struct modsub_notifsub_s {
            char *xpath;            /**< Subscription XPath. */
            time_t start_time;      /**< Subscription start time. */
            int replayed;           /**< Flag whether the subscription replay is finished. */
            time_t stop_time;       /**< Subscription stop time. */
            sr_event_notif_cb cb;   /**< Subscription value callback. */
            sr_event_notif_tree_cb tree_cb; /**< Subscription tree callback. */
            void *private_data;     /**< Subscription callback private data. */
            sr_session_ctx_t *sess; /**< Subscription session. */
        } *subs;                    /**< Notification subscriptions for each XPath. */
        uint32_t sub_count;         /**< Notification module XPath subscription count. */
 
        uint32_t request_id;    /**< Request ID of the last processed request. */
        sr_shm_t sub_shm;           /**< Subscription SHM. */
    } *notif_subs;                  /**< Notification subscriptions for each module. */
    uint32_t notif_sub_count;       /**< Notification module subscription count. */
 
    struct opsub_rpc_s {
        char *op_path;              /**< Subscription RPC/action path. */
        struct opsub_rpcsub_s {
            char *xpath;            /**< Subscription XPath. */
            uint32_t priority;      /**< Subscription priority. */
            sr_rpc_cb cb;           /**< Subscription value callback. */
            sr_rpc_tree_cb tree_cb; /**< Subscription tree callback. */
            void *private_data;     /**< Subscription callback private data. */
            sr_session_ctx_t *sess; /**< Subscription session. */
 
            uint32_t request_id;    /**< Request ID of the last processed request. */
            sr_sub_event_t event;   /**< Type of the last processed event. */
        } *subs;                    /**< RPC/action subscription for each XPath. */
        uint32_t sub_count;         /**< RPC/action XPath subscription count. */
 
        sr_shm_t sub_shm;           /**< Subscription SHM. */
    } *rpc_subs;                    /**< RPC/action subscriptions for each operation. */
    uint32_t rpc_sub_count;         /**< RPC/action operation subscription count. */
}
```

### 4.3 connection 函数

```c++
/*功能：连接sysrepo数据库
 *输入：默认的连接处理选项
 *输出：该连接的数据，用于该连接的后续的操作，最后由sr_disconnect释放
 */
API int
sr_connect(const sr_conn_options_t opts, sr_conn_ctx_t **conn_p)
{
    sr_error_info_t *err_info = NULL;
    sr_conn_ctx_t *conn = NULL;
    struct lyd_node *sr_mods = NULL;
    int created = 0, changed;
    sr_main_shm_t *main_shm;
    uint32_t conn_count;
 
    SR_CHECK_ARG_APIRET(!conn_p, NULL, err_info);
 
    /* check that all required directories exist */
    /* 路径包括startup库的存储路径，notify的路径，sysrepo加载的Yang的路径。
     * 并且获取以上路径的访问权限。与路径有关的，都在CMakeLists.txt中的定义
     * 使用者可以修改路径，也可以使用定义的默认路径。
     */
    if ((err_info = sr_shmmain_check_dirs())) {
        goto cleanup;
    }
 
    /* create basic connection structure */
    /*创建一个基础连接结构，包括，分配连接的存储空间，初始化YANG的上下文，
     * 互斥信号量初始化，共享内存文件锁权限打开，读写锁的初始化
     */
    if ((err_info = sr_conn_new(opts, &conn))) {
        goto cleanup;
    }
    
    /* CREATE LOCK */
    /*加锁*/
    if ((err_info = sr_shmmain_createlock(conn->main_create_lock))) {
        goto cleanup;
    }
 
    /* open the main SHM */
    /*初始化主SHM，打开主SHM,为主SHM分配合适的空间,并对主SHM做相应的初始化*/
    if ((err_info = sr_shmmain_main_open(&conn->main_shm, &created))) {
        goto cleanup_unlock;
    }
 
    /* open the ext SHM */
     /*初始化扩展SHM，打开扩展SHM,为扩展SHM分配合适的空间,并对扩展SHM做相应的初始化*/
    if ((err_info = sr_shmmain_ext_open(&conn->ext_shm, created))) {
        goto cleanup_unlock;
    }
    
    ／*Sysrepo SHM使用主+扩展SHM机制,整体机制在后面细谈，此处主要是将连接的创建。先略过*／
    /*该行代码之前的操作,都是基本操作,权限获取,内存大小分配初始化.该行代码之后,需要将已加载的 
      YANG数据模型做解析，并更新存储到相应的结构中*/
 
    /* update connection context based on stored lydmods data */
    /* 加载已经存储的YANG模型,并响应任意的调试变化,并要更新Connection的上下文
     * 根据前面所创建所保存的libyang的上下文ly_ctx,如果检测到lyd_node不存在,则为Sysrepo创建一 
     * 个新的YANG模型数据结构struct lyd_node,如果存在,则解析sysrepo Yang 模型数据.并对模块作上 
     * 下文件的更新.但是对于第一个连接,lyd_node一开始都是不存在的,所以,在完成创建与加载lyd_node 
     *  后,需要将全部的YANG模型解析到lys_module->lyd_node中,一个YANG模型相当于lys_module- 
     *  >lyd_node下的一个节点,一个节点一个节点加载,挂载到lys_module的链表中.
     */
    if ((err_info = sr_conn_lydmods_ctx_update(conn, created || !(opts & 
           SR_CONN_NO_SCHED_CHANGES), &sr_mods, &changed))) {
        goto cleanup_unlock;
    }
    
    /*这段代码不解读,看注释就能明白*/
    if (changed || created) {
        /* clear all main SHM modules (if main SHM was just created, there aren't any anyway) */
        if ((err_info = sr_shm_remap(&conn->main_shm, sizeof(sr_main_shm_t)))) {
            goto cleanup_unlock;
        }
        main_shm = (sr_main_shm_t *)conn->main_shm.addr;
        main_shm->mod_count = 0;
 
        /* clear ext SHM (there can be no connections and no modules) */
        if ((err_info = sr_shm_remap(&conn->ext_shm, sizeof(size_t)))) {
            goto cleanup_unlock;
        }
        /* set wasted mem to 0 */
        *((size_t *)conn->ext_shm.addr) = 0;
 
        /* add all the modules in lydmods data into main SHM */
        if ((err_info = sr_shmmain_add(conn, sr_mods->child))) {
            goto cleanup_unlock;
        }
        
        /* copy full datastore from <startup> to <running> */
        /*初始化时,完成将startup库的文件copy到running库中,常见的配置恢复是在此处完成*/
        if ((err_info = sr_shmmain_files_startup2running(conn, created))) {
            goto cleanup_unlock;
        }
 
        /* check data file existence and owner/permissions of all installed modules */
        if ((err_info = sr_shmmain_check_data_files(conn))) {
            goto cleanup_unlock;
        }
    }
 
    /* remember connection count */
    main_shm = (sr_main_shm_t *)conn->main_shm.addr;
    conn_count = main_shm->conn_state.conn_count;
 
    /* CREATE UNLOCK */
    sr_shmmain_createunlock(conn->main_create_lock);
 
    /* SHM LOCK (mainly to recover connections) */
    if ((err_info = sr_shmmain_lock_remap(conn, SR_LOCK_NONE, 1, 0, __func__))) {
        goto cleanup;
    }
 
    if (conn_count && !(opts & SR_CONN_NO_SCHED_CHANGES) && !main_shm->conn_state.conn_count) {
 
        /* SHM UNLOCK */
        sr_shmmain_unlock(conn, SR_LOCK_NONE, 1, 0, __func__);
 
        /* all the connections were stale so we actually can apply scheduled changes, recreate the whole connection */
        assert(!err_info);
 
        lyd_free_withsiblings(sr_mods);
        sr_conn_free(conn);
        return sr_connect(opts, conn_p);
    }
 
    /* add connection into state */
    err_info = sr_shmmain_conn_state_add(conn);
 
    /* SHM UNLOCK */
    /*打开锁*/
    sr_shmmain_unlock(conn, SR_LOCK_NONE, 1, 0, __func__);
 
    goto cleanup;
 
cleanup_unlock:
    /* CREATE UNLOCK */
    sr_shmmain_createunlock(conn->main_create_lock);
 
cleanup:
    lyd_free_withsiblings(sr_mods);
    if (err_info) {
        sr_conn_free(conn);
        if (created) {
            /* remove any created SHM so it is not considered properly created */
            shm_unlink(SR_MAIN_SHM);
            shm_unlink(SR_EXT_SHM);
        }
    } else {
        *conn_p = conn;
    }
    return sr_api_ret(NULL, err_info);
}
```

```c++
/* 功能:清除与释放由sr_connect分配的的连接上下文,
 * 在该连接下的所有session与订阅将自动停止并清理回收
 * 输入: 调用sr_connect中创建的连接上下文
 */
/**其它不做解释,看注释,很清楚/
API int
sr_disconnect(sr_conn_ctx_t *conn)
{
    sr_error_info_t *err_info = NULL, *lock_err = NULL, *tmp_err;
    uint32_t i;
    int wr_lock = 0;
    sr_main_shm_t *main_shm;
    if (!conn) {
        return sr_api_ret(NULL, NULL);
    }
    /* stop all subscriptions */
    for (i = 0; i < conn->session_count; ++i) {
        while (conn->sessions[i]->subscription_count && conn->sessions[i]->subscriptions[0]) {
            if (!wr_lock) {
                /* SHM LOCK */
                lock_err = sr_shmmain_lock_remap(conn, SR_LOCK_WRITE, 1, 0, __func__);
                sr_errinfo_merge(&err_info, lock_err);
 
                wr_lock = 1;
            }
 
            tmp_err = _sr_unsubscribe(conn->sessions[i]->subscriptions[0]);
            sr_errinfo_merge(&err_info, tmp_err);
        }
    }
 
    /* we need just remap lock or even no lock (no other threads can use the mapping)
     * would be fine, but be robust */
    if (!wr_lock) {
        /* SHM LOCK */
        lock_err = sr_shmmain_lock_remap(conn, SR_LOCK_NONE, 1, 0, __func__);
        sr_errinfo_merge(&err_info, lock_err);
    }
 
    /* stop all the sessions */
    while (conn->session_count) {
        tmp_err = _sr_session_stop(conn->sessions[0]);
        sr_errinfo_merge(&err_info, tmp_err);
    }
 
    /* free any stored operational data */
    tmp_err = sr_shmmod_oper_stored_del_conn(conn, conn, getpid());
    sr_errinfo_merge(&err_info, tmp_err);
 
    main_shm = (sr_main_shm_t *)conn->main_shm.addr;
 
    /* CONN STATE LOCK */
    tmp_err = sr_mlock(&main_shm->conn_state.lock, SR_CONN_STATE_LOCK_TIMEOUT, __func__);
    sr_errinfo_merge(&err_info, tmp_err);
 
    /* remove from state */
    sr_shmmain_conn_state_del(main_shm, conn->ext_shm.addr, conn, getpid());
 
    /* CONN STATE UNLOCK */
    sr_munlock(&main_shm->conn_state.lock);
 
    if (!lock_err) {
        /* SHM UNLOCK */
        if (wr_lock) {
            sr_shmmain_unlock(conn, SR_LOCK_WRITE, 1, 0, __func__);
        } else {
            sr_shmmain_unlock(conn, SR_LOCK_NONE, 1, 0, __func__);
        }
    }
 
    /* free attributes */
    sr_conn_free(conn);
 
    return sr_api_ret(NULL, err_info);
}
```

### 4.4 session

```c++
/*功能:开始一个新的session
 *输入:conn: 由sr_connect所创建的连接
 *     datastore: 连接的数据库类型
 *输出: 用于后续的API调用的session上下文件  
 */
API int
sr_session_start(sr_conn_ctx_t *conn, const sr_datastore_t datastore, sr_session_ctx_t **session)
{
    sr_error_info_t *err_info = NULL;
    sr_main_shm_t *main_shm;
    uid_t uid;
 
    SR_CHECK_ARG_APIRET(!conn || !session, NULL, err_info);
    /*分配1个sizeof (**session)大小的内存空间,并初始化为0*/
    *session = calloc(1, sizeof **session);
    if (!*session) {
        SR_ERRINFO_MEM(&err_info);
        return sr_api_ret(NULL, err_info);
    }
 
    /* use new SR session ID and increment it (no lock needed, we are just reading and main SHM is never remapped) */
    /**使用了C++的atomic机制,在C中引入,需要增加编译选项,如何增加,参考CMakeFile.txt.*/
    main_shm = (sr_main_shm_t *)conn->main_shm.addr;
    (*session)->sid.sr = ATOMIC_INC_RELAXED(main_shm->new_sr_sid);
    if ((*session)->sid.sr == (uint32_t)(ATOMIC_T_MAX - 1)) {
        /* the value in the main SHM is actually ATOMIC_T_MAX and calling another INC would cause an overflow */
        ATOMIC_STORE_RELAXED(main_shm->new_sr_sid, 1);
    }
 
    /* remember current real process owner */
    uid = getuid();
    if ((err_info = sr_get_pwd(&uid, &(*session)->sid.user))) {
        goto error;
    }
 
    /* add the session into conn */
    if ((err_info = sr_ptr_add(&conn->ptr_lock, (void ***)&conn->sessions, &conn->session_count, *session))) {
        goto error;
    }
 
    (*session)->conn = conn;
    (*session)->ds = datastore;
    if ((err_info = sr_mutex_init(&(*session)->ptr_lock, 0))) {
        goto error;
    }
    if ((err_info = sr_rwlock_init(&(*session)->notif_buf.lock, 0))) {
        goto error;
    }
 
    SR_LOG_INF("Session %u (user \"%s\") created.", (*session)->sid.sr, (*session)->sid.user);
 
    return sr_api_ret(NULL, NULL);
 
error:
    free((*session)->sid.user);
    free(*session);
    *session = NULL;
    return sr_api_ret(NULL, err_info);
}
```

```c++
/* 功能:停止当前session并且释放与该session所维系的全部资源
 * 输入: sr_session_start中所创建的session上下文
 */
####函数清晰,简单,注释丰富,一看就懂,就不多废话.
API int
sr_session_stop(sr_session_ctx_t *session)
{
    sr_error_info_t *err_info = NULL, *lock_err = NULL, *tmp_err;
    sr_conn_ctx_t *conn;
    int wr_lock = 0;
 
    if (!session) {
        return sr_api_ret(NULL, NULL);
    }
 
    conn = session->conn;
 
    /* stop all subscriptions of this session */
    while (session->subscription_count) {
        if (!wr_lock) {
            /* SHM LOCK */
            lock_err = sr_shmmain_lock_remap(conn, SR_LOCK_WRITE, 1, 0, __func__);
            sr_errinfo_merge(&err_info, lock_err);
 
            wr_lock = 1;
        }
 
        tmp_err = sr_subs_session_del(session, session->subscriptions[0]);
        sr_errinfo_merge(&err_info, tmp_err);
    }
 
    /* SHM UNLOCK */
    if (wr_lock && !lock_err) {
        sr_shmmain_unlock(conn, SR_LOCK_WRITE, 1, 0, __func__);
    }
 
    /* no lock needed, we are just reading main SHM */
    tmp_err = _sr_session_stop(session);
    sr_errinfo_merge(&err_info, tmp_err);
 
    return sr_api_ret(NULL, err_info);
}
```

连接与会话核心处就是这 4 个 API 函数, 其它与连接与会话有关的 API 都是对相关的补充,想要进一步了解的.请阅读源码.

接下来会分析 `sysrepo` 的共享内存机制. `SHM` 机制是新 `sysrepo` 的核心，需要好好说道说道.

## 5. sysrepo 共享内存机制

### 5.1 共享内存机制

`sysrepo0.X.X` 版本使用的进程间通信的机制，在实际的使用过程中，出现了诸如数据不同步、数据处理`TimeOut`、完成一次 `Get` 请求时，但实际处理的请求会较多，导致性能与规格上不去的各类问题。`sysrepo-devel` 分支开始引入共享机制后，合入到 `sysrepo` 的 `Master` 分支，也就是现在的 `sysrepo1.X.X` 版本。

简单说一说什么是共享内存，共享内存就是允许两个或多个进程共享一定的存储区，说白了，就是两个进程访问同一块内存区域，当一个进程改变了这块地址中的内容的时候，其它进程都会察觉到这个更改，所以数据不需要在客户机和服务器端之间复制，数据直接写到内存，不用若干次数据拷贝，是一种最快的 `IPC` 。原理图如下所示，需要注意的是，共享内存本向并没有任何的同步与互斥机制，所以必须使用信号量来实现对共享内存的存取的同步。其它有关的共享内存的概念使用，网上有很多，可自行查阅理解。本处这分析与 `sysrepo` 相关的共享内存机制的使用。

![共享内存原理](/images/images_sr/shm.png)

### 5.2 数据结构

```c++
/**
 * @brief Generic shared memory information structure.
 */
//sysrepo 共享内存数据结构
typedef struct sr_shm_s {
    int fd;                         /**< Shared memory file desriptor. */
    size_t size;                    /**< Shared memory mapping current size. */
    char *addr;                     /**< Shared memory mapping address. */
} sr_shm_t;
 
// sysrepo 定义了两个 SHM 分段，一个是 main SHM 和 ext SHM
#define SR_MAIN_SHM "/sr_main"              /**< Main SHM name. */
#define SR_EXT_SHM "/sr_ext"                /**< External SHM name. */
// 除了定义定义的 main 和 ext 分段之外，还有用于 subscriptions 和 running 数据文件的单个的 SHM 分段。
// main SHM 是以 sr_main_shm_t 结构开始，结构定义如下：
typedef struct sr_main_shm_s {
    sr_rwlock_t lock;  /**< Process-shared lock for accessing main and ext SHM. It is 
                        * required only when  accessing attributes that can be changed 
                        * (subscriptions, replay support) and do not have their own lock 
                        * (conn state), otherwise not needed. */
    pthread_mutex_t lydmods_lock; /**< Process-shared lock for accessing sysrepo module 
                                    *data. */
    uint32_t mod_count;  /**< Number of installed modules stored after this structure. */
    off_t rpc_subs;             /**< Array of RPC/action subscriptions. */
    uint16_t rpc_sub_count;     /**< Number of RPC/action subscriptions. */
    ATOMIC_T new_sr_sid;        /**< SID for a new session. */
    ATOMIC_T new_evpipe_num;    /**< Event pipe number for a new subscription. */
 
    struct {
        pthread_mutex_t lock; /**< Process-shared lock for accessing connection state. */
        off_t conns;            /**< Array of existing connections. */
        uint32_t conn_count;    /**< Number of existing connections. */
    } conn_state;               /**< Information about connection state. */
} sr_main_shm_t;
// 后面是是所有安装的模块，每个安装的模块都会带 sr_mod_t 结构直接到 main SHM 的定义结构。
typedef struct sr_mod_s sr_mod_t;
/**
 * @brief Main SHM module.
 * (typedef sr_mod_t)
 */
struct sr_mod_s {
    struct sr_mod_lock_s {
        sr_rwlock_t lock; /**< Process-shared lock for accessing module instance data. */
        uint8_t write_locked;   /**< Whether module data are WRITE locked (lock itself may not be WRITE locked to allow data reading). */
        uint8_t ds_locked;      /**< Whether module data are datastore locked (NETCONF locks). */
        sr_sid_t sid;           /**< Session ID of the locking session (user is always NULL). */
        time_t ds_ts;           /**< Timestamp of the datastore lock. */
    } data_lock_info[SR_DS_COUNT]; /**< Module data lock information for each datastore. */
    sr_rwlock_t replay_lock;    /**< Process-shared lock for accessing stored notifications for replay. */
    uint32_t ver;               /**< Module data version (non-zero). */
 
    off_t name;                 /**< Module name. */
    char rev[11];               /**< Module revision. */
    uint8_t flags;              /**< Module flags. */
 
    off_t features;             /**< Array of enabled features (off_t *). */
    uint16_t feat_count;        /**< Number of enabled features. */
    off_t data_deps;            /**< Array of data dependencies. */
    uint16_t data_dep_count;    /**< Number of data dependencies. */
    off_t inv_data_deps;        /**< Array of inverse data dependencies (off_t *). */
    uint16_t inv_data_dep_count;    /**< Number of inverse data dependencies. */
    off_t op_deps;              /**< Array of operation dependencies. */
    uint16_t op_dep_count;      /**< Number of operation dependencies. */
 
    struct {
        off_t subs;             /**< Array of change subscriptions. */
        uint16_t sub_count;     /**< Number of change subscriptions. */
    } change_sub[SR_DS_COUNT];  /**< Change subscriptions for each datastore. */
 
    off_t oper_subs;            /**< Array of operational subscriptions. */
    uint16_t oper_sub_count;    /**< Number of operational subscriptions. */
 
    off_t notif_subs;           /**< Array of notification subscriptions. */
    uint16_t notif_sub_count;   /**< Number of notification subscriptions. */
};
// 全部的 off_t 标识这些结构是指向 ext SHM 的偏移指针。
// 所以，通过 install 将模块安装后，这结构就是初始化与注册上。
 
// Ext shm 是以一个 size_t 单位开始，这值表示在该 SHM 分段使用的字节大小。它是由 main SHM 的 `off_t` 指所指向的数组和字符串表示。首先，在 sysrepo 有一个 sr_conn_state_t 结构，它是表示所有全部运行的连接状态，其次是 sr_mod_t 结构，它是包括安装的各个模块名，依赖，各类订阅，最后是 sr_rpc_t。
```

### 5.3 源码分析

![](/images/images_sr/shmmain_add.png)

此添加 `shm main` 的入口代码，将全部模块以 `lydmod` 数据形式添加到 `main SHM` 中。参考前一章的 `sr_connect` 函数，这就是将在与 `sysrepo` 连接时，会将全部模块的加载到共享内存中。

```c++
sr_error_info_t *
sr_shmmain_add(sr_conn_ctx_t *conn, struct lyd_node *sr_mod)
{
    sr_error_info_t *err_info = NULL;
    struct lyd_node *next;
    sr_mod_t *shm_mod;
    sr_main_shm_t *main_shm;
    off_t main_end, ext_end;
    size_t *wasted_ext, new_ext_size, new_mod_count;
 
    /* count how many modules are we going to add */
    //计算有多少个新的模块需要添加，如果模块在其它的连接已经添加过，该不会计算的/
    new_mod_count = 0;
    LY_TREE_FOR(sr_mod, next) {
        ++new_mod_count;
    }
 
    /* remember current SHM and ext SHM end (size) */
    //记录main SHM与ext SHM的大小 
    main_end = conn->main_shm.size;
    ext_end = conn->ext_shm.size;
 
    /* enlarge main SHM for the new modules */
    //为新的模块扩大man SHM的空间，这部分很棒，算的是一种自扩大袜。
    if ((err_info = sr_shm_remap(&conn->main_shm, conn->main_shm.size + new_mod_count * sizeof *shm_mod))) {
        return err_info;
    }
 
    /* enlarge ext SHM */
    //为新的模块扩大ext SHM 空间
    wasted_ext = (size_t *)conn->ext_shm.addr; //已使用的空间
    new_ext_size = sizeof(size_t) + sr_shmmain_ext_get_size_main_shm(&conn->main_shm, conn->ext_shm.addr) +
            sr_shmmain_ext_get_lydmods_size(sr_mod->parent);  //需要扩大的空间大小
    if ((err_info = sr_shm_remap(&conn->ext_shm, new_ext_size + *wasted_ext))) {
        return err_info;
    }
    //sr_shm_remap，将空间映射到连接的SHM分段上。
    wasted_ext = (size_t *)conn->ext_shm.addr;  //新扩大的空间大小。
 
    /* add all newly implemented modules into SHM */
    //添加所有的新的需要实现的模块到SHM中的地址中
    if ((err_info = sr_shmmain_add_modules(conn->ext_shm.addr, sr_mod, (sr_mod_t *)(conn->main_shm.addr + main_end),
                &ext_end))) {
        return err_info;
    }
 
    /* add the new modules number */
    main_shm = (sr_main_shm_t *)conn->main_shm.addr;
    main_shm->mod_count += new_mod_count;
    assert(main_shm->mod_count == (conn->main_shm.size - sizeof *main_shm) / sizeof *shm_mod);
 
    /*
     * Dependencies of old modules are rebuild because of possible
     * 1) new inverse dependencies when new modules depend on the old ones;
     * 2) new dependencies in the old modules in case they were added by foreign augments in the new modules.
     * Checking these cases would probably be more costly than just always rebuilding all dependencies.
     */
 
    /* remove all dependencies of all modules from SHM */
    //处理模块间的依赖，要重构各模块间的依赖，先将之前的依赖关系解除，
    //然后，为新的模块计算并扩大ext SHM 空间计算
    //最后，在SHM中为所有的模块添加建立新的依赖。
    //经过这个处理，各模块间的依赖建立成功。
    sr_shmmain_del_modules_deps(&conn->main_shm, conn->ext_shm.addr, SR_FIRST_SHM_MOD(conn->main_shm.addr));
 
    /* enlarge ext SHM to account for the newly wasted memory */
    if ((err_info = sr_shm_remap(&conn->ext_shm, new_ext_size + *wasted_ext))) {
        return err_info;
    }
    wasted_ext = (size_t *)conn->ext_shm.addr;
 
    /* add all dependencies for all modules in SHM */
    if ((err_info = sr_shmmain_add_modules_deps(&conn->main_shm, conn->ext_shm.addr, sr_mod->parent->child,
                SR_FIRST_SHM_MOD(conn->main_shm.addr), &ext_end))) {
        return err_info;
    }
 
    /* check expected size */
    SR_CHECK_INT_RET((unsigned)ext_end != new_ext_size + *wasted_ext, err_info);
 
    return NULL;
}
 
// 还有两个核心函数:
sr_shmmain_add_modules(char *ext_shm_addr, struct lyd_node *first_sr_mod, sr_mod_t *first_shm_mod, off_t *ext_end)
//实现将全部的模块以及模块的全部特性都保存于main SHM中。这个函数不会添加data/op/inverse三类依赖
 
sr_shmmain_add_modules_deps(sr_shm_t *shm_main, char *ext_shm_addr, struct lyd_node 
          *first_sr_mod, sr_mod_t *first_shm_mod,  off_t *ext_end)
//该函数就是添加各模块间的data/op/inverse 依赖，并保存到manin SHM中。
```

共享内存间在初始操作，包括信号的创建与初始化，也是在 `sr_connet` 函数中处理。``sr_connet` 是 `plugind` 与 `sysrepo` 的连接入口，`SHM` 是在入口中初始的一种机制，用来保证 `sysrepo` 与 `plugind` 的通信高效，快速。

先用 `sysrepo` 共享内存机制为后面的各类订阅打个底。先了解一下 `sysrepo` 的共享内存机理的实现。

# Reference

> [libyang -- GitHub](https://github.com/CESNET/libyang)
>
> [netopeer2 -- GitHub](https://github.com/CESNET/netopeer2)
>
> [sysrepo -- GitHub](https://github.com/sysrepo/sysrepo)
>
> [pyang -- GitHub](https://github.com/mbj4668/pyang)

> [libyang -- Doc](https://netopeer.liberouter.org/doc/libyang/master/index.html)
>
> [libnetconf2 -- Doc](https://netopeer.liberouter.org/doc/libnetconf2/devel/index.html)
>
> [sysrepo -- Doc](https://netopeer.liberouter.org/doc/sysrepo/master/index.html)
>
> [pyang -- Doc](http://66.218.245.39/doc/html/rn01re08.html)
>
> [XPath 教程 -- RUNOOB.COM](https://www.runoob.com/xpath/xpath-tutorial.html)
>
> [XPath教程 -- 易百教程](https://www.yiibai.com/xpath)

> [netopeer2 + sysrepo研究总结](https://blog.csdn.net/xuguozheng110/article/details/104043039)
>
> [sysrepo简单使用](https://blog.csdn.net/qq_27923047/article/details/108069409)
>
> [第三章 sysrepo-plugind源码分析](https://blog.csdn.net/m0_47413019/article/details/105867406)

