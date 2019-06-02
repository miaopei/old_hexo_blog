---
title: IDEA 下为 Spring Boot 项目开启热部署
hide: false
categories:
  - coding
  - java
toc: true
tags:
  - spring boot
  - idea
abbrlink: 53
date: 2019-03-03 08:57:45
---

# 前言

因为最近接触了一丢丢 Spring Boot 下的 Web 开发工作, 每次进行一丢丢改动都要重启项目甚是麻烦. 所以查了一下 IDEA 下 Spring 项目开启热部署的方法, 特此记录, 以便查阅. 

# 修改 pom 文件

1. 在 dependency 中添加 optional 属性并设置为 true: 

   ```xml
    <dependencies>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-devtools</artifactId>
           <optional>true</optional>
       </dependency>
   </dependencies>
   ```

   <!-- more -->

2. 在 plugin 中配置属性 fork 并设置为 true: 

   ```xml
   <build>
       <plugins>
           <plugin>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-maven-plugin</artifactId>
               <configuration>
                   <fork>true</fork>
               </configuration>
           </plugin>
   </plugins>
   </build>
   ```

# 配置 IDEA

1. 进入设置界面, 选择 "Build, Execution, Deployment" 下的 "Compiler" 选项, 勾选右边的 "Build project automatically"; 

   ![kLTgJI.md.png](https://s2.ax1x.com/2019/03/03/kLTgJI.md.png)

2. 使用快捷键 `Ctrl + Shift + A` 并搜索 "Registry". 进入 "Registry" 界面后找到 "compile.automake.allow.when.app.running" 并勾选. 

   ![Registry.png](https://i.loli.net/2019/03/03/5c7bc26bc5deb.png)

至此, 热部署就设置好啦. 