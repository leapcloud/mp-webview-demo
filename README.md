# 商领云小程序的 webview 内开发自定义 H5

## 本地调试

### 启动本地服务器
下载 [leapcloud webview h5 demo](https://github.com/leapcloud/mp-webview-demo)。命令行进入项目目录
``` bash
# 安装模块
npm install
# 启动命令
npm run dev
```

### 1、填写自定义协议地址
登录商领云后台，进入商场首页的菜单，编辑快捷菜单（这里以快捷菜单为例）。将自定义协议填入
> /sub/p3/commonpage/jump/page?mapp_params={"src":"http://127.0.0.1:3000/static/web.html","pageName":"common_web_share"}

### 2、小程序配置不校验域名
本地调试 webview ，小程序开发工具内需要勾选不校验域名。

> tip：上线需要配置小程序 H5 业务域名

### 3、调试自定义 H5
  #### 3.1：未登录状态
点击添加了自定义协议的菜单进入 H5。
未登录状态可获取的参数信息：

  #### 3.2：跳转个人中心

点击`跳转到个人中心`去登录，通过 `wx.miniProgramswitchTab` Api 跳转至个人中心。

  #### 3.3：获取登录信息
登录完成后，重新进入 H5，即可获取登录信息

  #### 3.4：获取个人信息
获取 sessionToken 通过请求 LeapCloud API 获取个人信息。

  ### 4、分享

输入分享标题和分享图片，点击`设置分享配置`按钮

点击右上角 `...`，选择 `分享到微信`

## 具体实现

### 获取用户信息
通过 js 获取地址栏中的 query string 信息,拿到当前用户的身份信息及 App 信息, 访问 LeapCloud API 时需要用到.
```javascript
  // 工具函数, 获取地址栏参数
  function getQueryString(name) {
      name = name.toLowerCase();
      var search = window.location.search.toLowerCase();
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i');
      var result = search.substr(1).match(reg);
      if (result != null) {
          return unescape(result[2]);
      }
      return null;
  }

  function getPageParams() {
    var pageParams = JSON.parse(getQueryString("page_params"))
    if (!pageParams) {
      return {}
    }
    return pageParams
  }

  var pageParams = getPageParams()

  // 所在环境.默认值为 "mapp"
  var platform = pageParams.platform
  // 该应用的 appId
  var appId = pageParams.appId
  // 已登录用户 token
  var sessionToken = pageParams.sessionToken
  // 推荐人用户 ID
  var introducerId = pageParams.introducerId
  // 所在小程序平台环境变量, 微信小程序为 'WEAPP'. 
  // 可能的值: 'WEAPP' | 'SWAN' | 'ALIPAY' | 'TT'
  var taroEnv = pageParams.taroEnv
```
> <font color='red'>注意: sessionToken 可能会在小程序内退出登录时清除，请尽量不要持久化 sessionToken。或者判断 page_params 内是否存在 sessionToken。不存在时清除本地 sessionToken。</font>
### 调用 API
```javascript
  // 设置全局的 ajax headers
  var pageParams = getPageParams()
  var appid = pageParams.appid
  var sessiontoken = pageParams.sessiontoken
  var userid = pageParams.userid
  $.ajaxSetup({
    headers: {
      'X-ML-AppId': appid,
      'X-Project': 'mapp',
      'X-Runtime': 'webview',
      'X-ML-Session-Token': sessiontoken
    }
  })

  // 通过本地服务器代理到 maxleap 开放 api。获取用户信息
  $.ajax({
    url: '/1.0/mems/' + userid,
  }).then(function(res) {
    console.log(res)
  })
```
### 配置分享
使用分享前，需`<script>`标签引入[jssdk](https://res.wx.qq.com/open/js/jweixin-1.3.2.js)
```html
<script src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
```
```javascript
// 数据格式
// interface IPostShareConfig {
//   data: {
//     share: {
//       title: string,
//       imageUrl: string,
//       timestamp: Timestamp
//     }
//   }
// }
wx.miniProgram.postMessage({ 
  data: {
    share: { 
      title: '自定义标题', 
      imageUrl: '自定义图片',
      // timestamp 必填. 不然只会获取第一次的设置的配置
      timestamp: new Date().getTime()
    } 
  }
})
```
> tip：webview 自定义协议有两个, 通用不带分享的 `common_web_index`，和带分享的 `common_web_share`。

### 页面跳转
调用页面跳转前，需`<script>`标签引入[jssdk](https://res.wx.qq.com/open/js/jweixin-1.3.2.js)
```html
<script src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
```
```javascript
  // 跳转到 tabBar 页面
  wx.miniProgram.switchTab({
    url: ''
  })
  // 保留当前页面，跳转到应用内的某个页面
  wx.miniProgram.navigateTo({
    url: ''
  })
  // 关闭当前页面，跳转到应用内的某个页面
  wx.miniProgram.redirectTo({
    url: ''
  })
  // 关闭当前页面，返回上一页面或多级页面
  wx.miniProgram.navigateBack({
    delta: 1
  })
```
> tip：可通过小程序内的 `app.json` 查看相关页面的 `url`。或者使用自定义协议跳转