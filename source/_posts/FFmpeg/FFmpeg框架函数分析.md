---
title: FFmpeg框架详解
tags: FFmpeg
reward: true
categories: FFmpeg
toc: true
abbrlink: 39639
date: 2019-05-27 10:14:50
---

> [[总结]FFMPEG视音频编解码零基础学习方法](<https://blog.csdn.net/leixiaohua1020/article/details/84499632>)

# 架构图

## FFMPEG+SDL的视频播放器

> [最简单的基于FFMPEG+SDL的视频播放器 ver2 （采用SDL2.0）](<https://blog.csdn.net/leixiaohua1020/article/details/38868499>)

**FFmpeg 解码一个视频流程：**

<!-- more -->

![FFmpeg解码一个视频流程](/images/imageFFmpeg/Thor/播放器解码的流程用图.png)

**SDL2.0 显示 YUV 的流程：**

![SDL2.0显示YUV的流程](/images/imageFFmpeg/Thor/SDL2.0显示YUV的流程图.png)

## FFMPEG的视频编码器（YUV编码为H.264）

> [最简单的基于FFMPEG的视频编码器（YUV编码为H.264）](<https://blog.csdn.net/leixiaohua1020/article/details/25430425>)
>
> [最简单的基于FFmpeg的视频编码器-更新版（YUV编码为HEVC(H.265)）](<https://blog.csdn.net/leixiaohua1020/article/details/39770947>)
>
> [最简单的基于FFmpeg的编码器-纯净版（不包含libavformat）](<https://blog.csdn.net/leixiaohua1020/article/details/42181271>)

### FFmpeg编码视频的流程图

通过该流程，不仅可以编码H.264/H.265的码流，而且可以编码MPEG4/MPEG2/VP9/VP8等多种码流。实际上使用FFmpeg编码视频的方式都是一样的。图中蓝色背景的函数是实际输出数据的函数。浅绿色的函数是视频编码的函数。

![FFmpeg编码视频的流程图](/images/imageFFmpeg/Thor/FFmpeg编码视频的流程图.png)

简单介绍一下流程中各个函数的意义：

```c
av_register_all()  // 注册FFmpeg所有编解码器。
avformat_alloc_output_context2()  // 初始化输出码流的AVFormatContext。
avio_open()  // 打开输出文件。
av_new_stream()  // 创建输出码流的AVStream。
avcodec_find_encoder()  // 查找编码器。
avcodec_open2()  // 打开编码器。
avformat_write_header()  // 写文件头（对于某些没有文件头的封装格式，不需要此函数。比如说MPEG2TS）。
avcodec_encode_video2()  // 编码一帧视频。即将AVFrame（存储YUV像素数据）编码为AVPacket（存储H.264等格式的码流数据）。
av_write_frame()  // 将编码后的视频码流写入文件。
flush_encoder()  // 输入的像素数据读取完成后调用此函数。用于输出编码器中剩余的AVPacket。
av_write_trailer()  // 写文件尾（对于某些没有文件头的封装格式，不需要此函数。比如说MPEG2TS）。
```

### “纯净”的基于FFmpeg的视频编码器

以下记录一个更加 “纯净” 的基于 FFmpeg 的视频编码器。此前记录过一个基于 FFmpeg 的视频编码器：

[ 《最简单的基于FFmpeg的视频编码器-更新版（YUV编码为HEVC(H.265)）》](http://blog.csdn.net/leixiaohua1020/article/details/39770947)

这个视频编码器调用了 FFmpeg 中的 libavformat 和 libavcodec 两个库完成了视频编码工作。但是这不是一个 “纯净” 的编码器。

上述两个库中 libavformat 完成封装格式处理，而 libavcodec 完成编码工作。

一个 “纯净” 的编码器，理论上说只需要使用 libavcodec 就足够了，并不需要使用 libavformat。一下记录的编码器就是这样的一个 “纯净” 的编码器，它仅仅通过调用 libavcodec 将 YUV 数据编码为 H.264/HEVC 等格式的压缩视频码流。

**仅使用libavcodec（不使用libavformat）编码视频的流程：**

![仅使用libavcodec（不使用libavformat）编码视频的流程](/images/imageFFmpeg/Thor/仅使用libavcodec编码视频的流程.png)

流程图中关键函数的作用如下所列：

```c
avcodec_register_all()  // 注册所有的编解码器。
avcodec_find_encoder()  // 查找编码器。
avcodec_alloc_context3()  // 为AVCodecContext分配内存。
avcodec_open2()  // 打开编码器。
avcodec_encode_video2()  // 编码一帧数据。
```

两个存储数据的结构体如下所列：

```c
AVFrame  // 存储一帧未编码的像素数据。
AVPacket  // 存储一帧压缩编码数据。
```

**对比：**

简单记录一下这个只使用 libavcodec 的 “纯净版” 视频编码器和使用 libavcodec+libavformat 的视频编码器的不同。

（1）	下列与libavformat相关的函数在“纯净版”视频编码器中都不存在。

```c
av_register_all注册所有的编解码器，复用/解复用器等等组件。其中调用了
avcodec_register_all()  // 注册所有编解码器相关的组件。
avformat_alloc_context()  // 创建AVFormatContext结构体。
avformat_alloc_output_context2()  // 初始化一个输出流。
avio_open()  // 打开输出文件。
avformat_new_stream()  // 创建AVStream结构体。avformat_new_stream()中会调用
avcodec_alloc_context3()  // 创建AVCodecContext结构体。
avformat_write_header()  // 写文件头。
av_write_frame()  // 写编码后的文件帧。
av_write_trailer()  // 写文件尾。
```

（2）	新增了如下几个函数

```c
avcodec_register_all()  // 只注册编解码器有关的组件。
avcodec_alloc_context3()  // 创建AVCodecContext结构体。
```

可以看出，相比于“完整”的编码器，这个纯净的编码器函数调用更加简单，功能相对少一些，相对来说更加的“轻量”。

## 解码框架图

![FFmpeg解码](/images/imageFFmpeg/Thor/FFmpeg源码API结构图-解码.png)

## 编码框架图

![FFmpeg编码](/images/imageFFmpeg/Thor/FFmpeg源码API结构图-编码.png)

# 通用函数解析

> [函数解析](<https://blog.csdn.net/leixiaohua1020/article/details/44220151>)

## av_register_all()

ffmpeg 注册复用器，编码器等的函数 `av_register_all()`。该函数在所有基于ffmpeg的应用程序中几乎都是第一个被调用的。只有调用了该函数，才能使用复用器，编码器等。

函数调用关系图如下图所示。`av_register_all()` 调用了 `avcodec_register_all()`。`avcodec_register_all()` 注册了和编解码器有关的组件：硬件加速器，解码器，编码器，Parser，Bitstream Filter。`av_register_all()` 除了调用 `avcodec_register_all()` 之外，还注册了复用器，解复用器，协议处理器。

![av_register_all](/images/imageFFmpeg/Thor/av_register_all.png)

## 内存的分配和释放（av_malloc()、av_free()等）

内存操作的常见函数位于 `libavutil\mem.c` 中。本文记录FFmpeg开发中最常使用的几个函数：`av_malloc()`，`av_realloc()`，`av_mallocz()`，`av_calloc()`，`av_free()`，`av_freep()`。

`av_malloc()` 就是简单的封装了系统函数malloc()，并做了一些错误检查工作。

### 关于size_t

size _t  这个类型在 FFmpeg 中多次出现，简单解释一下其作用。size _t 是为了增强程序的可移植性而定义的。不同系统上，定义 size_t 可能不一样。它实际上就是 unsigned int。

### 为什么要内存对齐？

FFmpeg 内存分配方面多次涉及到 “内存对齐”（memory alignment）的概念。

这方面内容在 IBM 的网站上有一篇文章，讲的挺通俗易懂的，在此简单转述一下。

程序员通常认为内存就是一个字节数组，每次可以一个一个字节存取内存。例如在 C 语言中使用 `char *` 指代 “一块内存”，Java 中使用 `byte[]` 指代一块内存。如下所示。

![](/images/imageFFmpeg/Thor/内存对齐-01.png)

但那实际上计算机处理器却不是这样认为的。处理器相对比较 “懒惰”，它会以 2 字节，4 字节，8 字节，16 字节甚至 32 字节来存取内存。例如下图显示了以 4 字节为单位读写内存的处理器 “看待” 上述内存的方式。

![](/images/imageFFmpeg/Thor/内存对齐-02.png)

上述的存取单位的大小称之为内存存取粒度。

下面看一个实例，分别从地址0，和地址 1 读取 4 个字节到寄存器。

从程序员的角度来看，读取方式如下图所示。

![](/images/imageFFmpeg/Thor/内存对齐-03.png)

而 2 字节存取粒度的处理器的读取方式如下图所示。

![](/images/imageFFmpeg/Thor/内存对齐-04.png)

可以看出 2 字节存取粒度的处理器从地址 0 读取 4 个字节一共读取 2 次；从地址 1 读取 4 个字节一共读取了 3 次。由于每次读取的开销是固定的，因此从地址 1 读取 4 字节的效率有所下降。

4 字节存取粒度的处理器的读取方式如下图所示。

![](/images/imageFFmpeg/Thor/内存对齐-05.png)

可以看出 4 字节存取粒度的处理器从地址 0 读取 4 个字节一共读取 1 次；从地址 1 读取 4 个字节一共读取了 2 次。从地址 1 读取的开销比从地址 0 读取多了一倍。由此可见内存不对齐对 CPU 的性能是有影响的。 

```c
av_malloc()  // 是FFmpeg中最常见的内存分配函数, av_malloc()就是简单的封装了系统函数malloc()
av_realloc()  // 用于对申请的内存的大小进行调整。
av_mallocz()  // 可以理解为av_malloc()+zeromemory
av_calloc()  // 则是简单封装了av_mallocz()
av_free()  // 用于释放申请的内存
av_freep()  // 简单封装了av_free()。并且在释放内存之后将目标指针设置为NULL
```

## 常见结构体的初始化和销毁（AVFormatContext，AVFrame等）

> [FFMPEG中最关键的结构体之间的关系](http://blog.csdn.net/leixiaohua1020/article/details/11693997)

常见的结构体如下：

```c
// 统领全局的基本结构体。主要用于处理封装格式（FLV/MKV/RMVB 等）
AVFormatContext

// 输入输出对应的结构体，用于输入输出（读写文件，RTMP 协议等）
AVIOContext

// 视音频流对应的结构体，用于视音频编解码
AVStream，AVCodecContext

// 存储非压缩的数据（视频对应 RGB/YUV 像素数据，音频对应 PCM 采样数据）
AVFrame

// 存储压缩数据（视频对应 H.264 等码流数据，音频对应 AAC/MP3 等码流数据）
AVPacket
```

他们之间的关系如下图所示：

![常见结构体之间的关系](/images/imageFFmpeg/Thor/常见结构体之间的关系.png)

简单分析一下上述几个结构体的初始化和销毁函数。这些函数列表如下。

| 结构体          | 初始化                                        | 销毁                    |
| --------------- | --------------------------------------------- | ----------------------- |
| AVFormatContext | avformat_alloc_context()                      | avformat_free_context() |
| AVIOContext     | avio_alloc_context()                          |                         |
| AVStream        | avformat_new_stream()                         |                         |
| AVCodecContext  | avcodec_alloc_context3()                      |                         |
| AVFrame         | av_frame_alloc();<br />av_image_fill_arrays() | av_frame_free()         |
| AVPacket        | av_init_packet();<br />av_new_packet()        | av_free_packet()        |

### avformat_alloc_context()

`avformat_alloc_context()` 的定义位于 `libavformat\options.c`。

`avformat_alloc_context()` 调用 `av_malloc()` 为 AVFormatContext 结构体分配了内存，而且同时也给 AVFormatContext 中的 `internal` 字段分配内存（这个字段是 FFmpeg 内部使用的，先不分析）。此外调用了一个 `avformat_get_context_defaults()` 函数。该函数用于设置 AVFormatContext 的字段的默认值。它的定义也位于 `libavformat\options.c`，确切的说就位于 `avformat_alloc_context()`上面

`avformat_get_context_defaults()` 首先调用 `memset()` 将 AVFormatContext 的所有字段置 0。而后调用了一个函数 `av_opt_set_defaults()` 。`av_opt_set_defaults()` 用于给字段设置默认值。

`avformat_alloc_context()` 代码的函数调用关系如下图所示。

![avformat_alloc_context](/images/imageFFmpeg/Thor/avformat_alloc_context.png)

`avformat_free_context()` 的声明位于 `libavformat\avformat.h`

`avformat_free_context()` 的定义位于 `libavformat\options.c`

`avformat_free_context()` 调用了各式各样的销毁函数：`av_opt_free()`，`av_freep()`，`av_dict_free()`。这些函数分别用于释放不同种类的变量，在这里不再详细讨论。

在这里看一个释放 AVStream 的函数 `ff_free_stream()`。该函数的定义位于 `libavformat\options.c`（其实就在 `avformat_free_context()` 上方）, 与释放 AVFormatContext 类似，释放 AVStream 的时候，也是调用了 `av_freep()`，`av_dict_free()` 这些函数释放有关的字段。如果使用了 parser 的话，会调用 `av_parser_close()` 关闭该 parser。

### avio_alloc_context()

AVIOContext 的初始化函数是 `avio_alloc_context()`，销毁的时候使用 `av_free()` 释放掉其中的缓存即可。它的声明位于 `libavformat\avio.h` 中

`avio_alloc_context()` 定义位于 `libavformat\aviobuf.c` 中

`avio_alloc_context()` 首先调用 `av_mallocz()` 为 AVIOContext 分配内存。而后调用了一个函数 `ffio_init_context()` 。该函数完成了真正的初始化工作

### avformat_new_stream()

`avformat_new_stream()` 的声明位于 `libavformat\avformat.h` 中

AVStream 的初始化函数是 `avformat_new_stream()`，销毁函数使用销毁 AVFormatContext 的 `avformat_free_context()` 就可以了。

`avformat_new_stream()` 的定义位于 `libavformat\utils.c` 中

`avformat_new_stream()` 首先调用 `av_mallocz()`  为 AVStream 分配内存。接着给新分配的AVStream 的各个字段赋上默认值。然后调用了另一个函数 `avcodec_alloc_context3()` 初始化 AVStream 中的 AVCodecContext。

### avcodec_alloc_context3()

`avcodec_alloc_context3()` 的声明位于 `libavcodec\avcodec.h` 中

`avcodec_alloc_context3()` 的定义位于 `libavcodec\options.c` 中

`avcodec_alloc_context3()` 首先调用 `av_malloc()` 为 AVCodecContext 分配存储空间，然后调用了一个函数 `avcodec_get_context_defaults3()` 用于设置该 AVCodecContext 的默认值

`avformat_new_stream()` 函数的调用结构如下所示：

![avformat_new_stream](/images/imageFFmpeg/Thor/avformat_new_stream.png)

### av_frame_alloc()

AVFrame 的初始化函数是 `av_frame_alloc()`，销毁函数是 `av_frame_free()`。在这里有一点需要注意，旧版的 FFmpeg 都是使用 `avcodec_alloc_frame()` 初始化 AVFrame 的，但是我在写这篇文章的时候，`avcodec_alloc_frame()` 已经被标记为 “过时的” 了，为了保证与时俱进，决定分析新的`API——av_frame_alloc()`。

`av_frame_alloc()` 的声明位于 `libavutil\frame.h`

`av_frame_alloc()` 的定义位于 `libavutil\frame.c`

`av_frame_alloc()` 首先调用 `av_mallocz()` 为 AVFrame 结构体分配内存。而后调用了一个函数`get_frame_defaults()` 用于设置一些默认参数

从 `av_frame_alloc()` 的代码我们可以看出，该函数并没有为 AVFrame 的像素数据分配空间。因此AVFrame 中的像素数据的空间需要自行分配空间，例如使用 `avpicture_fill()`， `av_image_fill_arrays()` 等函数。

`av_frame_alloc()` 函数的调用结构如下所示：

![av_frame_alloc](/images/imageFFmpeg/Thor/av_frame_alloc.png)

#### avpicture_fill()

`avpicture_fill()` 的声明位于 `libavcodec\avcodec.h`

`avpicture_fill()` 的定义位于 `libavcodec\avpicture.c`

`avpicture_fill()` 仅仅是简单调用了一下 `av_image_fill_arrays()`。也就是说这两个函数实际上是等同的

#### av_image_fill_arrays()

`av_image_fill_arrays()` 的声明位于 `libavutil\imgutils.h` 中

`av_image_fill_arrays()` 的定义位于 `libavutil\imgutils.c` 中

`av_image_fill_arrays()` 函数中包含 3 个函数：`av_image_check_size()`，`av_image_fill_linesizes()`，`av_image_fill_pointers()`。`av_image_check_size()` 用于检查输入的宽高参数是否合理，即不能太大或者为负数。`av_image_fill_linesizes()` 用于填充dst_linesize。`av_image_fill_pointers()` 则用于填充 dst_data。它们的定义相对比较简单，不再详细分析。

`avpicture_fill()` 函数调用关系如下图所示：

![avpicture_fill](/images/imageFFmpeg/Thor/avpicture_fill.png)

### av_init_packet()

`av_init_packet()` 的声明位于 `libavcodec\avcodec.h`

`av_init_packet()` 的定义位于 `libavcodec\avpacket.c`

### av_new_packet()

`av_new_packet()` 的声明位于 `libavcodec\avcodec.h`

`av_new_packet()` 的定义位于 `libavcodec\avpacket.c`

`av_new_packet()` 调用了 `av_init_packet(pkt)`。此外还调用了一个函数 `packet_alloc()`

`packet_alloc()` 中调用 `av_buffer_realloc()` 为 AVPacket 分配内存。然后调用 `memset()` 将分配的内存置 0。

PS：发现 AVPacket 的结构随着 FFmpeg 的发展越发复杂了。原先 AVPacket 中的数据仅仅存在一个 uint8_t 类型的数组里，而现在已经使用一个专门的结构体 AVBufferRef 存储数据。

`av_new_packet()` 代码的函数调用关系如下图所示：

![av_new_packet](/images/imageFFmpeg/Thor/av_new_packet.png)

`av_free_packet()` 的声明位于 `libavcodec\avcodec.h`

`av_free_packet()` 的定义位于 `libavcodec\avpacket.c`

`av_free_packet()` 调用 `av_buffer_unref()` 释放 AVPacket 中的数据，而后还调用了`av_packet_free_side_data()` 释放了 side_data（存储封装格式可以提供的额外的数据）。

## avio_open2() 

该函数用于打开 FFmpeg 的输入输出文件。`avio_open2()` 的声明位于 `libavformat\avio.h` 文件中

```c
int avio_open2(AVIOContext **s, const char *url, int flags,
               const AVIOInterruptCB *int_cb, AVDictionary **options);
```

`avio_open2()` 函数参数的含义如下：

```shell
s：函数调用成功之后创建的AVIOContext结构体。
url：输入输出协议的地址（文件也是一种“广义”的协议，对于文件来说就是文件的路径）。
flags：打开地址的方式。可以选择只读，只写，或者读写。取值如下。
AVIO_FLAG_READ：只读。
AVIO_FLAG_WRITE：只写。
AVIO_FLAG_READ_WRITE：读写。
int_cb：目前还没有用过。
options：目前还没有用过。
```

函数调用结构图：

![avio_open2](/images/imageFFmpeg/Thor/avio_open2.png)

## av_find_decoder() 和 av_find_encoder()

`avcodec_find_encoder()` 用于查找 FFmpeg 的编码器，

`avcodec_find_decoder()` 用于查找 FFmpeg 的解码器。

`avcodec_find_encoder()` 的声明位于 `libavcodec\avcodec.h`

```c
AVCodec *avcodec_find_encoder(enum AVCodecID id);
```

函数的参数是一个编码器的 ID，返回查找到的编码器（没有找到就返回NULL）。

`avcodec_find_decoder()` 的声明也位于 `libavcodec\avcodec.h`

```c
AVCodec *avcodec_find_decoder(enum AVCodecID id);
```

函数的参数是一个解码器的 ID，返回查找到的解码器（没有找到就返回NULL）。

`avcodec_find_encoder()` 和 `avcodec_find_decoder()` 的函数调用关系图如下所示：

![函数调用关系图](/images/imageFFmpeg/Thor/avcodec_find_encoder.png)

`avcodec_find_encoder()` 的源代码位于 `libavcodec\utils.c`

`avcodec_find_encoder()` 调用了一个 `find_encdec()`，注意它的第二个参数是 1。

`find_encdec()` 的源代码位于 `libavcodec\utils.c`

`find_encdec()` 中有一个循环，该循环会遍历 AVCodec 结构的链表，逐一比较输入的 ID 和每一个编码器的 ID，直到找到 ID 取值相等的编码器。

在这里有几点需要注意：

（1）first_avcodec 是一个全局变量，存储 AVCodec 链表的第一个元素。

（2）`remap_deprecated_codec_id()` 用于将一些过时的编码器 ID 映射到新的编码器 ID。

（3）函数的第二个参数 encoder 用于确定查找编码器还是解码器。当该值为 1 的时候，用于查找编码器，此时会调用 `av_codec_is_encoder()` 判断 AVCodec 是否为编码器；当该值为 0 的时候，用于查找解码器，此时会调用 `av_codec_is_decoder()` 判断 AVCodec 是否为解码器。

`avcodec_find_decoder()` 的源代码位于 `libavcodec\utils.c`

`avcodec_find_decoder()` 同样调用了 `find_encdec()`，只是第 2 个参数设置为 0。

## avcodec_open2()

该函数用于初始化一个视音频编解码器的 AVCodecContext。

`avcodec_open2()` 的声明位于 `libavcodec\avcodec.h`

```c
int avcodec_open2(AVCodecContext *avctx, const AVCodec *codec, AVDictionary **options);
```

用中文简单转述一下avcodec_open2()各个参数的含义：

```shell
avctx：需要初始化的 AVCodecContext。
codec：输入的 AVCodec
options：一些选项。例如使用 libx264 编码的时候，“preset”，“tune”等都可以通过该参数设置。
```

`avcodec_open2()` 函数调用关系非常简单，如下图所示：

![avcodec_open2](/images/imageFFmpeg/Thor/avcodec_open2.png)

`avcodec_open2()` 的定义位于 `libavcodec\utils.c`

`avcodec_open2()` 的源代码量是非常长的，但是它的调用关系非常简单——它只调用了一个关键的函数，即 AVCodec 的 `init()`，后文将会对这个函数进行分析。

我们可以简单梳理一下 `avcodec_open2()` 所做的工作，如下所列：

（1）为各种结构体分配内存（通过各种 `av_malloc()` 实现）。

（2）将输入的 AVDictionary 形式的选项设置到 AVCodecContext。

（3）其他一些零零碎碎的检查，比如说检查编解码器是否处于 “实验” 阶段。

（4）如果是编码器，检查输入参数是否符合编码器的要求

（5）调用 AVCodec 的 `init()` 初始化具体的解码器。

前几步比较简单，不再分析。在这里我们分析一下第4步和第5步。

### 检查输入参数是否符合编码器要求

在这里简单分析一下第 4 步，即 “检查输入参数是否符合编码器的要求”。这一步中检查了很多的参数，在这里我们随便选一个参数 pix_fmts（像素格式）看一下，如下所示。

<details><summary>代码：</summary>

```c
//检查像素格式
        if (avctx->codec->pix_fmts) {
            for (i = 0; avctx->codec->pix_fmts[i] != AV_PIX_FMT_NONE; i++)
                if (avctx->pix_fmt == avctx->codec->pix_fmts[i])
                    break;
            if (avctx->codec->pix_fmts[i] == AV_PIX_FMT_NONE
                && !((avctx->codec_id == AV_CODEC_ID_MJPEG || avctx->codec_id == AV_CODEC_ID_LJPEG)
                     && avctx->strict_std_compliance <= FF_COMPLIANCE_UNOFFICIAL)) {
                char buf[128];
                snprintf(buf, sizeof(buf), "%d", avctx->pix_fmt);
                av_log(avctx, AV_LOG_ERROR, "Specified pixel format %s is invalid or not supported\n",
                       (char *)av_x_if_null(av_get_pix_fmt_name(avctx->pix_fmt), buf));
                ret = AVERROR(EINVAL);
                goto free_and_end;
            }
            if (avctx->codec->pix_fmts[i] == AV_PIX_FMT_YUVJ420P ||
                avctx->codec->pix_fmts[i] == AV_PIX_FMT_YUVJ411P ||
                avctx->codec->pix_fmts[i] == AV_PIX_FMT_YUVJ422P ||
                avctx->codec->pix_fmts[i] == AV_PIX_FMT_YUVJ440P ||
                avctx->codec->pix_fmts[i] == AV_PIX_FMT_YUVJ444P)
                avctx->color_range = AVCOL_RANGE_JPEG;
        }
```

</details>

可以看出，该代码首先进入了一个 `for()` 循环，将 AVCodecContext 中设定的 `pix_fmt` 与编码器AVCodec 中的 `pix_fmts` 数组中的元素逐一比较。

先简单介绍一下 AVCodec 中的 `pix_fmts` 数组。AVCodec 中的 `pix_fmts` 数组存储了该种编码器支持的像素格式，并且规定以 AV_PIX_FMT_NONE（AV_PIX_FMT_NONE 取值为 -1）为结尾。例如，libx264 的 `pix_fmts` 数组的定义位于 `libavcodec\libx264.c`，如下所示。

<details><summary>代码：</summary>

```c
static const enum AVPixelFormat pix_fmts_8bit[] = {
    AV_PIX_FMT_YUV420P,
    AV_PIX_FMT_YUVJ420P,
    AV_PIX_FMT_YUV422P,
    AV_PIX_FMT_YUVJ422P,
    AV_PIX_FMT_YUV444P,
    AV_PIX_FMT_YUVJ444P,
    AV_PIX_FMT_NV12,
    AV_PIX_FMT_NV16,
    AV_PIX_FMT_NONE
};
```

</details>

从 `pix_fmts_8bit` 的定义可以看出 libx264 主要支持的是以 YUV 为主的像素格式。

现在回到 “检查输入 `pix_fmt` 是否符合编码器的要求” 的那段代码。如果 `for()` 循环从 `AVCodec->pix_fmts` 数组中找到了符合 `AVCodecContext->pix_fmt` 的像素格式，或者完成了 `AVCodec->pix_fmts` 数组的遍历，都会跳出循环。如果发现 `AVCodec->pix_fmts` 数组中索引为 `i` 的元素是 AV_PIX_FMT_NONE（即最后一个元素，取值为 -1）的时候，就认为没有找到合适的像素格式，并且最终提示错误信息。

### AVCodec->init()
`avcodec_open2()` 中最关键的一步就是调用 AVCodec 的 `init()` 方法初始化具体的编码器。AVCodec 的 `init()` 是一个函数指针，指向具体编解码器中的初始化函数。这里我们以 libx264 为例，看一下它对应的 AVCodec 的定义。

libx264 对应的 AVCodec 的定义位于 `libavcodec\libx264.c`

<details><summary>代码：</summary>

```c
AVCodec ff_libx264_encoder = {
    .name             = "libx264",
    .long_name        = NULL_IF_CONFIG_SMALL("libx264 H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10"),
    .type             = AVMEDIA_TYPE_VIDEO,
    .id               = AV_CODEC_ID_H264,
    .priv_data_size   = sizeof(X264Context),
    .init             = X264_init,
    .encode2          = X264_frame,
    .close            = X264_close,
    .capabilities     = CODEC_CAP_DELAY | CODEC_CAP_AUTO_THREADS,
    .priv_class       = &x264_class,
    .defaults         = x264_defaults,
    .init_static_data = X264_init_static,
};
```

</details>

可以看出在 `ff_libx264_encoder` 中 `init()` 指向 `X264_init()` 。`X264_init()` 的定义同样位于`libavcodec\libx264.c`

`X264_init()` 的代码以后研究 X264 的时候再进行细节的分析，在这里简单记录一下它做的两项工作：

（1）设置 X264Context 的参数。X264Context 主要完成了 libx264 和 FFmpeg 对接的功能。可以看出代码主要在设置一个 params 结构体变量，该变量的类型即是 x264 中存储参数的结构体 `x264_param_t`。
（2）调用 libx264 的 API 进行编码器的初始化工作。例如调用 `x264_param_default()` 设置默认参数，调用 `x264_param_apply_profile()` 设置 profile，调用 `x264_encoder_open()` 打开编码器等等。

最后附上 X264Context 的定义，位于 `libavcodec\libx264.c`

## avcodec_close()

该函数用于关闭编码器。`avcodec_close()` 函数的声明位于 `libavcodec\avcodec.h`

```c
int avcodec_close(AVCodecContext *avctx);
```

该函数只有一个参数，就是需要关闭的编码器的 AVCodecContext。

函数的调用关系图如下所示：

![avcodec_close](/images/imageFFmpeg/Thor/avcodec_close.png)

`avcodec_close()` 的定义位于 `libavcodec\utils.c`

从 `avcodec_close()` 的定义可以看出，该函数释放 AVCodecContext 中有关的变量，并且调用了 AVCodec 的 `close()` 关闭了解码器。

# 解码

## 图解 FFMPEG 打开媒体的函数 avformat_open_input

FFMPEG打开媒体的的过程开始于avformat_open_input，因此该函数的重要性不可忽视。

在该函数中，FFMPEG完成了：

- 输入输出结构体 AVIOContext 的初始化；

- 输入数据的协议（例如 RTMP，或者 file）的识别（通过一套评分机制）:
  - 判断文件名的后缀 
  - 读取文件头的数据进行比对；

- 使用获得最高分的文件协议对应的 URLProtocol，通过函数指针的方式，与 FFMPEG 连接（非专业用词）；

剩下的就是调用该 URLProtocol 的函数进行 open, read 等操作了

以下是通过 eclipse+MinGW 调试 FFMPEG 源代码获得的函数调用关系图：

![](/images/imageFFmpeg/Thor/图解FFMPEG打开媒体的函数avformat_open_input.png)

可见最终都调用了 URLProtocol 结构体中的函数指针。

URLProtocol 结构如下，是一大堆函数指针的集合（avio.h文件）

<details><summary>代码</summary>

```cpp
typedef struct URLProtocol {
    const char *name;
    int (*url_open)(URLContext *h, const char *url, int flags);
    int (*url_read)(URLContext *h, unsigned char *buf, int size);
    int (*url_write)(URLContext *h, const unsigned char *buf, int size);
    int64_t (*url_seek)(URLContext *h, int64_t pos, int whence);
    int (*url_close)(URLContext *h);
    struct URLProtocol *next;
    int (*url_read_pause)(URLContext *h, int pause);
    int64_t (*url_read_seek)(URLContext *h, int stream_index,
                             int64_t timestamp, int flags);
    int (*url_get_file_handle)(URLContext *h);
    int priv_data_size;
    const AVClass *priv_data_class;
    int flags;
    int (*url_check)(URLContext *h, int mask);
} URLProtocol;
```

</details>

URLProtocol 功能就是完成各种输入协议的读写等操作

但输入协议种类繁多，它是怎样做到 “大一统” 的呢？

原来，每个具体的输入协议都有自己对应的 URLProtocol。

比如 file 协议（FFMPEG 把文件也当做一种特殊的协议）（`*file.c` 文件）

<details><summary>代码：</summary>

```cpp
URLProtocol ff_pipe_protocol = {
    .name                = "pipe",
    .url_open            = pipe_open,
    .url_read            = file_read,
    .url_write           = file_write,
    .url_get_file_handle = file_get_handle,
    .url_check           = file_check,
};
```

</details>

或者rtmp协议（此处使用了librtmp）（librtmp.c文件）

<details><summary>代码：</summary>

```cpp
URLProtocol ff_rtmp_protocol = {
    .name                = "rtmp",
    .url_open            = rtmp_open,
    .url_read            = rtmp_read,
    .url_write           = rtmp_write,
    .url_close           = rtmp_close,
    .url_read_pause      = rtmp_read_pause,
    .url_read_seek       = rtmp_read_seek,
    .url_get_file_handle = rtmp_get_file_handle,
    .priv_data_size      = sizeof(RTMP),
    .flags               = URL_PROTOCOL_FLAG_NETWORK,
};
```

</details>

可见它们把各自的函数指针都赋值给了 URLProtocol 结构体的函数指针

因此 `avformat_open_input` 只需调用 url_open, url_read 这些函数就可以完成各种具体输入协议的 open, read 等操作了

## avformat_open_input()

> [FFMPEG源码分析：avformat_open_input()（媒体打开函数）](<https://blog.csdn.net/leixiaohua1020/article/details/11885813>)
>
> [avformat_open_input()](<https://blog.csdn.net/leixiaohua1020/article/details/44064715>)

个人感觉这个函数确实太重要了，可以算作 FFmpeg 的 “灵魂”

函数用于打开多媒体数据并且获得一些相关的信息。它的声明位于 `libavformat\avformat.h`

```c
int avformat_open_input(AVFormatContext **ps, const char *filename, AVInputFormat *fmt, AVDictionary **options);
```

参数说明：

```shell
ps：函数调用成功之后处理过的 AVFormatContext 结构体。
file：打开的视音频流的 URL。
fmt：强制指定 AVFormatContext 中 AVInputFormat 的。这个参数一般情况下可以设置为 NULL，这样 FFmpeg 可以自动检测 AVInputFormat。
dictionay：附加的一些选项，一般情况下可以设置为 NULL。
```

函数执行成功的话，其返回值大于等于 0。

函数调用结构图如下所示：

![avformat_open_input](/images/imageFFmpeg/Thor/avformat_open_input.png)

`avformat_open_input()` 定义位于 `libavformat\utils.c` 中

`avformat_open_input()` 源代码比较长，一部分是一些容错代码，比如说如果发现传入的 AVFormatContext 指针没有初始化过，就调用 `avformat_alloc_context()` 初始化该结构体；还有一部分是针对一些格式做的特殊处理，比如 id3v2 信息的处理等等。有关上述两种信息不再详细分析，在这里只选择它关键的两个函数进行分析：

- **`init_input()`**：绝大部分初始化工作都是在这里做的。

- **`s->iformat->read_header()`**：读取多媒体数据文件头，根据视音频流创建相应的 AVStream。

### init_input()

`init_input()` 作为一个内部函数，竟然包含了一行注释（一般内部函数都没有注释），足可以看出它的重要性。它的主要工作就是打开输入的视频数据并且探测视频的格式。该函数的定义位于 `libavformat\utils.c`

<details><summary>代码：</summary>

```cpp
/* Open input file and probe the format if necessary. */
static int init_input(AVFormatContext *s, const char *filename,
                      AVDictionary **options)
{
    int ret;
    AVProbeData pd = { filename, NULL, 0 };
    int score = AVPROBE_SCORE_RETRY;
 
    if (s->pb) {
        s->flags |= AVFMT_FLAG_CUSTOM_IO;
        if (!s->iformat)
            return av_probe_input_buffer2(s->pb, &s->iformat, filename,
                                         s, 0, s->format_probesize);
        else if (s->iformat->flags & AVFMT_NOFILE)
            av_log(s, AV_LOG_WARNING, "Custom AVIOContext makes no sense and "
                                      "will be ignored with AVFMT_NOFILE format.\n");
        return 0;
    }
 
    if ((s->iformat && s->iformat->flags & AVFMT_NOFILE) ||
        (!s->iformat && (s->iformat = av_probe_input_format2(&pd, 0, &score))))
        return score;
 
    if ((ret = avio_open2(&s->pb, filename, AVIO_FLAG_READ | s->avio_flags,
                          &s->interrupt_callback, options)) < 0)
        return ret;
    if (s->iformat)
        return 0;
    return av_probe_input_buffer2(s->pb, &s->iformat, filename,
                                 s, 0, s->format_probesize);
}
```

</details>

这个函数在短短的几行代码中包含了好几个 return，因此逻辑还是有点复杂的，我们可以梳理一下：

在函数的开头的 score 变量是一个判决 AVInputFormat 的分数的门限值，如果最后得到的 AVInputFormat 的分数低于该门限值，就认为没有找到合适的 AVInputFormat 。

FFmpeg 内部判断封装格式的原理实际上是对每种 AVInputFormat 给出一个分数，满分是 100 分，越有可能正确的 AVInputFormat 给出的分数就越高。最后选择分数最高的 AVInputFormat 作为推测结果。score 的值是一个宏定义 AVPROBE_SCORE_RETRY，我们可以看一下它的定义：

```cpp
#define AVPROBE_SCORE_RETRY (AVPROBE_SCORE_MAX/4)
```

其中 AVPROBE_SCORE_MAX 是 score 的最大值，取值是 100：

```cpp
#define AVPROBE_SCORE_MAX       100 ///< maximum score
```

由此我们可以得出 score 取值是 25，即如果推测后得到的最佳 AVInputFormat 的分值低于 25，就认为没有找到合适的 AVInputFormat。

整个函数的逻辑大体如下：

（1）当使用了自定义的 AVIOContext 的时候（AVFormatContext 中的 AVIOContext 不为空，即 `s->pb!=NULL`），如果指定了 AVInputFormat 就直接返回，如果没有指定就调用 `av_probe_input_buffer2()` 推测 AVInputFormat。这一情况出现的不算很多，但是当我们从内存中读取数据的时候（需要初始化自定义的 AVIOContext），就会执行这一步骤。

（2）在更一般的情况下，如果已经指定了 AVInputFormat，就直接返回；如果没有指定 AVInputFormat，就调用 `av_probe_input_format(NULL,…)` 根据文件路径判断文件格式。这里特意把 `av_probe_input_format()` 的第 1 个参数写成 “NULL”，是为了强调这个时候实际上并没有给函数提供输入数据，此时仅仅通过文件路径推测 AVInputFormat。

（3）如果发现通过文件路径判断不出来文件格式，那么就需要打开文件探测文件格式了，这个时候会首先调用 `avio_open2()` 打开文件，然后调用 `av_probe_input_buffer2()` 推测 AVInputFormat。

## avformat_find_stream_info()

该函数可以读取一部分视音频数据并且获得一些相关的信息。

`avformat_find_stream_info()` 的声明位于 `libavformat\avformat.h`

```c
int avformat_find_stream_info(AVFormatContext *ic, AVDictionary **options);
```

简单解释一下它的参数的含义：

```shell
ic：输入的 AVFormatContext。
options：额外的选项，目前没有深入研究过。
```

函数正常执行后返回值大于等于 0。

PS：由于该函数比较复杂，所以只看了一部分代码，以后有时间再进一步分析。

函数的调用关系如下图所示：

![avformat_find_stream_info](/images/imageFFmpeg/Thor/avformat_find_stream_info.png)

`avformat_find_stream_info()` 的定义位于 `libavformat\utils.c`

由于`avformat_find_stream_info()` 代码比较长，难以全部分析，在这里只能简单记录一下它的要点。该函数主要用于给每个媒体流（音频/视频）的 AVStream 结构体赋值。我们大致浏览一下这个函数的代码，会发现它其实已经实现了解码器的查找，解码器的打开，视音频帧的读取，视音频帧的解码等工作。换句话说，该函数实际上已经“走通”的解码的整个流程。下面看一下除了成员变量赋值之外，该函数的几个关键流程。

- 查找解码器：`find_decoder()`

- 打开解码器：`avcodec_open2()`

- 读取完整的一帧压缩编码的数据：`read_frame_internal()`

  注：`av_read_frame()` 内部实际上就是调用的 `read_frame_internal()`。

- 解码一些压缩编码数据：`try_decode_frame()`

## av_read_frame()

ffmpeg 中的 `av_read_frame()` 的作用是读取码流中的音频若干帧或者视频一帧。例如，解码视频的时候，每解码一个视频帧，需要先调用 `av_read_frame()` 获得一帧视频的压缩数据，然后才能对该数据进行解码（例如 H.264 中一帧压缩数据通常对应一个 NAL）。

上代码之前，先参考了其他人对 `av_read_frame()` 的解释，在此做一个参考：

> 通过 `av_read_packet()`，读取一个包，需要说明的是此函数必须是包含整数帧的，不存在半帧的情况，以 ts 流为例，是读取一个完整的 PES 包（一个完整 pes 包包含若干视频或音频 es 包），读取完毕后，通过 `av_parser_parse2()` 分析出视频一帧（或音频若干帧），返回，下次进入循环的时候，如果上次的数据没有完全取完，则 `st = s->cur_st` ; 不会是 NULL，即再此进入 `av_parser_parse2()` 流程，而不是下面的 `av_read_packet（）` 流程，这样就保证了，如果读取一次包含了 N 帧视频数据（以视频为例），则调用 `av_read_frame（）` N 次都不会去读数据，而是返回第一次读取的数据，直到全部解析完毕。

`av_read_frame()` 的声明位于 `libavformat\avformat.h`

```c
int av_read_frame(AVFormatContext *s, AVPacket *pkt);
```

`av_read_frame()` 使用方法在注释中写得很详细，用中文简单描述一下它的两个参数：

```shell
s：输入的AVFormatContext
pkt：输出的AVPacket
```

如果返回 0 则说明读取正常。

函数调用结构图如下所示：

![av_read_frame](/images/imageFFmpeg/Thor/av_read_frame.png)

`av_read_frame()` 的定义位于 `libavformat\utils.c`

`read_frame_internal()` 代码比较长，这里只简单看一下它前面的部分。它前面部分有 2 步是十分关键的：

（1）调用了 `ff_read_packet()` 从相应的 AVInputFormat 读取数据。

（2）如果媒体频流需要使用 AVCodecParser，则调用 `parse_packet()` 解析相应的 AVPacket。

`ff_read_packet()` 中最关键的地方就是调用了 AVInputFormat 的 `read_packet()` 方法。 AVInputFormat 的 `read_packet()` 是一个函数指针，指向当前的 AVInputFormat 的读取数据的函数。在这里我们以 FLV 封装格式对应的 AVInputFormat 为例，看看 `read_packet()` 的实现函数是什么样子的。

FLV 封装格式对应的 AVInputFormat 的定义位于 `libavformat\flvdec.c`

<details><summary>代码：</summary>

```c
AVInputFormat ff_flv_demuxer = {
    .name           = "flv",
    .long_name      = NULL_IF_CONFIG_SMALL("FLV (Flash Video)"),
    .priv_data_size = sizeof(FLVContext),
    .read_probe     = flv_probe,
    .read_header    = flv_read_header,
    .read_packet    = flv_read_packet,
    .read_seek      = flv_read_seek,
    .read_close     = flv_read_close,
    .extensions     = "flv",
    .priv_class     = &flv_class,
};
```

</details>

从 `ff_flv_demuxer` 的定义可以看出，`read_packet()` 对应的是 `flv_read_packet()` 函数。在看 `flv_read_packet()` 函数之前，我们先回顾一下 FLV 封装格式的结构，如下图所示。

PS：原图是网上找的，感觉画的很清晰，比官方的 Video File Format Specification 更加通俗易懂。但是图中有一个错误，就是 TagHeader 中的 StreamID 字段的长度写错了（查看了一下官方标准，应该是 3 字节，现在已经改过来了）。

![FLV封装格式](/images/imageFFmpeg/Thor/FLV封装格式.png)

从图中可以看出，FLV 文件体部分是由一个一个的 Tag 连接起来的（中间间隔着 Previous Tag Size）。每个 Tag 包含了 Tag Header 和 Tag Data 两个部分。

Tag Data 根据 Tag 的 Type 不同而不同：可以分为音频 Tag Data，视频 Tag Data 以及 Script Tag Data。下面简述一下音频 Tag Data 和视频 Tag Data。

### Audio Tag Data

Audio Tag在官方标准中定义如下。

![Audio Tag](/images/imageFFmpeg/Thor/AudioTag.png)

Audio Tag 开始的第 1 个字节包含了音频数据的参数信息，从第 2 个字节开始为音频流数据。
第 1 个字节的前 4 位的数值表示了音频数据格式：

```shell
0 = Linear PCM, platform endian
1 = ADPCM
2 = MP3
3 = Linear PCM, little endian
4 = Nellymoser 16-kHz mono
5 = Nellymoser 8-kHz mono
6 = Nellymoser
7 = G.711 A-law logarithmic PCM
8 = G.711 mu-law logarithmic PCM
9 = reserved
10 = AAC
14 = MP3 8-Khz
15 = Device-specific sound
```

第 1 个字节的第 5-6 位的数值表示采样率：`0 = 5.5kHz，1 = 11KHz，2 = 22 kHz，3 = 44 kHz`。

第 1 个字节的第7位表示采样精度：`0 = 8bits，1 = 16bits`。

第 1 个字节的第8位表示音频类型：`0 = sndMono，1 = sndStereo`。

其中，当音频编码为 AAC 的时候，第一个字节后面存储的是 AACAUDIODATA，格式如下所示。

![AACAUDIODATA格式](/images/imageFFmpeg/Thor/AACAUDIODATA格式.png)

### Video Tag Data

Video Tag在官方标准中的定义如下：

![Video Tag](/images/imageFFmpeg/Thor/VideoTag.png)

Video Tag 也用开始的第 1 个字节包含视频数据的参数信息，从第 2 个字节为视频流数据。

第 1 个字节的前 4 位的数值表示帧类型（FrameType）：

```shell
1: keyframe (for AVC, a seekableframe)（关键帧）
2: inter frame (for AVC, a nonseekableframe)
3: disposable inter frame (H.263only)
4: generated keyframe (reservedfor server use only)
5: video info/command frame
```

第 1 个字节的后 4 位的数值表示视频编码 ID（CodecID）：

```shell
1: JPEG (currently unused)
2: Sorenson H.263
3: Screen video
4: On2 VP6
5: On2 VP6 with alpha channel
6: Screen video version 2
7: AVC
```

其中，当音频编码为 AVC（H.264）的时候，第一个字节后面存储的是 AVCVIDEOPACKET，格式如下所示。

![AVCVIDEOPACKET格式](/images/imageFFmpeg/Thor/AVCVIDEOPACKET格式.png)

了解了 FLV 的基本格式之后，就可以看一下 FLV 解析 Tag 的函数 `flv_read_packet()了`。

`flv_read_packet()` 的定义位于 `libavformat\flvdec.c`

`flv_read_packet()` 的代码比较长，但是逻辑比较简单。它的主要功能就是根据 FLV 文件格式的规范，逐层解析 Tag 以及 TagData，获取 Tag 以及 TagData 中的信息。比较关键的地方已经写上了注释，不再详细叙述。

`parse_packet()` 给需要 AVCodecParser 的媒体流提供解析 AVPacket 的功能。

从代码中可以看出，最终调用了相应 AVCodecParser 的 `av_parser_parse2()` 函数，解析出来 AVPacket。此后根据解析的信息还进行了一系列的赋值工作，不再详细叙述。

## avcodec_decode_video2()

ffmpeg 中的 `avcodec_decode_video2()` 的作用是解码一帧视频数据。输入一个压缩编码的结构体 AVPacket，输出一个解码后的结构体 AVFrame。该函数的声明位于 `libavcodec\avcodec.h`

```c
int avcodec_decode_video2(AVCodecContext *avctx, AVFrame *picture,
                         int *got_picture_ptr,
                         const AVPacket *avpkt);
```

查看源代码之后发现，这个函数竟然十分的简单，源代码位于 `libavcodec\utils.c`

从代码中可以看出，`avcodec_decode_video2()` 主要做了以下几个方面的工作：

（1）对输入的字段进行了一系列的检查工作：例如宽高是否正确，输入是否为视频等等。

（2）通过 `ret = avctx->codec->decode(avctx, picture, got_picture_ptr,&tmp)` 这句代码，调用了相应 AVCodec 的 `decode()` 函数，完成了解码操作。

（3）对得到的 AVFrame 的一些字段进行了赋值，例如宽高、像素格式等等。

其中第二部是关键的一步，它调用了 AVCodec 的 `decode()` 方法完成了解码。AVCodec 的 `decode()` 方法是一个函数指针，指向了具体解码器的解码函数。在这里我们以 H.264 解码器为例，看一下解码的实现过程。H.264 解码器对应的 AVCodec 的定义位于 `libavcodec\h264.c`，如下所示。

<details><summary>代码：</summary>

```cpp
AVCodec ff_h264_decoder = {
    .name                  = "h264",
    .long_name             = NULL_IF_CONFIG_SMALL("H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10"),
    .type                  = AVMEDIA_TYPE_VIDEO,
    .id                    = AV_CODEC_ID_H264,
    .priv_data_size        = sizeof(H264Context),
    .init                  = ff_h264_decode_init,
    .close                 = h264_decode_end,
    .decode                = h264_decode_frame,
    .capabilities          = /*CODEC_CAP_DRAW_HORIZ_BAND |*/ CODEC_CAP_DR1 |
                             CODEC_CAP_DELAY | CODEC_CAP_SLICE_THREADS |
                             CODEC_CAP_FRAME_THREADS,
    .flush                 = flush_dpb,
    .init_thread_copy      = ONLY_IF_THREADS_ENABLED(decode_init_thread_copy),
    .update_thread_context = ONLY_IF_THREADS_ENABLED(ff_h264_update_thread_context),
    .profiles              = NULL_IF_CONFIG_SMALL(profiles),
    .priv_class            = &h264_class,
};
```

</details>

从 `ff_h264_decoder` 的定义可以看出，`decode()` 指向了 `h264_decode_frame()` 函数。

从 `h264_decode_frame()` 的定义可以看出，它调用了 `decode_nal_units()` 完成了具体的 H.264 解码工作。

## avformat_close_input()

该函数用于关闭一个 AVFormatContext，一般情况下是和 `avformat_open_input()` 成对使用的。

函数的调用关系如下图所示：

![avformat_close_input](/images/imageFFmpeg/Thor/avformat_close_input.png)

`avformat_close_input()` 的源代码位于 `libavformat\utils.c`

从源代码中可以看出，`avformat_close_input()` 主要做了以下几步工作：

（1）调用 AVInputFormat 的 `read_close()` 方法关闭输入流

（2）调用 `avformat_free_context()` 释放 AVFormatContext

（3）调用 `avio_close()` 关闭并且释放 AVIOContext

# 编码

## avformat_alloc_output_context2()

在基于 FFmpeg 的视音频编码器程序中，该函数通常是第一个调用的函数（除了组件注册函数 `av_register_all()`）。

`avformat_alloc_output_context2()` 函数可以初始化一个用于输出的 AVFormatContext 结构体。它的声明位于 `libavformat\avformat.h`

```c
int avformat_alloc_output_context2(AVFormatContext **ctx, AVOutputFormat *oformat,
                                   const char *format_name, const char *filename);
```

代码中的英文注释写的已经比较详细了，在这里拿中文简单叙述一下。

```shell
ctx：函数调用成功之后创建的AVFormatContext结构体。
oformat：指定AVFormatContext中的AVOutputFormat，用于确定输出格式。如果指定为NULL，可以设定后两个参数（format_name或者filename）由FFmpeg猜测输出格式。
PS：使用该参数需要自己手动获取AVOutputFormat，相对于使用后两个参数来说要麻烦一些。
format_name：指定输出格式的名称。根据格式名称，FFmpeg会推测输出格式。输出格式可以是“flv”，“mkv”等等。
filename：指定输出文件的名称。根据文件名称，FFmpeg会推测输出格式。文件名称可以是“xx.flv”，“yy.mkv”等等。
```

函数执行成功的话，其返回值大于等于0。

首先贴出来最终分析得出的函数调用结构图，如下所示：

![avformat_alloc_output_context2](/images/imageFFmpeg/Thor/avformat_alloc_output_context2.png)

`avformat_alloc_output_context2()` 的函数定义位于 `libavformat\mux.c`

从代码中可以看出，`avformat_alloc_output_context2()` 的流程如要包含以下 2 步：

1)	调用 `avformat_alloc_context()` 初始化一个默认的 AVFormatContext。

2)	如果指定了输入的 AVOutputFormat，则直接将输入的 AVOutputFormat 赋值给AVOutputFormat 的 oformat。如果没有指定输入的 AVOutputFormat，就需要根据文件格式名称或者文件名推测输出的 AVOutputFormat。无论是通过文件格式名称还是文件名推测输出格式，都会调用一个函数 `av_guess_format()`。

`avformat_alloc_context()` 首先调用 `av_malloc()` 为 AVFormatContext 分配一块内存。然后调用了一个函数 `avformat_get_context_defaults()` 用于给 AVFormatContext 设置默认值

`avformat_alloc_context()` 首先调用 `memset()` 将 AVFormatContext 的内存置零；然后指定它的AVClass（指定了 AVClass 之后，该结构体就支持和 AVOption 相关的功能）；最后调用 `av_opt_set_defaults()` 给 AVFormatContext 的成员变量设置默认值（`av_opt_set_defaults()` 就是和 AVOption 有关的一个函数，专门用于给指定的结构体设定默认值，此处暂不分析）。

`av_guess_format()` 中使用一个整型变量 score 记录每种输出格式的匹配程度。函数中包含了一个 `while()` 循环，该循环利用函数 `av_oformat_next()` 遍历 FFmpeg 中所有的 AVOutputFormat，并逐一计算每个输出格式的 score。具体的计算过程分成如下几步：

1)	如果封装格式名称匹配，score 增加 100。匹配中使用了函数 `av_match_name()`。

2)	如果 mime 类型匹配，score 增加 10。匹配直接使用字符串比较函数 `strcmp()`。

3)	如果文件名称的后缀匹配，score 增加 5。匹配中使用了函数 `av_match_ext()`。

`while()` 循环结束后，得到得分最高的格式，就是最匹配的格式。

下面看一下一个 AVOutputFormat 的实例，就可以理解 “封装格式名称”，“mine类型”，“文件名称后缀” 这些概念了。下面是 flv 格式的视音频复用器（Muxer）对应的 AVOutputFormat 格式的变量 `ff_flv_muxer`。

<details><summary>代码：</summary>

```c
AVOutputFormat ff_flv_muxer = {
    .name           = "flv",
    .long_name      = NULL_IF_CONFIG_SMALL("FLV (Flash Video)"),
    .mime_type      = "video/x-flv",
    .extensions     = "flv",
    .priv_data_size = sizeof(FLVContext),
    .audio_codec    = CONFIG_LIBMP3LAME ? AV_CODEC_ID_MP3 : AV_CODEC_ID_ADPCM_SWF,
    .video_codec    = AV_CODEC_ID_FLV1,
    .write_header   = flv_write_header,
    .write_packet   = flv_write_packet,
    .write_trailer  = flv_write_trailer,
    .codec_tag      = (const AVCodecTag* const []) {
                          flv_video_codec_ids, flv_audio_codec_ids, 0
                      },
    .flags          = AVFMT_GLOBALHEADER | AVFMT_VARIABLE_FPS |
                      AVFMT_TS_NONSTRICT,
};
```

</details>

## avformat_write_header()

FFmpeg 的写文件用到的 3 个函数：

- **`avformat_write_header()`**
- **`av_write_frame()`**
- **`av_write_trailer()`**

其中 `av_write_frame()` 用于写视频数据，`avformat_write_header()` 用于写视频文件头，而 `av_write_trailer()` 用于写视频文件尾。

本文首先分析`avformat_write_header()`。

PS：需要注意的是，尽管这 3 个函数功能是配套的，但是它们的前缀却不一样，写文件头 Header 的函数前缀是“`avformat_`”，其他两个函数前缀是“`av_`”（不太明白其中的原因）。

`avformat_write_header()` 的声明位于 `libavformat\avformat.h`

```c
int avformat_write_header(AVFormatContext *s, AVDictionary **options);
```

简单解释一下它的参数的含义：

```shell
s：用于输出的AVFormatContext。
options：额外的选项，目前没有深入研究过，一般为NULL。
```

函数正常执行后返回值等于 0。

`avformat_write_header()` 的调用关系如下图所示：

![avformat_write_header](/images/imageFFmpeg/Thor/avformat_write_header.png)

`avformat_write_header()` 的定义位于 `libavformat\mux.c`

从源代码可以看出，`avformat_write_header()` 完成了以下工作：

（1）调用 `init_muxer()` 初始化复用器

（2）调用 AVOutputFormat 的 `write_header()`

`init_muxer()` 代码很长，但是它所做的工作比较简单，可以概括成两个字：检查。函数的流程可以概括成以下几步：

（1）将传入的 AVDictionary 形式的选项设置到 AVFormatContext

（2）遍历 AVFormatContext 中的每个 AVStream，并作如下检查：

- a) AVStream 的 time_base 是否正确设置。如果发现 AVStream 的 time_base 没有设置，则会调用 `avpriv_set_pts_info()` 进行设置。
- b) 对于音频，检查采样率设置是否正确；对于视频，检查宽、高、宽高比。

- c) 其他一些检查，不再详述。

**AVOutputFormat->write_header()**

`avformat_write_header()` 中最关键的地方就是调用了 AVOutputFormat 的 `write_header()`。

`write_header()` 是 AVOutputFormat 中的一个函数指针，指向写文件头的函数。不同的AVOutputFormat 有不同的 `write_header()` 的实现方法。在这里我们举例子看一下 FLV 封装格式对应的 AVOutputFormat，它的定义位于 `libavformat\flvenc.c`

从 `ff_flv_muxer` 的定义中可以看出，`write_header()` 指向的函数为 `flv_write_header()`。我们继续看一下 `flv_write_header()` 函数。`flv_write_header()` 的定义同样位于 `libavformat\flvenc.c`

从源代码可以看出，`flv_write_header()` 完成了FLV文件头的写入工作。该函数的工作可以大体分为以下两部分：

（1）给 FLVContext 设置参数

（2）写文件头，以及相关的 Tag

可以参考下图中 FLV 文件头的定义比对一下上面的代码。

![FLV Header.png](/images/imageFFmpeg/Thor/FLVHeader.png)

## avcodec_encode_video()

该函数用于编码一帧视频数据。`avcodec_encode_video2()` 函数的声明位于 `libavcodec\avcodec.h`

```c
int avcodec_encode_video2(AVCodecContext *avctx, AVPacket *avpkt,
                          const AVFrame *frame, int *got_packet_ptr);
```

该函数每个参数的含义在注释里面已经写的很清楚了，在这里用中文简述一下：

```shell
avctx：编码器的AVCodecContext。
avpkt：编码输出的AVPacket。
frame：编码输入的AVFrame。
got_packet_ptr：成功编码一个AVPacket的时候设置为1。
```

函数返回0代表编码成功。

函数的调用关系如下图所示：

![avcodec_encode_video](/images/imageFFmpeg/Thoreavcodec_encode_video.png)

`avcodec_encode_video2()` 的定义位于 `libavcodec\utils.c`

从函数的定义可以看出，`avcodec_encode_video2()` 首先调用了 `av_image_check_size()` 检查设置的宽高参数是否合理，然后调用了 AVCodec 的 `encode2()` 调用具体的解码器。

`av_image_check_size()` 主要是要求图像宽高必须为正数，而且取值不能太大。

AVCodec 的 `encode2()` 是一个函数指针，指向特定编码器的编码函数

从 `ff_libx264_encoder` 的定义可以看出，`encode2()` 函数指向的是 `X264_frame()` 函数。

`X264_frame()` 函数的定义位于 `libavcodec\libx264.c`

## av_write_frame()

`av_write_frame()` 用于输出一帧视音频数据，它的声明位于 `libavformat\avformat.h`

```c
int av_write_frame(AVFormatContext *s, AVPacket *pkt);
```

简单解释一下它的参数的含义：

```shell
s：用于输出的AVFormatContext。
pkt：等待输出的AVPacket。
```

函数正常执行后返回值等于 0。

`av_write_frame()` 的调用关系如下图所示：

![av_write_frame](/images/imageFFmpeg/Thor/av_write_frame.png)

`av_write_frame()` 的定义位于 `libavformat\mux.c`

从源代码可以看出，`av_write_frame()` 主要完成了以下几步工作：

（1）调用 `check_packet()` 做一些简单的检测

（2）调用 `compute_pkt_fields2()` 设置 AVPacket 的一些属性值

（3）调用 `write_packet()` 写入数据

`check_packet()` 的功能比较简单：首先检查一下输入的 AVPacket 是否为空，如果为空，则是直接返回；然后检查一下 AVPacket 的 `stream_index`（标记了该 AVPacket 所属的 AVStream）设置是否正常，如果为负数或者大于 AVStream 的个数，则返回错误信息；最后检查 AVPacket 所属的 AVStream 是否属于 attachment stream，这个地方没见过，目前还没有研究。

`compute_pkt_fields2()` 函数的定义位于 `libavformat\mux.c`

`compute_pkt_fields2()` 主要有两方面的功能：

- 一方面用于计算 AVPacket 的 duration， dts 等信息；
- 另一方面用于检查 pts、dts 这些参数的合理性（例如 PTS 是否一定大于 DTS）。具体的代码还没有细看，以后有时间再进行分析。

`write_packet()` 函数的定义位于 `libavformat\mux.c`

`write_packet()` 函数最关键的地方就是调用了 AVOutputFormat 中写入数据的方法。如果 AVPacket 中的 flag 标记中包含 AV_PKT_FLAG_UNCODED_FRAME，就会调用 AVOutputFormat 的 `write_uncoded_frame()` 函数；如果不包含那个标记，就会调用 `write_packet()` 函数。 `write_packet()` 实际上是一个函数指针，指向特定的 AVOutputFormat 中的实现函数。例如，我们看一下 FLV 对应的 AVOutputFormat，位于 `libavformat\flvenc.c`

从 `ff_flv_muxer` 的定义可以看出，`write_packet()` 指向的是 `flv_write_packet()` 函数。在看 `flv_write_packet()` 函数的定义之前，先回顾一下 FLV 封装格式的结构。

## av_write_trailer()

`av_write_trailer()` 用于输出文件尾，它的声明位于 `libavformat\avformat.h`

```c
int av_write_trailer(AVFormatContext *s);
```

它只需要指定一个参数，即用于输出的 AVFormatContext。

函数正常执行后返回值等于 0。

`av_write_trailer()` 的调用关系如下图所示：

![av_write_trailer](/images/imageFFmpeg/Thor/av_write_trailer.png)

`av_write_trailer()` 的定义位于 `libavformat\mux.c`

从源代码可以看出 `av_write_trailer()` 主要完成了以下两步工作：

（1）循环调用 `interleave_packet()` 以及 `write_packet()`，将还未输出的 AVPacket 输出出来。

（2）调用 AVOutputFormat 的 `write_trailer()`，输出文件尾。

其中第一步和 `av_write_frame()` 中的步骤大致是一样的（`interleave_packet()` 这一部分在并不包含在 `av_write_frame()` 中，而是包含在 `av_interleaved_write_frame()` 中，这一部分源代码还没有分析）

AVOutputFormat 的 `write_trailer()` 是一个函数指针，指向特定的 AVOutputFormat 中的实现函数。我们以 FLV 对应的 AVOutputFormat 为例，看一下它的定义

从 FLV 对应的 AVOutputFormat 结构体的定义我们可以看出，`write_trailer()` 指向了`flv_write_trailer()` 函数。

`flv_write_trailer()` 函数的定义位于 `libavformat\flvenc.c`

从 `flv_write_trailer()` 的源代码可以看出该函数做了以下两步工作：

（1）如果视频流是 H.264，则添加包含 EOS（End Of Stream） NALU 的 Tag。

（2）更新 FLV 的时长信息，以及文件大小信息。

其中，`put_avc_eos_tag()` 函数用于添加包含 EOS NALU 的 Tag（包含结尾的一个PreviousTagSize）

可以参考 FLV 封装格式理解上述函数。由于前面的文章中已经描述过 FLV 封装格式，在这里不再重复叙述，在这里仅在此记录一下 AVCVIDEOPACKET 的格式，如下所示。

![AVCVIDEOPACKET格式](/images/imageFFmpeg/Thor/AVCVIDEOPACKET格式.png)

可以看出包含 EOS NALU 的 AVCVIDEOPACKET 的 AVCPacketType 为 2。在这种情况下， AVCVIDEOPACKET 的 CompositionTime 字段取 0，并且无需包含 Data 字段。

# 日志输出系统

> [日志输出系统](<https://blog.csdn.net/leixiaohua1020/article/details/44243155>)

## av_log()

本文分析一下 FFmpeg 的日志（Log）输出系统的源代码。日志输出部分的核心函数只有一个： `av_log()`。使用 `av_log()` 在控制台输出日志的效果如下图所示。

![av_log控制台日志输出](/images/imageFFmpeg/Thor/av_log控制台日志输出.png)

FFmpeg 日志输出系统的函数调用结构图如图所示：

![FFmpeg 日志输出系统的函数调用结构图](/images/imageFFmpeg/Thor/av_log.png)

`av_log()` 是 FFmpeg 中输出日志的函数。随便打开一个 FFmpeg 的源代码文件，就会发现其中遍布着 `av_log()` 函数。一般情况下 FFmpeg 类库的源代码中是不允许使用 `printf()` 这种的函数的，所有的输出一律使用 `av_log()`。

av_log()的声明位于libavutil\log.h

```c
void av_log(void *avcl, int level, const char *fmt, ...) av_printf_format(3, 4);
```

这个函数的声明有两个地方比较特殊：

（1）函数最后一个参数是 “…”。

在 C 语言中，在函数参数数量不确定的情况下使用 “…” 来代表参数。例如 `printf()` 的原型定义如下

```c
int printf (const char*, ...);
```

（2）它的声明后面有一个 `av_printf_format(3, 4)`。有关这个地方的左右还没有深入研究，网上资料中说它的作用是按照 `printf()` 的格式检查 `av_log()` 的格式。

av_log()每个字段的含义如下：

- avcl：指定一个包含 AVClass 的结构体。
- level：log 的级别
- fmt：和 `printf()` 一样。

由此可见，`av_log()` 和 `printf()` 的不同主要在于前面多了两个参数。其中第一个参数指定该 log 所属的结构体，例如 AVFormatContext、AVCodecContext 等等。第二个参数指定 log 的级别，源代码中定义了如下几个级别。

```c
#define AV_LOG_QUIET    -8
#define AV_LOG_PANIC     0
#define AV_LOG_FATAL     8
#define AV_LOG_ERROR    16
#define AV_LOG_WARNING  24
#define AV_LOG_INFO     32
#define AV_LOG_VERBOSE  40
#define AV_LOG_DEBUG    48
```

从定义中可以看出来，随着严重程度逐渐下降，一共包含如下级别：

- AV_LOG_PANIC，
- AV_LOG_FATAL，
- AV_LOG_ERROR，
- AV_LOG_WARNING，
- AV_LOG_INFO，
- AV_LOG_VERBOSE，
- AV_LOG_DEBUG。

每个级别定义的数值代表了严重程度，数值越小代表越严重。默认的级别是 AV_LOG_INFO。此外，还有一个级别不输出任何信息，即 AV_LOG_QUIET。

当前系统存在着一个 “Log级别”。所有严重程度高于该级别的 Log 信息都会输出出来。例如当前的 Log 级别是 AV_LOG_WARNING，则会输出 AV_LOG_PANIC，AV_LOG_FATAL，AV_LOG_ERROR，AV_LOG_WARNING 级别的信息，而不会输出 AV_LOG_INFO 级别的信息。可以通过 `av_log_get_level()` 获得当前 Log 的级别，通过另一个函数 `av_log_set_level()` 设置当前的 Log 级别。

可以通过 `av_log_set_level()` 设置当前 Log 的级别。

# 接头体成员管理系统

## AVClass

> [FFmpeg源代码简单分析：结构体成员管理系统-AVClass](<https://blog.csdn.net/leixiaohua1020/article/details/44268323>)

TODO

## AVOption

> [FFmpeg源代码简单分析：结构体成员管理系统-AVOption](<https://blog.csdn.net/leixiaohua1020/article/details/44279329>)

TODO

# libswscale

## sws_getContext()

> [FFmpeg源代码简单分析：libswscale的sws_getContext()](<https://blog.csdn.net/leixiaohua1020/article/details/44305697>)

TODO

## sws_scale()

> [FFmpeg源代码简单分析：libswscale的sws_scale()](<https://blog.csdn.net/leixiaohua1020/article/details/44346687>)

TODO

# libavdevice

## avdevice_register_all()

> [FFmpeg源代码简单分析：libavdevice的avdevice_register_all()](<https://blog.csdn.net/leixiaohua1020/article/details/41211121>)

## gdigrab

> [FFmpeg源代码简单分析：libavdevice的gdigrab](<https://blog.csdn.net/leixiaohua1020/article/details/44597955>)



![](/images/imageFFmpeg/Thor/)
