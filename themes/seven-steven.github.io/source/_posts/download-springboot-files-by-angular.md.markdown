---
title: download_springboot_files_by_angular
hide: false
categories:
  - null
toc: true
tags:
  - null
date: 2019-03-20 19:45:02
---

# 前端

```js

            /**
             * 导出 excel 表格
             */
            $scope.exportWarnList = function () {
                $http.post("/pipeline/exportWarnList", $scope.condition, {responseType: 'blob'}).success(function (data) {
                    let filename = "simDetail.xls";
                    let file = new File([data], filename, {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let objectUrl = URL.createObjectURL(file);

                    const element = document.createElement('a');
                    element.href = objectUrl;
                    element.download = filename;
                    document.body.appendChild(element);
                    element.click();
                });

                // 方法三
                // $http({
                //     url: '/pipeline/exportWarnList',
                //     method: "POST",
                //     data: $scope.condition,
                //     responseType: 'blob'
                // }).success(function (data, status, headers, config) {
                //     //var filename = config.headers('Content-Disposition').split(';')[1].trim().substr('filename='.length);
                //     var filename = "simDetail.xls";
                //     // var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                //     let file = new File([data], filename, {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                //     var objectUrl = URL.createObjectURL(file);
                //     // window.open(objectUrl);
                //     // URL.revokeObjectURL(objectUrl);
                //     // $event.target.download = filename;
                //     // $event.target.href = objectUrl;
                //     // $event.target.click();
                //
                //     const element = document.createElement('a');
                //     element.href = objectUrl;
                //     element.download = filename;
                //     document.body.appendChild(element);
                //     element.click();
                //
                // }).error(function (data, status, headers, config) {
                //     //upload failed
                // });

                // 方法二
                // window.open("/pipeline/exportWarnList");

                // 方法一
                // var $eleForm = $("<form method='get'></form>");
                //
                // $eleForm.attr("action","/pipeline/exportWarnList");
                //
                // $(document.body).append($eleForm);
                // let $input = $("<input\>");
                // // $input.attr();
                // $eleForm.append($input);
                // //提交表单，实现下载
                // $eleForm.submit();

            };
```

# 后台

```java
    @PostMapping("/exportWarnList")
    public ResponseMsg exportWarnList(@RequestBody JSONObject jsonObject, HttpServletResponse response) {
        // 指定 Excel 文件名
        List<String> chars = Arrays.asList(String.valueOf(System.currentTimeMillis()).split(""));
        Collections.shuffle(chars);
        String fileName =  String.join("", chars) + ".xlsx";
        String filePath = "${service.pd.parseSpecFile.baseFilePath}" + "/pipelineTemp/" + fileName;
        File file = new File(filePath);
        // 获取 Excel 写入对象
        BigExcelWriter excelWriter = ExcelUtil.getBigWriter(file);
        // 设置表头别名
        excelWriter.addHeaderAlias("checkPath", "监测路径");
        excelWriter.addHeaderAlias("alarmType", "告警类型");
        excelWriter.addHeaderAlias("companyName", "设备厂家");
        excelWriter.addHeaderAlias("alarmTemp", "告警温度(℃)");
        excelWriter.addHeaderAlias("alarmPosition", "告警位置(米)");
        excelWriter.addHeaderAlias("readTime", "告警时间");
        excelWriter.addHeaderAlias("status", "状态");


        // 默认每次查询 5000 条数据
        final int pageSize = 5000;
        jsonObject.put("pageSize", pageSize);

        Long totalElements = this.findWarnListSize(jsonObject);

        long pages = totalElements / pageSize;
        pages = totalElements % pageSize == 0 ? pages : pages + 1;
        for (int i = 0; i < pages; i++) {
            jsonObject.put("pageNum", i);
            ResponseMsg response4WarnList = this.findWarnList(jsonObject);
            if (response4WarnList.getCode() != 0) {
                return new ResponseMsg(MsgCode.Error);
            } else {
                JSONArray result = JSONObject.parseObject(JSONObject.toJSONString(response4WarnList.getResult())).getJSONArray("content");
                List<PipelineWarnListModel> pipelineWarnListModelList = new PipelineWarnListModel().parseList(result);
                excelWriter.write(pipelineWarnListModelList);
            }
        }

        excelWriter.close();

        // 返回文件流
        response.setContentType("application/octet-stream; charset=utf8");
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);

        InputStream inputStream = null;
        try {
            inputStream = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        this.writeToOutputSteam("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileName, inputStream, response);

        // 删除文件缓存
        if (file.exists()) {
            file.delete();
        }
        
        return null;


        // 方法三
        // 配置文件下载
        // response.setHeader("content-type", "application/octet-stream");
        // response.setContentType("application/octet-stream");
        // // 下载文件能正常显示中文
        // try {
        //     response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode("test3.xlsx", "UTF-8"));
        // } catch (UnsupportedEncodingException e) {
        //     e.printStackTrace();
        // }
        //
        // // 实现文件下载
        // byte[] buffer = new byte[1024];
        // FileInputStream fis = null;
        // BufferedInputStream bis = null;
        // try {
        //     fis = new FileInputStream(excelFilePath);
        //     bis = new BufferedInputStream(fis);
        //     OutputStream os = response.getOutputStream();
        //     int i = bis.read(buffer);
        //     while (i != -1) {
        //         os.write(buffer, 0, i);
        //         i = bis.read(buffer);
        //     }
        //     System.out.println("Download the song successfully!");
        // }
        // catch (Exception e) {
        //     System.out.println("Download the song failed!");
        // }
        // finally {
        //     if (bis != null) {
        //         try {
        //             bis.close();
        //         } catch (IOException e) {
        //             e.printStackTrace();
        //         }
        //     }
        //     if (fis != null) {
        //         try {
        //             fis.close();
        //         } catch (IOException e) {
        //             e.printStackTrace();
        //         }
        //     }
        // }
        //
        // return null;
    }

```



# 参考文献

* [angular get/post 下载 excel](<https://www.cnblogs.com/wanliyuan/p/5650105.html>)   ---   雨为我停 
* [Set File Name while downloading via blob in Angular 5]   ---   Dhivakaran Ravi
* [Spring Boot入门（11）实现文件下载功能](<https://segmentfault.com/a/1190000015559584>)   ---   jclian91 