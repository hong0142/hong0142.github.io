# Vercel 部署方案

## 一、前期准备

### 1. 账号准备
- [ ] 注册 [Vercel 账号](https://vercel.com/signup)
- [ ] 关联 GitHub 账号

### 2. 本地环境准备
```bash
# 安装 Node.js (如果没有)
# 从 https://nodejs.org 下载安装最新的 LTS 版本

# 安装 Vercel CLI
npm install -g vercel
```

## 二、项目配置

### 1. 确认项目文件
已准备好的文件：
- [x] vercel.json（部署配置）
- [x] api/chat.js（API 实现）
- [x] package.json（依赖配置）
- [x] .gitignore（忽略配置）

### 2. 安装项目依赖
```bash
# 在项目根目录执行
npm install
```

## 三、部署步骤

### 1. 本地测试
```bash
# 登录 Vercel
vercel login

# 本地开发测试
vercel dev
```

### 2. 配置环境变量
1. 登录 [Vercel 控制台](https://vercel.com)
2. 选择你的项目
3. 进入 Settings → Environment Variables
4. 添加环境变量：
   - 名称：`KIMI_API_KEY`
   - 值：你的 KIMI API 密钥
   - 环境：Production

### 3. 正式部署
```bash
# 部署到生产环境
vercel --prod
```

## 四、验证部署

### 1. 基本验证
- [ ] 访问部署后的网站首页
- [ ] 测试聊天机器人功能
- [ ] 确认 API 调用正常

### 2. 安全验证
- [ ] 确认 API 密钥未在前端暴露
- [ ] 验证 CORS 配置正常
- [ ] 检查错误处理是否正常

## 五、注意事项

1. **环境变量**
   - 确保在 Vercel 平台正确设置 `KIMI_API_KEY`
   - 不要在代码中硬编码 API 密钥

2. **域名设置**
   - 默认会得到 `*.vercel.app` 域名
   - 如需自定义域名，在 Vercel 控制台配置

3. **开发建议**
   - 使用 `vercel dev` 进行本地测试
   - 每次修改后先在本地验证
   - 确认无误后再部署到生产环境

## 六、回滚方案

如果部署后发现问题：
1. 在 Vercel 控制台查看部署历史
2. 点击之前的成功部署版本
3. 选择 "Redeploy" 进行回滚

## 七、维护计划

1. **定期检查**
   - 监控 API 调用情况
   - 检查错误日志
   - 验证功能完整性

2. **更新计划**
   - 定期更新依赖包
   - 关注 API 版本更新
   - 及时修复发现的问题 