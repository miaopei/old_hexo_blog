---
title: webrtc-专题-01-WebRTC框架介绍
tags:
  - WebRTC
categories:
  - WebRTC
reward: true
abbrlink: 42839
date: 2019-06-16 19:17:23
---

## 什么是WebRTC？

众所周知，浏览器本身不支持相互之间直接建立信道进行通信，都是通过服务器进行中转。比如现在有两个客户端，甲和乙，他们俩想要通信，首先需要甲和服务器、乙和服务器之间建立信道。甲给乙发送消息时，甲先将消息发送到服务器上，服务器对甲的消息进行中转，发送到乙处，反过来也是一样。这样甲与乙之间的一次消息要通过两段信道，通信的效率同时受制于这两段信道的带宽。同时这样的信道并不适合数据流的传输，如何建立浏览器之间的点对点传输，一直困扰着开发者。WebRTC应运而生。

<!-- more -->

WebRTC，名称源自网页实时通信（Web Real-Time Communication）的缩写，是一项实时通讯技术，它允许网络应用或者站点，在不借助中间媒介的情况下，建立浏览器之间点对点（Peer-to-Peer）的连接，实现视频流和（或）音频流或者其他任意数据的传输，支持网页浏览器进行实时语音对话或视频对话。WebRTC包含的这些标准使用户在无需安装任何插件或者第三方的软件的情况下，创建点对点（Peer-to-Peer）的数据分享和电话会议成为可能。它是谷歌2010年5月以6820万美元收购拥有编解码、回声消除等技术的Global IP Solutions公司而获得的一项技术。该项目是由GIPS项目和libjingle项目融合而成。其中GIPS部分主要提供媒体的处理的功能。libjingle项目部分主要提供P2P传输部分的功能。2011年5月开放了工程的源代码，与相关机构 IETF 和 W3C 制定行业标准，组成了现有的 WebRTC 项目，在行业内得到了广泛的支持和应用，成为下一代视频通话的标准。

WebRTC是一个开源项目，旨在使得浏览器能为实时通信（RTC）提供简单的JavaScript接口。说的简单明了一点就是让浏览器提供JS的即时通信接口。这个接口所创立的信道并不是像WebSocket一样，打通一个浏览器与WebSocket服务器之间的通信，而是通过一系列的信令，建立一个浏览器与浏览器之间（peer-to-peer）的信道，这个信道可以发送任何数据，而不需要经过服务器。并且WebRTC通过实现MediaStream，通过浏览器调用设备的摄像头、话筒，使得浏览器之间可以传递音频和视频。

WebRTC并不是单一的协议， 包含了媒体、加密、传输层等在内的多个协议标准以及一套基于 JavaScript 的 API。通过简单易用的 JavaScript API ，在不安装任何插件的情况下，让浏览器拥有了 P2P音视频和数据分享的能力。同时WebRTC 并不是一个孤立的协议，它拥有灵活的信令，可以便捷的对接现有的SIP 和电话网络的系统。

关键要认识到的是，点对点并不意味着不涉及服务器，这只是意味着正常的数据没有经过它们。至少，两台客户机仍然需要一台服务器来交换一些基本信息（我在网络上的哪些位置，我支持哪些编解码器），以便他们可以建立对等的连接。用于建立对等连接的信息被称为信令，而服务器被称为信令服务器。

WebRTC没有规定您使用什么信令服务器或什么协议。 Websockets是最常见的，但也可以使用长轮询甚至邮件协议。

## WebRTC的目标

WebRTC实现了基于网页的视频会议，标准是WHATWG 协议，目的是通过浏览器提供简单的javascript就可以达到实时通讯（Real-Time Communications (RTC)）能力。

WebRTC（Web Real-Time Communication）项目的最终目的主要是让Web开发者能够基于浏览器（Chrome\FireFox...）轻易快捷开发出丰富的实时多媒体应用，而无需下载安装任何插件，Web开发者也无需关注多媒体的数字信号处理过程，只需编写简单的Javascript程序即可实现，W3C等组织正在制定Javascript 标准API，目前是[WebRTC 1.0版本](http://w3c.github.io/webrtc-pc/)，Draft状态；另外WebRTC还希望能够建立一个多互联网浏览器间健壮的实时通信的平台，形成开发者与浏览器厂商良好的生态环境。同时，Google也希望和致力于让WebRTC的技术成为HTML5标准之一，可见Google布局之深远。

WebRTC 提供了视频会议的核心技术，包括音视频的采集、编解码、网络传输、显示等功能，并且还支持跨平台：windows，linux，mac，android。

## WebRTC的应用场景

WebRTC的点对点方式能够运用在很多场景：

- 社交平台，如视频聊天室应用
- 远程实时监控
- 远程学习，如在线教育、在线培训
- 远程医疗，如在线医疗
- 人力资源和招聘，如在线面试
- 会议和联系中心之间的协作，如客户服务、呼叫中心
- Web IM，如web qq
- 游戏娱乐，如双人对战游戏（如象棋这种双人对战游戏，每一步的数据服务器时不关心的，所以完全可以点对点发送）
- 屏幕共享
- 人脸检测识别
- 虚拟现实
- 市场调研
- 金融服务
- 其它即时通信业务

## WebRTC方案在多方实时音视频的应用及局限性

实时音视频有两种会话方式，一种是点对点的，就是2个设备之间进行交流。就像2个人视频聊天这种场景的。另外一种是多方会话，就像视频会议这样的场景。

### WebRTC适合做视频直播或音视频会议吗？

先说结论：**完全可以！**

但是，凡事总有但是，**也没那么简单**。你以为调用几个Chrome的API就能直播了？too simple

那正确的方法是什么呢？

1. 你得有一个实现了WebRTC相关协议的客户端。比如Chrome浏览器。
2. 架设一个类似MCU系统的服务器。（不知道MCU是什么？看这：[MCU（视频会议系统中心控制设备）](https://baike.baidu.com/item/MCU/3248422#viewPageContent)）

第一步，用你的客户端，比如Chrome浏览器，通过WebRTC相关的媒体API获取图像及声音信源，再用WebRTC中的通信API将图像和声音数据发送到MCU服务器。如果你只是做着玩玩，完全可以直接用Chrome浏览器做你的直播客户端。把摄像头麦克风连上电脑之后，Chrome可以用相关的js的API获取到摄像头和麦克风的数据。缺点就是如果长时间直播，Chrome的稳定性堪忧，因为chrome这样运行24小时以上内存占用很厉害，而且容易崩溃。 第二步，MCU服务器根据你的需求对图像和声音数据进行必要的处理，比如压缩、混音等。你可能要问，WebRTC可以直接在浏览器之间P2P地传输流，为什么还要有中转的MCU服务器？因为Chrome的功能很弱，视频的分辨率控制、多路语音的混音都做不了，所以需要MCU参与。**最重要的是，Chrome同时给6个客户端发视频流就很消耗资源了，所以你如果有超过10个用户收看的话，Chrome很容易崩溃**。 第三步，需要看直播的用户，通过他们的Chrome浏览器，链接上你的MCU服务器，并收取服务器转发来的图像和声音流。

所以，**这就要看你用的客户端是什么**。**如果你是想用浏览器，那WebRTC不是好方案。但如果你是用app，可以肯定回答：可以，而且强烈建议你基于WebRTC**。

WebRTC使web浏览器通过简单的JavaScript api接口实现实时通信功能。在这方面基本已成事实上标准，正如上面写的，它成为标准不是新闻，不成为标准才是新闻。国内就有不少从事和WebRTC相关的开发者，像有的公司就基于WebRTC包做些修改、然后给其它开发者用、号称是视频聊天SDK。这样公司好多，但真正做大却有点难。我想有两个原因：Javascript的限制，浏览器的限制。

**Javascript的限制**。Javascript是脚本语言，能有什么功能取决于实现它的虚拟机，也就是浏览器这个应用程序。由于受限，问题来了，人民群众的需求总是琳琅满目，你都能提供吗？举个例子，直播过程中，要让对方的头上自动加顶红帽子，——当然，修改浏览器代码让加个帽子不是难事，可谁又知道接下会发生什么，难道要一个改一个？聊天往往是娱乐，娱乐经常是没啥规矩。由于这限制，开发者用它时会有这看法：东西是很好，但总是有那么点不足，而且即使是努力了也不可能解决（自个写浏览器除外）。

**浏览器的限制**。这就要涉及到聊天场景。很现实问题，如果我想和你聊天，身边有手机，你认为会用浏览器吗？对PC，网页比app方便，而移动设备却有点反着来，而且将来移动设备会越来越多。关于这个再深入个问题：如果PC用浏览器，手机用app，聊天是否可行？技术实现上没问题，可事实上基本不会做，代价太高划不来。浏览器时，信令走的是Websocket，app用Websocket纯粹是没事找抽，直接C Socket既简单又高效。浏览器时，两socket间没啥心跳包机制，app时心跳包机制可很大提升效率。浏览器时，由于用Javascript开发，功能受限，app时用Native Code，自个想要什么就能实现什么。而且，WebRTC是跨平台包，基于C/C++的跨平台SDK也不是没有，何不在开发时顺便开发出个Windows平台app。以上导致了app不太可能和网页聊天，这又让浏览器少去很多应用场景。

**综合来说，在浏览器不是WebRTC不行，而是其它原因导致有那么点尴尬。想做一个“完美”用户体验的聊天工具，终归还得用app**。

为什么说对App是完全可行呢？浏览器在用的WebRTC其实分两层，底层是个用C++写的库（Native Code），然后上层写个Javascript封装，以便供HTML5调用。既然是写app，那完全不用管上层Js封装，而且Google在开发WebRTC时已考虑用在app，底层C++库的API已做得很完善了。也就是说，一旦直接用Native Code，完全和浏览器无关了，作为C/C++开发者，他就可以用WebRTC去实现自个想实现的所有东西。

对直播使用场景，很多人是用移动设备，移动设备基本都是用app。而WebRTC中的Native Code部分跨平台特性很好，基本不用改，就能写出完全跨iOS、Android、Windows平台的代码，所以有了iOS/Android app，基本不耗成本Windows上的app就出来了。——当然，如果有人在Windows还是坚持要用浏览器，那只能说在Windows不得不留有瑕疵。

为什么有人一想到Windows，直观就认为只有p2p？我猜是和默认的信令服务器是p2p有关。关于这默认的信令服务器是怎么个交互流程，如下图所示：

![信令服务器基本交互流程](/images/imageWebRTC/others/信令服务器基本交互流程.png)

根据这个图，你可以发现，只要换了信令服务器，就有可能变成直播。而事实也的确是这样。就像有人说直播时图像单向就够了（主播传向观众），而WebRTC是双向，只要改信令服务器，立刻就单向了。

为什么强烈建议你基于WebRTC？对直播系统，难的不是服务器，而是客户端。客户端难的地方则主要体现在两个方面，一是网络传输有关，像侦听事件，同步主线程和读线程，穿透；二是流数据有关，像编码、解码、回声消除。而这些正是WebRTC帮你解决了。也正因为如此，现在很多直播系统最早的客户端其实是以WebRTC为根的，只是后面自个不断优化，慢慢地变成自个系统而已。诚然，官方WebRTC是有地方不尽如意，但它们不断更新。

概括的说：

1. **WebRTC整体的技术并不适合做直播**。WebRTC设计的初衷只是为了在两个浏览器/native app之间解决直接连接发送media streaming/data数据的，也就是所谓的peer to peer的通信，大多数的情况下不需要依赖于服务器的中转，因此一般在通信的逻辑上是一对一。而我们现在的直播服务大部分的情况下是一对多的通信，一个主播可能会有成千上万个接收端，这种方式用传统的P2P来实现是不可能的，所以目前直播的方案基本上都是会有直播服务器来做中央管理，主播的数据首先发送给直播服务器，直播服务器为了能够支持非常多用户的同事观看，还要通过边缘节点CDN的方式来做地域加速，所有的接收端都不会直接连接主播，而是从服务器上接收数据。
2. **WebRTC内部包含的技术模块是非常适合解决直播过程中存在的各种问题的**，而且应该在大多数直播技术框架中都已经得到了部分应用，例如音视频数据的收发、音频处理回音消除降噪等。

所以综上，可以使用WebRTC内部的技术模块来解决直播过程中存在的技术问题，但是不适合直接用WebRTC来实现直播的整体框架。

### 多方会话实现方式

WebRTC针对这多方会话提供了两种实现方式。

**第一种实现方式：实现多个浏览器之间的对等连接——全网状模型**

![全网装模型](/images/imageWebRTC/others/全网装模型.png)

多个浏览器通过Web服务器访问网站，浏览器之间的通话并不通过任何流媒体服务器，而是直接通过对等连接，通过UDP来实现浏览器之间的通信。这个叫做全网状模型。

**第二种实现方式：浏览器和媒体服务器建立对等连接——集中式模型** 

服务端除了Web服务器之外还需要架构一个台媒体服务器，媒体服务器和各个浏览器之间实现对点连接。架设媒体服务器的目的在于接收各个浏览器的媒体流，之后通过媒体服务器把媒体流发给各个浏览器。

**两种实现方式的利弊** ：

- 全网状：不需要架设媒体服务器，媒体延迟低质量高。但是如果人数很多的话就会导致浏览器的本地宽带增加，不适合多人会议。

- 集中式：比较适合多人会话，节省本地宽带，但是只有少量浏览器查询的时候，这种体系的效率非常低（因为要走媒体服务器）。

## 业内哪些App在使用WebRTC？

目前，国内外有很多App都在使用WebRTC或者其相关技术，下面仅列举部分案例：

**腾讯QQ和微信**

腾讯的QQ音视频在使用GIPS方案（WebRTC的核心源于GIPS），据说微信内部已大量使用WebRTC组件，其内嵌的浏览器也支持WebRTC。

**陌陌**

由国内知名WebRTC服务提供商声网提供技术支持。

![](/images/imageWebRTC/others/陌陌.png)

**荔枝FM**

由国内知名WebRTC服务提供商声网提供技术支持。

![](/images/imageWebRTC/others/荔枝FM.png)

**MeetMe**

由国内知名WebRTC服务提供商声网提供技术支持。

![](/images/imageWebRTC/others/meetme.png)

**狼人杀**

由国内知名WebRTC服务提供商声网提供技术支持。

![](/images/imageWebRTC/others/狼人杀.png)

**去哪儿**

由国内知名WebRTC服务提供商声网提供技术支持。

![](/images/imageWebRTC/others/去哪儿.png)

## WebRTC的优缺点

**优点：**

- 方便。对于用户来说，在WebRTC出现之前想要进行实时通信就需要安装插件和客户端，但是对于很多用户来说，插件的下载、软件的安装和更新这些操作是复杂而且容易出现问题的，现在WebRTC技术内置于浏览器中，用户不需要使用任何插件或者软件就能通过浏览器来实现实时通信。对于开发者来说，在Google将WebRTC开源之前，浏览器之间实现通信的技术是掌握在大企业手中，这项技术的开发是一个很困难的任务，现在开发者使用简单的HTML标签和JavaScript API就能够实现Web音/视频通信的功能。

- 跨平台。因为基于浏览器，所以可跨浏览器（浏览器支持WebRTC）和跨操作系统平台，windows、Linux、ios、 android......全部支持。

- P2P的优势。使用P2P技术处理数据（音频、视频和文件等）的传输，可减少服务器端的性能压力和带宽成本（这是有条件的，有些网络环境下可能无法使用P2P）

- 一整套的解决方案。从采集，编解码，RTP打包，流量控制，音频处理，多通道混音，都给于了很好的支持，并且是开源的代码，大大节省了开发时间和成本。

- 免费。虽然WebRTC技术已经较为成熟，其集成了最佳的音/视频引擎，十分先进的codec，但是Google对于这些技术不收取任何费用。

- 强大的打洞能力。WebRTC技术包含了使用STUN、ICE、TURN、RTP-over-TCP的关键NAT和防火墙穿透技术，并支持代理。

**缺点：**

- WebRTC中很多的参数都是由GIPS公司的工程师们依靠经验所设定的值，这就会出现卡顿、延时、回声、丢包、多人视频不稳定等问题，并且由于公网的稳定性或机型适配等外在因素，以上问题在项目上线后会更加严重。

- WebRTC缺乏服务器方案的设计和部署。

- 传输质量难以保证。WebRTC的传输设计基于P2P，难以保障传输质量，优化手段也有限，只能做一些端到端的优化，难以应对复杂的互联网环境。比如对跨地区、跨运营商、低带宽、高丢包等场景下的传输质量基本是靠天吃饭，而这恰恰是国内互联网应用的典型场景。

- WebRTC比较适合一对一的单聊，虽然功能上可以扩展实现群聊，但是没有针对群聊，特别是超大群聊进行任何优化。

- 设备端适配，如回声、录音失败等问题层出不穷。这一点在安卓设备上尤为突出。由于安卓设备厂商众多，每个厂商都会在标准的安卓框架上进行定制化，导致很多可用性问题（访问麦克风失败）和质量问题（如回声、啸叫）。

- 对Native开发支持不够。WebRTC顾名思义，主要面向Web应用，虽然也可以用于Native开发，但是由于涉及到的领域知识（音视频采集、处理、编解码、实时传输等）较多，整个框架设计比较复杂，API粒度也比较细，导致连工程项目的编译都不是一件容易的事。

总而言之，WebRTC虽然提供了一套音视频实时通讯的解决方案，但是在实际应用中，由于网络传输、设备适配以及多方通话上都存在很多问题，效果并不理想。

由此可见，WebRTC是一个优缺点兼有的技术，在拥有诱人的优点的同时，其缺点也十分的严重。在进行WebRTC的开发之前，请根据自身的情况来决定是自主开发还是使用第三方SDK。目前在市场上有很多第三方的音视频SDK可供选择，比如声网、腾讯、Intel、天翼RTC、网易云信、环信、融云、anychat等等，虽然这么多厂商提供的服务都大同小异，但他们的技术架构可能完全不同，比如天翼RTC是WebRTC SDK，腾讯是Native SDK。

由于WebRTC的复杂性和尚未完善性，下面的这些建议结合自己的实际参考：

> 1. 音视频不是公司的核心方向，建议使用第三方SDK。
> 2. 项目时间紧，有多人视频场景，使用场景依赖于手机端，建议使用第三方SDK。
> 3. 公司没人音视频技术人才，建议使用第三方SDK或者技术外包。
> 4. 如果公司实力、财力、人力雄厚，时间也不紧急，可考虑WebRTC集成开发，虽然会有很多坑，但总是能填平的。
> 5. 如果音视频技术是公司的核心方向，但不想花太多时间去研究WebRTC，可直接找熟悉WebRTC的人来培训。
> 6. 项目时间不紧急、没有多人视频需求且音视频质量要求不高，可考虑WebRTC集成开发。

## 直播领域所用协议的现状及其优缺点比较

直播领域常用到的推送协议主要有：

- HTTP-FLV，即将音视频数据封装成FLV，然后通过HTTP协议传输给客户端。这种直播传输实际上就是利用的flv文件的特点，只需要一个matedata和音视频各自header，后面的音视频数据就可以随意按照时间戳传输，当然视频得按照gop段来传输，这种直播数据实际上就是一个无限大的HTTP传输的flv文件，客户端利用flv特性，可以一边接受数据边解码播放。

- RTMP 是 Real Time Messaging Protocol（实时消息传输协议）的首字母缩写，由Adobe公司为Flash播放器和服务器之间音频、视频传输开发的开放协议。该协议基于 TCP，是一个协议族，包括 RTMP 基本协议及 RTMPT/RTMPS/RTMPE 等多种变种。RTMP 是一种设计用来进行实时数据通信的网络协议，主要用来在 Flash/AIR 平台和支持 RTMP 协议的流媒体/交互服务器之间进行音视频和数据通信。支持该协议的软件包括 Adobe Media Server/Ultrant Media Server/red5 等。RTMP其实实质上也是传输的flv格式的数据，同样是flv tag，只不过RTMP在传输上封装了一层，比如RTMP不仅可以直播，也可以推流。RTMP的直播原理同样也是利用了flv文件的特性，只需要一些头信息，后面就可以随意传输音视频数据，达到边传输边播放。**RTMP 是目前主流的流媒体传输协议，广泛用于直播领域，可以说市面上绝大多数的直播产品都采用了这个协议**。

- HTTP Live Streaming（缩写是HLS）是一个由苹果公司提出的基于HTTP的流媒体网络传输协议。是苹果公司QuickTime X和iPhone软件系统的一部分。它的工作原理是把整个流分成一个个小的基于HTTP的文件来下载，每次只下载一些。当媒体流正在播放时，客户端可以选择从许多不同的备用源中以不同的速率下载同样的资源，允许流媒体会话适应不同的数据速率。在开始一个流媒体会话时，客户端会下载一个包含元数据的extended M3U (m3u8)playlist文件，用于寻找可用的媒体流。HLS只请求基本的HTTP报文，与实时传输协议（RTP)不同，HLS可以穿过任何允许HTTP数据通过的防火墙或者代理服务器。它也很容易使用内容分发网络来传输媒体流。苹果公司把HLS协议作为一个互联网草案（逐步提交），在第一阶段中已作为一个非正式的标准提交到IETF。但是，即使苹果偶尔地提交一些小的更新，IETF却没有关于制定此标准的有关进一步的动作。HLS在大部分的浏览器利用html5video是可以直接播放的。

- WebRTC，名称源自网页即时通信（英语：Web Real-Time Communication）的缩写，是一个支持网页浏览器进行实时语音对话或视频对话的 API。它于 2011 年 6 月 1 日开源并在 Google、Mozilla、Opera 支持下被纳入万维网联盟的 W3C 推荐标准。WebRTC默认使用UDP协议(实际上使用的是RTP/RTCP协议)进行音视频数据的传输，但是也可以通过TCP传输。 目前主要应用于视频会议和连麦中。

这几个协议的优缺点比较如下：

| 协议         | 优点                                                         | 缺点                                                         |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **HTTP FLV** | 实时性和RTMP相等； 相比于RTMP省去了一些协议交互时间，首屏时间更短，可拓展的功能更多； 将RTMP封装在HTTP协议之上的，可以更好的穿透防火墙等 | 不支持双向互动；目前在网页上只能用flash或者插件的方式解码播放，而且flash在cpu和内存上都是占用很高。 |
| **RTMP**     | CDN 支持良好，主流的 CDN 厂商都支持；协议简单，在各平台上实现容易，PC flash原生支持；支持双向互动；实时性很好；防HTTP下载。 | 基于TCP，传输成本高，在弱网环境丢包率高的情况下问题显著；不支持浏览器推送；Adobe 私有协议，Adobe已经不再更新； 需要访问1935端口，国内网络情况的恶劣程度，并不是每个网络防火墙都允许1935包通过；目前在网页上只能用flash或者插件的方式解码播放，而且flash在cpu和内存上都是占用很高。 |
| **HLS**      | 跨平台，支持度高，H5浏览器支持比较好，可以直接打开播放；IOS、安卓原生支持；技术实现简单。 | 延迟性比较大。                                               |
| **WebRTC**   | W3C 标准，主流浏览器支持程度高；Google 在背后支撑，并在各平台有参考实现；底层基于 SRTP 和 UDP，弱网情况优化空间大；可以实现点对点通信，通信双方延时低。 | 传统CDN没有ICE、STUN、TURN及类似的服务提供                   |

## WebRTC 的核心组件

- 音视频引擎：OPUS、VP8 / VP9、H264
- 传输层协议：底层传输协议为 UDP
- 媒体协议：SRTP / SRTCP
- 数据协议：DTLS / SCTP
- P2P 内网穿透：STUN / TURN / ICE / Trickle ICE
- 信令与 SDP 协商：HTTP / WebSocket / SIP、 Offer Answer 模型

## WebRTC架构图

![webrtc架构图](/images/imageWebRTC/others/webrtc架构图.png)

**WebRTC architecture (from webrtc.org)**

架构图颜色标识说明：

（1）紫色部分是Web开发者API层；

（2）蓝色实线部分是面向浏览器厂商的API层（也就是红色框标内模块，也是本人专注研究的部分）;

（3）蓝色虚线部分浏览器厂商可以自定义实现。

将WebRTC架构图分解为内部结构简化图和协议栈后如下：

![图1：webrtc内部结构](/images/imageWebRTC/others/webrtc内部结构.png)

![图2：webrtc协议栈](/images/imageWebRTC/others/webrtc协议栈.png)

图1 为 WebRTC 内部结构简化图，最底层是硬件设备，上面是音频捕获模块和视频捕获模块。中间部分为音视频引擎。音频引擎负责音频采集和传输，具有降噪、回声消除等功能。视频引擎负责网络抖动优化，互联网传输编解码优化。在音视频引擎之上是 一套 C++ API，在 C++ 的 API 之上是提供给浏览器的Javascript API。

图2 是 WebRTC 涉及到的协议栈，WebRTC 核心的协议都是在右侧基于 UDP 基础上搭建起来的。其中：

- ICE、STUN、TURN 用于内网穿透, 解决了获取与绑定外网映射地址，以及 keep alive 机制。DTLS 用于对传输内容进行加密，可以看做是 UDP 版的 TLS。由于 WebRTC 对安全比较重视，这一层是必须的。
- SRTP 与 SRTCP 是对媒体数据的封装与传输控制协议。
- SCTP 是流控制传输协议，提供类似 TCP 的特性，SCTP 可以基于 UDP 上构建，在 WebRTC 里是在 DTLS 协议之上。
- RTCPeerConnection 用来建立和维护端到端连接，并提供高效的音视频流传输。
- RTCDataChannel 用来支持端到端的任意二进制数据传输。

## WebRTC架构组件介绍

- **1）Your Web App** 	

  Web开发者开发的程序，Web开发者可以基于集成WebRTC的浏览器提供的web API开发基于视频、音频的实时通信应用。

- **2）Web API** 	

  面向第三方开发者的WebRTC标准API（Javascript），使开发者能够容易地开发出类似于网络视频聊天的web应用，最新的标准化进程可以查看[**这里**](http://dev.w3.org/2011/webrtc/editor/webrtc.html)。 

- **3）WebRTC Native C++ API** 	

  本地C++ API层，使浏览器厂商容易实现WebRTC标准的Web API，抽象地对数字信号过程进行处理。

- **4）Transport / Session**

  传输/会话层，会话层组件采用了 libjingle 库的部分组件实现，无须使用 xmpp/jingle 协议

  - **a. RTP Stack协议栈** 	

    Real Time Protocol 	

  - **b. STUN/ICE** 	

    可以通过 STUN 和 ICE 组件来建立不同类型网络间的呼叫连接。 	

  - **c. Session Management** 	

    一个抽象的会话层，提供会话建立和管理功能。该层协议留给应用开发者自定义实现。

- **5）VoiceEngine** 	

  音频引擎是包含一系列音频多媒体处理的框架，包括从视频采集卡到网络传输端等整个解决方案。 

  PS：VoiceEngine是WebRTC极具价值的技术之一，是Google收购GIPS公司后开源的。在VoIP上，技术业界领先，后面的文章会详细了解

  - **a. iSAC**

    Internet Speech Audio Codec （网络音频编解码）

    针对VoIP和音频流的宽带和超宽带音频编解码器，是WebRTC音频引擎的默认的编解码器 	

    采样频率：

    - `16khz`
    - `24kh`
    - `32khz`（默认为`16khz`） 	

    自适应速率为：

    - `10kbit/s ~ 52kbit/s`

    自适应包大小：

    - `30~60ms` 	

    算法延时：

    - `frame + 3ms`

  - **b. iLBC** 

    Internet Low Bitrate Codec 	

    VoIP音频流的窄带语音编解码器 	

    采样频率：

    - `8khz` 	

    20ms 帧比特率为 `15.2kbps` 

    30ms 帧比特率为 `13.33kbps`

    标准由 IETF RFC3951 和 RFC3952 定义

  - **c. NetEQ for Voice**

    针对音频软件实现的语音信号处理元件

    NetEQ算法：**自适应抖动控制算法以及语音包丢失隐藏算法**。使其能够快速且高解析度地适应不断变化的网络环境，确保音质优美且缓冲延迟最小。是GIPS公司独步天下的技术，能够有效的处理由于网络抖动和语音包丢失时候对语音质量产生的影响。

    PS：NetEQ 也是WebRTC中一个极具价值的技术，对于提高VoIP质量有明显效果，加以AEC\NR\AGC等模块集成使用，效果更好。

  - **d. Acoustic Echo Canceler (AEC)** 	

    回声消除器是一个基于软件的信号处理元件，能实时的去除mic采集到的回声。

  - **e. Noise Reduction (NR)** 	

    噪声抑制也是一个基于软件的信号处理元件，用于消除与相关VoIP的某些类型的背景噪声（嘶嘶声，风扇噪音等等… …）

- **6）VideoEngine** 	

  WebRTC视频处理引擎 	

  VideoEngine是包含一系列视频处理的整体框架，从摄像头采集视频到视频信息网络传输再到视频显示整个完整过程的解决方案。

  - **a. VP8** 	

    视频图像编解码器，是WebRTC视频引擎的默认的编解码器 	VP8 适合实时通信应用场景，因为它主要是针对低延时而设计的编解码器。 	

    PS:VPx编解码器是Google收购ON2公司后开源的，VPx现在是WebM项目的一部分，而WebM项目是Google致力于推动的HTML5标准之一

  - **b. Video Jitter Buffer** 	

    视频抖动缓冲器，可以降低由于视频抖动和视频信息包丢失带来的不良影。

  - **c. Image enhancements** 	

    图像质量增强模块，对网络摄像头采集到的图像进行处理，包括明暗度检测、颜色增强、降噪处理等功能，用来提升视频质量。

## WebRTC核心模块API

### 网络传输模块：libjingle

WebRTC重用了libjingle的一些组件，主要是network和transport组件，关于libjingle的文档资料可以查看[**这里**](http://code.google.com/apis/talk/libjingle/developer_guide.html)。

### 音频、视频图像处理的主要数据结构

**常量\VideoEngine\VoiceEngine**

*注意：以下所有的方法、类、结构体、枚举常量等都在webrtc命名空间里*

| **类、结构体、枚举常量** | **头文件**     | **说明**                                                     |
| ------------------------ | -------------- | ------------------------------------------------------------ |
| **Structures**           | common_types.h | Lists the structures common to the VoiceEngine & VideoEngine |
| **Enumerators**          | common_types.h | List the enumerators common to the VoiceEngine & VideoEngine |
| **Classes**              | common_types.h | List the classes common to VoiceEngine & VideoEngine         |
| class **VoiceEngine**    | voe_base.h     | How to allocate and release resources for the VoiceEngine using factory methods in the VoiceEngine class. It also lists the APIs which are required to enable file tracing and/or traces as callback messages |
| class **VideoEngine**    | vie_base.h     | How to allocate and release resources for the VideoEngine using factory methods in the VideoEngine class. It also lists the APIs which are required to enable file tracing and/or traces as callback messages |

### 音频引擎（VoiceEngine）模块 APIs

*下表列的是目前在 VoiceEngine中可用的sub APIs*

| **sub-API**            | **头文件**             | **说明**                                                     |
| ---------------------- | ---------------------- | ------------------------------------------------------------ |
| **VoEAudioProcessing** | voe_audio_processing.h | Adds support for Noise Suppression (NS), Automatic Gain Control (AGC) and Echo Control (EC). Receiving side VAD is also included. |
| **VoEBase**            | voe_base.h             | Enables full duplex VoIP using G.711.**NOTE:** This API must always be created. |
| **VoECallReport**      | voe_call_report.h      | Adds support for call reports which contains number of dead-or-alive detections, RTT measurements, and Echo metrics. |
| **VoECodec**           | voe_codec.h            | Adds non-default codecs (e.g. iLBC, iSAC, G.722 etc.), Voice Activity Detection (VAD) support. |
| **VoEDTMF**            | voe_dtmf.h             | Adds telephone event transmission, DTMF tone generation and telephone event detection. (Telephone events include DTMF.) |
| **VoEEncryption**      | voe_encryption.h       | Adds external encryption/decryption support.                 |
| **VoEErrors**          | voe_errors.h           | Error Codes for the VoiceEngine                              |
| **VoEExternalMedia**   | voe_external_media.h   | Adds support for external media processing and enables utilization of an external audio resource. |
| **VoEFile**            | voe_file.h             | Adds file playback, file recording and file conversion functions. |
| **VoEHardware**        | voe_hardware.h         | Adds sound device handling, CPU load monitoring and device information functions. |
| **VoENetEqStats**      | voe_neteq_stats.h      | Adds buffer statistics functions.                            |
| **VoENetwork**         | voe_network.h          | Adds external transport, port and address filtering, Windows QoS support and packet timeout notifications. |
| **VoERTP_RTCP**        | voe_rtp_rtcp.h         | Adds support for RTCP sender reports, SSRC handling, RTP/RTCP statistics, Forward Error Correction (FEC), RTCP APP, RTP capturing and RTP keepalive. |
| **VoEVideoSync**       | voe_video_sync.h       | Adds RTP header modification support, playout-delay tuning and monitoring. |
| **VoEVolumeControl**   | voe_volume_control.h   | Adds speaker volume controls, microphone volume controls, mute support, and additional stereo scaling methods. |

### 视频引擎（VideoEngine）模块 APIs

*下表列的是目前在 VideoEngine中可用的sub APIs*

| **sub-API**          | **头文件**           | **说明**                                                     |
| -------------------- | -------------------- | ------------------------------------------------------------ |
| **ViEBase**          | vie_base.h           | Basic functionality for creating a VideoEngine instance, channels and VoiceEngine interaction.**NOTE:** This API must always be created. |
| **ViECapture**       | vie_capture.h        | Adds support for capture device allocation as well as capture device capabilities. |
| **ViECodec**         | vie_codec.h          | Adds non-default codecs, codec settings and packet loss functionality. |
| **ViEEncryption**    | vie_encryption.h     | Adds external encryption/decryption support.                 |
| **ViEErrors**        | vie_errors.h         | Error codes for the VideoEngine                              |
| **ViEExternalCodec** | vie_external_codec.h | Adds support for using external codecs.                      |
| **ViEFile**          | vie_file.h           | Adds support for file recording, file playout, background images and snapshot. |
| **ViEImageProcess**  | vie_image_process.h  | Adds effect filters, deflickering, denoising and color enhancement. |
| **ViENetwork**       | vie_network.h        | Adds send and receive functionality, external transport, port and address filtering, Windows QoS support, packet timeout notification and changes to network settings. |
| **ViERender**        | vie_render.h         | Adds rendering functionality.                                |
| **ViERTP_RTCP**      | vie_rtp_rtcp.h       | Adds support for RTCP reports, SSRS handling RTP/RTCP statistics, NACK/FEC, keep-alive functionality and key frame request methods. |


