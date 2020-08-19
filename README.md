# 商领云小程序的 webview 内开发自定义 H5

[h5 demo地址](https://github.com/MaxLeap/mp-webview-demo)

## 本地调试

### 启动本地服务器
下载 demo。命令行进入项目目录
``` bash
# 安装模块
npm install
# 启动命令
npm run dev
```

### 自定义协议地址
登录商领云后台，进入商场首页的菜单，编辑快捷菜单。将自定义协议填入
> /sub/p3/commonpage/jump/page?mapp_params={"src":"http://127.0.0.1:3000/static/web.html","pageName":"common_web_share"}

