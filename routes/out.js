const express = require('express');

const { unzip } = require("zlib")
// 跨域代理
const { createProxyMiddleware } = require('http-proxy-middleware')
// 转码插件
const iconv = require('iconv-lite')
var router = express.Router();

// 请求 qq 昵称接口 浏览器访问:http://localhost:3000/api/out/qqinfo?uins=1278820830
router.get('/qqinfo', createProxyMiddleware({
  changeOrigin: true,

  /*自定义返回*/
  selfHandleResponse: true,

  /*这个接口英文正常,中文无法转码.*/
  //target: 'https://users.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg',

  /*这个是正常接口*/
  target: 'https://r.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg',

  pathRewrite: { '^/api/out/qqinfo': '' },
  onProxyReq(proxyReq, req, res) {
    //添加其他访问头,模拟空referer
    proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9');
    proxyReq.setHeader('Cache-Control', 'no-cache');
    proxyReq.setHeader('Accept-Language', 'zh-CN,zh;q=0.8;en-US;q=0.9');
    proxyReq.setHeader('sec-fetch-site', 'none');
    proxyReq.setHeader('referer', '');
    proxyReq.setHeader('sec-fetch-mode', 'navigate');
    proxyReq.setHeader('sec-fetch-user', '?1');
    proxyReq.setHeader('sec-fetch-dest', 'document');
    proxyReq.setHeader('Upgrade-Insecure-Requests', '1');

    // 换host,避免跨域
    proxyReq.setHeader('Host', 'r.qzone.qq.com');
  },
  onProxyRes(proxyRes, req, res) {
    let arr = [];
    proxyRes.on('data', (chunk) => {
      arr.push(chunk)
    })
    proxyRes.on('end', () => {
      arr = Buffer.concat(arr)
      /* 由于qq空间开启了gzip,这里需要先解压缩 */
      if (/error/.test(arr.toString())) {
        res.json({
          errno: 404,
          msg: "not found"
        })
      } else {
        unzip(arr, (err, buffer) => {
          if (err) {
            console.log(err)
          }
          /* QQ空间接口返回GBK编码数据,这里需要进行转码 */
          let str = iconv.decode(buffer, 'GBK')
          console.log(str)
          let reg = /.*(http.*)".*,"(.*)"/
          let user = {
            avatar: str.match(reg)[1],
            nickName: str.match(reg)[2],
          }
          console.log(user)
          res.json({
            data: user,
            errno: 0
          })
        })
      }
    })


  },

}))

module.exports = router