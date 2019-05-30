---
title: JavaScript笔记（八）
date: 2017-07-15 19:57:35
tags: JavaScript
reward: true
categories: JavaScript
toc: true
---

# Node.js mysql mocha

## mysql

### 访问数据库

程序运行的时候，数据都是在内存中的。当程序终止的时候，通常都需要将数据保存到磁盘上，无论是保存到本地磁盘，还是通过网络保存到服务器上，最终都会将数据写入磁盘文件。

而如何定义数据的存储格式就是一个大问题。如果我们自己来定义存储格式，比如保存一个班级所有学生的成绩单：

| 名字      | 成绩   |
| ------- | ---- |
| Michael | 99   |
| Bob     | 85   |
| Bart    | 59   |
| Lisa    | 87   |

你可以用一个文本文件保存，一行保存一个学生，用`,`隔开：

```javascript
Michael,99
Bob,85
Bart,59
Lisa,87
```

<!-- more -->

你还可以用JSON格式保存，也是文本文件：

```json
[
    {"name":"Michael","score":99},
    {"name":"Bob","score":85},
    {"name":"Bart","score":59},
    {"name":"Lisa","score":87}
]
```

你还可以定义各种保存格式，但是问题来了：

存储和读取需要自己实现，JSON还是标准，自己定义的格式就各式各样了；

不能做快速查询，只有把数据全部读到内存中才能自己遍历，但有时候数据的大小远远超过了内存（比如蓝光电影，40GB的数据），根本无法全部读入内存。

为了便于程序保存和读取数据，而且，能直接通过条件快速查询到指定的数据，就出现了数据库（Database）这种专门用于集中存储和查询的软件。

数据库软件诞生的历史非常久远，早在1950年数据库就诞生了。经历了网状数据库，层次数据库，我们现在广泛使用的关系数据库是20世纪70年代基于关系模型的基础上诞生的。

关系模型有一套复杂的数学理论，但是从概念上是十分容易理解的。举个学校的例子：

假设某个XX省YY市ZZ县第一实验小学有3个年级，要表示出这3个年级，可以在Excel中用一个表格画出来：

![](http://i.imgur.com/MKkamTR.png)

每个年级又有若干个班级，要把所有班级表示出来，可以在Excel中再画一个表格：

![](http://i.imgur.com/3kg5xb1.png)

这两个表格有个映射关系，就是根据Grade_ID可以在班级表中查找到对应的所有班级：

![](http://i.imgur.com/GG96qsd.png)

也就是Grade表的每一行对应Class表的多行，在关系数据库中，这种基于表（Table）的一对多的关系就是关系数据库的基础。

根据某个年级的ID就可以查找所有班级的行，这种查询语句在关系数据库中称为SQL语句，可以写成：

```mysql
SELECT * FROM classes WHERE grade_id = '1';
```

结果也是一个表：

```
---------+----------+----------
grade_id | class_id | name
---------+----------+----------
1        | 11       | 一年级一班
---------+----------+----------
1        | 12       | 一年级二班
---------+----------+----------
1        | 13       | 一年级三班
---------+----------+----------
```

类似的，Class表的一行记录又可以关联到Student表的多行记录：

![](http://i.imgur.com/RD0N9u1.png)

由于本教程不涉及到关系数据库的详细内容，如果你想从零学习关系数据库和基本的SQL语句，请自行搜索相关课程。

### NoSQL

你也许还听说过NoSQL数据库，很多NoSQL宣传其速度和规模远远超过关系数据库，所以很多同学觉得有了NoSQL是否就不需要SQL了呢？千万不要被他们忽悠了，连SQL都不明白怎么可能搞明白NoSQL呢？

### 数据库类别

既然我们要使用关系数据库，就必须选择一个关系数据库。目前广泛使用的关系数据库也就这么几种：

付费的商用数据库：

- Oracle，典型的高富帅；
- SQL Server，微软自家产品，Windows定制专款；
- DB2，IBM的产品，听起来挺高端；
- Sybase，曾经跟微软是好基友，后来关系破裂，现在家境惨淡。

这些数据库都是不开源而且付费的，最大的好处是花了钱出了问题可以找厂家解决，不过在Web的世界里，常常需要部署成千上万的数据库服务器，当然不能把大把大把的银子扔给厂家，所以，无论是Google、Facebook，还是国内的BAT，无一例外都选择了免费的开源数据库：

- MySQL，大家都在用，一般错不了；
- PostgreSQL，学术气息有点重，其实挺不错，但知名度没有MySQL高；
- sqlite，嵌入式数据库，适合桌面和移动应用。

作为一个JavaScript全栈工程师，选择哪个免费数据库呢？当然是MySQL。因为MySQL普及率最高，出了错，可以很容易找到解决方法。而且，围绕MySQL有一大堆监控和运维的工具，安装和使用很方便。

### 安装MySQL

为了能继续后面的学习，你需要从MySQL官方网站下载并安装[MySQL Community Server 5.6](http://dev.mysql.com/downloads/mysql/)，这个版本是免费的，其他高级版本是要收钱的（请放心，收钱的功能我们用不上）。MySQL是跨平台的，选择对应的平台下载安装文件，安装即可。

安装时，MySQL会提示输入`root`用户的口令，请务必记清楚。如果怕记不住，就把口令设置为`password`。

在Windows上，安装时请选择`UTF-8`编码，以便正确地处理中文。

在Mac或Linux上，需要编辑MySQL的配置文件，把数据库默认的编码全部改为UTF-8。MySQL的配置文件默认存放在`/etc/my.cnf`或者`/etc/mysql/my.cnf`：

```mysql
[client]
default-character-set = utf8

[mysqld]
default-storage-engine = INNODB
character-set-server = utf8
collation-server = utf8_general_ci
```

重启MySQL后，可以通过MySQL的客户端命令行检查编码：

```mysql
$ mysql -u root -p
Enter password: 
Welcome to the MySQL monitor..
...

mysql> show variables like '%char%';
+--------------------------+--------------------------------------------------------+
| Variable_name            | Value                                                  |
+--------------------------+--------------------------------------------------------+
| character_set_client     | utf8                                                   |
| character_set_connection | utf8                                                   |
| character_set_database   | utf8                                                   |
| character_set_filesystem | binary                                                 |
| character_set_results    | utf8                                                   |
| character_set_server     | utf8                                                   |
| character_set_system     | utf8                                                   |
| character_sets_dir       | /usr/local/mysql-5.1.65-osx10.6-x86_64/share/charsets/ |
+--------------------------+--------------------------------------------------------+
8 rows in set (0.00 sec)
```

看到`utf8`字样就表示编码设置正确。

*注*：如果MySQL的版本≥5.5.3，可以把编码设置为`utf8mb4`，`utf8mb4`和`utf8`完全兼容，但它支持最新的Unicode标准，可以显示emoji字符。

### 使用Sequelize

#### 访问MySQL

当我们安装好MySQL后，Node.js程序如何访问MySQL数据库呢？

访问MySQL数据库只有一种方法，就是通过网络发送SQL命令，然后，MySQL服务器执行后返回结果。

我们可以在命令行窗口输入`mysql -u root -p`，然后输入root口令后，就连接到了MySQL服务器。因为没有指定`--host`参数，所以我们连接到的是`localhost`，也就是本机的MySQL服务器。

在命令行窗口下，我们可以输入命令，操作MySQL服务器：

```mysql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
+--------------------+
4 rows in set (0.05 sec)
```

输入`exit`退出MySQL命令行模式。

对于Node.js程序，访问MySQL也是通过网络发送SQL命令给MySQL服务器。这个访问MySQL服务器的软件包通常称为MySQL驱动程序。不同的编程语言需要实现自己的驱动，MySQL官方提供了Java、.Net、Python、Node.js、C++和C的驱动程序，官方的Node.js驱动目前仅支持5.7以上版本，而我们上面使用的命令行程序实际上用的就是C驱动。

目前使用最广泛的MySQL Node.js驱动程序是开源的`mysql`，可以直接使用npm安装。

#### ORM

如果直接使用`mysql`包提供的接口，我们编写的代码就比较底层，例如，查询代码：

```javascript
connection.query('SELECT * FROM users WHERE id = ?', ['123'], function(err, rows) {
    if (err) {
        // error
    } else {
        for (let row in rows) {
            processRow(row);
        }
    }
});
```

考虑到数据库表是一个二维表，包含多行多列，例如一个`pets`的表：

```mysql
mysql> select * from pets;
+----+--------+------------+
| id | name   | birth      |
+----+--------+------------+
|  1 | Gaffey | 2007-07-07 |
|  2 | Odie   | 2008-08-08 |
+----+--------+------------+
2 rows in set (0.00 sec)
```

每一行可以用一个JavaScript对象表示，例如第一行：

```javascript
{
    "id": 1,
    "name": "Gaffey",
    "birth": "2007-07-07"
}
```

这就是传说中的ORM技术：Object-Relational Mapping，把关系数据库的表结构映射到对象上。是不是很简单？

但是由谁来做这个转换呢？所以ORM框架应运而生。

我们选择Node的ORM框架Sequelize来操作数据库。这样，我们读写的都是JavaScript对象，Sequelize帮我们把对象变成数据库中的行。

用Sequelize查询`pets`表，代码像这样：

```javascript
Pet.findAll()
   .then(function (pets) {
       for (let pet in pets) {
           console.log(`${pet.id}: ${pet.name}`);
       }
   }).catch(function (err) {
       // error
   });
```

因为Sequelize返回的对象是Promise，所以我们可以用`then()`和`catch()`分别异步响应成功和失败。

但是用`then()`和`catch()`仍然比较麻烦。有没有更简单的方法呢？

可以用ES7的await来调用任何一个Promise对象，这样我们写出来的代码就变成了：

```javascript
var pets = await Pet.findAll();
```

真的就是这么简单！

await只有一个限制，就是必须在async函数中调用。上面的代码直接运行还差一点，我们可以改成：

```javascript
(async () => {
    var pets = await Pet.findAll();
})();
```

考虑到koa的处理函数都是async函数，所以我们实际上将来在koa的async函数中直接写await访问数据库就可以了！

这也是为什么我们选择Sequelize的原因：只要API返回Promise，就可以用await调用，写代码就非常简单！

#### 实战

在使用Sequlize操作数据库之前，我们先在MySQL中创建一个表来测试。我们可以在`test`数据库中创建一个`pets`表。`test`数据库是MySQL安装后自动创建的用于测试的数据库。在MySQL命令行执行下列命令：

```javascript
grant all privileges on test.* to 'www'@'%' identified by 'www';

use test;

create table pets (
    id varchar(50) not null,
    name varchar(100) not null,
    gender bool not null,
    birth varchar(10) not null,
    createdAt bigint not null,
    updatedAt bigint not null,
    version bigint not null,
    primary key (id)
) engine=innodb;
```

第一条`grant`命令是创建MySQL的用户名和口令，均为`www`，并赋予操作`test`数据库的所有权限。

第二条`use`命令把当前数据库切换为`test`。

第三条命令创建了`pets`表。

然后，我们根据前面的工程结构创建`hello-sequelize`工程，结构如下：

```javascript
hello-sequelize/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- init.txt <-- 初始化SQL命令
|
+- config.js <-- MySQL配置文件
|
+- app.js <-- 使用koa的js
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
```

然后，添加如下依赖包：

```json
"sequelize": "3.24.1",
"mysql": "2.11.1"
```

注意`mysql`是驱动，我们不直接使用，但是`sequelize`会用。

用`npm install`安装。

`config.js`实际上是一个简单的配置文件：

```javascript
var config = {
    database: 'test', // 使用哪个数据库
    username: 'www', // 用户名
    password: 'www', // 口令
    host: 'localhost', // 主机名
    port: 3306 // 端口号，MySQL默认3306
};

module.exports = config;
```

下面，我们就可以在`app.js`中操作数据库了。使用Sequelize操作MySQL需要先做两件准备工作：

第一步，创建一个sequelize对象实例：

```javascript
const Sequelize = require('sequelize');
const config = require('./config');

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});
```

第二步，定义模型Pet，告诉Sequelize如何映射数据库表：

```javascript
var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    gender: Sequelize.BOOLEAN,
    birth: Sequelize.STRING(10),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT
}, {
        timestamps: false
    });
```

用`sequelize.define()`定义Model时，传入名称`pet`，默认的表名就是`pets`。第二个参数指定列名和数据类型，如果是主键，需要更详细地指定。第三个参数是额外的配置，我们传入`{ timestamps: false }`是为了关闭Sequelize的自动添加timestamp的功能。所有的ORM框架都有一种很不好的风气，总是自作聪明地加上所谓“自动化”的功能，但是会让人感到完全摸不着头脑。

接下来，我们就可以往数据库中塞一些数据了。我们可以用Promise的方式写：

```javascript
var now = Date.now();

Pet.create({
    id: 'g-' + now,
    name: 'Gaffey',
    gender: false,
    birth: '2007-07-07',
    createdAt: now,
    updatedAt: now,
    version: 0
}).then(function (p) {
    console.log('created.' + JSON.stringify(p));
}).catch(function (err) {
    console.log('failed: ' + err);
});
```

也可以用await写：

```javascript
(async () => {
    var dog = await Pet.create({
        id: 'd-' + now,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
        createdAt: now,
        updatedAt: now,
        version: 0
    });
    console.log('created: ' + JSON.stringify(dog));
})();
```

显然await代码更胜一筹。

查询数据时，用await写法如下：

```javascript
(async () => {
    var pets = await Pet.findAll({
        where: {
            name: 'Gaffey'
        }
    });
    console.log(`find ${pets.length} pets:`);
    for (let p of pets) {
        console.log(JSON.stringify(p));
    }
})();
```

如果要更新数据，可以对查询到的实例调用`save()`方法：

```javascript
(async () => {
    var p = await queryFromSomewhere();
    p.gender = true;
    p.updatedAt = Date.now();
    p.version ++;
    await p.save();
})();
```

如果要删除数据，可以对查询到的实例调用`destroy()`方法：

```javascript
(async () => {
    var p = await queryFromSomewhere();
    await p.destroy();
})();
```

运行代码，可以看到Sequelize打印出的每一个SQL语句，便于我们查看：

```javascript
Executing (default): INSERT INTO `pets` (`id`,`name`,`gender`,`birth`,`createdAt`,`updatedAt`,`version`) VALUES ('g-1471961204219','Gaffey',false,'2007-07-07',1471961204219,1471961204219,0);
```

#### Model

我们把通过`sequelize.define()`返回的`Pet`称为Model，它表示一个数据模型。

我们把通过`Pet.findAll()`返回的一个或一组对象称为Model实例，每个实例都可以直接通过`JSON.stringify`序列化为JSON字符串。但是它们和普通JSON对象相比，多了一些由Sequelize添加的方法，比如`save()`和`destroy()`。调用这些方法我们可以执行更新或者删除操作。

所以，使用Sequelize操作数据库的一般步骤就是：

首先，通过某个Model对象的`findAll()`方法获取实例；

如果要更新实例，先对实例属性赋新值，再调用`save()`方法；

如果要删除实例，直接调用`destroy()`方法。

注意`findAll()`方法可以接收`where`、`order`这些参数，这和将要生成的SQL语句是对应的。

#### 文档

Sequelize的API可以参考[官方文档](http://docs.sequelizejs.com/)。

#### 参考源码

[hello-sequelize](https://github.com/michaelliao/learn-javascript/tree/master/samples/node/web/db/hello-sequelize)

### 建立Model

直接使用Sequelize虽然可以，但是存在一些问题。

团队开发时，有人喜欢自己加timestamp：

```javascript
var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT
}, {
        timestamps: false
    });
```

有人又喜欢自增主键，并且自定义表名：

```javascript
var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING(100)
}, {
        tableName: 't_pet'
    });
```

一个大型Web App通常都有几十个映射表，一个映射表就是一个Model。如果按照各自喜好，那业务代码就不好写。Model不统一，很多代码也无法复用。

所以我们需要一个统一的模型，强迫所有Model都遵守同一个规范，这样不但实现简单，而且容易统一风格。

#### Model

我们首先要定义的就是Model存放的文件夹必须在`models`内，并且以Model名字命名，例如：`Pet.js`，`User.js`等等。

其次，每个Model必须遵守一套规范：

1. 统一主键，名称必须是`id`，类型必须是`STRING(50)`；
2. 主键可以自己指定，也可以由框架自动生成（如果为null或undefined）；
3. 所有字段默认为`NOT NULL`，除非显式指定；
4. 统一timestamp机制，每个Model必须有`createdAt`、`updatedAt`和`version`，分别记录创建时间、修改时间和版本号。其中，`createdAt`和`updatedAt`以`BIGINT`存储时间戳，最大的好处是无需处理时区，排序方便。`version`每次修改时自增。

所以，我们不要直接使用Sequelize的API，而是通过`db.js`间接地定义Model。例如，`User.js`应该定义如下：

```javascript
const db = require('../db');

module.exports = db.defineModel('users', {
    email: {
        type: db.STRING(100),
        unique: true
    },
    passwd: db.STRING(100),
    name: db.STRING(100),
    gender: db.BOOLEAN
});
```

这样，User就具有`email`、`passwd`、`name`和`gender`这4个业务字段。`id`、`createdAt`、`updatedAt`和`version`应该自动加上，而不是每个Model都去重复定义。

所以，`db.js`的作用就是统一Model的定义：

```javascript
const Sequelize = require('sequelize');

console.log('init sequelize...');

var sequelize = new Sequelize('dbname', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

const ID_TYPE = Sequelize.STRING(50);

function defineModel(name, attributes) {
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    if (!obj.id) {
                        obj.id = generateId();
                    }
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    obj.version = 0;
                } else {
                    obj.updatedAt = Date.now();
                    obj.version++;
                }
            }
        }
    });
}
```

我们定义的`defineModel`就是为了强制实现上述规则。

Sequelize在创建、修改Entity时会调用我们指定的函数，这些函数通过`hooks`在定义Model时设定。我们在`beforeValidate`这个事件中根据是否是`isNewRecord`设置主键（如果主键为`null`或`undefined`）、设置时间戳和版本号。

这么一来，Model定义的时候就可以大大简化。

#### 数据库配置

接下来，我们把简单的`config.js`拆成3个配置文件：

- config-default.js：存储默认的配置；
- config-override.js：存储特定的配置；
- config-test.js：存储用于测试的配置。

例如，默认的`config-default.js`可以配置如下：

```javascript
var config = {
    dialect: 'mysql',
    database: 'nodejs',
    username: 'www',
    password: 'www',
    host: 'localhost',
    port: 3306
};

module.exports = config;
```

而`config-override.js`可应用实际配置：

```javascript
var config = {
    database: 'production',
    username: 'www',
    password: 'secret-password',
    host: '192.168.1.199'
};

module.exports = config;
```

`config-test.js`可应用测试环境的配置：

```javascript
var config = {
    database: 'test'
};

module.exports = config;
```

读取配置的时候，我们用`config.js`实现不同环境读取不同的配置文件：

```javascript
const defaultConfig = './config-default.js';
// 可设定为绝对路径，如 /opt/product/config-override.js
const overrideConfig = './config-override.js';
const testConfig = './config-test.js';

const fs = require('fs');

var config = null;

if (process.env.NODE_ENV === 'test') {
    console.log(`Load ${testConfig}...`);
    config = require(testConfig);
} else {
    console.log(`Load ${defaultConfig}...`);
    config = require(defaultConfig);
    try {
        if (fs.statSync(overrideConfig).isFile()) {
            console.log(`Load ${overrideConfig}...`);
            config = Object.assign(config, require(overrideConfig));
        }
    } catch (err) {
        console.log(`Cannot load ${overrideConfig}.`);
    }
}

module.exports = config;
```

具体的规则是：

1. 先读取`config-default.js`；
2. 如果不是测试环境，就读取`config-override.js`，如果文件不存在，就忽略。
3. 如果是测试环境，就读取`config-test.js`。

这样做的好处是，开发环境下，团队统一使用默认的配置，并且无需`config-override.js`。部署到服务器时，由运维团队配置好`config-override.js`，以覆盖`config-override.js`的默认设置。测试环境下，本地和CI服务器统一使用`config-test.js`，测试数据库可以反复清空，不会影响开发。

配置文件表面上写起来很容易，但是，既要保证开发效率，又要避免服务器配置文件泄漏，还要能方便地执行测试，就需要一开始搭建出好的结构，才能提升工程能力。

#### 使用Model

要使用Model，就需要引入对应的Model文件，例如：`User.js`。一旦Model多了起来，如何引用也是一件麻烦事。

自动化永远比手工做效率高，而且更可靠。我们写一个`model.js`，自动扫描并导入所有Model：

```javascript
const fs = require('fs');
const db = require('./db');

let files = fs.readdirSync(__dirname + '/models');

let js_files = files.filter((f)=>{
    return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files) {
    console.log(`import model from file ${f}...`);
    let name = f.substring(0, f.length - 3);
    module.exports[name] = require(__dirname + '/models/' + f);
}

module.exports.sync = () => {
    db.sync();
};
```

这样，需要用的时候，写起来就像这样：

```javascript
const model = require('./model');

let
    Pet = model.Pet,
    User = model.User;

var pet = await Pet.create({ ... });
```

#### 工程结构

最终，我们创建的工程`model-sequelize`结构如下：

```javascript
model-sequelize/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- models/ <-- 存放所有Model
|  |
|  +- Pet.js <-- Pet
|  |
|  +- User.js <-- User
|
+- config.js <-- 配置文件入口
|
+- config-default.js <-- 默认配置文件
|
+- config-test.js <-- 测试配置文件
|
+- db.js <-- 如何定义Model
|
+- model.js <-- 如何导入Model
|
+- init-db.js <-- 初始化数据库
|
+- app.js <-- 业务代码
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
```

注意到我们其实不需要创建表的SQL，因为Sequelize提供了一个`sync()`方法，可以自动创建数据库。这个功能在开发和生产环境中没有什么用，但是在测试环境中非常有用。测试时，我们可以用`sync()`方法自动创建出表结构，而不是自己维护SQL脚本。这样，可以随时修改Model的定义，并立刻运行测试。开发环境下，首次使用`sync()`也可以自动创建出表结构，避免了手动运行SQL的问题。

`init-db.js`的代码非常简单：

```javascript
const model = require('./model.js');
model.sync();

console.log('init db ok.');
process.exit(0);
```

它最大的好处是避免了手动维护一个SQL脚本。

#### 参考源码

[model-sequelize](https://github.com/michaelliao/learn-javascript/tree/master/samples/node/web/db/model-sequelize)

## mocha

如果你听说过“测试驱动开发”（TDD：Test-Driven Development），单元测试就不陌生。

单元测试是用来对一个模块、一个函数或者一个类来进行正确性检验的测试工作。

比如对函数abs()，我们可以编写出以下几个测试用例：

输入正数，比如1、1.2、0.99，期待返回值与输入相同；

输入负数，比如-1、-1.2、-0.99，期待返回值与输入相反；

输入0，期待返回0；

输入非数值类型，比如null、[]、{}，期待抛出Error。

把上面的测试用例放到一个测试模块里，就是一个完整的单元测试。

如果单元测试通过，说明我们测试的这个函数能够正常工作。如果单元测试不通过，要么函数有bug，要么测试条件输入不正确，总之，需要修复使单元测试能够通过。

单元测试通过后有什么意义呢？如果我们对abs()函数代码做了修改，只需要再跑一遍单元测试，如果通过，说明我们的修改不会对abs()函数原有的行为造成影响，如果测试不通过，说明我们的修改与原有行为不一致，要么修改代码，要么修改测试。

这种以测试为驱动的开发模式最大的好处就是确保一个程序模块的行为符合我们设计的测试用例。在将来修改的时候，可以极大程度地保证该模块行为仍然是正确的。

### mocha

mocha是JavaScript的一种单元测试框架，既可以在浏览器环境下运行，也可以在Node.js环境下运行。

使用mocha，我们就只需要专注于编写单元测试本身，然后，让mocha去自动运行所有的测试，并给出测试结果。

mocha的特点主要有：

1. 既可以测试简单的JavaScript函数，又可以测试异步代码，因为异步是JavaScript的特性之一；
2. 可以自动运行所有测试，也可以只运行特定的测试；
3. 可以支持before、after、beforeEach和afterEach来编写初始化代码。

我们会详细讲解如何使用mocha编写自动化测试，以及如何测试异步代码。

### 编写测试

假设我们编写了一个`hello.js`，并且输出一个简单的求和函数：

```javascript
// hello.js

module.exports = function (...rest) {
    var sum = 0;
    for (let n of rest) {
        sum += n;
    }
    return sum;
};
```

这个函数非常简单，就是对输入的任意参数求和并返回结果。

如果我们想对这个函数进行测试，可以写一个`test.js`，然后使用Node.js提供的`assert`模块进行断言：

```javascript
// test.js

const assert = require('assert');
const sum = require('./hello');

assert.strictEqual(sum(), 0);
assert.strictEqual(sum(1), 1);
assert.strictEqual(sum(1, 2), 3);
assert.strictEqual(sum(1, 2, 3), 6);
```

`assert`模块非常简单，它断言一个表达式为true。如果断言失败，就抛出Error。可以在Node.js文档中查看`assert`模块的[所有API](https://nodejs.org/dist/latest/docs/api/assert.html)。

单独写一个`test.js`的缺点是没法自动运行测试，而且，如果第一个assert报错，后面的测试也执行不了了。

如果有很多测试需要运行，就必须把这些测试全部组织起来，然后统一执行，并且得到执行结果。这就是我们为什么要用mocha来编写并运行测试。

#### mocha test

我们创建`hello-test`工程来编写`hello.js`以及相关测试。工程结构如下：

```javascript
hello-test/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- hello.js <-- 待测试js文件
|
+- test/ <-- 存放所有test
｜ ｜
|  +- hello-test.js <-- 测试文件
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
```

我们首先在`package.json`中添加mocha的依赖包。和其他依赖包不同，这次我们并没有把依赖包添加到 `"dependencies"`中，而是`"devDependencies"`：

```json
{
  ...

  "dependencies": {},
  "devDependencies": {
    "mocha": "3.0.2"
  }
}
```

如果一个模块在运行的时候并不需要，仅仅在开发时才需要，就可以放到`devDependencies`中。这样，正式打包发布时，`devDependencies`的包不会被包含进来。

然后使用`npm install`安装。

*注意*，很多文章会让你用命令`npm install -g mocha`把mocha安装到全局module中。这是不需要的。尽量不要安装全局模块，因为全局模块会影响到所有Node.js的工程。

紧接着，我们在`test`目录下创建`hello-test.js`来编写测试。

mocha默认会执行`test`目录下的所有测试，不要去改变默认目录。

`hello-test.js`内容如下：

```javascript
const assert = require('assert');

const sum = require('../hello');

describe('#hello.js', () => {

    describe('#sum()', () => {
        it('sum() should return 0', () => {
            assert.strictEqual(sum(), 0);
        });

        it('sum(1) should return 1', () => {
            assert.strictEqual(sum(1), 1);
        });

        it('sum(1, 2) should return 3', () => {
            assert.strictEqual(sum(1, 2), 3);
        });

        it('sum(1, 2, 3) should return 6', () => {
            assert.strictEqual(sum(1, 2, 3), 6);
        });
    });
});
```

这里我们使用mocha默认的BDD-style的测试。`describe`可以任意嵌套，以便把相关测试看成一组测试。

每个`it("name", function() {...})`就代表一个测试。例如，为了测试`sum(1, 2)`，我们这样写：

```javascript
it('sum(1, 2) should return 3', () => {
    assert.strictEqual(sum(1, 2), 3);
});
```

编写测试的原则是，一次只测一种情况，且测试代码要非常简单。我们编写多个测试来分别测试不同的输入，并使用`assert`判断输出是否是我们所期望的。

#### 运行测试

下一步，我们就可以用mocha运行测试了。

如何运行？有三种方法。

方法一，可以打开命令提示符，切换到`hello-test`目录，然后执行命令：

```shell
C:\...\hello-test> node_modules\mocha\bin\mocha
```

mocha就会自动执行所有测试，然后输出如下：

```
  #hello.js
    #sum()
      ✓ sum() should return 0
      ✓ sum(1) should return 1
      ✓ sum(1, 2) should return 3
      ✓ sum(1, 2, 3) should return 6
  4 passing (7ms)
```

这说明我们编写的4个测试全部通过。如果没有通过，要么修改测试代码，要么修改`hello.js`，直到测试全部通过为止。

方法二，我们在`package.json`中添加npm命令：

```json
{
  ...

  "scripts": {
    "test": "mocha"
  },

  ...
}
```

然后在`hello-test`目录下执行命令：

```
C:\...\hello-test> npm test
```

可以得到和上面一样的输出。这种方式通过npm执行命令，输入的命令比较简单。

方法三，我们在VS Code中创建配置文件`.vscode/launch.json`，然后编写两个配置选项：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Run",
            "type": "node",
            "request": "launch",
            "program": "${workspaceRoot}/hello.js",
            "stopOnEntry": false,
            "args": [],
            "cwd": "${workspaceRoot}",
            "preLaunchTask": null,
            "runtimeExecutable": null,
            "runtimeArgs": [
                "--nolazy"
            ],
            "env": {
                "NODE_ENV": "development"
            },
            "externalConsole": false,
            "sourceMaps": false,
            "outDir": null
        },
        {
            "name": "Test",
            "type": "node",
            "request": "launch",
            "program": "${workspaceRoot}/node_modules/mocha/bin/mocha",
            "stopOnEntry": false,
            "args": [],
            "cwd": "${workspaceRoot}",
            "preLaunchTask": null,
            "runtimeExecutable": null,
            "runtimeArgs": [
                "--nolazy"
            ],
            "env": {
                "NODE_ENV": "test"
            },
            "externalConsole": false,
            "sourceMaps": false,
            "outDir": null
        }
    ]
}
```

注意第一个配置选项`Run`是正常执行一个.js文件，第二个配置选项`Test`我们填入`"program": "${workspaceRoot}/node_modules/mocha/bin/mocha"`，并设置`env`为`"NODE_ENV": "test"`，这样，就可以在VS Code中打开Debug面板，选择`Test`，运行，即可在Console面板中看到测试结果：

![](http://i.imgur.com/PdeDV9z.png)

#### before和after

在测试前初始化资源，测试后释放资源是非常常见的。mocha提供了before、after、beforeEach和afterEach来实现这些功能。

我们把`hello-test.js`改为：

```javascript
const assert = require('assert');
const sum = require('../hello');

describe('#hello.js', () => {
    describe('#sum()', () => {
        before(function () {
            console.log('before:');
        });

        after(function () {
            console.log('after.');
        });

        beforeEach(function () {
            console.log('  beforeEach:');
        });

        afterEach(function () {
            console.log('  afterEach.');
        });

        it('sum() should return 0', () => {
            assert.strictEqual(sum(), 0);
        });

        it('sum(1) should return 1', () => {
            assert.strictEqual(sum(1), 1);
        });

        it('sum(1, 2) should return 3', () => {
            assert.strictEqual(sum(1, 2), 3);
        });

        it('sum(1, 2, 3) should return 6', () => {
            assert.strictEqual(sum(1, 2, 3), 6);
        });
    });
});
```

再次运行，可以看到每个test执行前后会分别执行`beforeEach()`和`afterEach()`，以及一组test执行前后会分别执行`before()`和`after()`：

```
  #hello.js
    #sum()
before:
  beforeEach:
      ✓ sum() should return 0
  afterEach.
  beforeEach:
      ✓ sum(1) should return 1
  afterEach.
  beforeEach:
      ✓ sum(1, 2) should return 3
  afterEach.
  beforeEach:
      ✓ sum(1, 2, 3) should return 6
  afterEach.
after.
  4 passing (8ms)
```

#### 参考源码

[hello-test](https://github.com/michaelliao/learn-javascript/tree/master/samples/node/web/test/hello-test)

### 异步测试

用mocha测试一个函数是非常简单的，但是，在JavaScript的世界中，更多的时候，我们编写的是异步代码，所以，我们需要用mocha测试异步函数。

我们把上一节的`hello-test`工程复制一份，重命名为`async-test`，然后，把`hello.js`改造为异步函数：

```javascript
const fs = require('mz/fs');

// a simple async function:
module.exports = async () => {
    let expression = await fs.readFile('./data.txt', 'utf-8');
    let fn = new Function('return ' + expression);
    let r = fn();
    console.log(`Calculate: ${expression} = ${r}`);
    return r;
};
```

这个async函数通过读取`data.txt`的内容获取表达式，这样它就变成了异步。我们编写一个`data.txt`文件，内容如下：

```
1 + (2 + 4) * (9 - 2) / 3
```

别忘了在`package.json`中添加依赖包：

```json
"dependencies": {
    "mz": "2.4.0"
},
```

紧接着，我们在`test`目录中添加一个`await-test.js`，测试`hello.js`的async函数。

我们先看看mocha如何实现异步测试。

如果要测试同步函数，我们传入无参数函数即可：

```javascript
it('test sync function', function () {
    // TODO:
    assert(true);
});
```

如果要测试异步函数，我们要传入的函数需要带一个参数，通常命名为`done`：

```javascript
it('test async function', function (done) {
    fs.readFile('filepath', function (err, data) {
        if (err) {
            done(err);
        } else {
            done();
        }
    });
});
```

测试异步函数需要在函数内部手动调用`done()`表示测试成功，`done(err)`表示测试出错。

对于用ES7的async编写的函数，我们可以这么写：

```javascript
it('#async with done', (done) => {
    (async function () {
        try {
            let r = await hello();
            assert.strictEqual(r, 15);
            done();
        } catch (err) {
            done(err);
        }
    })();
});
```

但是用try...catch太麻烦。还有一种更简单的写法，就是直接把async函数当成同步函数来测试：

```javascript
it('#async function', async () => {
    let r = await hello();
    assert.strictEqual(r, 15);
});
```

这么写异步测试，太简单了有木有！

我们把上一个`hello-test`工程复制为`async-test`，结构如下：

```javascript
async-test/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- hello.js <-- 待测试js文件
|
+- data.txt <-- 数据文件
|
+- test/ <-- 存放所有test
｜ ｜
|  +- await-test.js <-- 异步测试
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
```

现在，在命令行窗口运行命令`node_modules\mocha\bin\mocha`，测试就可以正常执行：

```
  #async hello
    #asyncCalculate()
Calculate: 1 + (2 + 4) * (9 - 2) / 3 = 15
      ✓ #async function
  1 passing (11ms)
```

第二种方法是在`package.json`中把`script`改为：

```json
"scripts": {
    "test": "mocha"
}
```

这样就可以在命令行窗口通过`npm test`执行测试。

第三种方法是在VS Code配置文件中把`program`改为：

```
"program": "${workspaceRoot}/node_modules/mocha/bin/mocha"
```

这样就可以在VS Code中直接运行测试。

编写异步代码时，我们要坚持使用`async`和`await`关键字，这样，编写测试也同样简单。

#### 参考源码

[async-test](https://github.com/michaelliao/learn-javascript/tree/master/samples/node/web/test/async-test)

### Http测试

用mocha测试一个async函数是非常方便的。现在，当我们有了一个koa的Web应用程序时，我们怎么用mocha来自动化测试Web应用程序呢？

一个简单的想法就是在测试前启动koa的app，然后运行async测试，在测试代码中发送http请求，收到响应后检查结果，这样，一个基于http接口的测试就可以自动运行。

我们先创建一个最简单的koa应用，结构如下：

```javascript
koa-test/
|
+- .vscode/
|  |
|  +- launch.json <-- VSCode 配置文件
|
+- app.js <-- koa app文件
|
+- start.js <-- app启动入口
|
+- test/ <-- 存放所有test
｜ ｜
|  +- app-test.js <-- 异步测试
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
```

这个koa应用和前面的koa应用稍有不同的是，`app.js`只负责创建`app`实例，并不监听端口：

```javascript
// app.js

const Koa = require('koa');

const app = new Koa();

app.use(async (ctx, next) => {
    const start = new Date().getTime();
    await next();
    const ms = new Date().getTime() - start;
    console.log(`${ctx.request.method} ${ctx.request.url}: ${ms}ms`);
    ctx.response.set('X-Response-Time', `${ms}ms`);
});

app.use(async (ctx, next) => {
    var name = ctx.request.query.name || 'world';
    ctx.response.type = 'text/html';
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

module.exports = app;
```

而`start.js`负责真正启动应用：

```javascript
// start.js

const app = require('./app');

app.listen(3000);
console.log('app started at port 3000...');
```

这样做的目的是便于后面的测试。

紧接着，我们在`test`目录下创建`app-test.js`，来测试这个koa应用。

在测试前，我们在`package.json`中添加`devDependencies`，除了mocha外，我们还需要一个简单而强大的测试模块`supertest`：

```json
{
    ...
    "devDependencies": {
        "mocha": "3.0.2",
        "supertest": "3.0.0"
    }
}
```

运行`npm install`后，我们开始编写测试：

```javascript
// app-test.js

const
    request = require('supertest'),
    app = require('../app');

describe('#test koa app', () => {

    let server = app.listen(9900);

    describe('#test server', () => {

        it('#test GET /', async () => {
            let res = await request(server)
                .get('/')
                .expect('Content-Type', /text\/html/)
                .expect(200, '<h1>Hello, world!</h1>');
        });

        it('#test GET /path?name=Bob', async () => {
            let res = await request(server)
                .get('/path?name=Bob')
                .expect('Content-Type', /text\/html/)
                .expect(200, '<h1>Hello, Bob!</h1>');
        });
    });
});
```

在测试中，我们首先导入`supertest`模块，然后导入`app`模块，注意我们已经在`app.js`中移除了`app.listen(3000);`语句，所以，这里我们用：

```javascript
let server = app.listen(9900);
```

让`app`实例监听在`9900`端口上，并且获得返回的`server`实例。

在测试代码中，我们使用：

```javascript
let res = await request(server).get('/');
```

就可以构造一个GET请求，发送给koa的应用，然后获得响应。

可以手动检查响应对象，例如，`res.body`，还可以利用`supertest`提供的`expect()`更方便地断言响应的HTTP代码、返回内容和HTTP头。断言HTTP头时可用使用正则表达式。例如，下面的断言：

```javascript
.expect('Content-Type', /text\/html/)
```

可用成功匹配到`Content-Type`为`text/html`、`text/html; charset=utf-8`等值。

当所有测试运行结束后，`app`实例会自动关闭，无需清理。

利用mocha的异步测试，配合supertest，我们可以用简单的代码编写端到端的HTTP自动化测试。

#### 参考源码

[koa-test](https://github.com/michaelliao/learn-javascript/tree/master/samples/node/web/test/koa-test)













