# nodeQQ昵称api

### 描述

个人博客需要添加一个填写QQ号获取**昵称**和头像的api,故添加一个node搭建的接口,期间遇到了不少坑.

以移除其他无关代码,关键部分在`/router/out.js`里面.

### 环境

```
node
```

### 安装依赖

```shell
npm install
```

### 启动

```shell
npm run dev
```

### 调试

等http服务和代理起来之后再浏览器输入以下内容:

http://localhost:3000/api/out/qqinfo?uins=1278820830


代理会跳转到api:

https://r.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=1278820830


返回qq昵称和头像.



-----------------------

**如果遇到无法访问api,返回404或没有权限**

1. 在浏览器中清空qq空间`(user.qzone.com)`的本地存储和`(r.qzone.qq.com)`的本地缓存,保证发送请求时不携带cookie.
![JiWIfA.jpg](https://s1.ax1x.com/2020/04/16/JiWIfA.jpg)
2. 关闭vpn等代理工具,使用国外vpn后会导致接口无法访问,需要关闭vpn使用国内网络.
3. 在chorme调试工具的network中把Disable cache勾上.

### 目录结构
```
.
│  app.js  //路由跳转
│  package-lock.json
│  package.json //依赖
│  readme.md
│
├─bin
│      www //建立express http服务器,监听3000port
│
└─routes
        out.js //***处理路由***
```


**目前有两个接口可以返回昵称和头像:**

- 接口1:https://users.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=1278820830
- 接口2:https://r.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=1278820830

访问以上两个接口需要在浏览器中清空QQ空间cookie

### 编码问题:

github的相关issue:https://github.com/mashirozx/Sakura/issues/146


issue中的解决方法就是GBK to UTF-8

```php
$qq = isset($_GET['qq']) ? addslashes(trim($_GET['qq'])) : '';
if(!empty($qq) && is_numeric($qq) && strlen($qq) > 4 && strlen($qq) < 13){
  $qqnickname = file_get_contents('http://r.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?g_tk=1518561325'.$qq); // API
  if($qqnickname){
    $qqnickname = mb_convert_encoding($qqnickname, "UTF-8", "GBK");
    echo $qqnickname;
  }
}
```

但是由于这个接口是gzip压缩过的,node解决编码问题还需要添加一个解压缩,然后再进行编码转换.

### 效果

![tbCWPs.gif](https://s1.ax1x.com/2020/06/11/tbCWPs.gif)

### 其他

返回的头像URL还需要进行代理转发,避免跨域.
