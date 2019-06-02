---
title: Java 逐行读取文本文件的几种方式以及效率对比
hide: false
categories:
  - coding
  - java
toc: true
tags:
  - java
abbrlink: 59232
date: 2019-01-23 15:43:13
---

# 前言

上周负责的模块中需要逐行读取文件内容, 写完之后对程序执行效率不太满意, 索性上网查了一下 Java 逐行读取文件内容的各种方法, 并且简单地比对了一下执行效率. 在此记录, 希望能够帮到有需要的人. 

**注意: 本文比对的项目为 *逐行读取文本内容*, 并不能代表其他方式的文件读取效率优劣!!!**

文末有完整代码.

# 先放结果

1000000 行文本读取结果比对: 

```tex
BufferedReader 耗时: 49ms
Scanner 耗时: 653ms
Apache Commons IO 耗时: 44ms
InputStreamReader 耗时: 191ms
FileInputStream 耗时: 3171ms
BufferedInputStream 耗时: 70ms
FileUtils 耗时: 46ms
Files 耗时: 99ms
```

<!-- more -->

24488656 行文本读取结果比对: 

```tex
BufferedReader 耗时: 989ms
Scanner 耗时: 11899ms
Apache Commons IO 耗时: 568ms
InputStreamReader 耗时: 3377ms
FileInputStream 耗时: 78903ms
BufferedInputStream 耗时: 1480ms
FileUtils 耗时: 16569ms
Files 耗时: 25162ms
```

可见, 当文件较小时: 

* `ApacheCommonsIO 流` 表现最佳; 
* `FileUtils`, `BufferedReader` 居其二; 
* `BufferedInputStream`, `Files` 随其后; 
* `InputStreamReader`, `Scanner`, `FileInputStream` 略慢. 

当文件较大时, `Apache Commons IO 流`, `BufferedReader` 依然出色, `Files`, `FileUtils` 速度开始变慢. 

# 简要分析

使用到的工具类包括: 

* `java.io.BufferedReader` 
* `java.util.Scanner` 
* `org.apache.commons.io.FileUtils` 
* `java.io.InputStreamReader` 
* `java.io.FileInputStream` 
* `java.io.BufferedInputStream` 
* `com.google.common.io.Files` 

其中: 

`Apache Commons IO 流` 和 `BufferedReader` 使用到了缓冲区, 所以在不消耗大量内存的情况下提高了处理速度; 

`FileUtils` 和 `Files` 是先把文件内容全部读入内存, 然后在进行操作, 是典型的空间换时间案例. 这种方法可能会大**量消耗内存**, 建议酌情使用;

其他几个工具类本来就不擅长逐行读取, 效率底下也是情理之中. 

# 建议

在逐行读取文本内容的需求下, 建议使用 Apache Commons IO 流, 或者 BufferedReader, 既不会过多地占用内存, 也保证了优异的处理速度. 

# 参考文献: 

* [[Java]读取文件方法大全](http://www.cnblogs.com/lovebread/archive/2009/11/23/1609122.html)   ---   lovebread
* [java读取文件API速度对比](https://blog.csdn.net/fengxingzhe001/article/details/67640083)    ---   fengxingzhe001
* [Java高效读取大文件](http://www.importnew.com/14512.html)    ---   Eugen Paraschiv[文] / ImportNew - 进林[译]

# 附录-源代码: 

```java
import com.google.common.io.Files;
import org.apache.commons.io.Charsets;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.LineIterator;

import java.io.*;
import java.util.List;
import java.util.Random;
import java.util.Scanner;

/**
 * @Description: 逐行读取文件性能对比
 * @Author: Seven-Steven
 * @Date: 19-1-25
 **/
public class ReadByLineFromFileTest {

  public static void main(String[] args) {
    ReadByLineFromFileTest test = new ReadByLineFromFileTest();
    String filePath = "./testFile.txt";
    File file = new File(filePath);
    if (!file.exists()) {
      // 随机写入 1000000 行内容
      test.writeRandom(filePath, 1000000);
    }

    long before, after, time;
    // 使用 BufferedReader 逐行读取文件
    before = System.currentTimeMillis();
    test.bufferedReader(filePath);
    after = System.currentTimeMillis();
    time = after - before;
    System.out.println("BufferedReader 耗时: " + time + "ms");

    // 使用 Scanner 逐行读取文件
    before = System.currentTimeMillis();
    test.scanner(filePath);
    after = System.currentTimeMillis();
    time = after - before;
    System.out.println("Scanner 耗时: " + time + "ms");

    // 使用 Apache Commons IO 流逐行读取文件
    before = System.currentTimeMillis();
    test.apacheCommonsIo(filePath);
    after = System.currentTimeMillis();
    time = after - before;
    System.out.println("Apache Commons IO 耗时: " + time + "ms");

    // 使用 InputStreamReader 逐字符读取文件
    before = System.currentTimeMillis();
    test.inputStreamReader(filePath);
    after = System.currentTimeMillis();
    time = after - before;
    System.out.println("InputStreamReader 耗时: " + time + "ms");

    // 使用 FileInputStream 逐字符读取文件
    before = System.currentTimeMillis();
    test.fileInputStream(filePath);
    after = System.currentTimeMillis();
    time = after - before;
    System.out.println("FileInputStream 耗时: " + time + "ms");


    // 使用 BufferedInputStream 逐字符读取文件
    before = System.currentTimeMillis();
    test.bufferedInputStream(filePath);
    after = System.currentTimeMillis();
    time = after - before;
    System.out.println("BufferedInputStream 耗时: " + time + "ms");

    // 使用 FileUtils 一次性读取文件所有行
    before = System.currentTimeMillis();
    test.fileUtils(filePath);
    after = System.currentTimeMillis();
    time = after - before;
    System.out.println("FileUtils 耗时: " + time + "ms");

    // 使用 Files 一次性读取文件所有行
    before = System.currentTimeMillis();
    test.files(filePath);
    after = System.currentTimeMillis();
    time = after - before;
    System.out.println("Files 耗时: " + time + "ms");
  }

  /**
   * @Description: 使用 Apache Commons IO 流逐行读取文件
   * Maven 依赖:
   *         <!-- https://mvnrepository.com/artifact/commons-io/commons-io -->
   *         <dependency>
   *             <groupId>commons-io</groupId>
   *             <artifactId>commons-io</artifactId>
   *             <version>2.6</version>
   *         </dependency>
   * @Param: [filePath] 文件路径
   * @Author: Seven-Steven
   * @Date: 19-1-24
   **/
  public void apacheCommonsIo(String filePath) {
    File file = new File(filePath);
    if (!file.exists()) {
      return;
    }

    try {
      LineIterator iterator = FileUtils.lineIterator(file, "UTf-8");
      while (iterator.hasNext()) {
        String line = iterator.nextLine();
        // TODO
        // System.out.println(line);
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  /**
   * @Description: 使用 Scanner 类逐行读取
   * @Param: [filePath] 文件路径
   * @Author: Seven-Steven
   * @Date: 19-1-24
   **/
  public void scanner(String filePath) {
    File file = new File(filePath);
    if (!file.exists()) {
      return;
    }

    FileInputStream fileInputStream = null;
    Scanner scanner = null;
    try {
      fileInputStream = new FileInputStream(file);
      scanner = new Scanner(fileInputStream, "UTF-8");

      while (scanner.hasNextLine()) {
        // TODO things
        String line = scanner.nextLine();
        // System.out.println(line);
      }
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } finally {
      if (fileInputStream != null) {
        try {
          fileInputStream.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }

      if (scanner != null) {
        scanner.close();
      }
    }
  }

  /**
   * @Description: 使用 Files 一次性读取所有行
   * Maven 依赖:
   *         <!-- https://mvnrepository.com/artifact/com.google.guava/guava -->
   *         <dependency>
   *             <groupId>com.google.guava</groupId>
   *             <artifactId>guava</artifactId>
   *             <version>r05</version>
   *         </dependency>
   * @Param: [filePath] 文件路径
   * @Author: Seven-Steven
   * @Date: 19-1-24
   **/
  public void files(String filePath) {
    File file = new File(filePath);
    if (!file.exists()) {
      return;
    }

    try {
      List<String> fileLines = Files.readLines(file, Charsets.toCharset("UTF-8"));
      for (String str : fileLines) {
        // TODO things
        // System.out.println(str);
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  /**
   * @Description: 使用 FileUtils 一次性将文件所有行读入内存
   * Maven 依赖:
   *         <!-- https://mvnrepository.com/artifact/commons-io/commons-io -->
   *         <dependency>
   *             <groupId>commons-io</groupId>
   *             <artifactId>commons-io</artifactId>
   *             <version>2.6</version>
   *         </dependency>
   * @Param: [filePath] 文件路径
   * @Author: Seven-Steven
   * @Date: 19-1-24
   **/
  public void fileUtils(String filePath) {
    File file = new File(filePath);
    if (!file.exists()) {
      return;
    }

    try {
      List<String> fileLines = FileUtils.readLines(file, Charsets.UTF_8);
      for (String str : fileLines) {
        // TODO
        // System.out.println(str);
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void bufferedInputStream(String filePath) {
    File file = new File(filePath);
    if (!file.exists()) {
      return;
    }

    FileInputStream fileInputStream = null;
    BufferedInputStream bufferedInputStream = null;
    try {
      fileInputStream = new FileInputStream(file);
      bufferedInputStream = new BufferedInputStream(fileInputStream);

      int temp;
      char character;
      String line = "";
      while ((temp = bufferedInputStream.read()) != -1) {
        character = (char) temp;
        if (character != '\n') {
          line += character;
        } else {
          // TODO
          // System.out.println(line);
          line = "";
        }
      }
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (fileInputStream != null) {
        try {
          fileInputStream.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }

      if (bufferedInputStream != null) {
        try {
          bufferedInputStream.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  /**
   * @Description: 使用 FileInputStream 逐字符读取文件
   * @Param: [filePath] 文件路径
   * @Author: Seven-Steven
   * @Date: 19-1-23
   **/
  public void fileInputStream(String filePath) {
    File file = new File(filePath);
    if (!file.exists()) {
      return;
    }

    FileInputStream fileInputStream = null;
    try {
      fileInputStream = new FileInputStream(file);
      int temp;
      char character;
      String line = "";
      while ((temp = fileInputStream.read()) != -1) {
        character = (char) temp;
        if (character != '\n') {
          line += character;
        } else {
          // TODO
          // System.out.println(line);
          line = "";
        }
      }
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (fileInputStream != null) {
        try {
          fileInputStream.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  /**
   * @Description: 使用 InputStreamReader 逐行读取文件
   * @Param: [filePath] 文件路径
   * @Author: Seven-Steven
   * @Date: 19-1-23
   **/
  public void inputStreamReader(String filePath) {
    File file = new File(filePath);
    if (!file.exists()) {
      return;
    }

    FileInputStream fileInputStream = null;
    InputStreamReader inputStreamReader = null;
    try {
      fileInputStream = new FileInputStream(file);
      inputStreamReader = new InputStreamReader(fileInputStream);
      int temp;
      char character;
      String line = "";
      while ((temp = inputStreamReader.read()) != -1) {
        character = (char) temp;
        if (character != '\n') {
          line += character;
        } else {
          // TODO
          // System.out.println(line);
          line = "";
        }
      }
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (fileInputStream != null) {
        try {
          fileInputStream.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }

      if (inputStreamReader != null) {
        try {
          inputStreamReader.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  /**
   * @Description: 使用 BufferedReader 逐行读取文件内容
   * @Param: [filePath] 文件路径
   * @Author: Seven-Steven
   * @Date: 19-1-23
   **/
  public void bufferedReader(String filePath) {
    File file = new File(filePath);
    if (!file.exists()) {
      return;
    }

    FileReader fileReader = null;
    BufferedReader bufferedReader = null;
    try {
      fileReader = new FileReader(file);
      bufferedReader = new BufferedReader(fileReader);

      String line = "";
      while ((line = bufferedReader.readLine()) != null) {
        // TODO things
        // System.out.println(line);
      }
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (fileReader != null) {
        try {
          fileReader.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }

      if (bufferedReader != null) {
        try {
          bufferedReader.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  /**
   * @Description: 随机往文件中写入 totalLines 行内容
   * @Param: [filePath, totalLines] 文件路径, 内容行数
   * @Author: Seven-Steven
   * @Date: 19-1-23
   **/
  public void writeRandom(String filePath, int totalLines) {
    RandomAccessFile file = null;
    Random random = new Random();
    try {
      file = new RandomAccessFile(filePath, "rw");
      long length = file.length();
      for (int i = 0; i < totalLines; i++) {
        file.seek(length);
        int number = random.nextInt(1000000);
        String line = number + "\n";
        file.writeBytes(line);
        length += line.length();
      }
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (file != null) {
        try {
          file.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }
}

```

