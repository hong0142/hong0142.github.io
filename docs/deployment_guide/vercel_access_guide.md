# Vercel 部署与访问指南

## 一、项目访问地址

### 生产环境
- 主域名：https://hong0142-github-io.vercel.app
- 最新部署：https://hong0142-github-1o7ipj07y-rexs-projects-e835f8fe.vercel.app

## 二、部署流程

### 1. 环境准备
```bash
# 安装Vercel CLI
npm install -g vercel

# 登录Vercel
vercel login
```

### 2. 项目配置
在项目根目录创建`vercel.json`：
```json
{
  "version": 2,
  "builds": [
    { "src": "api/**/*.js", "use": "@vercel/node" },
    { "src": "*.html", "use": "@vercel/static" },
    { "src": "assets/**", "use": "@vercel/static" },
    { "src": "docs/**", "use": "@vercel/static" }
  ],
  "routes": [
    {
      "src": "/api/visitor",
      "methods": ["GET", "POST", "OPTIONS"],
      "dest": "/api/visitor.js",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
        "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    },
    {
      "src": "/api/chat",
      "methods": ["GET", "POST", "OPTIONS"],
      "dest": "/api/chat.js",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
        "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    },
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { 
      "src": "/(.*)", 
      "dest": "/$1",
      "headers": {
        "Cache-Control": "public, max-age=0, must-revalidate"
      }
    }
  ]
}
```

### 3. 环境变量配置

#### 必要的环境变量
1. `KIMI_API_KEY`
   - 用途：聊天机器人 API 密钥
   - 当前值：`sk-o8MgLyQeam1OluPGcVk0a1Ns5RwgkFLiIUZlTRgUoS36t8OO`
   - 配置位置：`vercel.json` 的 env 部分

#### 环境变量管理命令
```bash
# 添加环境变量
vercel env add KIMI_API_KEY

# 删除环境变量
vercel env rm KIMI_API_KEY -y

# 查看环境变量
vercel env ls

# 拉取环境变量到本地
vercel env pull .env.production
```

### 4. 部署步骤

#### 4.1 初始化部署
```bash
# 移除旧的vercel配置（如果存在）
rm -r -force .vercel

# 初始化并部署
vercel --yes
```

#### 4.2 生产环境部署
```bash
# 查看项目状态
vercel ls

# 部署到生产环境
vercel deploy --prod

# 查看部署状态
vercel ps
```

### 5. 域名配置

#### 5.1 设置项目别名
```bash
# 查看当前部署
vercel ls

# 设置别名
vercel alias set <latest-deployment-url> <your-project-name.vercel.app>
```

#### 5.2 自动别名配置
在`vercel.json`中添加：
```json
{
  "alias": ["your-project-name.vercel.app"]
}
```

## 三、监控与日志

### 1. 日志查看
```bash
# 查看实时日志
vercel logs <your-project-url> --follow

# 查看特定部署的日志
vercel logs <deployment-url>

# 查看构建日志
vercel inspect --logs <deployment-url>
```

### 2. 部署监控
```bash
# 查看所有部署
vercel ls

# 查看特定部署详情
vercel inspect <deployment-url>

# 查看项目状态
vercel ps
```

## 四、故障排查

### 1. 部署失败
常见原因及解决方案：
- 网络连接问题
  - 配置代理（见下文代理设置）
  - 使用 443 端口（如果可能）
- 环境变量缺失
  - 检查 `vercel.json` 配置
  - 验证环境变量是否正确设置

### 2. API 访问失败
检查步骤：
1. 确认环境变量配置正确
2. 检查浏览器控制台错误信息
3. 查看 Vercel 日志
4. 验证API路由配置

### 3. 网络访问问题

#### 代理设置
如果遇到网络问题，可以使用以下代理配置：

```bash
# PowerShell 设置代理
$env:HTTPS_PROXY='http://127.0.0.1:1080'
$env:HTTP_PROXY='http://127.0.0.1:1080'

# CMD 设置代理
set HTTPS_PROXY=http://127.0.0.1:1080
set HTTP_PROXY=http://127.0.0.1:1080

# Git 配置代理
git config --global http.proxy http://127.0.0.1:1080
git config --global https.proxy http://127.0.0.1:1080
```

## 五、维护建议

### 1. 日常维护
- 定期检查日志
- 监控API调用情况
- 检查环境变量状态
- 清理旧的部署记录

### 2. 性能优化
- 优化API响应时间
- 配置合适的缓存策略
- 监控资源使用情况
- 优化构建配置

### 3. 安全建议
- 定期更新API密钥
- 检查访问日志
- 控制访问权限
- 配置安全头部

## 六、回滚操作

### 1. 版本回滚
```bash
# 查看部署历史
vercel ls

# 回滚到指定版本
vercel alias set <previous-deployment-url> <your-project-name.vercel.app>
```

### 2. 紧急回滚步骤
1. 确认需要回滚的版本
2. 执行回滚命令
3. 验证回滚结果
4. 检查日志确认服务状态

## 七、最佳实践

### 1. 部署前检查
- 确保所有环境变量配置正确
- 验证 `vercel.json` 配置
- 测试本地开发环境
- 检查API功能

### 2. 部署后验证
- 检查部署日志
- 验证API访问
- 测试主要功能
- 监控错误日志

### 3. 长期维护
- 定期更新依赖
- 优化部署配置
- 清理无用资源
- 更新文档

## 八、参考资源

1. [Vercel CLI文档](https://vercel.com/docs/cli)
2. [Vercel部署配置](https://vercel.com/docs/deployments/overview)
3. [Vercel环境变量](https://vercel.com/docs/concepts/projects/environment-variables)
4. [Vercel项目设置](https://vercel.com/docs/concepts/projects/project-configuration) 