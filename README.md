# iPhone 17 — A New Perspective

一个采用原生 HTML、CSS 与 JavaScript 构建的响应式产品介绍网站。页面参考极简产品发布页的排版与留白方式；首屏、颜色选择、显示屏和相机区域使用保存在本地的 Apple 官网 iPhone 17 产品图，不包含 Apple 官方页面代码，也不代表 Apple 官方网站。

## 运行方式

无需安装依赖，无需联网加载第三方 CDN。可直接打开 `index.html`；也可以在项目目录运行：

```sh
python3 -m http.server 8000
```

然后访问 <http://localhost:8000>。如果使用 VS Code，也可通过 Live Server 打开 `index.html`。

## 文件清单

- `index.html`：语义化页面结构、产品内容、导航、交互组件与技术规格。
- `styles.css`：主题变量、桌面和移动端响应式布局、CSS 设备示意图、动画与无障碍动效偏好。
- `script.js`：导航状态、滚动进度、主题持久化、配色切换、可拖动卡片、相机说明、摄影场景、芯片演示、电池信息、FAQ 与返回顶部交互。
- `assets/`：从 Apple iPhone 17 官方产品页保存的本地产品图。站点不需要访问 CDN 即可显示这些图片。
- `README.md`：项目说明、运行方法与文件清单。

## 内容与准确性

页面规格以 Apple 的 iPhone 17 官方产品介绍与技术规格为主要参考。Apple Intelligence、卫星安全功能、无线网络和生态协作等软件或服务能力，可能受系统版本、设备设置、地区、语言、运营商及网络条件影响。续航、快速充电和 IP68 信息均附有官方条件说明。

- [iPhone 17 产品介绍](https://www.apple.com/iphone-17/)
- [iPhone 17 技术规格](https://www.apple.com/iphone-17/specs/)
- [iPhone 使用手册](https://support.apple.com/guide/iphone/welcome/ios)

当前本地图片资源及其官方素材来源：

- `assets/iphone-17-hero.jpg`：五种颜色的 iPhone 17 产品主视觉，[Apple 官方产品页](https://www.apple.com/iphone-17/)。
- `assets/iphone-17-lavender.jpg`、`iphone-17-sage.jpg`、`iphone-17-blue.jpg`、`iphone-17-white.jpg`、`iphone-17-black.jpg`：Apple 官方产品页颜色选择器中的对应配色外观图。
- `assets/iphone-17-display-start.jpg`：Apple 官方显示屏/产品浏览器素材。
- `assets/iphone-17-camera.png`：Apple 官方后置摄像头特写素材。
- `assets/iphone-17-display.jpg` 与 `assets/iphone-17-product-viewer.jpg`：Apple 官方产品浏览器素材备用图。

页面使用的产品图片为 Apple 官方公开展示素材，并随项目本地保存；Apple 名称与标志归 Apple 所有。本项目独立制作，不代表 Apple。网页本身无需网络即可浏览，页脚中的官方参考链接需要联网打开。
