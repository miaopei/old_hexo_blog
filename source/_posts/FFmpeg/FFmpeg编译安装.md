---
title: ffmpeg SDK定制
tags: FFmpeg
reward: true
categories: FFmpeg
toc: true
abbrlink: 39639
date: 2019-05-09 10:14:50
---

## FFmpeg 编译

```shell
$ git clone http://source.ffmpeg.org/git/ffmpeg.git ffmpeg
$ cd ffmpeg
$ ./configure --prefix=./install --enable-gpl --enable-nonfree \
--enable-libass --enable-libfdk-aac --enable-libfreetype \
--enable-libmp3lame --enable-libopus --enable-libtheora \
--enable-libvorbis --enable-libvpx --enable-libx264 --enable-libxvid \
--enable-shared --enable-static
$ make && sudo make install
```

注意：在执行各自的 configure 创建编译配置文件时，最好都强制带上 --enable-static 和 --enable-shared 参数以确保生成静态库和动态库。另外因为是在 Mac OS X 环境下编译，因此在各自编译完后，都要执行 sudo make install，安装到默认的 /usr/local 目录下相应位置（Mac OS X 下不推荐 /usr），因此不要在 configure 时指定 --prefix，就用默认的 /usr/local 目录前缀即可。完成编译安装后，FFmpeg 的头文件将会复制到 /usr/local/include 下面相应位置，静态库及动态库会被复制到 /usr/local/lib 目录下，FFmpeg 的可执行程序（ffmpeg、ffprobe、ffserver）会被复制到 /usr/local/bin 目录下，这样 FFmpeg 的开发环境就构建好了。

