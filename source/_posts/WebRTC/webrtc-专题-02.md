---
title: webrtc-专题-02-WebRTC应用
tags:
  - WebRTC
categories:
  - WebRTC
reward: true
abbrlink: 42839
date: 2019-06-19 19:17:23
password: Miaow
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---


## WebRTC浏览器API

WebRTC实现了多个Web API接口，其中三个重要的Web API分别是:

- **[MediaStream](https://www.html5rocks.com/en/tutorials/webrtc/basics/#toc-mediastream)**：通过 MediaStream 的 API 能够通过设备的摄像头及话筒获得视频、音频的同步流。
- **[RTCPeerConnection](https://www.html5rocks.com/en/tutorials/webrtc/basics/#toc-rtcpeerconnection)**：RTCPeerConnection 是 WebRTC 用于构建点对点之间稳定、高效的流传输的组件。
- **[RTCDataChannel](https://www.html5rocks.com/en/tutorials/webrtc/basics/#toc-rtcdatachannel)**：RTCDataChannel 使得浏览器之间（点对点）建立一个高吞吐量、低延时的信道，用于传输任意数据。

这里大致介绍一下这三个API：

### MediaStream (aka getUserMedia)

MediaStream API为WebRTC提供了从设备的摄像头、话筒获取视频、音频流数据的功能.

#### W3C标准

详见：<https://w3c.github.io/mediacapture-main/getusermedia.html>

#### 如何调用？

可以通过 `navigator.getUserMedia()` 这个方法来调用，这个方法接受三个参数：

- 一个约束对象（constraints object），这个后面会单独讲。

- 一个调用成功的回调函数，如果调用成功，传递给它一个流对象。

- 一个调用失败的回调函数，如果调用失败，传递给它一个错误对象。

#### 浏览器兼容性处理

由于浏览器实现不同，他们经常会在实现标准版本之前，在方法前面加上前缀，所以一个兼容版本就像这样：

```js
var getUserMedia = (navigator.getUserMedia || 
                    navigator.webkitGetUserMedia || 
                    navigator.mozGetUserMedia || 
                    navigator.msGetUserMedia);
```

####  一个超级简单的例子

这里写一个超级简单的例子，用来展现 `getUserMedia` 的效果：

<details><summary>简单的例子</summary>

```html
<!DOCTYPE html>
<html>
<head>
  	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>GetUserMedia实例</title>
</head>
<body>
    <video id="video" autoplay></video>
</body>

<script type="text/javascript">
    var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    getUserMedia.call(navigator, {
        video: true,
        audio: true
    }, function(localMediaStream) {
        var video = document.getElementById('video');
        video.src = window.URL.createObjectURL(localMediaStream);
        video.onloadedmetadata = function(e) {
            console.log("Label: " + localMediaStream.label);
            console.log("AudioTracks" , localMediaStream.getAudioTracks());
            console.log("VideoTracks" , localMediaStream.getVideoTracks());
        };
    }, function(e) {
        console.log('Rejected!', e);
    });
 
/*  
//或：
'use strict';

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var constraints = { // 音频、视频约束
  audio: true, // 指定请求音频Track
  video: {  // 指定请求视频Track
      mandatory: { // 对视频Track的强制约束条件
          width: {min: 320},
          height: {min: 180}
      },
      optional: [ // 对视频Track的可选约束条件
          {frameRate: 30}
      ]
  }
};

function successCallback(localMediaStream) {
  var video = document.querySelector('video');
  if (window.URL) {
    video.src = window.URL.createObjectURL(localMediaStream);
  } else {
    video.src = localMediaStream;
  }
  video.onloadedmetadata = function(e) {
            console.log("Label: " + localMediaStream.label);
            console.log("AudioTracks" , localMediaStream.getAudioTracks());
            console.log("VideoTracks" , localMediaStream.getVideoTracks());
        };
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);
 */ 
</script>

</html>
```

</details>

将这段内容保存在一个HTML文件中，放在服务器上。用较新版本的Opera、Firefox、Chrome打开，在浏览器弹出询问是否允许访问摄像头和话筒，选同意，浏览器上就会出现摄像头所拍摄到的画面了.

注意，HTML文件要放在服务器上，否则会得到一个 `NavigatorUserMediaError` 的错误，显示 `PermissionDeniedError`。

这里使用 **`getUserMedia`** 获得流之后，需要将其输出，一般是绑定到 **`video`** 标签上输出，需要使用**`window.URL.createObjectURL(localMediaStream)`**来创造能在 `video` 中使用 `src` 属性播放的 Blob URL，注意在 `video` 上加入 `autoplay` 属性，否则只能捕获到一张图片。

流创建完毕后可以通过 **`label`** 属性来获得其唯一的标识，还可以通过 **`getAudioTracks()`** 和 **`getVideoTracks()`** 方法来获得流的追踪对象数组（如果没有开启某种流，它的追踪对象数组将是一个空数组）

在 JS 中，我们通过 `getUserMedia` 函数来处理音频和视频，该函数接收三个参数，分别是音视频的约束，成功的回调以及失败的回调。

在底层，浏览器通过音频和视频引擎对捕获的原始音频和视频流加以处理，除了对画质和音质增强之外，还得保证音频和视频的同步。

由于音频和视频是用来传输的，因此，发送方还要适应不断变化的带宽和客户端之间的网络延迟调整输出的比特率。

对于接收方来说，则必须实时解码音频和视频流，并适应网络抖动和时延。其工作原理如下图所示：

![](/images/imageWebRTC/others/内部WebRTC-API.png)

如上面源码中成功回调的 `localMediaStream` 对象中携带者一个或多个同步的 `Track`，如果你同时在约束中设置了音频和视频为 `true`，则在 `localMediaStream` 中会携带有音频 `Track` 和视频 `Track`，每个 `Track` 在时间上是同步的。

`localMediaStream` 的输出可以被发送到一或多个目的地：本地的音频或视频元素、后期处理的 JavaScript 代理，或者远程另一端。如下图所示：

![](/images/imageWebRTC/others/音视频采集输出.png)

#### 约束对象(Constraints)

约束对象可以被设置在 `getUserMedia()` 和 `RTCPeerConnection` 的 `addStream` 方法中，这个约束对象是WebRTC 用来指定接受什么样的流的，其中可以定义如下属性：

- **video** : 是否接受视频流
- **audio**：是否接受音频流
- **MinWidth** : 视频流的最小宽度
- **MaxWidth**：视频流的最大宽度
- **MinHeight**：视频流的最小高度
- **MaxHiehgt**：视频流的最大高度
- **MinAspectRatio**：视频流的最小宽高比
- **MaxAspectRatio**：视频流的最大宽高比
- **MinFramerate**：视频流的最小帧速率
- **MaxFramerate**：视频流的最大帧速率

### RTCPeerConnection

在获取到音频和视频流后，下一步要做的就是将其发送出去。但这个跟 client-server 模式不同，这是 client-client 之间的传输，因此，在协议层面就必须解决 NAT 穿透问题，否则传输就无从谈起。

另外，由于 WebRTC 主要是用来解决实时通信的问题，可靠性并不是很重要，因此，WebRTC 使用 UDP 作为传输层协议：低延迟和及时性才是关键。

在更深入讲解之前，我们先来思考一下，是不是只要打开音频、视频，然后发送 UDP 包就搞定了？

当然没那么简单，除了要解决我们上面说的 NAT 穿透问题之外，还需要为每个流协商参数，对用户数据进行加密，并且需要实现拥塞和流量控制。

我们来看一张WebRTC的分层协议图：

![](/images/imageWebRTC/others/webrtc分层协议.png)

ICE、STUN 和 TURN 是通过 UDP 建立并维护端到端连接所必需的；

SDP 是一种数据格式，用于端到端连接时协商参数；

DTLS 用于保障传输数据的安全；

SCTP 和 SRTP 属于应用层协议，用于在 UDP 之上提供不同流的多路复用、拥塞和流量控制，以及部分可靠的交付和其他服务。

ICE（Interactive Connectivity Establishment，交互连接建立）：由于端与端之间存在多层防火墙和 NAT 设备阻隔，因此我们需要一种机制来收集两端之间公共线路的 IP，而 ICE 则是干这件事的好帮手。

- ICE 代理向操作系统查询本地 IP 地址
- 如果配置了 STUN 服务器，ICE 代理会查询外部 STUN 服务器，以取得本地端的公共 IP 和端口
- 如果配置了 TURN 服务器，ICE 则会将 TURN 服务器作为一个候选项，当端到端的连接失败，数据将通过指定的中间设备转发。

WebRTC 使用 SDP（Session Description Protocol，会话描述协议）描述端到端连接的参数。 SDP 不包含媒体本身的任何信息，仅用于描述 "会话状况"，表现为一系列的连接属性：要交换的媒体类型（音频、视频及应用数据）、网络传输协议、使用的编解码器及其设置、带宽及其他元数据。

DTLS 对 TLS 协议进行了扩展，为每条握手记录明确添加了偏移字段和序号，这样就满足了有序交付的条件，也能让大记录可以被分段成多个分组并在另一端再进行组装。 DTLS 握手记录严格按照 TLS 协议规定的顺序传输，顺序不对就报错。

最后，DTLS 还要处理丢包问题：两端都是用计时器，如果预定时间没有收到应答，就重传握手记录。 为保证过程完整，两端都要生成自己签名的证书，然后按照常规的 TLS 握手协议走。但这样的证书不能用于验证身份，因为没有要验证的信任链。因此，在必要情况下， 应用必须自己参与各端的身份验证：

- 应用可以通过登录来验证用户
- 每一端也可以在生成 SDP 提议/应答时指定各自的 "身份颁发机构"，等对端接收到 SDP 消息后，可以联系指定的身份颁发机构验证收到的证书

SRTP 为通过 IP 网络交付音频和视频定义了标准的分组格式。SRTP 本身并不对传输数据的及时性、可靠性或数据恢复提供任何保证机制， 它只负责把数字化的音频采样和视频帧用一些元数据封装起来，以辅助接收方处理这些流。

SCTP 是一个传输层协议，直接在 IP 协议上运行，这一点跟 TCP 和 UDP 类似。不过在 WebRTC 这里，SCTP 是在一个安全的 DTLS 信道中运行，而这个信道又运行在 UDP 之上。 由于 WebRTC 支持通过 DataChannel API 在端与端之间传输任意应用数据，而 DataChannel 就依赖于 SCTP。

![](/images/imageWebRTC/others/几种传输比较.png)

上讲了这么多，终于到我们的主角 `RTCPeerConnection`，`RTCPeerConnection` 接口负责维护每一个端到端连接的完整生命周期：

- `RTCPeerConnection` 管理穿越 NAT 的完整 ICE 工作流
- `RTCPeerConnection` 发送自动（STUN）持久化信号
- `RTCPeerConnection` 跟踪本地流
- `RTCPeerConnection` 跟踪远程流
- `RTCPeerConnection` 按需触发自动流协商
- `RTCPeerConnection` 提供必要的 API，以生成连接提议，接收应答，允许我们查询连接的当前状态，等等

![](/images/imageWebRTC/others/RTCPeerConnection.png)

WebRTC使用RTCPeerConnection来在浏览器之间传递流数据，这个流数据通道是点对点的，不需要经过服务器进行中转。但是这并不意味着我们能抛弃服务器，我们仍然需要它来为我们传递信令（signaling）来建立这个信道。WebRTC没有定义用于建立信道的信令的协议：信令并不是RTCPeerConnection API的一部分。

既然没有定义具体的信令的协议，我们就可以选择任意方式（AJAX、WebSocket），采用任意的协议（SIP、XMPP）来传递信令，建立信道。比如可以使用node的ws模块，在WebSocket上传递信令。

#### 浏览器兼容处理

还是前缀不同的问题，采用和上面类似的方法：

```javascript
var PeerConnection = (window.PeerConnection ||
                    window.webkitPeerConnection00 || 
                    window.webkitRTCPeerConnection || 
                    window.mozRTCPeerConnection);
```

#### 创建和使用

<details><summary>案例代码</summary>

```javascript
//使用Google的stun服务器
var iceServer = {
    "iceServers": [{
        "url": "stun:stun.l.google.com:19302"
    }]
};
//兼容浏览器的getUserMedia写法
var getUserMedia = (navigator.getUserMedia ||
                    navigator.webkitGetUserMedia || 
                    navigator.mozGetUserMedia || 
                    navigator.msGetUserMedia);
//兼容浏览器的PeerConnection写法
var PeerConnection = (window.PeerConnection ||
                    window.webkitPeerConnection00 || 
                    window.webkitRTCPeerConnection || 
                    window.mozRTCPeerConnection);
//与后台服务器的WebSocket连接
var socket = __createWebSocketChannel();
//创建PeerConnection实例
var pc = new PeerConnection(iceServer);
//发送ICE候选到其他客户端
pc.onicecandidate = function(event){
    socket.send(JSON.stringify({
        "event": "__ice_candidate",
        "data": {
            "candidate": event.candidate
        }
    }));
};
//如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
pc.onaddstream = function(event){
    someVideoElement.src = URL.createObjectURL(event.stream);
};
//获取本地的媒体流，并绑定到一个video标签上输出，并且发送这个媒体流给其他客户端
getUserMedia.call(navigator, {
    "audio": true,
    "video": true
}, function(stream){
    //发送offer和answer的函数，发送本地session描述
    var sendOfferFn = function(desc){
            pc.setLocalDescription(desc);
            socket.send(JSON.stringify({ 
                "event": "__offer",
                "data": {
                    "sdp": desc
                }
            }));
        },
        sendAnswerFn = function(desc){
            pc.setLocalDescription(desc);
            socket.send(JSON.stringify({ 
                "event": "__answer",
                "data": {
                    "sdp": desc
                }
            }));
        };
    //绑定本地媒体流到video标签用于输出
    myselfVideoElement.src = URL.createObjectURL(stream);
    //向PeerConnection中加入需要发送的流
    pc.addStream(stream);
    //如果是发送方则发送一个offer信令，否则发送一个answer信令
    if(isCaller){
        pc.createOffer(sendOfferFn);
    } else {
        pc.createAnswer(sendAnswerFn);
    }
}, function(error){
    //处理媒体流创建失败错误
});
//处理到来的信令
socket.onmessage = function(event){
    var json = JSON.parse(event.data);
    //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
    if( json.event === "__ice_candidate" ){
        pc.addIceCandidate(new RTCIceCandidate(json.data.candidate));
    } else {
         pc.setRemoteDescription(new RTCSessionDescription(json.data.sdp));
    }
};
```

</details>

### RTCDataChannel

既然能建立点对点的信道来传递实时的视频、音频数据流，为什么不能用这个信道传一点其他数据呢？

`RTCDataChannel` API就是用来干这个的，基于它我们可以在浏览器之间传输任意数据。`DataChannel` 是建立在 `PeerConnection` 上的，不能单独使用。建立 `RTCPeerConnection` 连接之后，两端可以打开一或多个信道交换文本或二进制数据。

`DataChannel` 和 `WebSocket` 的区别如下：

![](/images/imageWebRTC/others/DataChannel和WebSocket的区别.png)

#### 使用DataChannel

我们可以使用 `channel = pc.createDataCHannel(“someLabel”)` ;来在 `PeerConnection` 的实例上创建 `Data Channel`，并给与它一个标签。

`DataChannel` 使用方式几乎和 `WebSocket` 一样，有几个事件：

- `onopen`
- `onclose`
- `onmessage`
- `onerror`

同时它有几个状态，可以通过 `readyState` 获取：

- `connecting` : 浏览器之间正在试图建立channel
- `open`：建立成功，可以使用send方法发送数据了
- `closing`：浏览器正在关闭channel
- `closed`：channel已经被关闭了

两个暴露的方法:

- `close()` : 用于关闭channel
- `send()`：用于通过channel向对方发送数据

<details><summary>示例demo如下：
```javascript
var ice = {
    'iceServers': [
        {'url': 'stun:stun.l.google.com:19302'},   // google公共测试服务器
        // {"url": "turn:user@turnservera.com", "credential": "pass"}
    ]
};

// var signalingChannel =  new SignalingChannel();

var pc = new RTCPeerConnection(ice);

navigator.getUserMedia({'audio': true}, gotStream, logError);

function gotStream(stram) {
    pc.addStream(stram);

    pc.createOffer().then(function(offer){
        pc.setLocalDescription(offer);
    });
}

pc.onicecandidate = function(evt) {
    // console.log(evt);
    if(evt.target.iceGatheringState == 'complete') {
        pc.createOffer().then(function(offer){
            // console.log(offer.sdp);
            // signalingChannel.send(sdp);
        })
    }
}

function handleChannel(chan) {
    console.log(chan);
    chan.onerror = function(err) {}
    chan.onclose = function() {}
    chan.onopen = function(evt) {
        console.log('established');
        chan.send('DataChannel connection established.');
    }

    chan.onmessage = function(msg){
        // do something
    }
}

// 以合适的交付语义初始化新的DataChannel
var dc = pc.createDataChannel('namedChannel', {reliable: false});

handleChannel(dc);
pc.onDataChannel = handleChannel;

function logError(){
    console.log('error');
}
```

</details>

#### 通过Data Channel发送文件大致思路

JavaScript 已经提供了 File API 从 `input[ type= ‘file’]` 的元素中提取文件，并通过 **`FileReader`** 来将文件的转换成 `DataURL`，这也意味着我们可以将 `DataURL` 分成多个碎片来通过 Channel 来进行文件传输。

## WebRTC信令交换

本节讲述了WebRTC中所涉及的信令交换以及聊天室中的信令交换，主要内容来自于：[WebRTC in the real world: STUN, TURN and signaling](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)

### WebRTC的服务器

WebRTC提供浏览器之间的点对点信道进行数据传输，但是并不意味着WebRTC不需要服务器，建立这个信道，必须有服务器的参与。WebRTC需要服务器对其进行四方面的功能支持：

1. 用户发现以及通信；
2. 信令传输：浏览器之间交换建立通信的元数据（信令）；
3. NAT 防火墙穿越；
4. 如果点对点通信建立失败，可以作为中转服务器。

### NAT/防火墙穿越技术

#### NAT简介

NAT（Network Address Translation，网络地址转换）属接入广域网(WAN)技术，是一种将私有（保留）地址转化为合法 IP 地址的转换技术，主要用于实现私有网络访问公共网络的功能，它被广泛应用于各种类型 Internet 接入方式和各种类型的网络中。原因很简单，NAT 不仅完美地解决了 lP 地址不足的问题，而且还能够有效地避免来自网络外部的攻击，隐藏并保护网络内部的计算机。

#### NAT分类

根据 Stun 协议(RFC3489)，NAT 大致分为下面四类：

**1) Full Cone**（全锥型）

这种 NAT 内部的机器 A 连接过外网机器 C 后，NAT 会打开一个端口。然后外网的任何发到这个打开的端口的 UDP 数据报都可以到达 A，不管是不是 C 发过来的。

例如：

​```shell
A: 192.168.8.100 
NAT: 202.100.100.100 
C: 292.88.88.88 
A(192.168.8.100:5000) -> NAT(202.100.100.100:8000) -> C(292.88.88.88:2000) 
任何发送到 NAT(202.100.100.100:8000) 的数据都可以到达 A(192.168.8.100:5000)
```

**2) Restricted Cone**（受限锥型）

这种 NAT 内部的机器 A 连接过外网的机器 C 后，NAT 打开一个端口，然后 C 可以用任何端口和 A 通信，其他的外网机器不行。

例如：

```shell
A:192.168.8.100 
NAT:202.100.100.100 
C:292.88.88.88 
A(192.168.8.100:5000) -> NAT(202.100.100.100 : 8000) -> C(292.88.88.88:2000) 
任何从 C 发送到 NAT(202.100.100.100:8000)的数据都可以到达 A(192.168.8.100:5000)
```

**3) Port Restricted Cone**（端口受限锥型）

这种 NAT 内部的机器 A 连接过外网的机器 C 后，NAT打开一个端口，然后 C 可以用原来的端口和 A 通信，其他的外网机器不行。

例如：

```shell
A:192.168.8.100 
NAT:202.100.100.100 
C:292.88.88.88 
A(192.168.8.100:5000) -> NAT(202.100.100.100 : 8000) -> C(292.88.88.88:2000) C(202.88.88.88:2000)发送到 NAT(202.100.100.100:8000)的数据都可以到达A(192.168.8.100:5000)
```

以上三种 NAT 通称 Cone NAT(锥型NAT)。我们只能用这种 NAT 进行 UDP 打洞。

**4) Symmetic**（对称型）

对于这种 NAT 连接不同的外部目标，原来 NAT 打开的端口会变化，而 Cone NAT 不会。虽然可以用端口猜测，但是成功的概率很小。因此放弃这种 NAT 的 UDP 打洞。

#### UDP hole punching（UDP打洞）

对于 Cone NAT，要采用 UDP 打洞，需要一个公网机器 C 来充当 ”介绍人”，内网的 A、B 先分别和 C 通信，打开各自的 NAT 端口，C 这个时候知道 A、B 的公网 `IP:Port`，现在 A 和 B 想直接连接，比如 A 给 B 发，除非 B 是 Full Cone，否则不能通信。反之亦然，但是我们可以这样：

A 要连接 B，A 给 B 发一个 UD P包，同时同，A 让那个介绍人给 B 发一个命令，让 B 同时给 A 发一个 UDP 包，这样双方的 NAT 都会记录对方的 IP，然后就会允许互相通信。

#### NAT穿越

我们目前大部分人连接互联网时都处于防火墙后面或者配置私有子网的家庭(NAT)路由器后面, 这就导致我们的计算机的 IP 地址不是广域网 IP 地址, 故而不能相互之间直接通讯。 

正因为这样的一个场景, 我们得想办法去穿越这些防火墙或者家庭(NAT)路由器，让两个同处于私有网络里的计算机能够通讯起来。建立点对点信道的一个常见问题，也就是 NAT 穿越技术问题，即在处于使用了 NAT 设备的私有 TCP/IP 网络中的主机之间需要建立连接时需要使用 NAT 穿越技术。

以往在 VoIP 领域经常会遇到这个问题。目前已经有很多 NAT 穿越技术，但没有一项是完美的，因为 NAT 的行为是非标准化的。这些技术中大多使用了一个公共服务器，这个服务使用了一个从全球任何地方都能访问得到的 IP 地址。

![](/images/imageWebRTC/others/NAT穿越.png)

STUN(Simple Traversal of UDP over NATs,NAT 的UDP简单穿越)，STUN 协议服务器就是用来解决这些问题:

- 探测和发现通讯对方是否躲在防火墙或者NAT路由器后面。
- 确定内网客户端所暴露在外的广域网的 IP 和端口以及 NAT 类型等信息; STUN 服务器利用这些信息协助不同内网的计算机之间建立点对点的 UDP 通讯.

STUN 协议可以很好的解决一般家用(NAT)路由器环境的打洞问题, 但是对于大部分的企业的网络环境就不是很好了。

这时需要一个新的解决方案: TURN（Traversal Using Relay NAT，中继 NAT 实现的穿透）允许在 TCP 或 UDP 的连线上跨越 NAT 或防火墙。

TURN 是一个 Client-Server 协议。TURN 的 NAT 穿透方法与 STUN 类似，都是通过取得应用层中的公有地址达到 NAT 穿透, 但实现 TURN client 的终端必须在通讯开始前与 TURN server 进行交互, 并要求 TURN server 产生 "relay port", 也就是 relayed-transport-address. 这时 TURN server 会建立 peer, 即远端端点（remote endpoints）, 开始进行中继（relay）的动作, TURN client 利用 relay port 将资料传送至 peer, 再由 peer 转传到另一方的 TURN client. 通过服务器新产生的 peer 来进行数据的中转。

ICE 就是综合前面 2 种协议的综合性 NAT 穿越解决方案。在 `RTCPeeConnection` 中，使用 ICE 框架来保证 `RTCPeerConnection` 能实现 NAT 穿越。

ICE，全名叫交互式连接建立（Interactive Connectivity Establishment）, 一种综合性的 NAT 穿越技术，它是一种框架，可以整合各种 NAT 穿越技术如 STUN、TURN。ICE 会先使用 STUN，尝试建立一个基于 UDP 的连接，如果失败了，就会去尝试 TCP（先尝试 HTTP，然后尝试 HTTPS），如果依旧失败 ICE 就会使用一个中继的 TURN 服务器。

通过 `offer/answer` 模型建立基于 UDP 的通讯。ICE 是 `offer/answer` 模型的扩展，通过在 `offer` 和 `answer` 的 SDP(Session Description Protocol)里面包含多种 IP 地址和端口，然后对本地 SDP 和远程 SDP 里面的 IP 地址进行配对，然后通过 P2P 连通性检查进行连通性测试工作，如果测试通过即表明该传输地址对可以建立连接。

其中 IP 地址和端口（也就是地址）有以下几种：

- 本机地址
- 通过STUN服务器反射后获取的server-reflexive地址（内网地址被NAT映射后的地址）、relayed地址（和TURN转发服务器相对应的地址）及Peer reflexive地址等。

我们可以使用 Google 的 STUN 服器：**`stun:stun.l.google.com:19302`**，于是乎，一个整合了 ICE 框架的架构应该长这个样子 ：

![Finding connection candidates（找到联系候选人）](/images/imageWebRTC/others/Finding_connection_candidates.png)

![WebRTC data pathways（WebRTC数据通路）](/images/imageWebRTC/others/WebRTC_data_pathways.png)

### 为什么需要信令？

我们需要通过一系列的信令来建立浏览器之间的通信。而具体需要通过信令交换哪些内容呢？这里大概列了一下：

- 用来控制通信开启或者关闭的连接控制消息
- 发生错误时用来彼此告知的消息
- 媒体适配：媒体流元数据，比如像解码器、解码器的配置、带宽、媒体类型等等
- 用来建立安全连接的关键数据
- 网络配置：外界所看到的的网络上的数据，比如 IP 地址、端口等

这些信息的交换应该在点对点的流传输之前就全部完成。在建立连接之前，浏览器之间显然没有办法传递数据。所以我们需要通过服务器的中转，在浏览器之间传递这些数据，然后建立浏览器之间的点对点连接。但是WebRTC API中并没有实现这些。

### 为什么WebRTC不去实现信令交换？

不去由 WebRTC 实现信令交换的原因很简单：

- WebRTC 标准的制定者们希望能够最大限度地兼容已有的成熟技术。具体的连接建立方式由一种叫JSEP（JavaScript Session Establishment Protocol）的协议来规定，使用 JSEP 有两个好处：
  - 在 JSEP 中，需要交换的关键信息是多媒体会话描述（multimedia session description）。由于开发者在其所开发的应用程序中信令所使用的协议不同（SIP 或是 XMPP 或是开发者自己定义的协议），WebRTC建立呼叫的思想建立在媒体流控制层面上，从而与上层信令传输相分离，防止相互之间的信令污染。只要上层信令为其提供了多媒体会话描述符这样的关键信息就可以建立连接，不管开发者用何种方式来传递
  - JSEP 的架构同时也避免了在浏览器上保存连接的状态，防止其像一个状态机一样工作。由于页面经常被频繁的刷新，如果连接的状态保存在浏览器中，每次刷新都会丢失。使用 JSEP 能使得状态被保存在服务器上。

![JSEP architecture](/images/imageWebRTC/others/JSEP_architecture.png)

### 会话描述协议（Session Description Protocol）

JSEP 将客户端之间传递的信令分为两种：

- `offer信令`
- `answer信令`

他们主要内容的格式都遵循会话描述协议（Session Description Protocal，简称 SDP）。一个 SDP 的信令的内容大致上如下：

<details><summary>SDP信令内容</summary>

```shell
v=0
o=- 7806956 075423448571 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE audio video data
a=msid-semantic: WMS 5UhOcZZB1uXtVbYAU5thB0SpkXbzk9FHo30g
m=audio 1 RTP/SAVPF 111 103 104 0 8 106 105 13 126
c=IN IP4 0.0.0.0
a=rtcp:1 IN IP4 0.0.0.0
a=ice-ufrag:grnpQ0BSTSnBLroq
a=ice-pwd:N5i4DZKMM2L7FEYnhO8V7Kg5
a=ice-options:google-ice
a=fingerprint:sha-256 01:A3:18:0E:36:5E:EF:24:18:8C:8B:0C:9E:B0:84:F6:34:E9:42:E3:0F:43:64:ED:EC:46:2C:3C:23:E3:78:7B
a=setup:actpass
a=mid:audio
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=recvonly
a=rtcp-mux
a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:qzcKu22ar1+lYah6o8ggzGcQ5obCttoOO2IzXwFV
a=rtpmap:111 opus/48000/2
a=fmtp:111 minptime=10
a=rtpmap:103 ISAC/16000
a=rtpmap:104 ISAC/32000
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:106 CN/32000
a=rtpmap:105 CN/16000
a=rtpmap:13 CN/8000
a=rtpmap:126 telephone-event/8000
a=maxptime:60
m=video 1 RTP/SAVPF 100 116 117
c=IN IP4 0.0.0.0
a=rtcp:1 IN IP4 0.0.0.0
a=ice-ufrag:grnpQ0BSTSnBLroq
a=ice-pwd:N5i4DZKMM2L7FEYnhO8V7Kg5
a=ice-options:google-ice
a=fingerprint:sha-256 01:A3:18:0E:36:5E:EF:24:18:8C:8B:0C:9E:B0:84:F6:34:E9:42:E3:0F:43:64:ED:EC:46:2C:3C:23:E3:78:7B
a=setup:actpass
a=mid:video
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=sendrecv
a=rtcp-mux
a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:qzcKu22ar1+lYah6o8ggzGcQ5obCttoOO2IzXwFV
a=rtpmap:100 VP8/90000
a=rtcp-fb:100 ccm fir
a=rtcp-fb:100 nack
a=rtcp-fb:100 goog-remb
a=rtpmap:116 red/90000
a=rtpmap:117 ulpfec/90000
a=ssrc:3162115896 cname:/nERF7Ern+udqf++
a=ssrc:3162115896 msid:5UhOcZZB1uXtVbYAU5thB0SpkXbzk9FHo30g 221b204e-c9a0-4b01-b361-e17e9bf8f639
a=ssrc:3162115896 mslabel:5UhOcZZB1uXtVbYAU5thB0SpkXbzk9FHo30g
a=ssrc:3162115896 label:221b204e-c9a0-4b01-b361-e17e9bf8f639
m=application 1 DTLS/SCTP 5000
c=IN IP40.0.0.0
a=ice-ufrag:grnpQ0BSTSnBLroq
a=ice-pwd:N5i4DZKMM2L7FEYnhO8V7Kg5
a=ice-options:google-ice
a=fingerprint:sha-256 01:A3:18:0E:36:5E:EF:24:18:8C:8B:0C:9E:B0:84:F6:34:E9:42:E3:0F:43:64:ED:EC:46:2C:3C:23:E3:78:7B
a=setup:actpass
a=mid:data
a=sctpmap:5000 webrtc-datachannel 1024
```

</details>

它是一个在点对点连接中描述自己的字符串，我们可以将其封装在 JSON 中进行传输，在 `PeerConnection` 建立后将其通过服务器中转后，将自己的 SDP 描述符和对方的 SDP 描述符交给 `PeerConnection` 就行了。若想深入了解，可以参考[SDP for the WebRTC draft-nandakumar-rtcweb-sdp-04](http://datatracker.ietf.org/doc/draft-nandakumar-rtcweb-sdp/?include_text=1)进行解析。

### 令与RTCPeerConnection建立

在上一章节中介绍过，WebRTC 使用 `RTCPeerConnection` 来在浏览器之间传递流数据，在建立 `RTCPeerConnection` 实例之后，想要使用其建立一个点对点的信道，我们需要做两件事：

- 确定本机上的媒体流的特性，比如分辨率、编解码能力啥的（SDP 描述符）

- 连接两端的主机的网络地址（ICE Candidate）

需要注意的是，由于连接两端的主机都可能在内网或是在防火墙之后，我们需要一种对所有联网的计算机都通用的定位方式。这其中就涉及 NAT/防火墙穿越技术，以及 WebRTC 用来达到这个目的所 ICE 框架。

### 通过offer和answer交换SDP描述符

大致上在两个用户（甲和乙）之间建立点对点连接流程应该是这个样子（这里不考虑错误的情况， `RTCPeerConnection` 简称 PC）：

- 甲和乙各自建立一个 PC 实例
- 甲通过 PC 所提供的 `createOffer()` 方法建立一个包含甲的 SDP 描述符的 `offer信令`
- 甲通过 PC 所提供的 `setLocalDescription()` 方法，将甲的 SDP 描述符交给甲的 PC 实例
- 甲将 `offer信令` 通过服务器发送给乙
- 乙将甲的 `offer信令` 中所包含的的 SDP 描述符提取出来，通过 PC 所提供的 `setRemoteDescription()` 方法交给乙的 PC 实例
- 乙通过 PC 所提供的 `createAnswer()` 方法建立一个包含乙的 SDP 描述符 `answer信令`
- 乙通过 PC 所提供的 `setLocalDescription()` 方法，将乙的 SDP 描述符交给乙的 PC 实例
- 乙将 `answer信令` 通过服务器发送给甲
- 甲接收到乙的 `answer信令` 后，将其中乙的 SDP 描述符提取出来，调用 `setRemoteDescripttion()` 方法交给甲自己的 PC 实例

通过在这一系列的信令交换之后，甲和乙所创建的 PC 实例都包含甲和乙的 SDP 描述符了，完成了两件事的第一件。我们还需要完成第二件事——获取连接两端主机的网络地址。

### 通过ICE框架建立NAT/防火墙穿越的连接

这个网络地址应该是能从外界直接访问，WebRTC 使用 ICE 框架来获得这个地址。`RTCPeerConnection` 在创立的时候可以将 ICE 服务器的地址传递进去，如：

```javascript
var iceServer = {
    "iceServers": [{
        "url": "stun:stun.l.google.com:19302"
    }]
};
var pc = new RTCPeerConnection(iceServer);
```

当然这个地址也需要交换，还是以甲乙两位为例，交换的流程如下（`RTCPeerConnection` 简称 PC）：

- 甲、乙各创建配置了 ICE 服务器的 PC 实例，并为其添加 `onicecandidate` 事件回调
- 当网络候选可用时，将会调用 `onicecandidate` 函数
- 在回调函数内部，甲或乙将网络候选的消息封装在 ICE Candidate 信令中，通过服务器中转，传递给对方
- 甲或乙接收到对方通过服务器中转所发送过来 ICE Candidate 信令时，将其解析并获得网络候选，将其通过 PC 实例的 `addIceCandidate()` 方法加入到 PC 实例中

这样连接就创立完成了，可以向 `RTCPeerConnection` 中通过 `addStream()` 加入流来传输媒体流数据。将流加入到 `RTCPeerConnection` 实例中后，对方就可以通过 `onaddstream` 所绑定的回调函数监听到了。调用 `addStream()` 可以在连接完成之前，在连接建立之后，对方一样能监听到媒体流。

### 聊天室中的信令

上面是两个用户之间的信令交换流程，但我们需要建立一个多用户在线视频聊天的聊天室。所以需要进行一些扩展，来达到这个要求。

#### 用户操作

首先需要确定一个用户在聊天室中的操作大致流程：

1. 打开页面连接到服务器上
2. 进入聊天室
3. 与其他所有已在聊天室的用户建立点对点的连接，并输出在页面上
4. 若有聊天室内的其他用户离开，应得到通知，关闭与其的连接并移除其在页面中的输出
5. 若又有其他用户加入，应得到通知，建立于新加入用户的连接，并输出在页面上
6. 离开页面，关闭所有连接

从上面可以看出来，除了点对点连接的建立，还需要服务器至少做如下几件事：

1. 新用户加入房间时，发送新用户的信息给房间内的其他用户
2. 新用户加入房间时，发送房间内的其他用户信息给新加入房间的用户
3. 用户离开房间时，发送离开用户的信息给房间内的其他用户

#### 实现思路

以使用 WebSocket 为例，上面用户操作的流程可以进行以下修改：

1. 浏览器与服务器建立 WebSocket 连接
2. 发送一个加入聊天室的信令（`join`），信令中需要包含用户所进入的聊天室名称
3. 服务器根据用户所加入的房间，发送一个其他用户信令（`peers`），信令中包含聊天室中其他用户的信息，浏览器根据信息来逐个构建与其他用户的点对点连接
4. 若有用户离开，服务器发送一个用户离开信令（`remove_peer`），信令中包含离开的用户的信息，浏览器根据信息关闭与离开用户的信息，并作相应的清除操作
5. 若有新用户加入，服务器发送一个用户加入信令（`new_peer`），信令中包含新加入的用户的信息，浏览器根据信息来建立与这个新用户的点对点连接
6. 用户离开页面，关闭 WebSocket 连接

#### 服务器实现

由于用户可以只是建立连接，可能还没有进入具体房间，所以首先我们需要一个容器来保存所有用户的连接，同时监听用户是否与服务器建立了 WebSocket 的连接：

```javascript
var server = new WebSocketServer();
var sockets = [];

server.on('connection', function(socket){
    socket.on('close', function(){
        var i = sockets.indexOf(socket);
        sockets.splice(i, 1);
        //关闭连接后的其他操作
    });
    sockets.push(socket);
    //连接建立后的其他操作
});
```

由于有房间的划分，所以我们需要在服务器上建立一个容器，用来保存房间内的用户信息。显然对象较为合适，键为房间名称，值为用户信息列表。

同时我们需要监听上面所说的用户加入房间的信令（`join`），新用户加入之后需要向新用户发送房间内其他用户信息（`peers`）和向房间内其他用户发送新用户信息（`new_peer`），以及用户离开时向其他用户发送离开用户的信息（`remove_peer`）:

于是乎代码大致就变成这样：

<details><summary>服务器实现</summary>

```java
var server = new WebSocketServer();
var sockets = [];
var rooms = {};

/*
join信令所接收的格式
{
    "eventName": "join",
    "data": {
        "room": "roomName"
    }
}
*/
var joinRoom = function(data, socket) {
    var room = data.room || "__default";
    var curRoomSockets; //当前房间的socket列表
    var socketIds = []; //房间其他用户的id

    curRoomSockets = rooms[room] = rooms[room] || [];

    //给所有房间内的其他人发送新用户的id
    for (var i = curRoomSockets.length; i--;) {
        socketIds.push(curRoomSockets[i].id);
        curRoomSockets[i].send(JSON.stringify({
            "eventName": "new_peer",
            "data": {
                "socketId": socket.id
            }
        }));
    }

    //将新用户的连接加入到房间的连接列表中
    curRoomSockets.push(socket);
    socket.room = room;

    //给新用户发送其他用户的信息，及服务器给新用户自己赋予的id
    socket.send(JSON.stringify({
        "eventName": "peers",
        "data": {
            "socketIds": socketIds,
            "you": socket.id
        }
    }));
};

server.on('connection', function(socket) {
    //为socket构建一个特有的id，用来作为区分用户的标记
    socket.id = getRandomString();
    //用户关闭连接后，应做的处理
    socket.on('close', function() {
        var i = sockets.indexOf(socket);
        var room = socket.room;
        var curRoomSockets = rooms[room];
        sockets.splice(i, 1);
        //通知房间内其他用户
        if (curRoomSockets) {
            for (i = curRoomSockets.length; i--;) {
                curRoomSockets[i].send(JSON.stringify({
                    "eventName": "remove_peer",
                    "data": {
                        "socketId": socket.id
                    }
                }));
            }
        }
        //从room中删除socket
        if (room) {
            i = this.rooms[room].indexOf(socket);
            this.rooms[room].splice(i, 1);
            if (this.rooms[room].length === 0) {
                delete this.rooms[room];
            }
        }
        //关闭连接后的其他操作
    });
    //根据前台页面传递过来的信令进行解析，确定应该如何处理
    socket.on('message', function(data) {
        var json = JSON.parse(data);
        if (json.eventName) {
            if (json.eventName === "join") {
                joinRoom(data, socket);
            }
        }
    });
    //将连接保存
    sockets.push(socket);
    //连接建立后的其他操作
});
```

</details>

最后再加上点对点的信令转发就行了，一份完整的代码可参考[SkyRTC项目源码](https://github.com/LingyuCoder/SkyRTC/blob/master/SkyRTC.js)

## WebRTC点对点通信

WebRTC 给我们带来了浏览器中的视频、音频聊天体验。但个人认为，它最实用的特性莫过于 DataChannel ——在浏览器之间建立一个点对点的数据通道。

在 DataChannel 之前，浏览器到浏览器的数据传递通常是这样一个流程：浏览器 A 发送数据给服务器，服务器处理，服务器再转发给浏览器 B。这三个过程都会带来相应的消耗，占用服务器带宽不说，还减缓了消息从发送到接收的时间。

其实最理想的方式就是浏览器 A 直接与浏览 B 进行通信，服务器不需要参与其中。WebRTC DataChannel 就提供了这样一种方式。当然服务器完全不参与其中，显然是不可能的，用户需要通过服务器上存储的信息，才能确定需要和谁建立连接。这里通过一个故事来讲述建立连接的过程：

### DataChannel连接的建立

**故事一：老刘和老姚去钓鱼**

背景：

- 老刘和老姚都住在同一个小区但不同的片区，小区很破旧，没有电话
- 片区相互隔离且片区门口有个保安，保安只认识自己片区的人，遇到不认识的人就需要查询凭证才能通过，而凭证需要找物业才能确定
- 门卫老大爷认识小区里的所有人但是不知道都住哪，有什么消息都可以在出入小区的时候代为传达

现在，老刘听说老姚钓鱼技术高超，想和老姚讨论钓鱼技巧。只要老刘和老姚相互之间知道对方的门牌号以及凭证，就可以串门了:

1. 门卫老大爷认识老刘和老姚
2. 老刘找物业确定了自己片区的出入凭证，将凭证、自己的门牌号以及意图告诉门卫老大爷，让其转交给老姚
3. 老姚买菜归来遇到门卫老大爷，门卫老大爷将老刘的消息传达给老姚。于是老姚知道怎么去老刘家了
4. 老姚很开心，他也找物业获取了自己小区的凭证，并将凭证、自己的门牌号等信息交给门卫老大爷，希望他传达给老刘
5. 老刘吃早餐回来遇到门卫老大爷，老大爷把老姚的小区凭证、门牌号等信息告诉老刘，这样老刘就知道了怎么去老姚家了

老刘和老姚相互之间知道了对方的门牌号和小区出入凭证，他们相互之间有什么需要交流的直接串门就行了，消息不再需要门卫老大爷来代为传达了

**换个角度**

我们把角色做一个映射：

- 老刘：浏览器A
- 老姚：浏览器B
- 片区：不同网段
- 保安：防火墙
- 片区凭证：ICE candidate
- 物业：ICE server
- 门牌号：session description
- 门卫老大爷：server

于是乎故事就变成了这样：

1. 浏览器 A 和浏览器 B 在 server 上注册，并保有连接
2. 浏览器 A 从 ice server 获取 ice candidate 并发送给 server，并生成包含 session description 的 offer，发送给 server
3. server 发送浏览器 A 的 offer 和 ice candidate 给浏览器 B
4. 浏览器 B 发送包含 session description 的 answer 和 ice candidate 给 server
5. server 发送浏览器 B 的 answer 和 ice candidate 给浏览器 A

这样，就建立了一个点对点的信道。

### DataChannel的分片传输

**故事二：老姚送礼物**

老刘和老姚已经可以相互串门了，经过一段时间的交流感情越来越深。老姚的亲友送了20斤葡萄给老姚，老姚决定送10斤给老刘。老姚毕竟年事已高，不可能一次带10斤。于是乎，老姚将葡萄分成了10份，每次去老刘家串门就送一份过去。

这里可以做如下类比：

1. 10斤葡萄：一个文件（尽管文件分片没有意义，葡萄分开还可以单独吃，但是实在找不到啥好的比喻了）
2. 分成10份：将文件分片，转成多个 chunk
3. 老姚一次只能带一斤：datachannel 每次传输的数据量不宜太大（[找到最合适的大小](http://stackoverflow.com/questions/15435121/what-is-the-maximum-size-of-webrtc-data-channel-messages)）

这其实就是通过 datachannel 传输文件的方式，首先将文件分片，然后逐个发送，最后再统一的进行组合成一个新的文件

**分片**

通过 HTML5 的 File API 可以将 `type` 为 `file` 的 `input` 选中的文件读取出来，并转换成 `data url` 字符串。这也就为我们提供了很方便的分片方式：

```javascript
var reader = new window.FileReader(file);
reader.readAsDataURL(file);
reader.onload = function(event, text) {
    chunkify(event.target.result);//将数据分片
};
```

**组合**

通过 datachannel 发送的分片数据，我们需要将其进行组合，由于是 `data url` 字符串，在接收到所有包之后进行拼接就可以了。拼接完成后就得到了一个文件完整的 `data url` 字符串，那么我们如何将这个字符串转换成文件呢？

**方案一：直接跳转下载**

既然是个 `dataurl`，我们直接将其赋值给 `window.location.href` 自然可以下载，但是这样下载是没法设定下载后的文件名的，这想一想都蛋疼

**方案二：通过 `a` 标签下载**

这个原理和跳转下载类似，都是使用 `dataurl` 本身的特性，通过创建一个 `a` 标签，将 `dataurl` 字符串赋值给 `href` 属性，然后使用 download 确定下载后的文件名，就可以完成下载了。但是很快又有新问题了，稍微大一点的文件下载的时候页面崩溃了。这是因为 `dataurl` 有大小限制

**方案三：blob**

其实可以通过给 `a` 标签创建 blob url 的方式来进行下载，这个没有大小限制。但是我们手上是 `dataurl`，所以需要先进行转换：

```javascript
function dataURItoBlob(dataURI, dataTYPE) {
    var binary = atob(dataURI.split(',')[1]),
        array = [];
    for (var i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
    return new Blob([new Uint8Array(array)], {
        type: dataTYPE
    });
}
```

获得 blob 后，我们就可以通过 URL API 来下载了：

```javascript
var a = document.createElement("a");
document.body.appendChild(a);
a.style = "display: none";
var blob = dataURItoBlob(data, 'octet/stream');
var url = window.URL.createObjectURL(blob);
a.href = url;
a.download = filename;
a.click();
!moz && window.URL.revokeObjectURL(url);
a.parentNode.removeChild(a);
```

这里有几个点：

- datachannel 其实是可以直接传送 blob 的，但是只有 firefox 支持，所以传 `data url`

- chrome 下载是直接触发的，不会进行询问，firefox 会先询问后下载，在询问过程中如果执行了 `revokeObjectURL`，下载就会取消。

### DataChannel传输的升级

如我们所知，WebRTC 最有特点的地方其实是可以传输 `getUserMedia` 获得的视频、音频流，来实现视频聊天。但事实上我们的使用习惯来看，一般人不会一开始就打开视频聊天，而且视频聊天时很消耗内存的（32 位机上一个连接至少 20M 左右好像，也有可能有出入）。所以常见的需求是，先建立一个包含 datachannel 的连接用于传输数据，然后在需要时升级成可以传输视频、音频。

看看我们之前传输的 session description，它其实来自[Session Description Protocol](http://datatracker.ietf.org/doc/draft-nandakumar-rtcweb-sdp/?include_text=1)。可以看到 wiki 上的介绍：

> The Session Description Protocol (SDP) is a format for describing streaming media initialization parameters.

这意味着什么呢？我们之前建立 datachannel 是没有加视频、音频流的，而这个流的描述是写在 SDP 里面的。现在我们需要传输视频、音频，就需要添加这些描述。所以就得重新获得 SDP，然后构建 offer 和 answer 再传输一次。传输的流程和之前一样，没什么区别。但这一次，我们不需要传输任何的 ice candidate。

> from mattm: You do not need to send ICE candidates on an already established peer connection. The ICE candidates are to make sure the two peers can establish a connection through their potential NAT and firewalls. If you can already send data on the peer connection, ICE candidates will not do anything.

## 有用的链接

### Specifications:

- WebRTC 1.0: Real-time Communication Between Browsers：<https://www.w3.org/TR/webrtc/>
- Media Capture and Streams：<https://w3c.github.io/mediacapture-main/>
- Media Capture from DOM Elements：<https://w3c.github.io/mediacapture-fromelement/>

### Getting started:

WebRTC官方网站：<https://webrtc.org/start/>

A Study of WebRTC Security：<http://webrtc-security.github.io/>

### Tutorials:

<https://www.html5rocks.com/en/tutorials/webrtc/basics/>

### WebRTC API:

<https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API>

### WebRTC codelab:

A step-by-step guide that explains how to build a complete video chat app, including a simple signaling server.<https://www.bitbucket.org/webrtc/codelab>

### Javascript frameworks

1. Video chat:

- <https://github.com/andyet/SimpleWebRTC>
- <https://github.com/priologic/easyrtc>
- <https://github.com/webRTC-io/webRTC.io>

2. Peer-to-peer data:

- <http://peerjs.com/>
- <https://github.com/peer5/sharefest>

### Demos:

<https://121.15.167.230:8090/demos/>

<https://webrtc.github.io/samples/>

<https://www.webrtc-experiment.com/>

<https://webcamtoy.com/zh/app/>

<https://idevelop.ro/ascii-camera/>

### WebRTC教程:

1. WebRTC基础:

   - [*Scaledrone*](https://www.scaledrone.com/blog/posts/webrtc-tutorial-simple-video-chat) —这个简单的教程会教你：

     ```shell
     1) WebRTC 基础知识
     2) 如何建立一个 1 对 1 视频通话
     3) 如何使用 Scaledrone 进行信令传输，这样就不需要编写服务器代码了
     ```

   - [*CodeLabs*](https://codelabs.developers.google.com/codelabs/webrtc-web/#0) —这个教程包括了 WebRTC 介绍，一些简单的代码和 demo。

   - [*Tutorial’s Point*](https://www.tutorialspoint.com/webrtc/index.htm) —这篇教程会帮助所有想要学习如何搭建像实时广告，多人游戏，直播互动，网上学习这些应用的开发人员。

   - [*WebRTC.ventures*](https://webrtc.ventures/webrtc-resources/) Email课程—在这一系列的免费邮件中，你会学到 WebRTC 的基本知识，以及它的优缺点及使用方法。包括这些话题：

     ```shell
     1) WebRTC 基础
     2) WebRTC 优点
     3) WebRTC 缺点
     4) 信令
     5) 建立 WebRTC 通话
     6) WebRTC 中的 DataChannel
     7) WebRTC 设计
     ```

   - [*Verto*](http://evoluxbr.github.io/verto-docs/) —在这个教程中，我们会通过例子学到如何建立，调入 verto jQuery 库来创建一个基础的网络视频会议应用。

2. CPASS教程:

   - [*Tokbox*](https://tokbox.com/developer/tutorials/) —这是教程会一步一步指导你建立自己的 OpenTok 实时视频软件中的内容。在完成基本教程之后，你就可以继续跟着 Tokbox 的教程学习进阶内容：

   ```shell
   1) 归档
   2) 文字聊天
   3) 自定义视频渲染
   4) 自定义音频驱动
   5) 以及更多内容
   ```

   - [*Twilio*](https://www.twilio.com/docs/tutorials/browser-calls-node-express) —这个网页应用会向你展示如何使用 Twilio 客户端来创建一个浏览器-手机以及浏览器-浏览器通话。
   - [*Vidyo.io*](https://support.vidyo.io/hc/en-us/sections/115001457187-Video-Tutorials) —Vidyo.io 通过教育视频聊天教程向我们展示：

   ```shell
   1) 生成 Vidyo.io Token
   2) 用几分钟的时间就搭建一个 iOS 版的移动端视频聊天软件
   3) 用几分钟的时间就搭建一个 Android 版的移动端视频聊天软件
   ```

3. **信令**

   [*Html5Rocks.com*](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) —在这个教程文章中，你会学到如何搭建一个信令服务，以及如何通过使用 STUN 和 TURN 服务器来处理现实世界中连接性产生的各种奇怪问题。还解释了 WebRTC 应用是如何处理多方通话以及与 VoIP 和 PSTN 这些服务互动的。

4. **媒体服务器**

   [*Kurento教程*](http://doc-kurento.readthedocs.io/en/stable/tutorials.html) —这些教程会给你展示如何使用 Kurento 框架搭建不同种类的 WebRTC 及多媒体应用。教程从三个角度出发：Java，浏览器 JavaScript 和 Node.js。

### WebRTC服务提供商:

1. 国外:

- [https://xirsys.com](https://xirsys.com/)
- <https://tokbox.com/developer/>
- <https://cloud.aculab.com/documents/webrtcdemo>
- <https://www.twilio.com/webrtc>
- <http://www.frafos.com/webrtc/>
- <http://www.sightcall.com/>

1. 国内:

- 声网：<https://www.agora.io/cn/>
- 融云：<http://www.rongcloud.cn/>
- 亲加云：<http://www.gotye.com.cn/>
- 环信：<https://www.easemob.com/>
- 野狗通信云：<https://www.wilddog.com/>



