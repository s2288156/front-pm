# bs-management

## Project setup
```
npm install
npm install --registry=https://registry.npm.taobao.org

# check package update version 
npm outdated

npm install -g npm-check-updates

# 检查可更新模块
ncu

# 更新
ncu -u
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

```
# nginx config

server {
    listen       8000;
    server_name  localhost 192.168.30.61;

    root C:/Users/s2288/WebstormProjects/bs-management/dist;

    location / {
        # proxy_pass http://localhost:8200;
        try_files $uri $uri/ @router;
        index  index.html index.htm;
    }

    location @router {
        rewrite ^.*$ /index.html last;
    }

}

```

### Lints and fixes files
```
npm run lint
```

### package list

- `nprogress`进度条插件
- `path-to-regexp`路径字符串转正则表达式
- `normalize.css`它在默认的HTML元素样式上提供了跨浏览器的高度一致性
- `js-cookie`是一个简单的，轻量级的处理cookies的js API
