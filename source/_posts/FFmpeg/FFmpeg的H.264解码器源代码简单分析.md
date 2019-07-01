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











![](/images/imageFFmpeg/Thor/)

![](/images/imageFFmpeg/Thor/)

![](/images/imageFFmpeg/Thor/)

![](/images/imageFFmpeg/Thor/)

![](/images/imageFFmpeg/Thor/)

![](/images/imageFFmpeg/Thor/)

![](/images/imageFFmpeg/Thor/)

![](/images/imageFFmpeg/Thor/)

![](/images/imageFFmpeg/Thor/)

![](/images/imageFFmpeg/Thor/)

![](/images/imageFFmpeg/Thor/)



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

