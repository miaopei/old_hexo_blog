---
title: WebRTC（三）
tags: WebRTC
reward: true
categories: WebRTC
abbrlink: 39639
date: 2019-05-17 10:14:50
password: Miaow
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---

## WebRTC 环境搭建

### 简单的 https server 服务搭建

<!-- more -->

```shell
# 二进制安装
$ apt/brew/yum install nodejs
$ apt/brew/yum install npm
$ apt-cache search xxx 		# 查看源上相关软件版本信息

# 源码安装
# 下载 Nodejs 源码 http://nodejs.cn/download/
$ wget -c https://npm.taobao.org/mirrors/node/v10.16.0/node-v10.16.0.tar.gz
# 生成 Makefile
$ ./configure --prefix=/usr/local/nodejs
$ make -j 4 && sudo make install
```

```js
# server.js
'use strict'

var https = require('https');
var fs = require('fs');

var options = {
    key  : fs.readFileSync('./cert/server.key'),
    cert : fs.readFileSync('./cert/server.pem')
}

var app = https.createServer(options, function(req, res){
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('Hello Mr.Miaow!\n');
}).listen(443, '0.0.0.0');
```

启动 server

```shell
$ node server.js
$ nohub node server.js &
$ forever start server.js  	# nmp install forever -g
```

### 真正的Web服务

- 引用 express 模块
- 引入 serve-index 模块
- 指定发布目录

```shell
$ npm install express serve-index
```

<details><summary>web server 服务</summary>

```js
'use strict'

var http = require('http');
var https = require('https');
var fs = require('fs');

var express = require('express');
var serverIndex = require('serve-index');

var socketIo = require('socket.io');
var log4js = require('log4js');

var USERCOUNT = 3;

log4js.configure({
    appenders: {
        file: {
            type: 'file',
            filename: 'app.log',
            layout: {
                type: 'pattern',
                pattern: '%r %p - %m',
            }
        }
    },
    categories: {
        default: {
            appenders: ['file'],
            level: 'debug'
        }
    }
});

var logger = log4js.getLogger();

var app = express();
app.use(serverIndex('./public'));
app.use(express.static('./public'));

var http_server = http.createServer(app);
http_server.listen(80, '0.0.0.0');

var options = {
    key  : fs.readFileSync('./cert/server.key'),
    cert : fs.readFileSync('./cert/server.pem')
}

var https_server = https.createServer(options, app);

// bind socket.io with https_server
var io = socketIo.listen(https_server);
var sockio = socketIo.listen(http_server);

// connection
io.sockets.on('connection', (socket)=>{
    logger.log('Socket.io connection ...');

    socket.on('message', (room, data)=>{
        socket.to(room).emit('message', room, data); //除自己之外
    });

    // 该函数应该加锁
    socket.on('join', (room)=>{
        socket.join(room);

        var myRoom = io.sockets.adapter.rooms[room];
        var users = (myRoom) ? Object.keys(myRoom.sockets).length : 0;

        logger.debug('The number of user in room is:' + users);

        // 在这里可以控制进入房间的人数,现在一个房间最多 2个人
        // 为了便于客户端控制，如果是多人的话，应该将目前房间里
        // 人的个数当做数据下发下去。
        if(users < USERCOUNT) {
            socket.emit('joined', room, socket.id);  // 谁来了发给谁
            if (users > 1) {
                socket.to(room).emit('otherjoin', room, socket.id);//除自己之外
            }
        }else {
            socket.leave(room);
            socket.emit('full', room, socket.id);
        }
        //socket.emit('joined', room, socket.id); // 发给自己
        //socket.to(room).emit('joined', room, socket.id); // 发给除自己之外的房间内的所有人
        //io.in(room).emit('joined', room, socket.id); // 发给房间内所有人
        //socket.broadcast.emit('joined', room, socket.id); // 发给除自己之外，这个节点上的所有人
    });

    socket.on('leave', (room)=>{
        var myRoom = io.sockets.adapter.rooms[room];
        var users = (myRoom) ? Object.keys(myRoom.sockets).length : 0;
        // users - 1
        logger.debug('The number of user in room is:' + (users-1));

        socket.leave(room);
        socket.to(room).emit('bye', room, socket.id); //房间内所有人,除自己外
        socket.emit('leaved', room, socket.id); // 给自己发leaved

        //socket.to(room).emit('leaved', room, socket.id); // 除自己之外
        //io.in(room).emit('leaved', room, socket.id); // 房间内所有人
        //socket.broadcast.emit('leaved', room, socket.id); // 除自己，全部站点
    })
})

https_server.listen(443, '0.0.0.0');
```

</details>

<details><summary>项目目录结构图</summary>

```shell
$ tree -I "node_modules|WebRTCAndroid"     
.
├── app.log
├── cert
│   ├── server.key
│   └── server.pem
├── package-lock.json
├── public
│   ├── bandwidth
│   │   ├── css
│   │   │   └── main.css
│   │   ├── js
│   │   │   └── main.js
│   │   └── room.html
│   ├── chat
│   │   ├── css
│   │   │   └── main.css
│   │   ├── index.html
│   │   └── js
│   │       ├── main.js
│   │       └── third_party
│   │           └── graph.js
│   ├── chatroom
│   │   ├── css
│   │   │   └── main.css
│   │   ├── index.html
│   │   └── js
│   │       └── client.js
│   ├── device
│   │   ├── index.html
│   │   └── js
│   │       └── client.js
│   ├── getstats
│   │   ├── css
│   │   │   └── main.css
│   │   ├── js
│   │   │   ├── main.js
│   │   │   └── third_party
│   │   │       └── graph.js
│   │   └── room.html
│   ├── mediaDisplay
│   │   ├── index.html
│   │   └── js
│   │       └── client.js
│   ├── mediastream
│   │   ├── index.html
│   │   └── js
│   │       └── client.js
│   ├── mediastream_bak
│   │   ├── index.html
│   │   └── js
│   │       └── client.js
│   ├── only_audio
│   │   ├── index.html
│   │   └── js
│   │       └── client.js
│   ├── peerConnection
│   │   ├── css
│   │   │   └── main.css
│   │   ├── index.html
│   │   └── js
│   │       └── main.js
│   ├── realyPeerConnection
│   │   ├── css
│   │   │   └── main.css
│   │   ├── js
│   │   │   └── main.js
│   │   └── room.html
│   ├── sendfile
│   │   ├── css
│   │   │   └── main.css
│   │   ├── index.html
│   │   └── js
│   │       ├── main_bw.js
│   │       └── third_party
│   │           └── graph.js
│   └── testCreateOffer
│       ├── index.html
│       └── js
│           └── main.js
├── server-bak-01.js
└── server.js

38 directories, 42 files
```

</details>

### PeerConnection

<details><summary>room.html</summary>

```html
<html>
    <head>
        <title>WebRTC PeerConnection</title>
        <link href="./css/main.css" rel="stylesheet" />
    </head>

    <body>
        <div>
            <div>
                <button id="connserver">Connect Sig Server</button>
                <button id="leave">Leave</button>
            </div>

            <div>
                <input id="shareDesk" type="checkbox"/><label for="shareDesk">Share Desktop</label>
            </div>

            <div id="preview">
                <div>
                    <h2>Local:</h2>
                    <video id="localvideo" autoplay playsinline muted></video>

                    <h2>Offer SDP:</h2>
                    <textarea id="offer"></textarea>
                </div>
                <div>
                    <h2>Remote:</h2>
                    <video id="remotevideo" autoplay playsinline></video>

                    <h2>Answer SDP:</h2>
                    <textarea id="answer"></textarea>
                </div>
            </div>
        </div>

        <script src="https://cdn.bootcss.com/socket.io/2.2.0/socket.io.js"></script>
        <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
        <script src="./js/main.js"></script>
    </body>
</html>
```

</details>

<details><summary>main.css</summary>

```css
/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

button {
  margin: 0 20px 25px 0;
  vertical-align: top;
  width: 134px;
}

textarea {
  color: #444;
  font-size: 0.9em;
  font-weight: 300;
  height: 20.0em;
  padding: 5px;
  width: calc(100% - 10px);
}

div#getUserMedia {
  padding: 0 0 8px 0;
}

div.input {
  display: inline-block;
  margin: 0 4px 0 0;
  vertical-align: top;
  width: 310px;
}

div.input > div {
  margin: 0 0 20px 0;
  vertical-align: top;
}

div.output {
  background-color: #eee;
  display: inline-block;
  font-family: 'Inconsolata', 'Courier New', monospace;
  font-size: 0.9em;
  padding: 10px 10px 10px 25px;
  position: relative;
  top: 10px;
  white-space: pre;
  width: 270px;
}

div#preview {
  border-bottom: 1px solid #eee;
  margin: 0 0 1em 0;
  padding: 0 0 0.5em 0;
}

div#preview > div {
  display: inline-block;
  vertical-align: top;
  width: calc(50% - 12px);
}

section#statistics div {
  display: inline-block;
  font-family: 'Inconsolata', 'Courier New', monospace;
  vertical-align: top;
  width: 308px;
}

section#statistics div#senderStats {
  margin: 0 20px 0 0;
}

section#constraints > div {
  margin: 0 0 20px 0;
}

h2 {
  margin: 0 0 1em 0;
}

section#constraints label {
  display: inline-block;
  width: 156px;
}

section {
  margin: 0 0 20px 0;
  padding: 0 0 15px 0;
}

video {
  background: #222;
  margin: 0 0 0 0;
  --width: 100%;
  width: var(--width);
  height: 225px;
}

@media screen and (max-width: 720px) {
  button {
    font-weight: 500;
    height: 56px;
    line-height: 1.3em;
    width: 90px;
  }
  div#getUserMedia {
    padding: 0 0 40px 0;
  }
  section#statistics div {
    width: calc(50% - 14px);
  }
}
```

</details>

<details><summary>main.js</summary>

```js
'use strict'

var localVideo = document.querySelector('video#localvideo');
var remoteVideo = document.querySelector('video#remotevideo');

var btnConn = document.querySelector('button#connserver');
var btnLeave = document.querySelector('button#leave');

var offer = document.querySelector('textarea#offer');
var answer = document.querySelector('textarea#answer');

var shareDeskBox  = document.querySelector('input#shareDesk');

var pcConfig = {
    'iceServers': [{
        'urls': 'turn:stun.al.learningrtc.cn:3478',
        'credential': "mypasswd",
        'username': "garrylea"
    }]
};

var localStream = null;
var remoteStream = null;

var roomid = '123123';
var socket = null;

var offerdesc = null;
var state = 'init';

var pc = null;

// 以下代码是从网上找的
//================================================================================
//如果返回的是false说明当前操作系统是手机端，如果返回的是true则说明当前的操作系统是电脑端
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
    var flag = true;

    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

//如果返回true 则说明是Android  false是ios
function is_android() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        //这个是安卓操作系统
        return true;
    }

    if (isIOS) {
        //这个是ios操作系统
        return false;
    }
}

//获取url参数
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
//=======================================================================

function getRemoteStream(e){
    remoteStream = e.streams[0];
    remoteVideo.srcObject = e.streams[0];
}

function sendMessage(roomid, data)
{
    console.log('Send p2p message: roomid=' + roomid + ' data=' + data);
    if(!socket) {
        console.log('SendMessage is error: socket is null');
    }
    socket.emit('message', roomid, data);
}

function createPeerConnection(){
    //如果是多人的话，在这里要创建一个新的连接.
    //新创建好的要放到一个map表中。
    //key=userid, value=peerconnection
    console.log('Create RTCPeerConnection ...');
    if(!pc) {
        pc = new RTCPeerConnection(pcConfig);
        pc.onicecandidate = (e)=> {		// 监听 candidate 事件
            if(e.candidate) {
                console.log('Find an new candidate:', e.candidate);
                sendMessage(roomid, {
                    type: 'candidate',
                    label: e.candidate.sdpMLineIndex,
                    id: e.candidate.sdpMid,
                    candidate: e.candidate.candidate
                });
            } else {
                console.log('This is the end candidate');
            }
        }
        pc.ontrack = getRemoteStream;  // 监听 轨 事件
    } else {
        console.log('The pc have be created!');
    }

    //if(localStream) {
    //    localStream.getTracks().forEach((track)=>{
    //        pc.addTrack(track);
    //    });
    //}
    return;
}

//绑定永远与 peerconnection在一起，
//所以没必要再单独做成一个函数
function bindTracks(){
    console.log('Bind tracks into RTCPeerConnection!');
    if( pc === null || pc === undefined) {
        console.error('pc is null or undefined!');
        return;
    }

    if(localStream === null || localStream === undefined) {
        console.error('localstream is null or undefined!');
        return;
    }

    //add all track into peer connection
    localStream.getTracks().forEach((track)=>{
        pc.addTrack(track, localStream);
    });
}

function getOffer(desc){
    pc.setLocalDescription(desc);
    offer.value = desc.sdp;
    offerdesc = desc;
    sendMessage(roomid, offerdesc);
}

function handleOfferError(err) {
    console.error('Failed to get Offer!', err);
}

function call(){
    console.log('call ...');
    if(state === 'joined_conn') {
        if(pc) {
            // 控制接受远端视频和音频参数配置
            var options = {  // 还有两个参数 1. icerestart 2. 静音检测  
                offerToRecieveVideo: 1,
                offerToRecieveAudio: 1
            }
            pc.createOffer(options)
                .then(getOffer).catch(handleOfferError);
        }
    }
}

function closeLocalMedia(){
    if(localStream && localStream.getTracks()) {
        localStream.getTracks().forEach((track)=>{
            track.stop();
        });
    }
    localStream = null;
}

function hangup(){
    console.log('Close RTCPeerConnection ...');
    if(pc) {
        offerdesc = null;
        pc.close();
        pc = null;
    }
}

function getAnswer(desc){
    pc.setLocalDescription(desc);  // 通知本地手机candidate
    answer.value = desc.sdp;
    sendMessage(roomid, desc);
}

function handleAnswerError(err){
    console.error('Failed to get Answer!', err);
}

function conn(){
    socket = io.connect();  // 与信令服务器进行连接
	// 注册 接收服务端的 消息函数
    socket.on('joined', (roomid, id)=> {  // id -> 用户id
        btnConn.disabled = true;
        btnLeave.disabled = false;
        state = 'joined';
        createPeerConnection();
        bindTracks();
        console.log('Receive joined message: roomid=' + roomid + ' userid=' + id + ' state=' + state);
    });

    socket.on('otherjoin', (roomid, id)=> {
        if(state === 'joined_unbind') {
            createPeerConnection();
            bindTracks();
        }
        state = 'joined_conn';
        // 媒体协商
        call();
        console.log('Receive otherjoin message: roomid=' + roomid + ' userid=' + id + ' state=' + state);
    });

    socket.on('full', (roomid, id)=> {
        state = 'leaved';
        hangup();
        //socket.disconnect();
        closeLocalMedia();
        btnConn.disabled = false;
        btnLeave.disabled = true;
        console.log('Receive full message: roomid=' + roomid + ' userid=' + id + ' state=' + state);
        alert('The room is full!');
    });

    socket.on('leaved', (roomid, id)=> {
        state = 'leaved';
        socket.disconnect();  // 关闭连接
        btnConn.disabled = false;
        btnLeave.disabled = true;
        console.log('Receive leaved message: roomid=' + roomid + ' userid=' + id + ' state=' + state);
    });

    socket.on('bye', (roomid, id)=> {
        //state = 'created';
        //当是多人通话时，应该带上当前房间的用户数
        //如果当前房间用户不小于 2, 则不用修改状态
        //并且，关闭的应该是对应用户的peerconnection
        //在客户端应该维护一张peerconnection表，它是
        //一个key:value的格式，key=userid, value=peerconnection

        state = 'joined_unbind';
        hangup();
        offer.value = '';
        answer.value = '';
        console.log('Receive bye message: roomid=' + roomid + ' userid=' + id + ' state=' + state);
    });

    socket.on('disconnect', (socket) => {
        if(!(state === 'leaved')){
            hangup();
            closeLocalMedia();
        }
        state = 'leaved';
        console.log('Receive disconnect message! roomid=' + roomid);
    });
	// 端对端的消息
    socket.on('message', (roomid, data)=> {
        // 媒体协商
        if(data === null || data === undefined){
            console.error('The message is invalid!');
            return;
        }

        if(data.hasOwnProperty('type') && data.type === 'offer') {
            offer.value = data.sdp;
            pc.setRemoteDescription(new RTCSessionDescription(data));  // data 发送前是一个对象，发送过来的时候已经变成了一个文本，所以这儿要转换
            pc.createAnswer()
                .then(getAnswer).catch(handleAnswerError);
        } else if(data.hasOwnProperty('type') && data.type == 'answer'){
            answer.value = data.sdp;
            pc.setRemoteDescription(new RTCSessionDescription(data));
        } else if (data.hasOwnProperty('type') && data.type === 'candidate'){
            var candidate = new RTCIceCandidate({
                sdpMLineIndex: data.label,
                candidate: data.candidate
            });
            pc.addIceCandidate(candidate); // 将 candidate 添加到本端
        } else {
            console.error('The message is invalid!', data);
        }

        console.log('Receive client message: roomid=' + roomid + ' data=' + data);
    });

    //roomid = getQueryVariable('room');
    socket.emit('join', roomid);  // 发送消息，加入 roomid 这个房间
    return;
}

function getMediaStream(stream){
    if(localStream){
        stream.getAudioTracks().forEach((track)=>{
            localStream.addTrack(track);
            stream.removeTrack(track);
        });
    }else{
        localStream = stream;
    }
    localVideo.srcObject = localStream;  // 本地视频在视频标签中显示

    //这个函数的位置特别重要，
    //一定要放到getMediaStream之后再调用
    //否则就会出现绑定失败的情况
    //setup connection
    conn();  // 信令功能实现
}

function handleError(err){
    console.error('Failed to get Media Stream: ', err.name);
}

function getDeskStream(stream){
    localStream = stream;
}

function handleShareDeskError(err){
    console.error('Failed to get Media Stream!', err);
}

function shareDesk(){
    if(IsPC()){
        navigator.mediaDevices.getDisplayMedia({video: true})
            .then(getDeskStream).catch(handleShareDeskError);
        return true;
    }
    return false;
}

function start(){
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('The getUserMedia is not supported!');
        return;
    } else {
        var constraints;
        if(shareDeskBox.checked && shareDesk()) {
            constraints = {
                video: false,
                audio:  {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            }
        } else {
            constraints = {
                video: true,
                audio:  {
                    echoCancellation: true,  // 回音消除
                    noiseSuppression: true,  // 降噪？
                    autoGainControl: true	 // 
                }
            }
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(getMediaStream).catch(handleError);
    }
}

function connSignalServer(){
    // 开启本地视频
    start();
    return true;
}

function closePeerConnection(){
    console.log('Close RTCPeerConnection ...');
    if(pc) {
        pc.close();
        pc = null;
    }
}

function leave(){
    if(socket) {
        socket.emit('leave', roomid);
    }
    hangup();
    closeLocalMedia();

    offer.value = '';
    answer.value = '';

    btnConn.disabled = false;
    btnLeave.disabled = true;
}

btnConn.onclick = connSignalServer;
btnLeave.onclick = leave;
```

</details>

## Chat

<details><summary>main.css</summary>

```css
/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

button {
  margin: 10px 20px 25px 0;
  vertical-align: top;
  width: 134px;
}

table {
  margin: 200px (50% - 100) 0 0; 
}

textarea {
  color: #444;
  font-size: 0.9em;
  font-weight: 300;
  height: 20.0em;
  padding: 5px;
  width: calc(100% - 10px);
}

div#getUserMedia {
  padding: 0 0 8px 0;
}

div.input {
  display: inline-block;
  margin: 0 4px 0 0;
  vertical-align: top;
  width: 310px;
}

div.input > div {
  margin: 0 0 20px 0;
  vertical-align: top;
}

div.output {
  background-color: #eee;
  display: inline-block;
  font-family: 'Inconsolata', 'Courier New', monospace;
  font-size: 0.9em;
  padding: 10px 10px 10px 25px;
  position: relative;
  top: 10px;
  white-space: pre;
  width: 270px;
}

div.label {
        display: inline-block;
        font-weight: 400;
        width: 120px;
}

div.graph-container {
  background-color: #ccc;
  float: left;
  margin: 0.2em;
  width: calc(50%-1em);
}

div#preview {
  border-bottom: 1px solid #eee;
  margin: 0 0 1em 0;
  padding: 0 0 0.5em 0;
}

div#preview > div {
  display: inline-block;
  vertical-align: top;
  width: calc(50% - 12px);
}

section#statistics div {
  display: inline-block;
  font-family: 'Inconsolata', 'Courier New', monospace;
  vertical-align: top;
  width: 308px;
}

section#statistics div#senderStats {
  margin: 0 20px 0 0;
}

section#constraints > div {
  margin: 0 0 20px 0;
}

h2 {
  margin: 0 0 1em 0;
}

section#constraints label {
  display: inline-block;
  width: 156px;
}

section {
  margin: 0 0 20px 0;
  padding: 0 0 15px 0;
}

video {
  background: #222;
  margin: 0 0 0 0;
  --width: 100%;
  width: var(--width);
  height: 225px;
}

@media screen and (max-width: 720px) {
  button {
    font-weight: 500;
    height: 56px;
    line-height: 1.3em;
    width: 90px;
  }

  div#getUserMedia {
    padding: 0 0 40px 0;
  }

  section#statistics div {
    width: calc(50% - 14px);
  }

}
```

</details>

<details><summary>Chat.html</summary>

```html
<html>
    <head>
        <title>WebRTC PeerConnection</title>
        <link href="./css/main.css" rel="stylesheet" />
    </head>

    <body>
        <div>
            <div>
                <button id="connserver">Connect Sig Server</button>
                <button id="leave">Leave</button>
            </div>

            <div>
                <label>BandWidth:</label>
                <select id="bandwidth" disabled>
                    <option value="unlimited" selected>unlimited</option>
                    <option value="2000">2000</option>
                    <option value="1000">1000</option>
                    <option value="500">500</option>
                    <option value="250">250</option>
                    <option value="125">125</option>
                </select>
                kbps
            </div>

            <div>
                <input id="shareDesk" type="checkbox"/><label for="shareDesk">Share Desktop</label>
            </div>

            <div id="preview">
                <div>
                    <h2>Local:</h2>
                    <video id="localvideo" autoplay playsinline muted></video>

                    <h2>Remote:</h2>
                    <video id="remotevideo" autoplay playsinline></video>
                </div>

                <div>
                    <h2>Chat:</h2>
                    <textarea id="chat" disabled></textarea>
                    <textarea id="sendtxt" disabled></textarea>
                    <button id="send">Send</button>
                </div>
            </div>

            <div id="preview">
                <div class="graph-container" id="bitrateGraph">
                    <div>Bitrate</div>
                    <canvas id="bitrateCanvas"></canvas>
                </div>
                <div class="graph-container" id="packetGraph">
                    <div>Packets sent per second</div>
                    <canvas id="packetCanvas"></canvas>
                </div>
            </div>
        </div>

        <script src="js/third_party/graph.js"></script>
        <script src="https://cdn.bootcss.com/socket.io/2.2.0/socket.io.js"></script>
        <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
        <script src="./js/Chat.js"></script>
    </body>
</html>
```

</details>

<details><summary>Chat.js</summary>

```js
'use strict'

var localVideo = document.querySelector('video#localvideo');
var remoteVideo = document.querySelector('video#remotevideo');

var btnConn = document.querySelector('button#connserver');
var btnLeave = document.querySelector('button#leave');

var optBW = document.querySelector('select#bandwidth');

var shareDeskBox  = document.querySelector('input#shareDesk');

var chat = document.querySelector('textarea#chat');
var sendTxt = document.querySelector('textarea#sendtxt');
var btnSend = document.querySelector('button#send');

var pcConfig = {
    'iceServers': [{
        'urls': 'turn:stun.al.learningrtc.cn:3478',
        'credential': "mypasswd",
        'username': "garrylea"
    }]
};

var bitrateGraph;
var bitrateSeries;

var packetGraph;
var packetSeries;

var lastReportResult;

var localStream = null;
var remoteStream = null;

var roomid = '123123';
var socket = null;

var offerdesc = null;
var state = 'init';

var pc = null;
var dc = null;

// 以下代码是从网上找的
//=========================================================================================

//如果返回的是false说明当前操作系统是手机端，如果返回的是true则说明当前的操作系统是电脑端
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
    var flag = true;

    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }

    return flag;
}

//如果返回true 则说明是Android  false是ios
function is_android() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        //这个是安卓操作系统
        return true;
    }

    if (isIOS) {
        //这个是ios操作系统
        return false;
    }
}

//获取url参数
function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
//=======================================================================

function sendMessage(roomid, data){
    console.log('Send p2p message: roomid=' + roomid + ' data=' + data);
    if(!socket) {
        console.log('SendMessage is error: socket is null');
    }
    socket.emit('message', roomid, data);
}

function getOffer(desc){
    pc.setLocalDescription(desc);
    offerdesc = desc;
    sendMessage(roomid, offerdesc);
}

function handleOfferError(err) {
    console.error('Failed to get Offer!', err);
}

function getAnswer(desc){
    pc.setLocalDescription(desc);
    optBW.disabled = false;
    sendMessage(roomid, desc);
}

function handleAnswerError(err){
    console.error('Failed to get Answer!', err);
}

function call(){
    console.log('call ...');
    if(state === 'joined_conn') {
        if(pc) {
            var options = {
                offerToRecieveVideo: 1,
                offerToRecieveAudio: 1
            }
            pc.createOffer(options)
                .then(getOffer).catch(handleOfferError);
        }
    }
}

function connSignalServer(){
    // 开启本地视频
    start();
    return true;
}

function receivemsg(e){
    var msg = e.data;
    if(msg) {
        chat.value += '->' + msg + '\r\n';
    } else {
        console.error('Received msg is null!');
    }
}

function dataChannelStateChange() {
    var readyState = dc.readyState;
    console.log('Send channel state is: ' + readyState);
    if (readyState === 'open') {
        sendTxt.disabled = false;
        send.disabled = false;
    } else {
        sendTxt.disabled = true;
        send.disabled = true;
    }
}

function conn(){
    socket = io.connect();

    socket.on('joined', (roomid, id) => {
        state = 'joined'

        //如果是多人的话，第一个人不该在这里创建peerConnection
        //都等到收到一个otherjoin时再创建
        //所以，在这个消息里应该带当前房间的用户数
        //
        //create conn and bind media track
        createPeerConnection();
        bindTracks();

        btnConn.disabled = true;
        btnLeave.disabled = false;
        console.log('receive joined message, state=', state);
    });

    socket.on('otherjoin', (roomid, id) => {
        //如果是多人的话，每上来一个人都要创建一个新的 peerConnection
        //
        if(state === 'joined_unbind'){
            createPeerConnection();
            bindTracks();
        }

        //create data channel for transporting non-audio/video data
        dc = pc.createDataChannel('chatchannel');
        dc.onmessage = receivemsg;
        dc.onopen = dataChannelStateChange;
        dc.onclose = dataChannelStateChange;

        state = 'joined_conn';

        // 媒体协商
        call();
        
        console.log('Receive otherjoin message: roomid=' + roomid + ' userid=' + id + ' state=' + state);
    });

    socket.on('full', (roomid, id)=> {
        state = 'leaved';
        hangup();
        closeLocalMedia();

        btnConn.disabled = false;
        btnLeave.disabled = true;
        console.log('Receive full message: roomid=' + roomid + ' userid=' + id + ' state=' + state);
        alert('The room is full!');
    });

    socket.on('leaved', (roomid, id)=> {
        state = 'leaved';
        socket.disconnect();

        btnConn.disabled = false;
        btnLeave.disabled = true;
        console.log('Receive leaved message: roomid=' + roomid + ' userid=' + id + ' state=' + state);
    });

    socket.on('bye', (roomid, id)=> {
        //state = 'created';
        //当是多人通话时，应该带上当前房间的用户数
        //如果当前房间用户不小于 2, 则不用修改状态
        //并且，关闭的应该是对应用户的peerconnection
        //在客户端应该维护一张peerconnection表，它是
        //一个key:value的格式，key=userid, value=peerconnection
        state = 'joined_unbind';

        hangup();
        console.log('Receive bye message: roomid=' + roomid + ' userid=' + id + ' state=' + state);
    });

    socket.on('disconnect', (socket) => {
        if(!(state === 'leaved')){
            hangup();
            closeLocalMedia();
        }
        state = 'leaved';
        console.log('Receive disconnect message! roomid=' + roomid);
    });

    socket.on('message', (roomid, data)=> {
        // 媒体协商
        if(data === null || data === undefined){
            console.error('The message is invalid!');
            return;
        }
        if(data.hasOwnProperty('type') && data.type === 'offer') {
            pc.setRemoteDescription(new RTCSessionDescription(data));
            pc.createAnswer()
                .then(getAnswer).catch(handleAnswerError);
        } else if(data.hasOwnProperty('type') && data.type == 'answer'){
            optBW.disabled = false;
            pc.setRemoteDescription(new RTCSessionDescription(data));
        } else if (data.hasOwnProperty('type') && data.type === 'candidate'){
            var candidate = new RTCIceCandidate({
                sdpMLineIndex: data.label,
                candidate: data.candidate
            });
            pc.addIceCandidate(candidate);
        } else {
            console.error('The message is invalid!', data);
        }
        console.log('Receive client message: roomid=' + roomid + ' data=' + data);
    });

    //roomid = getQueryVariable('room');
    socket.emit('join', roomid);

    return;
}

function getMediaStream(stream){
    if(localStream){
        stream.getAudioTracks().forEach((track)=>{
            localStream.addTrack(track);
            stream.removeTrack(track);
        });
    }else{
        localStream = stream;
    }

    localVideo.srcObject = localStream;

    //这个函数的位置特别重要，
    //一定要放到getMediaStream之后再调用
    //否则就会出现绑定失败的情况
    //
    //setup connection
    conn();

    bitrateSeries = new TimelineDataSeries();
    bitrateGraph = new TimelineGraphView('bitrateGraph', 'bitrateCanvas');
    bitrateGraph.updateEndDate();

    packetSeries = new TimelineDataSeries();
    packetGraph = new TimelineGraphView('packetGraph', 'packetCanvas');
    packetGraph.updateEndDate();
}

function handleError(err){
    console.error('Failed to get Media Stream: ', err.name);
}

function getDeskStream(stream){
    localStream = stream;
}

function handleShareDeskError(err){
    console.error('Failed to get Media Stream!', err);
}

function shareDesk(){
    if(IsPC()){
        navigator.mediaDevices.getDisplayMedia({video: true})
            .then(getDeskStream).catch(handleShareDeskError);
        return true;
    }
    return false;
}

function start(){
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('The getUserMedia is not supported!');
        return;
    } else {
        var constraints;
        if(shareDeskBox.checked && shareDesk()) {
            constraints = {
                video: false,
                audio:  {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            }
        } else {
            constraints = {
                video: true,
                audio:  {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            }
        }

        navigator.mediaDevices.getUserMedia(constraints)
            .then(getMediaStream).catch(handleError);
    }
}


function closeLocalMedia(){
    if(localStream && localStream.getTracks()) {
        localStream.getTracks().forEach((track)=>{
            track.stop();
        });
    }
    localStream = null;
}

function leave(){
    if(socket) {
        socket.emit('leave', '123123');
    }
    hangup();
    closeLocalMedia();

    btnConn.disabled = false;
    btnLeave.disabled = true;
}

function getRemoteStream(e){
    remoteStream = e.streams[0];
    remoteVideo.srcObject = e.streams[0];
}

function createPeerConnection()
{
    //如果是多人的话，在这里要创建一个新的连接.
    //新创建好的要放到一个map表中。
    //key=userid, value=peerconnection
    console.log('Create RTCPeerConnection ...');
    if(!pc) {
        pc = new RTCPeerConnection(pcConfig);

        pc.onicecandidate = (e)=> {
            if(e.candidate) {
                console.log('Find an new candidate:', e.candidate);

                sendMessage(roomid, {
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                });
            } else {
                console.log('This is the end candidate');
            }
        }

        pc.ondatachannel = e=> {
            if(!dc){
                dc = e.channel;
                dc.onmessage = receivemsg; 
                dc.onopen = dataChannelStateChange;
                dc.onclose = dataChannelStateChange;
            }
        }

        pc.ontrack = getRemoteStream;
    } else {
        console.log('The pc have be created!');
    }

    //if(localStream) {
    //    localStream.getTracks().forEach((track)=>{
    //        pc.addTrack(track);
    //    });
    //}
    return;
}

//绑定永远与 peerconnection在一起，
//所以没必要再单独做成一个函数
function bindTracks(){
    console.log('Bind tracks into RTCPeerConnection!');
    if( pc === null || pc === undefined) {
        console.error('pc is null or undefined!');
        return;
    }

    if(localStream === null || localStream === undefined) {
        console.error('localstream is null or undefined!');
        return;
    }

    //add all track into peer connection
    localStream.getTracks().forEach((track)=>{
        pc.addTrack(track, localStream);
    });
}

function hangup(){
    console.log('Close RTCPeerConnection ...');
    if(pc) {
        offerdesc = null;
        pc.close();
        pc = null;
    }
}

function closePeerConnection(){
    console.log('Close RTCPeerConnection ...');
    if(pc) {
        pc.close();
        pc = null;
    }
}

function change_bw(){
    bandwidth.disabled = true;
    var bw = optBW.options[optBW.selectedIndex].value;

    var vsender = null;
    var senders = pc.getSenders();

    senders.forEach( sender => {
        if(sender && sender.track.kind === 'video') {
            vsender = sender;
        } 
    });

    var parameters = vsender.getParameters();
    if(!parameters.encodings) {
        return;
    }

    if(bw === 'unlimited') {
        return;
    } 

    parameters.encodings[0].maxBitrate = bw * 1000;

    vsender.setParameters(parameters)
        .then(()=>{
            bandwidth.disabled = false;
            console.log('Successed to set parameters!');
        })
        .catch(err =>{
            console.error(err);
        });

    return;
}

// query getStats every second
// 设置定时器，每秒处理一次，因为计算包的流量和发送包的次数都是1秒为单位的
window.setInterval(() => {
    if (!pc) {
        return;
    }

    var vsender = null;
    var senders = pc.getSenders();

    senders.forEach( sender => {
        if(sender && sender.track.kind === 'video') {
            vsender = sender;
        } 
    });

    //const vsender = pc.getSenders()[0];
    if (!vsender) {
        return;
    }

    vsender.getStats()
        .then(reports => {
        	reports.forEach(report => {
                let bytes;
                let packets;
                if (report.type === 'outbound-rtp') {
                    if (report.isRemote) {
                        return;
                    }
                    const curTs = report.timestamp;
                    bytes = report.bytesSent;
                    packets = report.packetsSent;
                    if (lastReportResult && lastReportResult.has(report.id)) {
                        // calculate bitrate
                        const bitrate = 8 * (bytes - lastReportResult.get(report.id).bytesSent) /
                              (curTs - lastReportResult.get(report.id).timestamp);

                        // append to chart
                        bitrateSeries.addPoint(curTs, bitrate);
                        bitrateGraph.setDataSeries([bitrateSeries]);
                        bitrateGraph.updateEndDate();

                        // calculate number of packets and append to chart
                        packetSeries.addPoint(curTs, packets - lastReportResult.get(report.id).packetsSent);
                        packetGraph.setDataSeries([packetSeries]);
                        packetGraph.updateEndDate();
                    }
                }
        	});
        	lastReportResult = reports;
    	})
        .catch(err =>{
            console.log(err);
        });
}, 1000);

function sendText(){
    var data = sendTxt.value;
    if(data) {
        dc.send(data);
    }

    sendTxt.value = '';
    chat.value += '<-' + data + '\r\n';
}

btnConn.onclick = connSignalServer;
btnLeave.onclick = leave;
optBW.onchange = change_bw;

btnSend.onclick = sendText;
```

</details>

