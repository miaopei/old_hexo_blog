---
title: FFmpeg的H.264解码器源代码简单分析
tags: FFmpeg
reward: true
categories: FFmpeg
toc: true
abbrlink: 39639
date: 2019-05-28 10:14:50
---

> 文章参考汇总至[雷神笔记](<https://blog.csdn.net/leixiaohua1020/article/details/45536607>)

# 编码 - x264

## 概述

最近正在研究H.264和HEVC的编码方式，因此分析了一下最常见的H.264编码器——x264的源代码。本文简单梳理一下它的结构。X264的源代码量比较大而且涉及到很多的算法，目前还有很多不懂的地方，因此也不能保证分析的完全正确。目前打算先把已经理解的部分整理出来以作备忘。

### 函数调用关系图

<!-- more -->

![X264的函数调用关系图](/images/imageFFmpeg/Thor/X264的函数调用关系图.png)

下面解释一下图中关键标记的含义。

#### 函数背景色

函数在图中以方框的形式表现出来。不同的背景色标志了该函数不同的作用：

- **白色背景的函数**：不加区分的普通内部函数。
- **浅红背景的函数**：libx264类库的接口函数（API）。
- **粉红色背景函数**：滤波函数（Filter）。用于环路滤波，半像素插值，SSIM/PSNR的计算。
- **黄色背景函数**：分析函数（Analysis）。用于帧内预测模式的判断，或者帧间预测模式的判断。
- **绿色背景的函数**：宏块编码函数（Encode）。通过对残差的DCT变换、量化等方式对宏块进行编码。
- **紫色背景的函数**：熵编码函数（Entropy Coding）。对宏块编码后的数据进行CABAC或者CAVLC熵编码。
- **蓝色背景函数**：汇编函数（Assembly）。做过汇编优化的函数。图中主要画出了这些函数的C语言版本，此外这些函数还包含MMX版本、SSE版本、NEON版本等。

- **浅蓝色背景函数**：码率控制函数（Rate Control）。对码率进行控制的函数。具体的方法包括了ABR、CBR、CRF等。

#### 区域

整个关系图可以分为以下几个区域：

- **最左边区域**——x264命令行程序函数区域。
- **左边中间区域**——libx264内部函数区域。
- **右上方粉红色区域**——滤波模块。其中包括了环路滤波，半像素插值，SSIM/PSNR计算。
- **右上方黄色区域**——分析模块。其中包含了帧内预测模式分析以及帧间运动估计等。
- **右中间绿色区域**——宏块编码模块。其中包含了针对编码帧的DCT变换，量化，Hadamard变换等；以及针对重建帧的DCT反变换，反量化，Hadamard反变换等。
- **右下方紫色区域**——熵编码模块。其中包含了CABAC或者CAVLC熵编码。

#### 箭头线

箭头线标志了函数的调用关系：

- **黑色箭头线**：不加区别的调用关系。
- **粉红色的箭头线**：滤波函数（Filter）之间的调用关系。
- **黄色箭头线**：分析函数（Analysis）之间的调用关系。
- **绿色箭头线**：宏块编码函数（Encode）之间的调用关系。
- **紫色箭头线**：熵编码函数（Entropy Coding）之间的调用关系。

#### 函数所在的文件

每个函数标识了它所在的文件路径。

### 几个关键的部分

下文简单记录图中几个关键的部分。

#### x264命令行程序

x264命令行程序指的是x264项目提供的控制台程序。通过这个程序可以调用libx264编码YUV为H.264码流。该程序的入口函数为 `main()`。`main()` 函数首先调用 `parse()` 解析输入的参数，然后调用 `encode()` 编码YUV数据。

<font style="color:red;">**parse()**</font>首先调用 `x264_param_default()` 为保存参数的 `x264_param_t` 结构体赋默认值；然后在一个大循环中通过 `getopt_long()` 解析通过命令行传递来的存储在 `argv[]` 中的参数，并作相应的设置工作；最后调用 `select_input()` 和 `select_output()` 完成输入文件格式（yuv，y4m等）和输出文件格式（裸流，mp4，mkv，FLV等）的设置。

<font style="color:red;">**encode()**</font>首先调用 `x264_encoder_open()` 打开编码器；接着在一个循环中反复调用 `encode_frame()` 一帧一帧地进行编码；最后在编码完成后调用 `x264_encoder_close()` 关闭编码器。

<font style="color:red;">**encode_frame()**</font>则调用 `x264_encoder_encode()` 将存储YUV数据的 `x264_picture_t` 编码为存储H.264数据的 `x264_nal_t`。

#### <font style="color:#ff6600;">libx264类库的接口</font>

在一个x264编码流程中，至少需要调用如下API函数（参考文章《[最简单的视频编码器：基于libx264（编码YUV为H.264）](http://blog.csdn.net/leixiaohua1020/article/details/42078645)》）：

```c
x264_param_default() 	// 设置参数集结构体x264_param_t的缺省值。
x264_picture_alloc() 	// 为图像结构体x264_picture_t分配内存。
x264_encoder_open() 	// 打开编码器。
x264_encoder_encode()	// 编码一帧图像。
x264_encoder_close()	// 关闭编码器。
x264_picture_clean()	// 释放x264_picture_alloc()申请的资源。
```

#### libx264主干函数

libx264主干函数指的是编码API之后，`x264_slice_write()` 之前的函数。这一部分函数较多，暂时不详细分析，仅仅举几个例子列一下它们的功能。

```c
x264_encoder_open() 		// 调用了下面的函数：
x264_validate_parameters()	// 检查输入参数（例如输入图像的宽高是否为正数）。
x264_predict_16x16_init()	// 初始化Intra16x16帧内预测汇编函数。
x264_predict_4x4_init()		// 初始化Intra4x4帧内预测汇编函数。
x264_pixel_init()			// 初始化像素值计算相关的汇编函数（包括SAD、SATD、SSD等）。
x264_dct_init()				// 初始化DCT变换和DCT反变换相关的汇编函数。
x264_mc_init() 				// 初始化运动补偿相关的汇编函数。
x264_quant_init()			// 初始化量化和反量化相关的汇编函数。
x264_deblock_init()			// 初始化去块效应滤波器相关的汇编函数。
x264_lookahead_init()		// 初始化Lookahead相关的变量。
x264_ratecontrol_new()		// 初始化码率控制模块。
```

`x264_encoder_headers()` 调用了下面的函数：

```c
x264_sps_write()			// 输出SPS
x264_pps_write()			// 输出PPS
x264_sei_version_write()	// 输出SEI
```

x264_encoder_encode()调用了下面的函数：

```c
x264_frame_pop_unused()	// 获取1个x264_frame_t类型结构体fenc。如果frames.unused[]队列不为空，就调用x264_frame_pop()从unused[]队列取1个现成的；否则就调用x264_frame_new()创建一个新的。
x264_frame_copy_picture()	// 将输入的图像数据拷贝至fenc。
x264_lookahead_put_frame()	// 将fenc放入lookahead.next.list[]队列，等待确定帧类型。
x264_lookahead_get_frames()	// 通过lookahead分析帧类型。该函数调用了x264_slicetype_decide()，x264_slicetype_analyse()和x264_slicetype_frame_cost()等函数。经过一些列分析之后，最终确定了帧类型信息，并且将帧放入frames.current[]队列。
x264_frame_shift()	// 从frames.current[]队列取出一帧用于编码。
x264_reference_update() // 更新参考帧列表。
x264_reference_reset() // 如果为IDR帧，调用该函数清空参考帧列表。
x264_reference_hierarchy_reset() // 如果是I（非IDR帧）、P帧、B帧（可做为参考帧），调用该函数（还没研究）。
x264_reference_build_list() // 创建参考帧列表list0和list1。
x264_ratecontrol_start() // 开启码率控制。
x264_slice_init() // 创建 Slice Header。
x264_slices_write() // 编码数据（最关键的步骤）。其中调用了x264_slice_write()完成了编码的工作（注意“x264_slices_write()”和“x264_slice_write()”名字差了一个“s”）。
x264_encoder_frame_end() // 编码结束后做一些后续处理，例如释放一些中间变量以及打印输出一些统计信息。其中调用了x264_frame_push_unused()将fenc重新放回frames.unused[]队列，并且调用x264_ratecontrol_end()关闭码率控制。
```

#### x264_slice_write()

`x264_slice_write()` 用于编码 Slice。该函数中包含了一个很长的 `for()` 循环。该循环每执行一遍编码一个宏块。`x264_slice_write()` 中以下几个函数比较重要：

```c
x264_nal_start() 	// 开始写一个NALU。
x264_macroblock_thread_init() // 初始化存储宏块的重建数据缓存fdec_buf[]和编码数据缓存fenc_buf[]。
x264_slice_header_write() 	// 输出 Slice Header。
x264_fdec_filter_row() 		// 滤波模块。该模块包含了环路滤波，半像素插值，SSIM/PSNR的计算。
x264_macroblock_cache_load() 	// 将要编码的宏块的周围的宏块的信息读进来。
x264_macroblock_analyse()		// 分析模块。该模块包含了帧内预测模式分析以及帧间运动估计等。
x264_macroblock_encode() // 宏块编码模块。该模块通过对残差的DCT变换、量化等方式对宏块进行编码。
x264_macroblock_write_cabac() // CABAC熵编码模块。
x264_macroblock_write_cavlc() // CAVLC熵编码模块。
x264_macroblock_cache_save() // 保存当前宏块的信息。
x264_ratecontrol_mb() // 码率控制。
x264_nal_end() // 结束写一个NALU。
```

#### <font style="color:#ffcccc;">滤波模块</font>

滤波模块对应的函数是 `x264_fdec_filter_row()`。该函数完成了环路滤波，半像素插值，`SSIM/PSNR` 的计算的功能。该函数调用了以下及个比较重要的函数：

```c
x264_frame_deblock_row()	// 去块效应滤波器。
x264_frame_filter()			// 半像素插值。
x264_pixel_ssd_wxh()		// PSNR计算。
x264_pixel_ssim_wxh()		// SSIM计算。
```

#### <font style="color:#ffcc33;">分析模块</font>

分析模块对应的函数是 `x264_macroblock_analyse()`。该函数包含了帧内预测模式分析以及帧间运动估计等。该函数调用了以下比较重要的函数（只列举了几个有代表性的函数）：

```c
x264_mb_analyse_init()			// Analysis模块初始化。
x264_mb_analyse_intra()			// I 宏块帧内预测模式分析。
x264_macroblock_probe_pskip()	// 分析是否是skip模式。
x264_mb_analyse_inter_p16x16()	// P16x16宏块帧间预测模式分析。
x264_mb_analyse_inter_p8x8()	// P8x8宏块帧间预测模式分析。
x264_mb_analyse_inter_p16x8()	// P16x8宏块帧间预测模式分析。
x264_mb_analyse_inter_b16x16()	// B16x16宏块帧间预测模式分析。
x264_mb_analyse_inter_b8x8()	// B8x8宏块帧间预测模式分析。
x264_mb_analyse_inter_b16x8()	// B16x8宏块帧间预测模式分析。
```

#### <font style="color:#33cc00;">宏块编码模块</font>

宏块编码模块对应的函数是 `x264_macroblock_encode()`。该模块通过对残差的 DCT 变换、量化等方式对宏块进行编码。对于 `Intra16x16` 宏块，调用 `x264_mb_encode_i16x16()` 进行编码，对于 `Intra4x4`，调用 `x264_mb_encode_i4x4()` 进行编码。对于Inter类型的宏块则直接在函数体里面编码。

#### <font style="color:#cc33cc;">熵编码模块</font>

CABAC 熵编码对应的函数是 `x264_macroblock_write_cabac()`。CAVLC 熵编码对应的函数是 `x264_macroblock_write_cavlc()`。`x264_macroblock_write_cavlc()` 调用了以下几个比较重要的函数：

```c
x264_cavlc_mb_header_i()		// 写入I宏块MB Header数据。包含帧内预测模式等。
x264_cavlc_mb_header_p()		// 写入P宏块MB Header数据。包含MVD、参考帧序号等。
x264_cavlc_mb_header_b()		// 写入B宏块MB Header数据。包含MVD、参考帧序号等。
x264_cavlc_qp_delta()			// 写入QP。
x264_cavlc_block_residual()		// 写入残差数据。
```

#### <font style="color:#66cccc;">码率控制模块</font>

码率控制模块函数分布在x264源代码不同的地方，包含了以下几个比较重要的函数：

```c
x264_encoder_open() 	中的 x264_ratecontrol_new()		// 创建码率控制。
x264_encoder_encode() 	中的 x264_ratecontrol_start()		// 开始码率控制。
x264_slice_write()		中的 x264_ratecontrol_mb()		// 码率控制算法。
x264_encoder_encode()	中的 x264_ratecontrol_end()		// 结束码率控制。
x264_encoder_close()	中的 x264_ratecontrol_summary()	// 码率控制信息。
x264_encoder_close()	中的 x264_ratecontrol_delete()	// 释放码率控制。
```

## x264命令行工具

该命令行工具可以调用 libx264 将 YUV 格式像素数据编码为 H.264 码流。

### 函数调用关系图

![X264命令行工具的源代码的调用关系](/images/imageFFmpeg/Thor/X264命令行工具的源代码的调用关系.png)

从图中可以看出，X264命令行工具调用了libx264的几个API完成了H.264编码工作。使用libx264的API进行编码可以参考《[最简单的视频编码器：基于libx264（编码YUV为H.264）](http://blog.csdn.net/leixiaohua1020/article/details/42078645)》，这个流程中最关键的API包括：

```c
x264_param_default()	// 设置参数集结构体x264_param_t的缺省值。
x264_encoder_open()		// 打开编码器。
x264_encoder_headers()	// 输出SPS，PPS，SEI等信息。
x264_encoder_encode()	// 编码输出一帧图像。
x264_encoder_close()	// 关闭编码器。
```

在X264命令行工具中，`main()` 首先调用 `parse()` 解析输入的命令行参数，然后调用 `encode()` 进行编码。 

`parse()` 首先调用 `x264_param_default()` 为存储参数的结构体 `x264_param_t` 赋默认值；然后在一个大循环中调用 `getopt_long()` 逐个解析输入的参数，并作相应的处理；最后调用 `select_input()` 和 `select_output()` 解析输入文件格式（例如yuv，y4m…）和输出文件格式（例如raw，flv，MP4…）。

`encode()` 首先调用 `x264_encoder_open()` 打开H.264编码器，然后调用 `x264_encoder_headers()` 输出H.264码流的头信息（例如SPS、PPS、SEI），接着进入一个循环并且调用 `encode_frame()` 逐帧编码视频，最后调用 `x264_encoder_close()` 关闭解码器。其中 `encode_frame()` 中又调用了 `x264_encoder_encode()` 完成了具体的编码工作。下文将会对上述流程展开分析。

#### main()

`main()` 的定义很简单，它主要调用了两个函数：`parse()` 和 `encode()` 。`main()` 首先调用 `parse()` 解析输入的命令行参数，然后调用 `encode()` 进行编码。下面分别分析这两个函数。

#### parse()

`parse()` 用于解析命令行输入的参数（存储于 `argv[]` 中）

下面简单梳理 `parse()` 的流程：

（1）调用 `x264_param_default()` 为存储参数的结构体 `x264_param_t` 赋默认值

（2）调用 `x264_param_default_preset()` 为 `x264_param_t` 赋值

（3）在一个大循环中调用 `getopt_long()` 逐个解析输入的参数，并作相应的处理。举几个例子：

- a) “-h”：调用 `help()` 打开帮助菜单。
- b) “-V” 调用 `print_version_info()` 打印版本信息。
- c)对于长选项，调用 `x264_param_parse()` 进行处理。

（4）调用 `select_input()` 解析输出文件格式（例如raw，flv，MP4…）

（5）调用 `select_output()` 解析输入文件格式（例如yuv，y4m…）

下文按照顺序记录parse()中涉及到的函数：

```c
x264_param_default()
x264_param_default_preset()
help()
print_version_info()
x264_param_parse()
select_input()
select_output()
```

`x264_param_default()` 是一个x264的API。该函数用于设置x264中 `x264_param_t` 结构体的默认值。

`x264_param_default_preset()` 是一个 libx264 的 API，用于设置 x264 的 preset 和 tune。

从源代码可以看出，`x264_param_default_preset()` 调用 `x264_param_apply_preset()` 设置 preset，调用 `x264_param_apply_tune()` 设置 tune。记录一下这两个函数。

`help()` 用于打印帮助菜单。在 x264 命令行程序中添加 “-h” 参数后会调用该函数。

`print_version_info()` 用于打印 x264 的版本信息。在x264命令行程序中添加 “-V” 参数后会调用该函数。

`x264_param_parse()` 是一个 x264 的 API。该函数以字符串键值对的方式设置 `x264_param_t` 结构体的一个成员变量。

`x264_param_parse()` 中判断参数的宏 `OPT()` 和 `OPT2()` 实质上就是 `strcmp()`。由此可见该函数的流程首先是调用 `strcmp()` 判断当前输入参数的名称 name，然后再调用 `atoi()`，`atof()`，或者 `atobool()` 等将当前输入参数值 value 转换成相应类型的值并赋值给对应的参数。

`x264_param_apply_profile()` 是一个 x264 的 API。该函数用于设置 x264 的 profile

`select_output()` 用于设定输出的文件格式。

`select_input()` 用于设定输入的文件格式。

#### encode()

`encode()` 编码 YUV 为 H.264 码流

从源代码可以梳理出来 `encode()` 的流程：

（1）调用 `x264_encoder_open()` 打开 H.264 编码器。

（2）调用 `x264_encoder_parameters()` 获得当前的参数集 `x264_param_t`，用于后续步骤中的一些配置。

（3）调用输出格式（H.264裸流、FLV、mp4等）对应 `cli_output_t` 结构体的 `set_param()` 方法，为输出格式的封装器设定参数。其中参数源自于上一步骤得到的 `x264_param_t`。

（4）如果不是在每个keyframe前面都增加 SPS/PPS/SEI 的话，就调用 `x264_encoder_headers()` 在整个码流前面加 SPS/PPS/SEI。

（5）进入一个循环中进行一帧一帧的将 YUV 编码为 H.264：

- a)调用输入格式（YUV、Y4M等）对应的 `cli_vid_filter_t` 结构体 `get_frame()` 方法，获取一帧YUV数据。
- b)调用 `encode_frame()` 编码该帧YUV数据为H.264数据，并且输出出来。该函数内部调用`x264_encoder_encode()` 完成编码工作，调用输出格式对应 `cli_output_t` 结构体的 `write_frame()` 完成了输出工作。
- c)调用输入格式（YUV、Y4M等）对应的 `cli_vid_filter_t` 结构体 `release_frame()` 方法，释放刚才获取的 YUV 数据。
- d)调用 `print_status()` 输出一些统计信息。

（6）编码即将结束的时候，进入另一个循环，输出编码器中缓存的视频帧：

- a)不再传递新的YUV数据，直接调用 `encode_frame()`，将编码器中缓存的剩余几帧数据编码输出出来。
- b)调用 `print_status()` 输出一些统计信息。

（7）调用 `x264_encoder_close()` 关闭 H.264 编码器。

`encode()` 的流程中涉及到 libx264 的几个关键的 API：

```c
x264_encoder_open()		// 打开H.264编码器。
x264_encoder_headers()	// 输出SPS/PPS/SEI。
x264_encoder_encode()	// 编码一帧数据。
x264_encoder_close()	// 关闭H.264编码器。
```

此外上述流程中涉及到两个比较简单的函数：`encode_frame()` 和 `print_status()`。其中 `encode_frame()` 用于编码一帧数据，而 `print_status()` 用于输出一帧数据编码后的统计信息。下文记录一下这两个函数的定义。

`encode_frame()` 内部调用 `x264_encoder_encode()` 完成编码工作，调用输出格式对应 `cli_output_t` 结构体的 `write_frame() `完成了输出工作。

print_status()的代码不再详细记录，它的输出效果如下图中红框中的文字。

![print_status输出效果](/images/imageFFmpeg/Thor/print_status.png)

### X264 控制台程序中和输入输出相关的结构体

在x264控制台程序中有3个和输入输出相关的结构体：

```c
cli_output_t		// 输出格式对应的结构体。输出格式一般为H.264裸流、FLV、MP4等。
cli_input_t			// 输入格式对应的结构体。输入格式一般为纯YUV像素数据，Y4M格式数据等。
cli_vid_filter_t	// 输入格式滤镜结构体。滤镜可以对输入数据做一些简单的处理，例如拉伸、裁剪等等（当然滤镜也可以不作任何处理，直接读取输入数据）。
```

在 x264 的编码过程中，调用 `cli_vid_filter_t` 结构体的 `get_frame()` 读取 YUV 数据，调用 `cli_output_t` 的 `write_frame()` 写入数据。

## 编码器主干部分

“主干部分”指的就是libx264中最核心的接口函数—— `x264_encoder_encode()` ，以及相关的几个接口函数`x264_encoder_open()`，`x264_encoder_headers()`，和 `x264_encoder_close()`。

### 函数调用关系图

![X264编码器主干部分的函数调用关系](/images/imageFFmpeg/Thor/X264编码器主干部分的函数调用关系.png)

从图中可以看出，x264 主干部分最复杂的函数就是 `x264_encoder_encode()`，该函数完成了编码一帧 YUV 为H.264 码流的工作。与之配合的还有打开编码器的函数 `x264_encoder_open()`，关闭编码器的函数 `x264_encoder_close()`，以及输出 SPS/PPS/SEI 这样的头信息的 `x264_encoder_headers()`。

`x264_encoder_open()` 用于打开编码器，其中初始化了 libx264 编码所需要的各种变量。它调用了下面的函数：

```c
x264_validate_parameters()	// 检查输入参数（例如输入图像的宽高是否为正数）。
x264_predict_16x16_init()	// 初始化Intra16x16帧内预测汇编函数。
x264_predict_4x4_init()		// 初始化Intra4x4帧内预测汇编函数。
x264_pixel_init()			// 初始化像素值计算相关的汇编函数（包括SAD、SATD、SSD等）。
x264_dct_init()				// 初始化DCT变换和DCT反变换相关的汇编函数。
x264_mc_init()				// 初始化运动补偿相关的汇编函数。
x264_quant_init()			// 初始化量化和反量化相关的汇编函数。
x264_deblock_init()			// 初始化去块效应滤波器相关的汇编函数。
x264_lookahead_init()		// 初始化Lookahead相关的变量。
x264_ratecontrol_new()		// 初始化码率控制相关的变量。
```

`x264_encoder_headers()` 输出 SPS/PPS/SEI 这些 H.264 码流的头信息。它调用了下面的函数：

```c
x264_sps_write()			// 输出SPS
x264_pps_write()			// 输出PPS
x264_sei_version_write()	// 输出SEI
```

`x264_encoder_encode()` 编码一帧 YUV 为 H.264 码流。它调用了下面的函数：

```c
x264_frame_pop_unused()	// 获取1个x264_frame_t类型结构体fenc。如果frames.unused[]队列不为空，就调用x264_frame_pop()从unused[]队列取1个现成的；否则就调用x264_frame_new()创建一个新的。
x264_frame_copy_picture() // 将输入的图像数据拷贝至fenc。
x264_lookahead_put_frame()  // 将fenc放入lookahead.next.list[]队列，等待确定帧类型。
x264_lookahead_get_frames() // 通过lookahead分析帧类型。该函数调用了x264_slicetype_decide()，x264_slicetype_analyse()和x264_slicetype_frame_cost()等函数。经过一些列分析之后，最终确定了帧类型信息，并且将帧放入frames.current[]队列。
x264_frame_shift() // 从frames.current[]队列取出1帧用于编码。
x264_reference_update() // 更新参考帧列表。
x264_reference_reset() // 如果为IDR帧，调用该函数清空参考帧列表。
x264_reference_hierarchy_reset() // 如果是I（非IDR帧）、P帧、B帧（可做为参考帧），调用该函数。
x264_reference_build_list() // 创建参考帧列表list0和list1。
x264_ratecontrol_start() // 开启码率控制。
x264_slice_init() // 创建 Slice Header。
x264_slices_write() // 编码数据（最关键的步骤）。其中调用了x264_slice_write()完成了编码的工作（注意“x264_slices_write()”和“x264_slice_write()”名字差了一个“s”）。
x264_encoder_frame_end() // 编码结束后做一些后续处理，例如记录一些统计信息。其中调用了x264_frame_push_unused()将fenc重新放回frames.unused[]队列，并且调用x264_ratecontrol_end()关闭码率控制。
```

`x264_encoder_close()` 用于关闭解码器，同时输出一些统计信息。它调用了下面的函数：

```c
x264_lookahead_delete()		// 释放Lookahead相关的变量。
x264_ratecontrol_summary()	// 汇总码率控制信息。
x264_ratecontrol_delete()	// 关闭码率控制。
```

#### x264_encoder_open()

`x264_encoder_open()` 是一个 libx264 的 API。该函数用于打开编码器，其中初始化了 libx264 编码所需要的各种变量。

根据函数调用的顺序，看一下 `x264_encoder_open()` 调用的下面几个函数：

```c
x264_sps_init()				// 根据输入参数生成H.264码流的SPS信息。
x264_pps_init()				// 根据输入参数生成H.264码流的PPS信息。
x264_predict_16x16_init()	// 初始化Intra16x16帧内预测汇编函数。
x264_predict_4x4_init()		// 初始化Intra4x4帧内预测汇编函数。
x264_pixel_init()			// 初始化像素值计算相关的汇编函数（包括SAD、SATD、SSD等）。
x264_dct_init()				// 初始化DCT变换和DCT反变换相关的汇编函数。
x264_mc_init()				// 初始化运动补偿相关的汇编函数。
x264_quant_init()			// 初始化量化和反量化相关的汇编函数。
x264_deblock_init()			// 初始化去块效应滤波器相关的汇编函数。
mbcmp_init()				// 决定像素比较的时候使用SAD还是SATD。
```

#### 相关知识简述

简单记录一下帧内预测的方法。帧内预测根据宏块左边和上边的边界像素值推算宏块内部的像素值，帧内预测的效果如下图所示。其中左边的图为图像原始画面，右边的图为经过帧内预测后没有叠加残差的画面。

![帧内预测-01](/images/imageFFmpeg/Thor/帧内预测-01.png)

H.264 中有两种帧内预测模式：`16x16` 亮度帧内预测模式和 `4x4` 亮度帧内预测模式。其中 `16x16` 帧内预测模式一共有 4 种，如下图所示。

![帧内预测-02](/images/imageFFmpeg/Thor/帧内预测-02.png)

这 4 种模式列表如下。

| 模式       | 描述                                 |
| ---------- | ------------------------------------ |
| Vertical   | 由上边像素推出相应像素值             |
| Horizontal | 由左边像素推出相应像素值             |
| DC         | 由上边和左边像素平均值推出相应像素值 |
| Plane      | 由上边和左边像素推出相应像素值       |

`4x4` 帧内预测模式一共有 9 种，如下图所示。

![帧内预测-03](/images/imageFFmpeg/Thor/帧内预测-03.png)

简单记录几个像素计算中的概念。SAD 和 SATD 主要用于帧内预测模式以及帧间预测模式的判断。有关 SAD、SATD、SSD 的定义如下：

> SAD（Sum of Absolute Difference）也可以称为SAE（Sum of Absolute Error），即绝对误差和。它的计算方法就是求出两个像素块对应像素点的差值，将这些差值分别求绝对值之后再进行累加。
>
> SATD（Sum of Absolute Transformed Difference）即Hadamard变换后再绝对值求和。它和SAD的区别在于多了一个“变换”。
>
> SSD（Sum of Squared Difference）也可以称为SSE（Sum of Squared Error），即差值的平方和。它和SAD的区别在于多了一个“平方”。

H.264中使用SAD和SATD进行宏块预测模式的判断。早期的编码器使用SAD进行计算，近期的编码器多使用SATD进行计算。为什么使用SATD而不使用SAD呢？关键原因在于编码之后码流的大小是和图像块DCT变换后频域信息紧密相关的，而和变换前的时域信息关联性小一些。SAD只能反应时域信息；SATD却可以反映频域信息，而且计算复杂度也低于DCT变换，因此是比较合适的模式选择的依据。

使用SAD进行模式选择的示例如下所示。下面这张图代表了一个普通的 `Intra16x16` 的宏块的像素。它的下方包含了使用Vertical，Horizontal，DC和Plane四种帧内预测模式预测的像素。通过计算可以得到这几种预测像素和原始像素之间的SAD（SAE）分别为3985，5097，4991，2539。由于Plane模式的SAD取值最小，由此可以断定Plane模式对于这个宏块来说是最好的帧内预测模式。

![帧内预测-04](/images/imageFFmpeg/Thor/帧内预测-04.png)

![帧内预测-05](/images/imageFFmpeg/Thor/帧内预测-05.png)

简单记录一下DCT相关的知识。DCT变换的核心理念就是把图像的低频信息（对应大面积平坦区域）变换到系数矩阵的左上角，而把高频信息变换到系数矩阵的右下角，这样就可以在压缩的时候（量化）去除掉人眼不敏感的高频信息（位于矩阵右下角的系数）从而达到压缩数据的目的。二维 `8x8` DCT变换常见的示意图如下所示。

![帧内预测-06](/images/imageFFmpeg/Thor/帧内预测-06.png)

早期的DCT变换都使用了 `8x8` 的矩阵（变换系数为小数）。在 H.264 标准中新提出了一种 `4x4` 的矩阵。这种 `4x4` DCT变换的系数都是整数，一方面提高了运算的准确性，一方面也利于代码的优化。`4x4` 整数DCT变换的示意图如下所示（作为对比，右侧为 `4x4` 块的Hadamard变换的示意图）。

![帧内预测-07](/images/imageFFmpeg/Thor/帧内预测-07.png)

简单记录一下半像素插值的知识。《H.264标准》中规定，运动估计为 `1/4` 像素精度。因此在H.264编码和解码的过程中，需要将画面中的像素进行插值——简单地说就是把原先的 1 个像素点拓展成 `4x4` 一共16个点。下图显示了H.264编码和解码过程中像素插值情况。可以看出原先的 G 点的右下方通过插值的方式产生了a、b、c、d等一共 16 个点。

![帧内预测-08](/images/imageFFmpeg/Thor/帧内预测-08.png)

如图所示，`1/4` 像素内插一般分成两步：

（1）半像素内插。这一步通过 6 抽头滤波器获得 5 个半像素点。

（2）线性内插。这一步通过简单的线性内插获得剩余的 `1/4` 像素点。

图中半像素内插点为 b、m、h、s、j 五个点。半像素内插方法是对整像素点进行 6 抽头滤波得出，滤波器的权重为( `1/32, -5/32, 5/8, 5/8, -5/32, 1/32` )。例如 b 的计算公式为：

**`b=round( (E - 5F + 20G + 20H - 5I + J ) / 32)`**

剩下几个半像素点的计算关系如下：

```shell
m：由B、D、H、N、S、U计算
h：由A、C、G、M、R、T计算
s：由K、L、M、N、P、Q计算
j：由cc、dd、h、m、ee、ff计算。需要注意j点的运算量比较大，因为cc、dd、ee、ff都需要通过半像素内插方法进行计算。
```

在获得半像素点之后，就可以通过简单的线性内插获得 `1/4` 像素内插点了。`1/4` 像素内插的方式如下图所示。例如图中 a 点的计算公式如下：

**`A=round( (G+b)/2 )`**

在这里有一点需要注意：位于 4 个角的e、g、p、r 四个点并不是通过 j 点计算计算的，而是通过b、h、s、m四个半像素点计算的。

![帧内预测-09](/images/imageFFmpeg/Thor/帧内预测-09.png)

#### x264_encoder_headers()

`x264_encoder_headers()` 是libx264的一个API函数，用于输出 SPS/PPS/SEI 这些 H.264 码流的头信息。

#### x264_encoder_close()

`x264_encoder_close()` 是libx264的一个API函数。该函数用于关闭编码器，同时输出一些统计信息。

#### x264_encoder_encode()

`x264_encoder_encode()` 是libx264的API函数，用于编码一帧 YUV 为 H.264 码流。

`x264_encoder_encode()` 的流程大致如下：

（1）调用 `x264_frame_pop_unused` 获取一个空的 `fenc`（x264_frame_t类型）用于存储一帧编码像素数据。

（2）调用 `x264_frame_copy_picture()` 将外部结构体的 `pic_in`（`x264_picture_t`类型）的数据拷贝给内部结构体的 `fenc`（`x264_frame_t` 类型）。

（3）调用 `x264_lookahead_put_frame()` 将 `fenc` 放入 Lookahead 模块的队列中，等待确定帧类型。

（4）调用 `x264_lookahead_get_frames()` 分析 Lookahead 模块中一个帧的帧类型。分析后的帧保存在`frames.current[]` 中。

（5）调用 `x264_frame_shift()` 从 `frames.current[]` 中取出分析帧类型之后的 `fenc`。

（6）调用 `x264_reference_update()` 更新参考帧队列 `frames.reference[]`。

（7）如果编码帧 `fenc` 是 `IDR` 帧，调用 `x264_reference_reset()` 清空参考帧队列 `frames.reference[]`。

（8）调用 `x264_reference_build_list()` 创建参考帧列表 `List0` 和 `List1`。

（9）根据选项做一些配置：

- a) 如果 `b_aud` 不为 0，输出 AUD 类型 NALU
- b) 在当前帧是关键帧的情况下，如果 `b_repeat_headers` 不为 0，调用 `x264_sps_write()` 和 `x264_pps_write()` 输出 SPS 和 PPS。
- c) 输出一些特殊的 SEI 信息，用于适配各种解码器。

（10）调用 `x264_slice_init()` 初始化 Slice Header 信息。

（11）调用 `x264_slices_write()` 进行编码。该部分是 libx264 的核心，在后续文章中会详细分析。

（12）调用 `x264_encoder_frame_end()` 做一些编码后的后续处理。

`x264_slice_write()` 是完成编码工作的函数。该函数中包含了去块效应滤波，运动估计，宏块编码，熵编码等模块。

## x264_slice_write()

`x264_slice_write()` 是 x264 项目的核心，它完成了编码了一个 Slice 的工作。根据功能的不同，该函数可以分为滤波（Filter），分析（Analysis），宏块编码（Encode）和熵编码（Entropy Encoding）几个子模块。

### 函数调用关系图

![x264_slice_write](/images/imageFFmpeg/Thor/x264_slice_write.png)

x264_slice_write()调用了如下函数：

```c
x264_nal_start()	// 开始写一个NALU。
x264_macroblock_thread_init() // 初始化宏块重建数据缓存fdec_buf[]和编码数据缓存fenc_buf[]。
x264_slice_header_write()	// 输出 Slice Header。
x264_fdec_filter_row()	// 滤波模块。该模块包含了环路滤波，半像素插值，SSIM/PSNR的计算。
x264_macroblock_cache_load() 	// 将要编码的宏块的周围的宏块的信息读进来。
x264_macroblock_analyse()	// 分析模块。该模块包含了帧内预测模式分析以及帧间运动估计等。
x264_macroblock_encode()	// 宏块编码模块。该模块通过对残差的DCT变换、量化等方式对宏块进行编码。
x264_macroblock_write_cabac()	// CABAC熵编码模块。
x264_macroblock_write_cavlc()	// CAVLC熵编码模块。
x264_macroblock_cache_save()	// 保存当前宏块的信息。
x264_ratecontrol_mb()	// 码率控制。
x264_nal_end() // 结束写一个NALU。
```

根据源代码简单梳理了 `x264_slice_write()` 的流程，如下所示：

（1）调用 `x264_nal_start()` 开始输出一个 NALU。

（2）`x264_macroblock_thread_init()`：初始化宏块重建像素缓存 `fdec_buf[]` 和编码像素缓存 `fenc_buf[]`。

（3）调用 `x264_slice_header_write()` 输出 Slice Header。

（4）进入一个循环，该循环每执行一遍编码一个宏块：

- a) 每处理一行宏块，调用一次 `x264_fdec_filter_row()` 执行滤波模块。
- b) 调用 `x264_macroblock_cache_load_progressive()` 将要编码的宏块的周围的宏块的信息读进来。
- c) 调用 `x264_macroblock_analyse()` 执行分析模块。
- d) 调用 `x264_macroblock_encode()` 执行宏块编码模块。
- e) 调用 `x264_macroblock_write_cabac()/x264_macroblock_write_cavlc()` 执行熵编码模块。
- f) 调用 `x264_macroblock_cache_save()` 保存当前宏块的信息。
- g) 调用 `x264_ratecontrol_mb()` 执行码率控制。
- h) 准备处理下一个宏块。

（5）调用 `x264_nal_end()` 结束输出一个 NALU。

### 重要的数据结构

X264在宏块编码方面涉及到下面几个比较重要的结构体：

宏块像素存储缓存  `fenc_buf[]` 和 `fdec_buf[]` ——位于 `x264_t.mb.pic` 中，用于存储宏块的亮度和色度像素。
宏块各种信息的缓存 Cache——位于 `x264_t.mb.pic` 中，用于存储宏块的信息例如 `4x4` 帧内预测模式、DCT 的非 0 系数个数、运动矢量、参考帧序号等。

图像半像素点存储空间 `filtered[]` ——位于 `x264_frame_t` 中，用于存储半像素插值后的点。

#### 宏块像素存储缓存 fenc_buf[] 和 fdec_buf[]

`fenc_buf[]` 和 `fdec_buf[]` 为 `x264_t.mb.cache` 中的结构体，用于存储一个宏块的像素数据。其中 `fenc_buf[]` 用于存储宏块编码像素数据，而 `fdec_buf[]` 用于存储宏块重建像素数据。他们的定义如下所示。

```c
/* space for p_fenc and p_fdec */
#define FENC_STRIDE 16
#define FDEC_STRIDE 32
//存储编码宏块fenc和重建宏块fdec的内存
uint8_t fenc_buf[48*FENC_STRIDE]
uint8_t fdec_buf[52*FDEC_STRIDE]
```

从定义可以看出，`fenc_buf[]` 每行 16 个数据；而 `fdec_buf[]` 每行 32 个数据。在 `x264_t.mb.cache` 中和 `fenc_buf[]` 和 `fdec_buf[]` 相关的指针数组还有 `p_fenc[3]` 和 `p_fdec[3]` ，它们中的 3 个元素 `[0]、[1]、[2]` 分别指向分别指向对应缓存 buf 的 Y、U、V 分量。下图画出了像素格式为 YUV420P 的时候 `fenc_buf[]` 的存储示意图。图中灰色区域存储 Y，蓝色区域存储 U，粉红区域存储 V。`p_fenc[0]` 指向 Y 的存储区域，`p_fenc[1]` 指向 U 的存储区域，`p_fenc[2]` 指向 V 的存储区域，在图中以方框的形式标注了出来。

![像素格式为 YUV420P 的时候 fenc_buf 的存储](/images/imageFFmpeg/Thor/x264-01.png)

下图画出了像素格式为 YUV420P 的时候 `fdec_buf[]` 的存储示意图。图中灰色区域存储 Y，蓝色区域存储 U，粉红区域存储 V。`p_fenc[0]` 指向 Y 的存储区域，`p_fenc[1]` 指向 U 的存储区域，`p_fenc[2]` 指向 V 的存储区域，在图中以方框的形式标注了出来。

![像素格式为 YUV420P 的时候 fdec_buf 的存储](/images/imageFFmpeg/Thor/x264-02.png)

从图中可以看出，`fdec_buf[]` 和 `fenc_buf[]` 主要的区别在于 `fdec_buf[]` 像素块的左边和上边包含了左上方相邻块用于预测的像素。

### 宏块各种信息的缓存Cache 

在 x264 中 `x264_t.mb.cache` 结构体中包含了存储宏块信息的各种各样的缓存 Cache。例如：

- **intra4x4_pred_mode**：`Intra4x4` 帧内预测模式的缓存
- **non_zero_count**：DCT 的非 0 系数个数的缓存
- **mv**：运动矢量缓存
- **ref**：运动矢量参考帧的缓存

## 滤波（Filter）部分

`x264_fdec_filter_row()` 对应着 x264 中的滤波模块。滤波模块主要完成了下面 3 个方面的功能：

（1）环路滤波（去块效应滤波）

（2）半像素内插

（3）视频质量指标PSNR和SSIM的计算

### 函数调用关系图

![滤波（Filter）部分的函数调用关系](/images/imageFFmpeg/Thor/x264_fdec_filter_row.png)

从图中可以看出，滤波模块对应的x264_fdec_filter_row()调用了如下函数：

```c
x264_frame_deblock_row()	// 去块效应滤波器。
x264_frame_filter()			// 半像素插值。
x264_pixel_ssd_wxh()		// PSNR计算。
x264_pixel_ssim_wxh()		// SSIM计算。
```

从源代码可以看出，`x264_fdec_filter_row()` 完成了三步工作：

（1）环路滤波（去块效应滤波）。通过调用 `x264_frame_deblock_row()` 实现。

（2）半像素内插。通过调用 `x264_frame_filter()` 实现。

（3）视频质量 SSIM 和 PSNR 计算。PSNR在这里只计算了 SSD，通过调用 `x264_pixel_ssd_wxh()` 实现；SSIM 的计算则是通过 `x264_pixel_ssim_wxh()` 实现。

## 宏块分析（Analysis）部分-帧内宏块（Intra）

`x264_macroblock_analyse()` 对应着 x264 中的分析模块。分析模块主要完成了下面 2 个方面的功能：

（1）对于帧内宏块，分析帧内预测模式

（2）对于帧间宏块，进行运动估计，分析帧间预测模式

### 函数调用关系图

![宏块分析（Analysis）部分的函数调用关系](/images/imageFFmpeg/Thor/x264_macroblock_analyse.png)

从图中可以看出，分析模块的 `x264_macroblock_analyse()` 调用了如下函数（只列举了几个有代表性的函数）：

```c
x264_mb_analyse_init()			// Analysis模块初始化。
x264_mb_analyse_intra()			// Intra宏块帧内预测模式分析。
x264_macroblock_probe_pskip()	// 分析是否是skip模式。
x264_mb_analyse_inter_p16x16()	// P16x16宏块帧间预测模式分析。
x264_mb_analyse_inter_p8x8()	// P8x8宏块帧间预测模式分析。
x264_mb_analyse_inter_p16x8()	// P16x8宏块帧间预测模式分析。
x264_mb_analyse_inter_b16x16()	// B16x16宏块帧间预测模式分析。
x264_mb_analyse_inter_b8x8()	// B8x8宏块帧间预测模式分析。
x264_mb_analyse_inter_b16x8()	// B16x8宏块帧间预测模式分析。
```

尽管 `x264_macroblock_analyse()` 的源代码比较长，但是它的逻辑比较清晰，如下所示：

（1）如果当前是 `I` Slice，调用 `x264_mb_analyse_intra()` 进行 Intra 宏块的帧内预测模式分析。

（2）如果当前是 `P` Slice，则进行下面流程的分析：

- a)调用 `x264_macroblock_probe_pskip()` 分析是否为 Skip 宏块，如果是的话则不再进行下面分析。
- b)调用 `x264_mb_analyse_inter_p16x16()` 分析 `P16x16` 帧间预测的代价。
- c)调用 `x264_mb_analyse_inter_p8x8()` 分析 `P8x8` 帧间预测的代价。
- d)如果 `P8x8` 代价值小于 `P16x16`，则依次对 4 个 `8x8` 的子宏块分割进行判断：
  - i.调用 `x264_mb_analyse_inter_p4x4()` 分析 `P4x4` 帧间预测的代价。
  - ii.如果 `P4x4` 代价值小于 `P8x8` ，则调用 `x264_mb_analyse_inter_p8x4()` 和`x264_mb_analyse_inter_p4x8()` 分析 `P8x4` 和 `P4x8` 帧间预测的代价。
- e)如果 `P8x8` 代价值小于 `P16x16`，调用 `x264_mb_analyse_inter_p16x8()` 和`x264_mb_analyse_inter_p8x16()` 分析 `P16x8` 和 `P8x16` 帧间预测的代价。
- f)此外还要调用 `x264_mb_analyse_intra()` ，检查当前宏块作为 Intra 宏块编码的代价是否小于作为 `P` 宏块编码的代价（`P` Slice中也允许有 Intra 宏块）。

（3）如果当前是 `B` Slice，则进行和 `P` Slice类似的处理。

总体说来 `x264_mb_analyse_intra()` 通过计算 `Intra16x16`，`Intra8x8`（暂时没有研究），`Intra4x4` 这 3 中帧内预测模式的代价，比较后得到最佳的帧内预测模式。该函数的等流程大致如下：

（1）进行 `Intra16X16` 模式的预测

- a)调用 `predict_16x16_mode_available()` 根据周围宏块的情况判断其可用的预测模式（主要检查左边和上边的块是否可用）。
- b)循环计算 4 种 `Intra16x16` 帧内预测模式：
  - i.调用 `predict_16x16[]()` 汇编函数进行 `Intra16x16` 帧内预测
  - ii.调用 `x264_pixel_function_t` 中的 `mbcmp[]()` 计算编码代价（`mbcmp[]()` 指向 SAD 或者 SATD 汇编函数）。
- c)获取最小代价的 `Intra16x16` 模式。

（2）进行 `Intra8x8` 模式的预测（未研究，流程应该类似）

（3）进行 `Intra4X4` 块模式的预测

- a)循环处理 16 个 `4x4` 的块：
  - i.调用 `x264_mb_predict_intra4x4_mode()` 根据周围宏块情况判断该块可用的预测模式。
  - ii.循环计算 9 种 `Intra4x4` 的帧内预测模式：
    - 1)调用 `predict_4x4 []()` 汇编函数进行 `Intra4x4` 帧内预测
    - 2)调用 `x264_pixel_function_t` 中的 `mbcmp[]()` 计算编码代价（`mbcmp[]()` 指向 SAD 或者 SATD 汇编函数）。
  - iii.获取最小代价的 `Intra4x4` 模式。
- b)将 16 个 `4X4` 块的最小代价相加，得到总代价。

（4）将上述 3 中模式的代价进行对比，取最小者为当前宏块的帧内预测模式。

## 宏块分析（Analysis）部分-帧间宏块（Inter）

`x264_macroblock_analyse()` 对应着 x264 中的分析模块。分析模块主要完成了下面 2 个方面的功能：

（1）对于帧内宏块，分析帧内预测模式

（2）对于帧间宏块，进行运动估计，分析帧间预测模式

> [详细功能说明](<https://blog.csdn.net/leixiaohua1020/article/details/45936267>)

## 宏块编码（Encode）部分

`x264_macroblock_encode()` 对应着 x264 中的宏块编码模块。宏块编码模块主要完成了 DCT 变换和量化两个步骤。

### 函数调用关系图

![宏块编码（Encode）部分的函数调用关系](/images/imageFFmpeg/Thor/x264_macroblock_encode.png)

从图中可以看出，宏块编码模块的 `x264_macroblock_encode()` 调用了 `x264_macroblock_encode_internal()` ，而 `x264_macroblock_encode_internal()` 完成了如下功能：

```c
x264_macroblock_encode_skip()	// 编码Skip类型宏块。
x264_mb_encode_i16x16()			// 编码Intra16x16类型的宏块。该函数除了进行DCT变换之外，还对16个小块的DC系数进行了Hadamard变换。
x264_mb_encode_i4x4()			// 编码Intra4x4类型的宏块。
// 帧间宏块编码：这一部分代码直接写在了函数体里面。
x264_mb_encode_chroma()			// 编码色度块。
```

`x264_macroblock_encode()` 用于编码宏块。该函数的定义位于 `encoder\macroblock.c`

`x264_macroblock_encode_internal()` 的流程大致如下：

（1）如果是 Skip 类型，调用 `x264_macroblock_encode_skip()` 编码宏块。

（2）如果是 `Intra16x16` 类型，调用 `x264_mb_encode_i16x16()` 编码宏块。

（3）如果是 `Intra4x4` 类型，循环 16 次调用 `x264_mb_encode_i4x4()` 编码宏块。

（4）如果是 Inter 类型，则不再调用子函数，而是直接进行编码：

- a)对 `16x16` 块调用 `x264_dct_function_t` 的 `sub16x16_dct()` 汇编函数，求得编码宏块数据 `p_fenc` 与重建宏块数据 `p_fdec` 之间的残差（“sub”），并对残差进行 DCT 变换。
- b)分成 4 个 `8x8` 的块，对每个 `8x8` 块分别调用 `x264_quant_function_t` 的 `quant_4x4x4()` 汇编函数进行量化。
- c)分成 16 个 `4x4` 的块，对每个 `4x4` 块分别调用 `x264_quant_function_t` 的 `dequant_4x4()` 汇编函数进行反量化（用于重建帧）。
- d)分成 4 个 `8x8` 的块，对每个 `8x8` 块分别调用 `x264_dct_function_t` 的 `add8x8_idct()` 汇编函数，对残差进行 DCT 反变换，并将反变换后的数据叠加（“add”）至预测数据上（用于重建帧）。

（5）	如果对色度编码，调用 `x264_mb_encode_chroma()` 。

从 Inter 宏块编码的步骤可以看出，编码就是 “DCT变换+量化” 两步的组合。

简单整理一下 `x264_mb_encode_i16x16()` 的逻辑，如下所示：

（1）调用 `predict_16x16[]()` 汇编函数对重建宏块数据 `p_fdec` 进行帧内预测。

（2）调用 `x264_dct_function_t` 的 `sub16x16_dct()` 汇编函数，计算重建宏块数据 `p_fdec` 与编码宏块数据`p_fenc` 之间的残差，然后对残差做 DCT 变换。

（3）抽取出来 16 个 `4x4DCT` 小块的 DC 系数，存储于 `dct_dc4x4[]`。

（4）分成 4 个 `8x8` 的块，对每个 `8x8` 块分别调用 `x264_quant_function_t` 的 `quant_4x4x4()` 汇编函数进行量化。

（5）分成 16 个 `4x4` 的块，对每个 `4x4` 块分别调用 `x264_quant_function_t` 的 `dequant_4x4()` 汇编函数进行反量化（用于重建帧）。

（6）对于 `dct_dc4x4[]` 中 16 个小块的 DC 系数作如下处理：

- a)调用 `x264_dct_function_t` 的 `dct4x4dc()` 汇编函数进行 Hadamard 变换。
- b)调用 `x264_quant_function_t` 的 `quant_4x4_dc()` 汇编函数进行 DC 系数的量化。
- c)调用 `x264_dct_function_t` 的 `idct4x4dc()` 汇编函数进行 Hadamard 反变换。
- d)调用 `x264_quant_function_t` 的 `dequant_4x4_dc()` 汇编函数进行 DC 系数的反量化。
- e)将反量化后的 DC 系数重新放到 `16x16` 块对应的位置上。

（7）调用 `x264_dct_function_t` 的 `add16x16_idct()` 汇编函数，对残差进行 DCT 反变换，并将反变换后的数据叠加（“add”）至预测数据上（用于重建帧）。

可以看出 `Intra16x16` 编码的过程就是一个 “DCT变换 + 量化 + Hadamard变换” 的流程。其中 “DCT变换 + 量化” 是一个通用的编码步骤，而 “Hadamard变换” 是专属于 `Intra16x16` 宏块的步骤。

简单整理一下 `x264_mb_encode_i4x4()` 的逻辑，如下所示：

（1）调用 `predict_4x4[]()` 汇编函数对重建宏块数据 `p_fdec` 进行帧内预测。

（2）调用 `x264_dct_function_t` 的 `sub4x4_dct ()` 汇编函数，计算重建宏块数据 `p_fdec` 与编码宏块数据 `p_fenc` 之间的残差，然后对残差做 DCT 变换。

（3）调用 `x264_quant_function_t` 的 `quant_4x4()` 汇编函数进行量化。

（4）调用 `x264_quant_function_t` 的 `dequant_4x4()` 汇编函数进行反量化（用于重建帧）。

（5）调用 `x264_dct_function_t` 的 `add4x4_idct()` 汇编函数，对残差进行 DCT 反变换，并将反变换后的数据叠加（“add”）至预测数据上（用于重建帧）。

可以看出 `Intra4x4` 编码的过程就是一个 “DCT变换 + 量化” 的流程。

## 熵编码（Entropy Encoding）部分

`x264_macroblock_write_cavlc()` 对应着x264中的熵编码模块。熵编码模块主要完成了编码数据输出的功能。

### 函数调用关系图

![熵编码（Entropy Encoding）部分的函数调用关系](/images/imageFFmpeg/Thor/x264_macroblock_write_cavlc.png)

从图中可以看出，熵编码模块包含两个函数 `x264_macroblock_write_cabac()` 和`x264_macroblock_write_cavlc()`。如果输出设置为 CABAC 编码，则会调用`x264_macroblock_write_cabac()`；如果输出设置为 CAVLC 编码，则会调用 `x264_macroblock_write_cavlc()` 。本文选择 CAVLC 编码输出函数 `x264_macroblock_write_cavlc()` 进行分析。该函数调用了如下函数：

```c
x264_cavlc_mb_header_i()		// 写入I宏块MB Header数据。包含帧内预测模式等。
x264_cavlc_mb_header_p()		// 写入P宏块MB Header数据。包含MVD、参考帧序号等。
x264_cavlc_mb_header_b()		// 写入B宏块MB Header数据。包含MVD、参考帧序号等。
x264_cavlc_qp_delta()			// 写入QP。
x264_cavlc_block_residual()		// 写入残差数据。
```

从源代码可以看出，`x264_macroblock_write_cavlc()` 的流程大致如下：

（1）根据 Slice 类型的不同，调用不同的函数输出宏块头（MB Header）：

- a)对于 `P Slice`，调用 `x264_cavlc_mb_header_p()`
- b)对于 `B Slice`，调用 `x264_cavlc_mb_header_b()`
- c)对于 `I Slice`，调用 `x264_cavlc_mb_header_i()`

（2）调用 `x264_cavlc_qp_delta()` 输出宏块 QP 值

（3）调用 `x264_cavlc_block_residual()` 输出 CAVLC 编码的残差数据

## FFmpeg与libx264接口源代码简单分析

本文简单记录一下 FFmpeg 的 libavcodec 中与 libx264 接口部分的源代码。该部分源代码位于 “libavcodec/libx264.c” 中。正是有了这部分代码，使得 FFmpeg 可以调用 libx264 编码 H.264 视频。

### 函数调用关系图

![FFmpeg的libavcodec中的libx264.c的函数调用关系](/images/imageFFmpeg/Thor/[FFmpeg的libavcodec中的libx264的函数调用关系.png)

从图中可以看出，libx264 对应的 AVCodec 结构体 `ff_libx264_encoder` 中设定编码器初始化函数是 `X264_init()`，编码一帧数据的函数是 `X264_frame()`，编码器关闭函数是 `X264_close()`。

`X264_init()` 调用了如下函数：

```c
[libx264 API] x264_param_default()			// 设置默认参数。
[libx264 API] x264_param_default_preset()	// 设置默认preset。
convert_pix_fmt() 	// 将FFmpeg像素格式转换为libx264像素格式。
[libx264 API] x264_param_apply_profile()	// 设置Profile。
[libx264 API] x264_encoder_open()			// 打开编码器。
[libx264 API] x264_encoder_headers()		// 需要全局头的时候，输出头信息。
```

X264_frame()调用了如下函数：

```c
[libx264 API] x264_encoder_encode()				// 编码一帧数据。
[libx264 API] x264_encoder_delayed_frames()		// 输出编码器中缓存的数据。
encode_nals() 	// 将编码后得到的x264_nal_t转换为AVPacket。
```

`X264_close()` 调用了如下函数：

```c
[libx264 API] x264_encoder_close()	// 关闭编码器。
```

# 解码 - libavcodec H.264 解码器

## 概述

本文简单记录 FFmpeg 中 libavcodec 的 H.264 解码器（H.264 Decoder）的源代码。这个 H.264 解码器十分重要，可以说 FFmpeg 项目今天可以几乎“垄断”视音频编解码技术，很大一部分贡献就来自于这个 H.264 解码器。这个 H.264 解码器一方面功能强大，性能稳定；另一方面源代码也比较复杂，难以深入研究。本文打算梳理一下这个 H.264 解码器的源代码结构，以方便以后深入学习 H.264 使用。

> PS：这部分代码挺复杂的，还有不少地方还比较模糊，还需要慢慢学习......

### 函数调用关系图

H.264解码器的函数调用关系图如下所示。

![H.264解码器的函数调用关系图](/images/imageFFmpeg/Thor/H.264解码器的函数调用关系图.png)

下面解释一下图中关键标记的含义。

#### 作为接口的结构体

FFmpeg和H.264解码器之间作为接口的结构体有2个：

- `ff_h264_parser`：用于解析 H.264 码流的 AVCodecParser 结构体。
- `ff_h264_decoder`：用于解码 H.264 码流的 AVCodec 结构体。

#### 函数背景色

函数在图中以方框的形式表现出来。不同的背景色标志了该函数不同的作用：

- 白色背景的函数：普通内部函数。
- 粉红色背景函数：解析函数（Parser）。这些函数用于解析SPS、PPS等信息。
- 紫色背景的函数：熵解码函数（Entropy Decoding）。这些函数读取码流数据并且进行CABAC或者CAVLC熵解码。
- 绿色背景的函数：解码函数（Decode）。这些函数通过帧内预测、帧间预测、DCT反变换等方法解码压缩数据。
- 黄色背景的函数：环路滤波函数（Loop Filter）。这些函数对解码后的数据进行滤波，去除方块效应。
- 蓝色背景函数：汇编函数（Assembly）。这些函数是做过汇编优化的函数。图中主要画出了这些函数的C语言版本，此外这些函数还包含MMX版本、SSE版本、NEON版本等。

#### 箭头线

箭头线标志了函数的调用关系：

- 黑色箭头线：不加区别的调用关系。
- 粉红色的箭头线：解析函数（Parser）之间的调用关系。
- 紫色箭头线：熵解码函数（Entropy Decoding）之间的调用关系。
- 绿色箭头线：解码函数（Decode）之间的调用关系。
- 黄色箭头线：环路滤波函数（Loop Filter）之间的调用关系。

#### 函数所在的文件

每个函数标识了它所在的文件路径。

### 几个关键部分

下文简单记录几个关键的部分。

#### FFmpeg和H.264解码器之间作为接口的结构体

FFmpeg和H.264解码器之间作为接口的结构体有2个：ff_h264_parser和ff_h264_decoder。

**ff_h264_parser**

ff_h264_parser是用于解析H.264码流的AVCodecParser结构体。AVCodecParser中包含了几个重要的函数指针：

- **parser_init()：初始化解析器。**
- **parser_parse()：解析。**
- **parser_close()：关闭解析器。**

在ff_h264_parser结构体中，上述几个函数指针分别指向下面几个实现函数：

- **init()：初始化H.264解析器。**
- **h264_parse()：解析H.264码流。**
- **close()：关闭H.264解析器。**

**ff_h264_decoder**

ff_h264_decoder是用于解码H.264码流的AVCodec结构体。AVCodec中包含了几个重要的函数指针：

- **init()：初始化解码器。**
- **decode()：解码。**
- **close()：关闭解码器。**

在ff_h264_decoder结构体中，上述几个函数指针分别指向下面几个实现函数：

- **ff_h264_decode_init()：初始化H.264解码器。**
- **h264_decode_frame()：解码H.264码流。**

- **h264_decode_end()：关闭H.264解码器。**

#### 普通内部函数

普通内部函数指的是H.264解码器中还没有进行分类的函数。下面举几个例子。

ff_h264_decoder中ff_h264_decode_init()调用的初始化函数：

- **ff_h264dsp_init()：初始化DSP相关的函数。包含了IDCT、环路滤波函数等。**
- **ff_h264qpel_init()：初始化四分之一像素运动补偿相关的函数。**
- **ff_h264_pred_init()：初始化帧内预测相关的函数。**
- **ff_h264_decode_extradata()：解析AVCodecContext中的extradata。**

ff_h264_decoder中h264_decode_frame()逐层调用的和解码Slice相关的函数：

- **decode_nal_units()，ff_h264_execute_decode_slices()，decode_slice()等。**

ff_h264_decoder中h264_decode_end()调用的清理函数：

- **ff_h264_remove_all_refs()：移除所有参考帧。**
- **ff_h264_free_context()：释放在初始化H.264解码器的时候分配的内存。**

ff_h264_parser中h264_parse()逐层调用的和解析Slice相关的函数：

- **h264_find_frame_end()：查找NALU的结尾。**

- **parse_nal_units()：解析一个NALU。**

#### <font style="color:rgb(255,153,255);">解析函数（Parser）</font>
解析函数（Parser）用于解析H.264码流中的一些信息（例如SPS、PPS、Slice Header等）。在parse_nal_units()和decode_nal_units()中都调用这些解析函数完成了解析。下面举几个解析函数的例子。

- **ff_h264_decode_nal()：解析NALU。这个函数是后几个解析函数的前提。**
- **ff_h264_decode_slice_header()：解析Slice Header。**
- **ff_h264_decode_sei()：解析SEI。**
- **ff_h264_decode_seq_parameter_set()：解析SPS。**
- **ff_h264_decode_picture_parameter_set()：解析PPS。**

#### <font style="color:#993399;">熵解码函数（Entropy Decoding）</font>

熵解码函数（Entropy Decoding）读取码流数据并且进行CABAC或者CAVLC熵解码。CABAC解码函数是ff_h264_decode_mb_cabac()，CAVLC解码函数是ff_h264_decode_mb_cavlc()。熵解码函数中包含了很多的读取指数哥伦布编码数据的函数，例如get_ue_golomb_long()，get_ue_golomb()，get_se_golomb()，get_ue_golomb_31()等等。

在获取残差数据的时候需要进行CAVLC/CABAC解码。例如解码CAVLC的时候，会调用decode_residual()函数，而decode_residual()会调用get_vlc2()函数，get_vlc2()会调用OPEN_READER()，UPDATE_CACHE()，GET_VLC()，CLOSE_READER()几个函数读取CAVLC格式的数据。
此外，在获取运动矢量的时候，会调用pred_motion()以及类似的几个函数获取运动矢量相关的信息。

#### <font style="color:#009900;">解码函数（Decode）</font>

解码函数（Decode）通过帧内预测、帧间预测、DCT反变换等方法解码压缩数据。解码函数是`ff_h264_hl_decode_mb()`。其中跟宏块类型的不同，会调用几个不同的函数，最常见的就是调用`hl_decode_mb_simple_8()`。

`hl_decode_mb_simple_8()` 的定义是无法在源代码中直接找到的，这是因为它实际代码的函数名称是使用宏的方式写的（以后再具体分析）。`hl_decode_mb_simple_8()`的源代码实际上就是 `FUNC(hl_decode_mb)()` 函数的源代码。

`FUNC(hl_decode_mb)()`根据宏块类型的不同作不同的处理：如果宏块类型是INTRA，就会调用`hl_decode_mb_predict_luma()` 进行帧内预测；如果宏块类型不是INTRA，就会调用`FUNC(hl_motion_422)()` 或者 `FUNC(hl_motion_420)()` 进行四分之一像素运动补偿。

随后 `FUNC(hl_decode_mb)()` 会调用 `hl_decode_mb_idct_luma()` 等几个函数对数据进行DCT反变换工作。

#### <font style="color:#ffcc00;">环路滤波函数（Loop Filter）</font>

环路滤波函数（Loop Filter）对解码后的数据进行滤波，去除方块效应。环路滤波函数是loop_filter()。其中调用了ff_h264_filter_mb()和ff_h264_filter_mb_fast()。ff_h264_filter_mb_fast()中又调用了h264_filter_mb_fast_internal()。而h264_filter_mb_fast_internal()中又调用了下面几个函数进行滤波：

- **filter_mb_edgeh()：亮度水平滤波**
- **filter_mb_edgev()：亮度垂直滤波**
- **filter_mb_edgech()：色度水平滤波**

- **filter_mb_edgecv()：色度垂直滤波**

#### <font style="color:#3333ff;">汇编函数（Assembly）</font>

汇编函数（Assembly）是做过汇编优化的函数。为了提高效率，整个H.264解码器中（主要在解码部分和环路滤波部分）包含了大量的汇编函数。实际解码的过程中，FFmpeg会根据系统的特性调用相应的汇编函数（而不是C语言函数）以提高解码的效率。如果系统不支持汇编优化的话，FFmpeg才会调用C语言版本的函数。例如在帧内预测的时候，对于16x16亮度DC模式，有以下几个版本的函数：

- C语言版本的pred16x16_dc_8_c()
- NEON版本的ff_pred16x16_dc_neon()
- MMXEXT版本的ff_pred16x16_dc_8_mmxext()
- SSE2版本的ff_pred16x16_dc_8_sse2()

### 附录

在网上找到一张图（出处不详），分析了FFmpeg的H.264解码器每个函数运行的耗时情况，比较有参考意义，在这里附上。

![H.264解码器每个函数运行的耗时情况](/images/imageFFmpeg/Thor/H.264解码器每个函数运行的耗时情况.png)

从图中可以看出，熵解码、宏块解码、环路滤波耗时比例分别为：23.64%、51.85%、22.22%。

## 解析器（Parser）部分

本文继续分析FFmpeg中libavcodec的H.264解码器（H.264 Decoder）。上篇文章概述了FFmpeg中H.264解码器的结构；从这篇文章开始，具体研究H.264解码器的源代码。本文分析H.264解码器中解析器（Parser）部分的源代码。这部分的代码用于分割H.264的NALU，并且解析SPS、PPS、SEI等信息。解析H.264码流（对应AVCodecParser结构体中的函数）和解码H.264码流（对应AVCodec结构体中的函数）的时候都会调用该部分的代码完成相应的功能。

### 函数调用关系图

![解析器（Parser）部分的源代码的调用关系](/images/imageFFmpeg/Thor/解析器部分的源代码的调用关系.png)

从图中可以看出，H.264的解析器（Parser）在解析数据的时候调用 `h264_parse()`，`h264_parse()` 调用了`parse_nal_units()`，`parse_nal_units()` 则调用了一系列解析特定 NALU 的函数。H.264 的解码器（Decoder）在解码数据的时候调用 `h264_decode_frame()`，`h264_decode_frame()` 调用了`decode_nal_units()`，`decode_nal_units()` 也同样调用了一系列解析不同 NALU 的函数。

图中简单列举了几个解析特定 NALU 的函数：

```c
ff_h264_decode_nal()					// 解析 NALU Header
ff_h264_decode_seq_parameter_set()		// 解析 SPS
ff_h264_decode_picture_parameter_set()	// 解析 PPS
ff_h264_decode_sei()					// 解析 SEI
```

H.264 解码器与 H.264 解析器最主要的不同的地方在于它调用了 `ff_h264_execute_decode_slices()` 函数进行了解码工作。这篇文章只分析 H.264 解析器的源代码，至于 H.264 解码器的源代码，则在后面几篇文章中再进行分析。

#### h264_find_frame_end()

`h264_find_frame_end()` 用于查找 H.264 码流中的 “起始码”（start code）。在 H.264 码流中有两种起始码： `0x000001` 和 `0x00000001`。其中 4Byte 的长度的起始码最为常见。只有当一个完整的帧被编为多个 slice 的时候，包含这些 slice 的 NALU 才会使用 3Byte 的起始码。`h264_find_frame_end()` 的定义位于`libavcodec\h264_parser.c`

从源代码可以看出，`h264_find_frame_end()` 使用了一种类似于状态机的方式查找起始码。函数中的 `for()` 循环每执行一遍，状态机的状态就会改变一次。该状态机主要包含以下几种状态：

```shell
7 - 初始化状态
2 - 找到1个0
1 - 找到2个0
0 - 找到大于等于3个0
4 - 找到2个0和1个1，即001（即找到了起始码）
5 - 找到至少3个0和1个1，即0001等等（即找到了起始码）
>=8 - 找到2个Slice Header
```

这些状态之间的状态转移图如下所示。图中粉红色代表初始状态，绿色代表找到“起始码”的状态。

![状态之间的状态转移](/images/imageFFmpeg/Thor/h264_find_frame_end状态转移.png)

如图所示，`h264_find_frame_end()` 初始化时候位于状态 “7”；当找到 1 个 “0” 之后，状态从 “7” 变为 “2”；在状态 “2” 下，如果再次找到 1 个 “0”，则状态变为 “1”；在状态 “1” 下，如果找到 “1”，则状态变换为 “4”，表明找到了 “0x000001” 起始码；在状态 “1” 下，如果找到 “0”，则状态变换为 “0”；在状态 “0” 下，如果找到 “1”，则状态变换为 “5” ，表明找到了 “0x000001” 起始码。

`parse_nal_units()` 主要做了以下几步处理：

（1）对于所有的 NALU，都调用 `ff_h264_decode_nal` 解析 NALU 的 Header，得到 nal_unit_type 等信息

（2）根据 nal_unit_type 的不同，调用不同的解析函数进行处理。例如：

- a)解析 SPS 的时候调用 `ff_h264_decode_seq_parameter_set()`
- b)解析 PPS 的时候调用 `ff_h264_decode_picture_parameter_set()`
- c)解析 SEI 的时候调用 `ff_h264_decode_sei()`

- d)解析 IDR Slice / Slice 的时候，获取 slice_type 等一些信息。

## 解码器主干部分

本文分析FFmpeg的H.264解码器的主干部分。“主干部分” 是相对于 “熵解码”、“宏块解码”、“环路滤波” 这些细节部分而言的。它包含了 H.264 解码器直到 `decode_slice()` 前面的函数调用关系（`decode_slice()` 后面就是H.264解码器的细节部分，主要包含了 “熵解码”、“宏块解码”、“环路滤波” 3个部分）。

### 函数调用关系图

![解码器主干部分的源代码的调用关系](/images/imageFFmpeg/Thor/解码器主干部分的源代码的调用关系.png)

从图中可以看出，H.264解码器（Decoder）在初始化的时候调用了 `ff_h264_decode_init()`，`ff_h264_decode_init()` 又调用了下面几个函数进行解码器汇编函数的初始化工作（仅举了几个例子）：

```c
ff_h264dsp_init()		// 初始化DSP相关的汇编函数。包含了IDCT、环路滤波函数等。
ff_h264qpel_init()		// 初始化四分之一像素运动补偿相关的汇编函数。
ff_h264_pred_init()		// 初始化帧内预测相关的汇编函数。
```

H.264 解码器在关闭的时候调用了 `h264_decode_end()`，`h264_decode_end()` 又调用了`ff_h264_remove_all_refs()`，`ff_h264_free_context()` 等几个函数进行清理工作。
H.264 解码器在解码图像帧的时候调用了 `h264_decode_frame()`，`h264_decode_frame()` 调用了 `decode_nal_units()`，`decode_nal_units()` 调用了两类函数——解析函数和解码函数，如下所示。

（1）解析函数（获取信息）：

```c
ff_h264_decode_nal()				// 解析NALU Header。
ff_h264_decode_seq_parameter_set()	// 解析SPS。
ff_h264_decode_picture_parameter_set()	// 解析PPS。
ff_h264_decode_sei()	// 解析SEI。
ff_h264_decode_slice_header()	// 解析Slice Header。
```

（2）解码函数（解码获得图像）：

```c
ff_h264_execute_decode_slices() 	// 解码Slice。
```

其中 `ff_h264_execute_decode_slices()` 调用了 `decode_slice()`，而 `decode_slice()` 中调用了解码器中细节处理的函数（暂不详细分析）：

```c
ff_h264_decode_mb_cabac()	// CABAC熵解码函数。
ff_h264_decode_mb_cavlc()	// CAVLC熵解码函数。
ff_h264_hl_decode_mb()		// 宏块解码函数。
loop_filter()				// 环路滤波函数。
```

`h264_decode_frame()` 根据输入的 AVPacket 的 data 是否为空作不同的处理：

（1）若果输入的 AVPacket 的 data 为空，则调用 `output_frame()` 输出 `delayed_pic[]` 数组中的H264Picture，即输出解码器中缓存的帧（对应的是通常称为 “Flush Decoder” 的功能）。

（2）若果输入的 AVPacket 的 data 不为空，则首先调用 `decode_nal_units()` 解码 AVPacket 的 data，然后再调用 `output_frame()` 输出解码后的视频帧（有一点需要注意：由于帧重排等因素，输出的 AVFrame 并非对应于输入的 AVPacket）。

`decode_nal_units()` 首先调用 `ff_h264_decode_nal()` 判断 NALU 的类型，然后根据 NALU 类型的不同调用了不同的处理函数。这些处理函数可以分为两类——解析函数和解码函数，如下所示。

（1）解析函数（获取信息）：

```c
ff_h264_decode_seq_parameter_set()		// 解析SPS。
ff_h264_decode_picture_parameter_set()	// 解析PPS。
ff_h264_decode_sei()					// 解析SEI。
ff_h264_decode_slice_header()			// 解析Slice Header。
```

（2）解码函数（解码得到图像）：

```c
ff_h264_execute_decode_slices()	// 解码Slice。
```

`decode_slice()` 按照宏块（`16x16`）的方式处理输入的视频流。每个宏块的压缩数据经过以下 3 个基本步骤的处理，得到解码后的数据：

（1）熵解码。如果熵编码为 CABAC，则调用 `ff_h264_decode_mb_cabac()`；如果熵编码为 CAVLC，则调用 `ff_h264_decode_mb_cavlc()`

（2）宏块解码。这一步骤调用 `ff_h264_hl_decode_mb()`

（3）环路滤波。这一步骤调用 `loop_filter()`

此外，还有可能调用错误隐藏函数 `er_add_slice()`。

至此，`decode_nal_units()` 函数的调用流程就基本分析完毕了。`h264_decode_frame()` 在调用完 `decode_nal_units()` 之后，还需要把解码后得到的 H264Picture 转换为 AVFrame 输出出来，这时候会调用一个相对比较简单的函数 `output_frame()`。

## 熵解码（Entropy Decoding）部分

FFmpeg的H.264解码器调用 `decode_slice()` 函数完成了解码工作。这些解码工作可以大体上分为3个步骤：熵解码，宏块解码以及环路滤波。本文分析这3个步骤中的第1个步骤。

### 函数调用关系图

![熵解码（Entropy Decoding）部分的源代码的调用关系](/images/imageFFmpeg/Thor/熵解码部分的源代码的调用关系.png)

从图中可以看出，FFmpeg的熵解码方面的函数有两个：`ff_h264_decode_mb_cabac()` 和 `ff_h264_decode_mb_cavlc()`。

- `ff_h264_decode_mb_cabac()` 用于解码 CABAC 编码方式的 H.264 数据，
- `ff_h264_decode_mb_cavlc()`用于解码 CAVLC 编码方式的 H.264 数据。

本文挑选了`ff_h264_decode_mb_cavlc()` 函数进行分析。

`ff_h264_decode_mb_cavlc()` 调用了很多的读取指数哥伦布编码数据的函数，例如 `get_ue_golomb_long()`，`get_ue_golomb()，get_se_golomb()`，`get_ue_golomb_31()` 等。此外在解码残差数据的时候，调用了 `decode_residual()`函数，而 `decode_residual()` 会调用 `get_vlc2()` 函数读取 CAVLC 编码数据。

总而言之，“熵解码” 部分的作用就是按照 H.264 语法和语义的规定，读取数据（宏块类型、运动矢量、参考帧、残差等）并且赋值到 FFmpeg H.264 解码器中相应的变量上。需要注意的是，“熵解码” 部分并不使用这些变量还原视频数据。还原视频数据的功能在下一步 “宏块解码” 步骤中完成。

在开始看 `ff_h264_decode_mb_cavlc()` 之前先回顾一下 `decode_slice()` 函数。

`decode_slice()` 的的流程如下：

（1）判断 H.264 码流是 CABAC 编码还是 CAVLC 编码，进入不同的处理循环。

（2）如果是 CABAC 编码，首先调用 `ff_init_cabac_decoder()` 初始化 CABAC 解码器。然后进入一个循环，依次对每个宏块进行以下处理：

- a)调用 `ff_h264_decode_mb_cabac()`进行 CABAC 熵解码

- b)调用 `ff_h264_hl_decode_mb()` 进行宏块解码

- c)解码一行宏块之后调用 `loop_filter()` 进行环路滤波

- d)此外还有可能调用 `er_add_slice()` 进行错误隐藏处理

（3）如果是 CABAC 编码，直接进入一个循环，依次对每个宏块进行以下处理：

- a)调用 `ff_h264_decode_mb_cavlc()` 进行 CAVLC 熵解码

- b)调用 `ff_h264_hl_decode_mb()` 进行宏块解码

- c)解码一行宏块之后调用 `loop_filter()` 进行环路滤波

- d)此外还有可能调用 `er_add_slice()` 进行错误隐藏处理

可以看出，出了熵解码以外，宏块解码和环路滤波的函数是一样的。

`ff_h264_decode_mb_cavlc()` 的定义有将近 1000 行代码，算是一个比较复杂的函数了。我在其中写了不少注释，因此不再对源代码进行详细的分析。下面先简单梳理一下它的流程：

（1）解析 Skip 类型宏块

（2）获取 `mb_type`

（3）填充当前宏块左边和上边宏块的信息（后面的预测中会用到）

（4）根据 `mb_type` 的不同，分成三种情况进行预测工作：

- a)宏块是帧内预测
  - i.如果宏块是 `Intra4x4` 类型，则需要单独解析帧内预测模式。
  - ii.如果宏块是 `Intra16x16` 类型，则不再做过多处理。

- b)宏块划分为 4 个块（此时每个 `8x8` 的块可以再次划分为 4 种类型）

  这个时候每个 `8x8` 的块可以再次划分为 `8x8、8x4、4x8、4x4` 几种子块。需要分别处理这些小的子块：

  - i.解析子块的参考帧序号
  - ii.解析子块的运动矢量

- c)其它类型（包括 `16x16，16x8，8x16` 几种划分，这些划分不可再次划分）

  这个时候需要判断宏块的类型为 `16x16，16x8` 还是 `8x16`，然后作如下处理：

  - i.解析子宏块的参考帧序号
  - ii.解析子宏块的运动矢量

（5）解码残差信息

（6）将宏块的各种信息输出到整个图片相应的变量中

#### 各种 Cache（缓存）
在 H.264 解码器中包含了各种各样的 Cache（缓存）。例如：

```c
intra4x4_pred_mode_cache	// Intra4x4帧内预测模式的缓存
non_zero_count_cache		// 每个4x4块的非0系数个数的缓存
mv_cache					// 运动矢量缓存
ref_cache					// 运动矢量参考帧的缓存
```

> [其他知识查看](<https://blog.csdn.net/leixiaohua1020/article/details/45114453>)

## 宏块解码（Decode）部分-帧内宏块（Intra）

FFmpeg的H.264解码器调用 `decode_slice()` 函数完成了解码工作。这些解码工作可以大体上分为3个步骤：熵解码，宏块解码以及环路滤波。本文分析这3个步骤中的第2个步骤。由于宏块解码部分的内容比较多，因此将本部分内容拆分成两篇文章：一篇文章记录帧内预测宏块（Intra）的宏块解码，另一篇文章记录帧间预测宏块（Inter）的宏块解码。

### 函数调用关系图

![宏块解码（Decode）部分的源代码的调用关系](/images/imageFFmpeg/Thor/宏块解码部分的源代码的调用关系.png)

宏块解码函数（Decode）通过帧内预测、帧间预测、DCT 反变换等方法解码压缩数据。解码函数是 `ff_h264_hl_decode_mb()`。其中跟宏块类型的不同，会调用几个不同的函数，最常见的就是调用 `hl_decode_mb_simple_8()`。

`hl_decode_mb_simple_8()` 的定义是无法在源代码中直接找到的，这是因为它实际代码的函数名称是使用宏的方式写的。`hl_decode_mb_simple_8()` 的源代码实际上就是 `FUNC(hl_decode_mb)()` 函数的源代码。

从函数调用图中可以看出，`FUNC(hl_decode_mb)()` 根据宏块类型的不同作不同的处理：

- 如果帧内预测宏块（INTRA），就会调用 `hl_decode_mb_predict_luma()` 进行帧内预测；
- 如果是帧间预测宏块（INTER），就会调用 `FUNC(hl_motion_422)()` 或者 `FUNC(hl_motion_420)()` 进行四分之一像素运动补偿。

经过帧内预测或者帧间预测步骤之后，就得到了预测数据。随后 `FUNC(hl_decode_mb)()` 会调用 `hl_decode_mb_idct_luma()` 等几个函数对残差数据进行 DCT 反变换工作，并将变换后的数据叠加到预测数据上，形成解码后的图像数据。

由于帧内预测宏块和帧间预测宏块的解码工作都比较复杂，因此分成两篇文章记录这两部分的源代码。本文记录帧内预测宏块解码时候的源代码。

下面简单梳理一下 `FUNC(hl_decode_mb)` 的流程（在这里只考虑亮度分量的解码，色度分量的解码过程是类似的）：

（1）预测

- a)如果是帧内预测宏块（Intra），调用 `hl_decode_mb_predict_luma()` 进行帧内预测，得到预测数据。
- b)如果不是帧内预测宏块（Inter），调用 `FUNC(hl_motion_420)()` 或者 `FUNC(hl_motion_422)()` 进行帧间预测（即运动补偿），得到预测数据。

（2）残差叠加

- a)调用 `hl_decode_mb_idct_luma()` 对 DCT 残差数据进行 DCT 反变换，获得残差像素数据并且叠加到之前得到的预测数据上，得到最后的图像数据。

PS：该流程中有一个重要的贯穿始终的内存指针 `dest_y`，其指向的内存中存储了解码后的亮度数据。

根据原代码梳理一下 `hl_decode_mb_predict_luma()` 的主干：

（1）如果宏块是4x4帧内预测类型（Intra4x4），作如下处理：

- a)循环遍历 16 个 `4x4` 的块，并作如下处理：
  - i.从 `intra4x4_pred_mode_cache` 中读取 `4x4` 帧内预测方法
  - ii.根据帧内预测方法调用 H264PredContext 中的汇编函数 `pred4x4()` 进行帧内预测
  - iii.调用 H264DSPContext 中的汇编函数 `h264_idct_add()` 对 DCT 残差数据进行 `4x4DCT` 反变换；如果DCT 系数中不包含 AC 系数的话，则调用汇编函数 `h264_idct_dc_add()` 对残差数据进行 `4x4DCT` 反变换（速度更快）。

（2）如果宏块是 `16x16` 帧内预测类型（`Intra4x4`），作如下处理：

- a)通过 `intra16x16_pred_mode` 获得 `16x16` 帧内预测方法
- b)根据帧内预测方法调用 H264PredContext 中的汇编函数 `pred16x16 ()` 进行帧内预测
- c)调用 H264DSPContext 中的汇编函数 `h264_luma_dc_dequant_idct ()` 对 16 个小块的 DC 系数进行Hadamard 反变换

在这里需要注意，帧内 `4x4` 的宏块在执行完 `hl_decode_mb_predict_luma()` 之后实际上已经完成了 “帧内预测+DCT反变换” 的流程（解码完成）；而帧内 `16x16` 的宏块在执行完 `hl_decode_mb_predict_luma()` 之后仅仅完成了 “帧内预测+Hadamard反变换 ”的流程，而并未进行 “DCT反变换” 的步骤，这一步骤需要在后续步骤中完成。

下文记录上述流程中涉及到的汇编函数（此处暂不记录DCT反变换的函数，在后文中再进行叙述）：

- `4x4`帧内预测汇编函数：`H264PredContext -> pred4x4[dir`]()
- `16x16` 帧内预测汇编函数：`H264PredContext -> pred16x16[dir]()`

- Hadamard反变换汇编函数：`H264DSPContext->h264_luma_dc_dequant_idct()`

下面根据源代码简单梳理一下 `hl_decode_mb_idct_luma()` 的流程：

（1）判断宏块是否属于 `Intra4x4` 类型，如果是，函数直接返回（`Intra4x4` 比较特殊，它的 DCT 反变换已经前文所述的 “帧内预测” 部分完成）。

（2）根据不同的宏块类型作不同的处理：

- a) `Intra16x16`：调用 H264DSPContext 的汇编函数 `h264_idct_add16intra()` 进行 DCT 反变换
- b) Inter类型：调用 H264DSPContext 的汇编函数 `h264_idct_add16()` 进行 DCT 反变换

PS：需要注意的是 `h264_idct_add16intra()` 和 `h264_idct_add16()` 只有微小的区别，它们的基本逻辑都是把 `16x16` 的块划分为 16 个 `4x4` 的块再进行 DCT 反变换。此外还有一点需要注意：函数名中的 “add” 的含义是将 DCT 反变换之后的残差像素数据直接叠加到已有数据之上。

## 宏块解码（Decode）部分-帧间宏块（Inter）

本文分析FFmpeg的H.264解码器的宏块解码（Decode）部分。FFmpeg的H.264解码器调用 `decode_slice()` 函数完成了解码工作。这些解码工作可以大体上分为3个步骤：熵解码，宏块解码以及环路滤波。本文分析这3个步骤中的第2个步骤：宏块解码。上一篇文章已经记录了帧内预测宏块（Intra）的宏块解码，本文继续上一篇文章的内容，记录帧间预测宏块（Inter）的宏块解码。

### 函数调用关系图

参考宏块解码（Decode）部分的源代码的调用关系图

`MCFUNC(hl_motion)` 根据子宏块的划分类型的不同，传递不同的参数调用 `mc_part()` 函数。

（1）如果子宏块划分为 `16x16`（等同于没有划分），直接调用 `mc_part()` 并且传递如下参数：

- a)单向预测汇编函数集：`qpix_put[0]` （`qpix_put[0]`中的函数进行 `16x16` 块的四分之一像素运动补偿）。
- b)双向预测汇编函数集：`qpix_avg[0]`。
- c) square 设置为 1，delta 设置为 0。
- d) x_offset 和 y_offset 都设置为 0。

（2）如果子宏块划分为 `16x8`，分两次调用 `mc_part()` 并且传递如下参数：

- a)单向预测汇编函数集：`qpix_put[1]` （`qpix_put[1]` 中的函数进行 `8x8` 块的四分之一像素运动补偿）。
- b)双向预测汇编函数集：`qpix_avg[1]`。
- c) square 设置为 0，delta 设置为 8。

其中第 1 次调用 `mc_part()` 的时候 x_offset 和 y_offset 都设置为 0，第 2 次调用 `mc_part()` 的时候 x_offset 设置为 0，y_offset 设置为 4。

（3）如果子宏块划分为 `8x16`，分两次调用 `mc_part()` 并且传递如下参数：

- a)单向预测汇编函数集：`qpix_put[1]` （`qpix_put[1]` 中的函数进行 `8x8` 块的四分之一像素运动补偿）。
- b)双向预测汇编函数集：`qpix_avg[1]`。
- c) square设置为 0，delta 设置为 `8 * h->mb_linesize`。

其中第 1 次调用 `mc_part()` 的时候 x_offset 和 y_offset 都设置为 0，第 2 次调用 `mc_part()` 的时候 x_offset 设置为 4，y_offset 设置为 0。

（4）如果子宏块划分为 `8x8`，说明此时每个 `8x8` 子宏块还可以继续划分为 `8x8，8x8，4x8，4x4` 几种类型，此时根据上述的规则，分成 4 次分别对这些小块做类似的处理。

`qpix_put[4][16]` 实际上指向了 H264QpelContex 的 `put_h264_qpel_pixels_tab[4][16]` ，其中存储了所有单向预测方块的四分之一像素运动补偿函数。其中：

```shell
qpix_put[0]存储的是16x16方块的运动补偿函数；
qpix_put[1]存储的是8x8方块的运动补偿函数；
qpix_put[2]存储的是4x4方块的运动补偿函数；
qpix_put[3]存储的是2x2方块的运动补偿函数；
```

从源代码可以看出，`mc_part_std()` 首先计算了几个关键的用于确定子宏块位置的参数，然后根据预测类型的不同（单向预测或者双向预测），把不同的函数指针传递给 `mc_dir_part()`：如果仅仅使用了 list0（单向预测），则只传递 `qpix_put()`；如果使用了 list0 和 list1（双向预测），则调用两次 `mc_dir_part()`，第一次传递 `qpix_put()`，第二次传递 `qpix_avg()`。

`mc_part_std()` 中赋值了 3 个重要的变量（只考虑亮度）：

（1）`dest_y`：指向子宏块亮度数据指针。这个值是通过 x_offset 和 y_offset 计算得来的。在这里需要注意一点：x_offset 和 y_offset 是以色度为基本单位的，所以在计算亮度相关的变量的时候需要乘以 2。

（2）`x_offset`：传入的 x_offset 本来是子宏块相对于整个宏块位置的横坐标，在这里加上 `8 * h->mb_x` 之后，变成了子宏块相对于整个图像的位置的横坐标（以色度为基本单位）。

（3）`y_offset`：传入的 y_offset 本来是子宏块相对于整个宏块位置的纵坐标，在这里加上 `8 * h->mb_y` 之后，变成了子宏块相对于整个图像的位置的纵坐标（以色度为基本单位）。

通过源代码，简单梳理一下 `mc_dir_part()` 的流程（只考虑亮度，色度的流程类似）：

（1）计算 mx 和 my。mx 和 my 是当前宏块的匹配块的位置坐标。需要注意的是该坐标是以 `1/4` 像素（而不是整像素）为基本单位的。

（2）计算 offset。offset 是当前宏块的匹配块相对于图像的整像素偏移量，由 mx、my 计算而来。

（3）计算 luma_xy。luma_xy 决定了当前宏块的匹配块采用的四分之一像素运动补偿的方式，由 mx、my 计算而来。

（4）调用运动补偿汇编函数 `qpix_op[luma_xy]()` 完成运动补偿。在这里需要注意，如果子宏块不是正方形的（square 取 0），则还会调用 1 次 `qpix_op[luma_xy]()` 完成另外一个方块的运动补偿。

总而言之，首先找到当前宏块的匹配块的整像素位置，然后在该位置的基础上进行四分之一像素的内插，并将结果输出出来。

前文中曾经提过，由于 H.264 解码器中只提供了正方形块的四分之一像素运动补偿函数，所以如果子宏块不是正方形的（例如 `16x8，8x16`），就需要先将子宏块划分为正方形的方块，然后再进行两次运动补偿（两个正方形方块之间的位置关系用 delta 变量记录）。例如 `16x8` 的宏块，就会划分成两个 `8x8` 的方块，调用两次相同的运动补偿函数

下面可以看一下 C 语言版本的四分之一像素运动补偿函数的源代码。由于 `1/4` 像素内插比较复杂，其中还用到了整像素赋值函数以及 `1/2` 像素线性内插函数，所以需要从简到难一步一步的看这些源代码。打算按照顺序一步一步分析这些源代码：

（1）pel_template.c（展开“ `DEF_PEL(put, op_put)` ”宏）：整像素赋值（用于整像素的单向预测）

（2）pel_template.c（展开“ `DEF_PEL(avg, op_avg)` ”宏）：整像素求平均（写这个为了举一个双向预测的例子）

（3）hpel_template.c(（展开“`DEF_HPEL(put, op_put)`”宏）：`1/2` 像素线性内插

（4）h264qpel_template.c（展开“ `H264_LOWPASS(put_, op_put, op2_put)`”宏）：半像素内插（注意不是1/2像素线性内插，而是需要滤波的）

（5）h264qpel_template.c（展开“`H264_MC(put_, 8)`”宏）：`1/4`像素运动补偿

## 环路滤波（Loop Filter）部分

本文分析FFmpeg的H.264解码器的环路滤波（Loop Filter）部分。FFmpeg的H.264解码器调用decode_slice()函数完成了解码工作。这些解码工作可以大体上分为3个步骤：熵解码，宏块解码以及环路滤波。本文分析这3个步骤中的第3个步骤。

### 函数调用关系图

![环路滤波（Loop Filter）部分的源代码的调用关系](/images/imageFFmpeg/Thor/环路滤波部分的源代码的调用关系.png)

环路滤波主要用于滤除方块效应。`decode_slice()` 在解码完一行宏块之后，会调用 `loop_filter()` 函数完成环路滤波功能。`loop_filter()` 函数会遍历该行宏块中的每一个宏块，并且针对每一个宏块调用 `ff_h264_filter_mb_fast()`。`ff_h264_filter_mb_fast()` 又会调用 `h264_filter_mb_fast_internal()`。

`h264_filter_mb_fast_internal()` 完成了一个宏块的环路滤波工作。该函数调用 `filter_mb_edgev()` 和 `filter_mb_edgeh()` 对亮度垂直边界和水平边界进行滤波，或者调用 `filter_mb_edgecv()` 和 `filter_mb_edgech()` 对色度的的垂直边界和水平边界进行滤波。

通过源代码整理出来 `h264_filter_mb_fast_internal()` 的流程如下：

（1）读取 QP 等几个参数，用于推导滤波门限值 alpha，beta。

（2）如果是帧内宏块（Intra），作如下处理：

- a)对于水平的边界，调用 `filter_mb_edgeh()` 进行滤波。

- b)对于垂直的边界，调用 `filter_mb_edgev()` 进行滤波。

  帧内宏块滤波过程中，对于在宏块边界上的边界（最左边的垂直边界和最上边的水平边界），采用滤波强度 Bs 为 4 的滤波；对于其它边界则采用滤波强度 Bs 为 3 的滤波。

（3）如果是其他宏块，作如下处理：

- a)对于水平的边界，调用 `filter_mb_edgeh()` 进行滤波。

- b)对于垂直的边界，调用 `filter_mb_edgev()` 进行滤波。

  此类宏块的滤波强度需要另作判断。

总体说来，一个宏块内部的滤波顺序如下图所示。图中的 “0”、“1”、“2”、“3” 为滤波的顺序。可以看出首先对垂直边界进行滤波，然后对水平边界进行滤波。垂直边界滤波按照从左到右的顺序进行，而水平边界的滤波按照从上到下的顺序进行。

![宏块内部的滤波顺序](/images/imageFFmpeg/Thor/宏块内部的滤波顺序.png)

