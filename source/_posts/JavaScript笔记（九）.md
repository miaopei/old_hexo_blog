---
title: JavaScript笔记（九）
date: 2017-07-19 19:57:35
tags: JavaScript
reward: true
categories: JavaScript
toc: true
---

# Node.js WebSocket REST

## WebSocket

WebSocket是HTML5新增的协议，它的目的是在浏览器和服务器之间建立一个不受限的双向通信的通道，比如说，服务器可以在任意时刻发送消息给浏览器。

为什么传统的HTTP协议不能做到WebSocket实现的功能？这是因为HTTP协议是一个请求－响应协议，请求必须先由浏览器发给服务器，服务器才能响应这个请求，再把数据发送给浏览器。换句话说，浏览器不主动请求，服务器是没法主动发数据给浏览器的。

这样一来，要在浏览器中搞一个实时聊天，在线炒股（不鼓励），或者在线多人游戏的话就没法实现了，只能借助Flash这些插件。

也有人说，HTTP协议其实也能实现啊，比如用轮询或者Comet。轮询是指浏览器通过JavaScript启动一个定时器，然后以固定的间隔给服务器发请求，询问服务器有没有新消息。这个机制的缺点一是实时性不够，二是频繁的请求会给服务器带来极大的压力。

Comet本质上也是轮询，但是在没有消息的情况下，服务器先拖一段时间，等到有消息了再回复。这个机制暂时地解决了实时性问题，但是它带来了新的问题：以多线程模式运行的服务器会让大部分线程大部分时间都处于挂起状态，极大地浪费服务器资源。另外，一个HTTP连接在长时间没有数据传输的情况下，链路上的任何一个网关都可能关闭这个连接，而网关是我们不可控的，这就要求Comet连接必须定期发一些ping数据表示连接“正常工作”。

<!-- more -->

以上两种机制都治标不治本，所以，HTML5推出了WebSocket标准，让浏览器和服务器之间可以建立无限制的全双工通信，任何一方都可以主动发消息给对方。

### WebSocket协议

WebSocket并不是全新的协议，而是利用了HTTP协议来建立连接。我们来看看WebSocket连接是如何创建的。

首先，WebSocket连接必须由浏览器发起，因为请求协议是一个标准的HTTP请求，格式如下：

```http
GET ws://localhost:3000/ws/chat HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Origin: http://localhost:3000
Sec-WebSocket-Key: client-random-string
Sec-WebSocket-Version: 13
```

该请求和普通的HTTP请求有几点不同：

1. GET请求的地址不是类似`/path/`，而是以`ws://`开头的地址；
2. 请求头`Upgrade: websocket`和`Connection: Upgrade`表示这个连接将要被转换为WebSocket连接；
3. `Sec-WebSocket-Key`是用于标识这个连接，并非用于加密数据；
4. `Sec-WebSocket-Version`指定了WebSocket的协议版本。

随后，服务器如果接受该请求，就会返回如下响应：

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: server-random-string
```

该响应代码`101`表示本次连接的HTTP协议即将被更改，更改后的协议就是`Upgrade: websocket`指定的WebSocket协议。

版本号和子协议规定了双方能理解的数据格式，以及是否支持压缩等等。如果仅使用WebSocket的API，就不需要关心这些。

现在，一个WebSocket连接就建立成功，浏览器和服务器就可以随时主动发送消息给对方。消息有两种，一种是文本，一种是二进制数据。通常，我们可以发送JSON格式的文本，这样，在浏览器处理起来就十分容易。

为什么WebSocket连接可以实现全双工通信而HTTP连接不行呢？实际上HTTP协议是建立在TCP协议之上的，TCP协议本身就实现了全双工通信，但是HTTP协议的请求－应答机制限制了全双工通信。WebSocket连接建立以后，其实只是简单规定了一下：接下来，咱们通信就不使用HTTP协议了，直接互相发数据吧。

安全的WebSocket连接机制和HTTPS类似。首先，浏览器用`wss://xxx`创建WebSocket连接时，会先通过HTTPS创建安全的连接，然后，该HTTPS连接升级为WebSocket连接，底层通信走的仍然是安全的SSL/TLS协议。

### 浏览器

很显然，要支持WebSocket通信，浏览器得支持这个协议，这样才能发出`ws://xxx`的请求。目前，支持WebSocket的主流浏览器如下：

- Chrome
- Firefox
- IE >= 10
- Sarafi >= 6
- Android >= 4.4
- iOS >= 8

### 服务器

由于WebSocket是一个协议，服务器具体怎么实现，取决于所用编程语言和框架本身。Node.js本身支持的协议包括TCP协议和HTTP协议，要支持WebSocket协议，需要对Node.js提供的HTTPServer做额外的开发。已经有若干基于Node.js的稳定可靠的WebSocket实现，我们直接用npm安装使用即可。

### 使用ws

要使用WebSocket，关键在于服务器端支持，这样，我们才有可能用支持WebSocket的浏览器使用WebSocket。

#### ws模块

在Node.js中，使用最广泛的WebSocket模块是`ws`，我们创建一个`hello-ws`的VS Code工程，然后在`package.json`中添加`ws`的依赖：

```json
"dependencies": {
    "ws": "1.1.1"
}
```

整个工程结构如下：

```javascript
hello-ws/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- app.js <-- 启动js文件
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
```

运行`npm install`后，我们就可以在`app.js`中编写WebSocket的服务器端代码。

创建一个WebSocket的服务器实例非常容易：

```javascript
// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    port: 3000
});
```

这样，我们就在3000端口上打开了一个WebSocket Server，该实例由变量`wss`引用。

接下来，如果有WebSocket请求接入，`wss`对象可以响应`connection`事件来处理这个WebSocket：

```javascript
wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        ws.send(`ECHO: ${message}`, (err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        });
    })
});
```

在`connection`事件中，回调函数会传入一个`WebSocket`的实例，表示这个WebSocket连接。对于每个WebSocket连接，我们都要对它绑定某些事件方法来处理不同的事件。这里，我们通过响应`message`事件，在收到消息后再返回一个`ECHO: xxx`的消息给客户端。

#### 创建WebSocket连接

现在，这个简单的服务器端WebSocket程序就编写好了。如何真正创建WebSocket并且给服务器发消息呢？方法是在浏览器中写JavaScript代码。

先在VS Code中执行`app.js`，或者在命令行用`npm start`执行。然后，在当前页面下，直接打开可以执行JavaScript代码的浏览器Console，依次输入代码：

```javascript
// 打开一个WebSocket:
var ws = new WebSocket('ws://localhost:3000/test');
// 响应onmessage事件:
ws.onmessage = function(msg) { console.log(msg); };
// 给服务器发送一个字符串:
ws.send('Hello!');
```

一切正常的话，可以看到Console的输出如下：

```json
MessageEvent {isTrusted: true, data: "ECHO: Hello!", origin: "ws://localhost:3000", lastEventId: "", source: null…}
```

这样，我们就在浏览器中成功地收到了服务器发送的消息！

如果嫌在浏览器中输入JavaScript代码比较麻烦，我们还可以直接用`ws`模块提供的`WebSocket`来充当客户端。换句话说，`ws`模块既包含了服务器端，又包含了客户端。

`ws`的`WebSocket`就表示客户端，它其实就是WebSocketServer响应`connection`事件时回调函数传入的变量`ws`的类型。

客户端的写法如下：

```javascript
let ws = new WebSocket('ws://localhost:3000/test');

// 打开WebSocket连接后立刻发送一条消息:
ws.on('open', function () {
    console.log(`[CLIENT] open()`);
    ws.send('Hello!');
});

// 响应收到的消息:
ws.on('message', function (message) {
    console.log(`[CLIENT] Received: ${message}`);
}
```

在Node环境下，`ws`模块的客户端可以用于测试服务器端代码，否则，每次都必须在浏览器执行JavaScript代码。

#### 同源策略

从上面的测试可以看出，WebSocket协议本身不要求同源策略（Same-origin Policy），也就是某个地址为`http://a.com`的网页可以通过WebSocket连接到`ws://b.com`。但是，浏览器会发送`Origin`的HTTP头给服务器，服务器可以根据`Origin`拒绝这个WebSocket请求。所以，是否要求同源要看服务器端如何检查。

#### 路由

还需要注意到服务器在响应`connection`事件时并未检查请求的路径，因此，在客户端打开`ws://localhost:3000/any/path`可以写任意的路径。

实际应用中还需要根据不同的路径实现不同的功能。

#### 参考源码

[hello-ws](https://github.com/michaelliao/learn-javascript/tree/master/samples/node/web/ws/hello-ws)

### 编写聊天室

上一节我们用`ws`模块创建了一个WebSocket应用。但是它只能简单地响应`ECHO: xxx`消息，还属于Hello, world级别的应用。

要创建真正的WebSocket应用，首先，得有一个基于MVC的Web应用，也就是我们在前面用koa2和Nunjucks创建的Web，在此基础上，把WebSocket添加进来，才算完整。

因此，本节的目标是基于WebSocket创建一个在线聊天室。

首先，我们把前面编写的MVC工程复制一份，先创建一个完整的MVC的Web应用，结构如下：

```javascript
ws-with-koa/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- controllers/ <-- Controller
|
+- views/ <-- html模板文件
|
+- static/ <-- 静态资源文件
|
+- app.js <-- 使用koa的js
|
+- controller.js <-- 扫描注册Controller
|
+- static-files.js <-- 处理静态文件
|
+- templating.js <-- 模版引擎入口
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
```

然后，把我们需要的依赖包添加到`package.json`：

```json
"dependencies": {
    "ws": "1.1.1",
    "koa": "2.0.0",
    "koa-bodyparser": "3.2.0",
    "koa-router": "7.0.0",
    "nunjucks": "2.4.2",
    "mime": "1.3.4",
    "mz": "2.4.0"
}
```

使用`npm install`安装后，我们首先得到了一个标准的基于MVC的koa2应用。该应用的核心是一个代表koa应用的`app`变量：

```javascript
const app = new Koa();

// TODO: app.use(...);

app.listen(3000);
```

现在第一个问题来了：koa通过3000端口响应HTTP，我们要新加的WebSocketServer还能否使用3000端口？

答案是肯定的。虽然WebSocketServer可以使用别的端口，但是，统一端口有个最大的好处：

实际应用中，HTTP和WebSocket都使用标准的80和443端口，不需要暴露新的端口，也不需要修改防火墙规则。

在3000端口被koa占用后，WebSocketServer如何使用该端口？

实际上，3000端口并非由koa监听，而是koa调用Node标准的http模块创建的http.Server监听的。koa只是把响应函数注册到该http.Server中了。类似的，WebSocketServer也可以把自己的响应函数注册到http.Server中，这样，同一个端口，根据协议，可以分别由koa和ws处理：

![](http://i.imgur.com/p68cjtk.png)

把WebSocketServer绑定到同一个端口的关键代码是先获取koa创建的`http.Server`的引用，再根据`http.Server`创建WebSocketServer：

```javascript
// koa app的listen()方法返回http.Server:
let server = app.listen(3000);

// 创建WebSocketServer:
let wss = new WebSocketServer({
    server: server
});
```

要始终注意，浏览器创建WebSocket时发送的仍然是标准的HTTP请求。无论是WebSocket请求，还是普通HTTP请求，都会被http.Server处理。具体的处理方式则是由koa和WebSocketServer注入的回调函数实现的。WebSocketServer会首先判断请求是不是WS请求，如果是，它将处理该请求，如果不是，该请求仍由koa处理。

所以，WS请求会直接由WebSocketServer处理，它根本不会经过koa，koa的任何middleware都没有机会处理该请求。

现在第二个问题来了：在koa应用中，可以很容易地认证用户，例如，通过session或者cookie，但是，在响应WebSocket请求时，如何识别用户身份？

一个简单可行的方案是把用户登录后的身份写入Cookie，在koa中，可以使用middleware解析Cookie，把用户绑定到`ctx.state.user`上。

WS请求也是标准的HTTP请求，所以，服务器也会把Cookie发送过来，这样，我们在用WebSocketServer处理WS请求时，就可以根据Cookie识别用户身份。

先把识别用户身份的逻辑提取为一个单独的函数：

```javascript
function parseUser(obj) {
    if (!obj) {
        return;
    }
    console.log('try parse: ' + obj);
    let s = '';
    if (typeof obj === 'string') {
        s = obj;
    } else if (obj.headers) {
        let cookies = new Cookies(obj, null);
        s = cookies.get('name');
    }
    if (s) {
        try {
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            console.log(`User: ${user.name}, ID: ${user.id}`);
            return user;
        } catch (e) {
            // ignore
        }
    }
}
```

*注意*：出于演示目的，该Cookie并没有作Hash处理，实际上它就是一个JSON字符串。

在koa的middleware中，我们很容易识别用户：

```javascript
app.use(async (ctx, next) => {
    ctx.state.user = parseUser(ctx.cookies.get('name') || '');
    await next();
});
```

在WebSocketServer中，就需要响应`connection`事件，然后识别用户：

```javascript
wss.on('connection', function (ws) {
    // ws.upgradeReq是一个request对象:
    let user = parseUser(ws.upgradeReq);
    if (!user) {
        // Cookie不存在或无效，直接关闭WebSocket:
        ws.close(4001, 'Invalid user');
    }
    // 识别成功，把user绑定到该WebSocket对象:
    ws.user = user;
    // 绑定WebSocketServer对象:
    ws.wss = wss;
});
```

紧接着，我们要对每个创建成功的WebSocket绑定`message`、`close`、`error`等事件处理函数。对于聊天应用来说，每收到一条消息，就需要把该消息广播到所有WebSocket连接上。

先为`wss`对象添加一个`broadcase()`方法：

```javascript
wss.broadcast = function (data) {
    wss.clients.forEach(function (client) {
        client.send(data);
    });
};
```

在某个WebSocket收到消息后，就可以调用`wss.broadcast()`进行广播了：

```javascript
ws.on('message', function (message) {
    console.log(message);
    if (message && message.trim()) {
        let msg = createMessage('chat', this.user, message.trim());
        this.wss.broadcast(msg);
    }
});
```

消息有很多类型，不一定是聊天的消息，还可以有获取用户列表、用户加入、用户退出等多种消息。所以我们用`createMessage()`创建一个JSON格式的字符串，发送给浏览器，浏览器端的JavaScript就可以直接使用：

```javascript
// 消息ID:
var messageIndex = 0;

function createMessage(type, user, data) {
    messageIndex ++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}
```

#### 编写页面

相比服务器端的代码，页面的JavaScript代码会更复杂。

聊天室页面可以划分为左侧会话列表和右侧用户列表两部分：

![](http://i.imgur.com/AL9NUf1.png)

这里的DOM需要动态更新，因此，状态管理是页面逻辑的核心。

为了简化状态管理，我们用Vue控制左右两个列表：

```javascript
var vmMessageList = new Vue({
    el: '#message-list',
    data: {
        messages: []
    }
});

var vmUserList = new Vue({
    el: '#user-list',
    data: {
        users: []
    }
});
```

会话列表和用户列表初始化为空数组。

紧接着，创建WebSocket连接，响应服务器消息，并且更新会话列表和用户列表：

```javascript
var ws = new WebSocket('ws://localhost:3000/ws/chat');

ws.onmessage = function(event) {
    var data = event.data;
    console.log(data);
    var msg = JSON.parse(data);
    if (msg.type === 'list') {
        vmUserList.users = msg.data;
    } else if (msg.type === 'join') {
        addToUserList(vmUserList.users, msg.user);
        addMessage(vmMessageList.messages, msg);
    } else if (msg.type === 'left') {
        removeFromUserList(vmUserList.users, msg.user);
        addMessage(vmMessageList.messages, msg);
    } else if (msg.type === 'chat') {
        addMessage(vmMessageList.messages, msg);
    }
};
```

这样，JavaScript负责更新状态，Vue负责根据状态刷新DOM。以用户列表为例，HTML代码如下：

```html
<div id="user-list">
    <div class="media" v-for="user in users">
        <div class="media-left">
            <img class="media-object" src="/static/user.png">
        </div>
        <div class="media-body">
            <h4 class="media-heading" v-text="user.name"></h4>
        </div>
    </div>
</div>
```

测试的时候，如果在本机测试，需要同时用几个不同的浏览器，这样Cookie互不干扰。

最终的聊天室效果如下：

![](http://i.imgur.com/erE22nB.png)

#### 配置反向代理

如果网站配置了反向代理，例如Nginx，则HTTP和WebSocket都必须通过反向代理连接Node服务器。HTTP的反向代理非常简单，但是要正常连接WebSocket，代理服务器必须支持WebSocket协议。

我们以Nginx为例，编写一个简单的反向代理配置文件。

详细的配置可以参考Nginx的官方博客：[Using NGINX as a WebSocket Proxy](https://www.nginx.com/blog/websocket-nginx/)

首先要保证Nginx版本>=1.3，然后，通过`proxy_set_header`指令，设定：

```
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

Nginx即可理解该连接将使用WebSocket协议。

一个示例配置文件内容如下：

```json
server {
    listen      80;
    server_name localhost;

    # 处理静态资源文件:
    location ^~ /static/ {
        root /path/to/ws-with-koa;
    }

    # 处理WebSocket连接:
    location ^~ /ws/ {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
    }

    # 其他所有请求:
    location / {
        proxy_pass       http://127.0.0.1:3000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 参考源码

[ws-with-koa](https://github.com/michaelliao/learn-javascript/tree/master/samples/node/web/ws/ws-with-koa)

## REST

自从Roy Fielding博士在2000年他的博士论文中提出[REST](http://zh.wikipedia.org/wiki/REST)（Representational State Transfer）风格的软件架构模式后，REST就基本上迅速取代了复杂而笨重的SOAP，成为Web API的标准了。

什么是Web API呢？

如果我们想要获取某个电商网站的某个商品，输入`http://localhost:3000/products/123`，就可以看到id为123的商品页面，但这个结果是HTML页面，它同时混合包含了Product的数据和Product的展示两个部分。对于用户来说，阅读起来没有问题，但是，如果机器读取，就很难从HTML中解析出Product的数据。

如果一个URL返回的不是HTML，而是机器能直接解析的数据，这个URL就可以看成是一个Web API。比如，读取`http://localhost:3000/api/products/123`，如果能直接返回Product的数据，那么机器就可以直接读取。

REST就是一种设计API的模式。最常用的数据格式是JSON。由于JSON能直接被JavaScript读取，所以，以JSON格式编写的REST风格的API具有简单、易读、易用的特点。

编写API有什么好处呢？由于API就是把Web App的功能全部封装了，所以，通过API操作数据，可以极大地把前端和后端的代码隔离，使得后端代码易于测试，前端代码编写更简单。

此外，如果我们把前端页面看作是一种用于展示的客户端，那么API就是为客户端提供数据、操作数据的接口。这种设计可以获得极高的扩展性。例如，当用户需要在手机上购买商品时，只需要开发针对iOS和Android的两个客户端，通过客户端访问API，就可以完成通过浏览器页面提供的功能，而后端代码基本无需改动。

当一个Web应用以API的形式对外提供功能时，整个应用的结构就扩展为：

![](http://i.imgur.com/Uxndw7P.png)

把网页视为一种客户端，是REST架构可扩展的一个关键。

### 编写REST API

#### REST API规范

编写REST API，实际上就是编写处理HTTP请求的async函数，不过，REST请求和普通的HTTP请求有几个特殊的地方：

1. REST请求仍然是标准的HTTP请求，但是，除了GET请求外，POST、PUT等请求的body是JSON数据格式，请求的`Content-Type`为`application/json`；
2. REST响应返回的结果是JSON数据格式，因此，响应的`Content-Type`也是`application/json`。

REST规范定义了资源的通用访问格式，虽然它不是一个强制要求，但遵守该规范可以让人易于理解。

例如，商品Product就是一种资源。获取所有Product的URL如下：

```http
GET /api/products
```

而获取某个指定的Product，例如，id为`123`的Product，其URL如下：

```http
GET /api/products/123
```

新建一个Product使用POST请求，JSON数据包含在body中，URL如下：

```http
POST /api/products
```

更新一个Product使用PUT请求，例如，更新id为`123`的Product，其URL如下：

```http
PUT /api/products/123
```

删除一个Product使用DELETE请求，例如，删除id为`123`的Product，其URL如下：

```http
DELETE /api/products/123
```

资源还可以按层次组织。例如，获取某个Product的所有评论，使用：

```http
GET /api/products/123/reviews
```

当我们只需要获取部分数据时，可通过参数限制返回的结果集，例如，返回第2页评论，每页10项，按时间排序：

```http
GET /api/products/123/reviews?page=2&size=10&sort=time
```

#### koa处理REST

既然我们已经使用koa作为Web框架处理HTTP请求，因此，我们仍然可以在koa中响应并处理REST请求。

我们先创建一个`rest-hello`的工程，结构如下：

```javascript
rest-hello/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- controllers/
|  |
|  +- api.js <-- REST API
|
+- app.js <-- 使用koa的js
|
+- controller.js <-- 扫描注册Controller
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
```

在`package.json`中，我们需要如下依赖包：

```json
"dependencies": {
    "koa": "2.0.0",
    "koa-bodyparser": "3.2.0",
    "koa-router": "7.0.0"
}
```

运行`npm install`安装依赖包。

在`app.js`中，我们仍然使用标准的koa组件，并自动扫描加载`controllers`目录下的所有js文件：

```javascript
const app = new Koa();

const controller = require('./controller');

// parse request body:
app.use(bodyParser());

// add controller:
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
```

注意到`app.use(bodyParser());`这个语句，它给koa安装了一个解析HTTP请求body的处理函数。如果HTTP请求是JSON数据，我们就可以通过`ctx.request.body`直接访问解析后的JavaScript对象。

下面我们编写`api.js`，添加一个GET请求：

```javascript
// 存储Product列表，相当于模拟数据库:
var products = [{
    name: 'iPhone',
    price: 6999
}, {
    name: 'Kindle',
    price: 999
}];

module.exports = {
    'GET /api/products': async (ctx, next) => {
        // 设置Content-Type:
        ctx.response.type = 'application/json';
        // 设置Response Body:
        ctx.response.body = {
            products: products
        };
    }
}
```

在koa中，我们只需要给`ctx.response.body`赋值一个JavaScript对象，koa会自动把该对象序列化为JSON并输出到客户端。

我们在浏览器中访问`http://localhost:3000/api/products`，可以得到如下输出：

```json
{"products":[{"name":"iPhone","price":6999},{"name":"Kindle","price":999}]}
```

紧接着，我们再添加一个创建Product的API：

```javascript
module.exports = {
    'GET /api/products': async (ctx, next) => {
        ...
    },

    'POST /api/products': async (ctx, next) => {
        var p = {
            name: ctx.request.body.name,
            price: ctx.request.body.price
        };
        products.push(p);
        ctx.response.type = 'application/json';
        ctx.response.body = p;
    }
};
```

这个POST请求无法在浏览器中直接测试。但是我们可以通过`curl`命令在命令提示符窗口测试这个API。我们输入如下命令：

```shell
curl -H 'Content-Type: application/json' -X POST -d '{"name":"XBox","price":3999}' http://localhost:3000/api/products
```

得到的返回内容如下：

```json
{"name":"XBox","price":3999}
```

我们再在浏览器中访问`http://localhost:3000/api/products`，可以得到更新后的输出如下：

```json
{"products":[{"name":"iPhone","price":6999},{"name":"Kindle","price":999},{"name":"XBox","price":3999}]}
```

可见，在koa中处理REST请求是非常简单的。`bodyParser()`这个middleware可以解析请求的JSON数据并绑定到`ctx.request.body`上，输出JSON时我们先指定`ctx.response.type = 'application/json'`，然后把JavaScript对象赋值给`ctx.response.body`就完成了REST请求的处理。

#### 参考源码

[rest-hello](https://github.com/michaelliao/learn-javascript/tree/master/samples/node/web/rest/rest-hello)

### 开发REST API

在上一节中，我们演示了如何在koa项目中使用REST。其实，使用REST和使用MVC是类似的，不同的是，提供REST的Controller处理函数最后不调用`render()`去渲染模板，而是把结果直接用JSON序列化返回给客户端。

使用REST虽然非常简单，但是，设计一套合理的REST框架却需要仔细考虑很多问题。

#### 问题一：如何组织URL

在实际工程中，一个Web应用既有REST，还有MVC，可能还需要集成其他第三方系统。如何组织URL？

一个简单的方法是通过固定的前缀区分。例如，`/static/`开头的URL是静态资源文件，类似的，`/api/`开头的URL就是REST API，其他URL是普通的MVC请求。

使用不同的子域名也可以区分，但对于中小项目来说配置麻烦。随着项目的扩大，将来仍然可以把单域名拆成多域名。

#### 问题二：如何统一输出REST

如果每个异步函数都编写下面这样的代码：

```javascript
// 设置Content-Type:
ctx.response.type = 'application/json';
// 设置Response Body:
ctx.response.body = {
    products: products
};
```

很显然，这样的重复代码很容易导致错误，例如，写错了字符串`'application/json'`，或者漏写了`ctx.response.type = 'application/json'`，都会导致浏览器得不到JSON数据。

回忆我们集成Nunjucks模板引擎的方法：通过一个middleware给`ctx`添加一个`render()`方法，Controller就可以直接使用`ctx.render('view', model)`来渲染模板，不必编写重复的代码。

类似的，我们也可以通过一个middleware给`ctx`添加一个`rest()`方法，直接输出JSON数据。

由于我们给所有REST API一个固定的URL前缀`/api/`，所以，这个middleware还需要根据path来判断当前请求是否是一个REST请求，如果是，我们才给`ctx`绑定`rest()`方法。

我们把这个middleware先写出来，命名为`rest.js`：

```javascript
module.exports = {
    restify: (pathPrefix) => {
        // REST API前缀，默认为/api/:
        pathPrefix = pathPrefix || '/api/';
        return async (ctx, next) => {
            // 是否是REST API前缀?
            if (ctx.request.path.startsWith(pathPrefix)) {
                // 绑定rest()方法:
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                }
                await next();
            } else {
                await next();
            }
        };
    }
};
```

这样，任何支持REST的异步函数只需要简单地调用：

```javascript
ctx.rest({
    data: 123
});
```

就完成了REST请求的处理。

#### 问题三：如何处理错误

这个问题实际上有两部分。

第一，当REST API请求出错时，我们如何返回错误信息？

第二，当客户端收到REST响应后，如何判断是成功还是错误？

这两部分还必须统一考虑。

REST架构本身对错误处理并没有统一的规定。实际应用时，各种各样的错误处理机制都有。有的设计得比较合理，有的设计得不合理，导致客户端尤其是手机客户端处理API简直就是噩梦。

在涉及到REST API的错误时，我们必须先意识到，客户端会遇到两种类型的REST API错误。

一类是类似403，404，500等错误，这些错误实际上是HTTP请求可能发生的错误。REST请求只是一种请求类型和响应类型均为JSON的HTTP请求，因此，这些错误在REST请求中也会发生。

针对这种类型的错误，客户端除了提示用户“出现了网络错误，稍后重试”以外，并无法获得具体的错误信息。

另一类错误是业务逻辑的错误，例如，输入了不合法的Email地址，试图删除一个不存在的Product，等等。这种类型的错误完全可以通过JSON返回给客户端，这样，客户端可以根据错误信息提示用户“Email不合法”等，以便用户修复后重新请求API。

问题的关键在于客户端必须能区分出这两种类型的错误。

第一类的错误实际上客户端可以识别，并且我们也无法操控HTTP服务器的错误码。

第二类的错误信息是一个JSON字符串，例如：

```json
{
    "code": "10000",
    "message": "Bad email address"
}
```

但是HTTP的返回码应该用啥？

有的Web应用使用`200`，这样客户端在识别出第一类错误后，如果遇到`200`响应，则根据响应的JSON判断是否有错误。这种方式对于动态语言（例如，JavaScript，Python等）非常容易：

```javascript
var result = JSON.parse(response.data);
if (result.code) {
    // 有错误:
    alert(result.message);
} else {
    // 没有错误
}
```

但是，对于静态语言（例如，Java）就比较麻烦，很多时候，不得不做两次序列化：

```javascript
APIError err = objectMapper.readValue(jsonString, APIError.class);
if (err.code == null) {
    // 没有错误，还需要重新转换:
    User user = objectMapper.readValue(jsonString, User.class);
} else {
    // 有错误:
}
```

有的Web应用对正确的REST响应使用`200`，对错误的REST响应使用`400`，这样，客户端即是静态语言，也可以根据HTTP响应码判断是否出错，出错时直接把结果反序列化为`APIError`对象。

两种方式各有优劣。我们选择第二种，`200`表示成功响应，`400`表示失败响应。

但是，要注意，*绝不能*混合其他HTTP错误码。例如，使用`401`响应“登录失败”，使用`403`响应“权限不够”。这会使客户端无法有效识别HTTP错误码和业务错误，其原因在于HTTP协议定义的错误码十分偏向底层，而REST API属于“高层”协议，不应该复用底层的错误码。

#### 问题四：如何定义错误码

REST架构本身同样没有标准的错误码定义一说，因此，有的Web应用使用数字`1000`、`1001`……作为错误码，例如Twitter和新浪微博，有的Web应用使用字符串作为错误码，例如YouTube。到底哪一种比较好呢？

我们强烈建议使用字符串作为错误码。原因在于，使用数字作为错误码时，API提供者需要维护一份错误码代码说明表，并且，该文档必须时刻与API发布同步，否则，客户端开发者遇到一个文档上没有写明的错误码，就完全不知道发生了什么错误。

使用字符串作为错误码，最大的好处在于不用查表，根据字面意思也能猜个八九不离十。例如，YouTube API如果返回一个错误`authError`，基本上能猜到是因为认证失败。

我们定义的REST API错误格式如下：

```json
{
    "code": "错误代码",
    "message": "错误描述信息"
}
```

其中，错误代码命名规范为`大类:子类`，例如，口令不匹配的登录错误代码为`auth:bad_password`，用户名不存在的登录错误代码为`auth:user_not_found`。这样，客户端既可以简单匹配某个类别的错误，也可以精确匹配某个特定的错误。

#### 问题五：如何返回错误

如果一个REST异步函数想要返回错误，一个直观的想法是调用`ctx.rest()`：

```javascript
user = processLogin(username, password);
if (user != null) {
    ctx.rest(user);
} else {
    ctx.response.status = 400;
    ctx.rest({
        code: 'auth:user_not_found',
        message: 'user not found'
    });
}
```

这种方式不好，因为控制流程会混乱，而且，错误只能在Controller函数中输出。

更好的方式是异步函数直接用`throw`语句抛出错误，让middleware去处理错误：

```javascript
user = processLogin(username, password);
if (user != null) {
    ctx.rest(user);
} else {
    throw new APIError('auth:user_not_found', 'user not found');
}
```

这种方式可以在异步函数的任何地方抛出错误，包括调用的子函数内部。

我们只需要稍稍改写一个middleware就可以处理错误：

```javascript
module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/api/';
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                // 绑定rest()方法:
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                }
                try {
                    await next();
                } catch (e) {
                    // 返回错误:
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'internal:unknown_error',
                        message: e.message || ''
                    };
                }
            } else {
                await next();
            }
        };
    }
};
```

这个错误处理的好处在于，不但简化了Controller的错误处理（只需要throw，其他不管），并且，在遇到非APIError的错误时，自动转换错误码为`internal:unknown_error`。

受益于async/await语法，我们在middleware中可以直接用`try...catch`捕获异常。如果是callback模式，就无法用`try...catch`捕获，代码结构将混乱得多。

最后，顺便把`APIError`这个对象export出去。

### 开发REST API

我们先根据`rest-hello`和`view-koa`来创建一个`rest-hello`的工程，结构如下：

```javascript
rest-koa/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- controllers/
|  |
|  +- api.js <-- REST API
|  |
|  +- index.js <-- MVC Controllers
|
+- products.js <-- 集中处理Product
|
+- rest.js <-- 支持REST的middleware
|
+- app.js <-- 使用koa的js
|
+- controller.js <-- 扫描注册Controller
|
+- static-files.js <-- 支持静态文件的middleware
|
+- templating.js <-- 支持Nunjucks的middleware
|
+- package.json <-- 项目描述文件
|
+- views/ <-- Nunjucks模板
|
+- static/ <-- 静态资源文件
|
+- node_modules/ <-- npm安装的所有依赖包
```

在`package.json`中，我们需要如下依赖包：

```json
"dependencies": {
    "koa": "2.0.0",
    "koa-bodyparser": "3.2.0",
    "koa-router": "7.0.0",
    "nunjucks": "2.4.2",
    "mime": "1.3.4",
    "mz": "2.4.0"
}
```

运行`npm install`安装依赖包。

我们在这个工程中约定了如下规范：

1. REST API的返回值全部是object对象，而不是简单的number、boolean、null或者数组；
2. REST API必须使用前缀`/api/`。

第一条规则实际上是为了方便客户端处理结果。如果返回结果不是object，则客户端反序列化后还需要判断类型。以Objective-C为例，可以直接返回`NSDictionary*`：

```javascript
NSDictionary* dict = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&err];
```

如果返回值可能是number、boolean、null或者数组，则客户端的工作量会大大增加。

#### Service

为了操作Product，我们用`products.js`封装所有操作，可以把它视为一个Service：

```javascript
var id = 0;

function nextId() {
    id++;
    return 'p' + id;
}

function Product(name, manufacturer, price) {
    this.id = nextId();
    this.name = name;
    this.manufacturer = manufacturer;
    this.price = price;
}

var products = [
    new Product('iPhone 7', 'Apple', 6800),
    new Product('ThinkPad T440', 'Lenovo', 5999),
    new Product('LBP2900', 'Canon', 1099)
];

module.exports = {
    getProducts: () => {
        return products;
    },

    getProduct: (id) => {
        var i;
        for (i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                return products[i];
            }
        }
        return null;
    },

    createProduct: (name, manufacturer, price) => {
        var p = new Product(name, manufacturer, price);
        products.push(p);
        return p;
    },

    deleteProduct: (id) => {
        var
            index = -1,
            i;
        for (i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            // remove products[index]:
            return products.splice(index, 1)[0];
        }
        return null;
    }
};
```

变量`products`相当于在内存中模拟了数据库，这里是为了简化逻辑。

#### API

紧接着，我们编写`api.js`，并放到`controllers`目录下：

```javascript
const products = require('../products');

const APIError = require('../rest').APIError;

module.exports = {
    'GET /api/products': async (ctx, next) => {
        ctx.rest({
            products: products.getProducts()
        });
    },

    'POST /api/products': async (ctx, next) => {
        var p = products.createProduct(ctx.request.body.name, ctx.request.body.manufacturer, parseFloat(ctx.request.body.price));
        ctx.rest(p);
    },

    'DELETE /api/products/:id': async (ctx, next) => {
        console.log(`delete product ${ctx.params.id}...`);
        var p = products.deleteProduct(ctx.params.id);
        if (p) {
            ctx.rest(p);
        } else {
            throw new APIError('product:not_found', 'product not found by id.');
        }
    }
};
```

该API支持GET、POST和DELETE这三个请求。当然，还可以添加更多的API。

编写API时，需要注意：

如果客户端传递了JSON格式的数据（例如，POST请求），则async函数可以通过`ctx.request.body`直接访问已经反序列化的JavaScript对象。这是由`bodyParser()`这个middleware完成的。如果`ctx.request.body`为`undefined`，说明缺少middleware，或者middleware没有正确配置。

如果API路径带有参数，参数必须用`:`表示，例如，`DELETE /api/products/:id`，客户端传递的URL可能就是`/api/products/A001`，参数`id`对应的值就是`A001`，要获得这个参数，我们用`ctx.params.id`。

类似的，如果API路径有多个参数，例如，`/api/products/:pid/reviews/:rid`，则这两个参数分别用`ctx.params.pid`和`ctx.params.rid`获取。

这个功能由koa-router这个middleware提供。

*请注意*：API路径的参数永远是字符串！

#### MVC

有了API以后，我们就可以编写MVC，在页面上调用API完成操作。

先在`controllers`目录下创建`index.js`，编写页面入口函数：

```javascript
module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html');
    }
};
```

然后，我们在`views`目录下创建`index.html`，编写JavaScript代码读取Products：

```javascript
$(function () {
    var vm = new Vue({
        el: '#product-list',
        data: {
            products: []
        }
    });

    $.getJSON('/api/products').done(function (data) {
        vm.products = data.products;
    }).fail(function (jqXHR, textStatus) {
        alert('Error: ' + jqXHR.status);
    });
});
```

与VM对应的HTML如下：

```javascript
<table id="product-list" class="table table-hover">
    <thead>
        <tr>
            <th style="width:50px"></th>
            <th>Product</th>
            <th style="width:150px">Price</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="p in products">
            <td>
                <img class="media-object" style="width:40px; height:40px;" src="/static/images/icon.png">
            </td>
            <td>
                <h4 class="media-heading" v-text="p.name"></h4>
                <p><span v-text="p.manufacturer"></span></p>
            </td>
            <td>
                <p style="font-size:2em">¥ <span v-text="p.price"></span></p>
            </td>
        </tr>
    </tbody>
</table>
```

当products变化时，Vue会自动更新表格的内容。

类似的，可以添加创建和删除Product的功能，并且刷新变量`products`的内容，就可以实时更新Product列表。

最终的页面效果如下：

![](http://i.imgur.com/mFBhgiK.png)

右侧可以通过`POST /api/products`创建新的Product，左侧可以通过`GET /api/products`列出所有Product，并且还可以通过`DELETE /api/products/<id>`来删除某个Product。

#### 参考源码

[rest-koa](https://github.com/michaelliao/learn-javascript/tree/master/samples/node/web/rest/rest-koa)



