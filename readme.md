### 描述

个人博客需要添加一个填写QQ号获取**昵称**和头像的api,但是返回数据包含乱码,浏览器访问api使用chorme插件访问切换gbk后数据正常,node无法转码.已经困扰了我快一个月,希望大佬解决一下(´；ω；`).

以移除其他无关代码,关键部分在`/router/out.js`里面.

### 环境

```
node^12.13.0 & npm^6.14.4
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

![JigxYR.jpg](https://s1.ax1x.com/2020/04/15/JigxYR.jpg)

但是返回的数据是乱码:

![JiWmsf.jpg](https://s1.ax1x.com/2020/04/15/JiWmsf.jpg)

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


>**目前有两个接口可以返回昵称和头像:**
接口1:https://users.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=1278820830
接口2:https://r.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=1278820830
访问以上两个接口需要在浏览器中清空QQ空间cookie
github的相关issue:https://github.com/mashirozx/Sakura/issues/146


接口1:返回的数据在node中,英文转GBK正常,但是中文转GBK是锟斤拷,浏览器中直接访问`接口1`查看昵称也是乱码.

接口2:返回数据在node中英文中文转GBK都会变成乱码.浏览器中直接访问`接口1`和代理后的`http://localhost:3000/api/out/qqinfo?uins=1278820830`显示的昵称是正常的.


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
# 需求:

返回的数据可以在控制台中正常打印出来, 或在network中返回的数据为utf8格式,不为乱码格式.