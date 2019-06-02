// hexo n 命令之后直接打开sublime text编辑器
var exec = require('child_process').exec;
hexo.on('new', function(data){
  exec('start  "sublimetext" ' + data.path);
});


// 新建文档之后用 typora 打开文件
var spawn = require('child_process').spawn;
hexo.on('new', function(data){
    spawn('typora', [data.path]);
});
