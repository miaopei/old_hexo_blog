const ap = new APlayer({
    container: document.getElementById('aplayer'), //播放器容器元素
    mini: false, //迷你模式
    autoplay: false, //自动播放
    theme: '#FADFA3', //主题色
    loop: 'all', //音频循环播放, 可选值: 'all'全部循环, 'one'单曲循环, 'none'不循环
    order: 'random', //音频循环顺序, 可选值: 'list'列表循环, 'random'随机循环
    preload: 'auto', //预加载，可选值: 'none', 'metadata', 'auto'
    volume: 0.7, //默认音量，请注意播放器会记忆用户设置，用户手动设置音量后默认音量即失效
    mutex: true, //互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
    listFolded: true, //列表默认折叠
    listMaxHeight: 30, //列表最大高度
    lrcType: 3, //歌词传递方式
    audio: [ //音频信息,包含以下
        // {
        //     name: 'name1', //音频名称
        //     artist: 'artist1', //音频艺术家
        //     url: 'url1.mp3', //音频外链
        //     cover: 'cover1.jpg', //音频封面
        //     lrc: 'lrc1.lrc', //音频歌词，配合上面的lrcType使用
        //     theme: '#ebd0c2' //切换到此音频时的主题色，比上面的 theme 优先级高
        // },
        // {
        //     name: 'name2', //如果只有一首歌，删掉这一块，如有更多歌曲按此格式逐渐往下添加
        //     artist: 'artist2',
        //     url: 'url2.mp3',
        //     cover: 'cover2.jpg',
        //     lrc: 'lrc2.lrc',
        //     theme: '#46718b'
        // }
        {
            name: 'summary days',
            artist: 'Martin Garrix',
            url: 'https://m10.music.126.net/20190627193948/96e8dbbd3abdc537a7778574fbf5b23e/ymusic/045c/035b/0452/36edb6134b41d2ac0a4f38128ba1f07c.mp3',
            cover: 'https://p2.music.126.net/V-NvZ9AQWgsup61DrG5Ztg==/109951164177068604.jpg',
            theme: '#ebd0c2'
        },
        {
            name: 'Turnin', 
            artist: 'Young Rising Sons',
            url: 'https://m701.music.126.net/20190627195148/e1ba40716039182042679b0ac06c0291/jdyyaac/045f/520e/035e/35fbcc03aded47970147441c85365e6c.m4a',
            cover: 'http://p1.music.126.net/_3YCwTf4yAB-pMP7j70sUg==/5896680860106448.jpg',
            theme: '#46718b'
        }
    ]
});
