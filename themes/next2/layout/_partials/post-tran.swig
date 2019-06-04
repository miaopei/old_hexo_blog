<ul class="post-copyright">
  <li class="post-copyright-link">
    <strong><i class="fa fa-{{ theme.translation.icon }}"></i> {{ theme.translation.language + __('symbol.colon') }}</strong>
    <span id="url" style="display:none">{{theme.translation.url}}</span> 
    <span id="path" style="display:none">{{post.permalink}}</span> 
    <span id="info" style="display:none">{{theme.translation.info}}</span> 
    <span id="goto"></span> 
  </li>
</ul>


<script language=javascript>
    var url = document.getElementById("url").innerHTML;
    var path = document.getElementById("path").innerHTML;
    var info = document.getElementById("info").innerHTML;
    path=GetUrlRelativePath(path);
    if(info.length==0){
      infos= url+path;
    }
    else{
      infos=info;
    }
    var str = "<a href='"+url+path+"'>"+infos+"</a>"
    console.log(str);
    document.getElementById("goto").innerHTML=str;

　　function GetUrlRelativePath()
　　{
　　　　var url = document.location.toString();
　　　　var arrUrl = url.split("//");

　　　　var start = arrUrl[1].indexOf("/");
　　　　var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

　　　　if(relUrl.indexOf("?") != -1){
　　　　　　relUrl = relUrl.split("?")[0];
　　　　}
　　　　return relUrl;
　　}
</script>
