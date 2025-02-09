# 个人简历网站

一个现代化的响应式个人简历网站模板。

## 部署地址

[在线预览](https://hong0142-github-io.vercel.app/)

## 最后更新时间

测试自动部署更新时间：2024-03-19 15:30

## 特点

- 响应式设计，适配各种设备
- 现代化的UI设计
- 流畅的动画效果
- 优化的打印样式
- 良好的可访问性
- SEO友好

## 技术栈

- HTML5
- CSS3
- JavaScript (原生)
- Font Awesome (图标)
- Google Fonts (字体)

## 功能

- 固定导航栏
- 平滑滚动
- 响应式菜单
- 技能进度条动画
- 时间线布局
- 项目展示卡片
- 打印优化

## 目录结构

```
resume/
├── index.html          # 主页面
├── assets/            # 资源文件夹
│   ├── css/          # 样式文件
│   │   ├── style.css    # 主样式
│   │   ├── print.css    # 打印样式
│   │   └── responsive.css # 响应式样式
│   ├── js/           # JavaScript文件
│   │   └── main.js      # 主要脚本
│   └── images/       # 图片资源
├── favicon.ico       # 网站图标
└── README.md         # 项目说明
```

## 使用说明

1. 克隆仓库
2. 修改 `index.html` 中的个人信息
3. 替换 `assets/images/avatar.jpg` 为你的个人照片
4. 根据需要修改样式和布局
5. 部署到你的网站服务器

## 自定义

### 修改颜色主题

在 `assets/css/style.css` 文件中修改 `:root` 中的颜色变量：

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --text-color: #333;
    --light-gray: #f5f6fa;
    --border-color: #ddd;
    --timeline-color: #3498db;
    --success-color: #2ecc71;
}
```

### 添加新的部分

1. 在 `index.html` 中添加新的 section
2. 在 `style.css` 中添加相应的样式
3. 如果需要，在 `main.js` 中添加相应的功能

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- Opera (最新版)

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT License 