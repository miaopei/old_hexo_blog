---
title: WebRTC（三）
tags: WebRTC
reward: true
categories: WebRTC
abbrlink: 39639
date: 2019-05-17 10:14:50
---

## WebRTC 环境搭建

### 简单的 https server 服务搭建

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
        socket.to(room).emit('message', room, data);
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
        socket.emit('leaved', room, socket.id);

        //socket.to(room).emit('leaved', room, socket.id); // 除自己之外
        //io.in(room).emit('leaved', room, socket.id); // 房间内所有人
        //socket.broadcast.emit('leaved', room, socket.id); // 除自己，全部站点
    })
})

https_server.listen(443, '0.0.0.0');
```

</details>

