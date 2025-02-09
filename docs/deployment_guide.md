# Git 部署指南

## SSH 配置
为了确保能够顺利地推送代码到 GitHub，需要正确配置 SSH。以下是推荐的配置：

1. SSH 配置文件位置：`~/.ssh/config`
2. 配置内容：
```
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
    IdentityFile ~/.ssh/id_ed25519
```

## HTTPS 代理配置
如果使用 HTTPS 方式推送代码，可以配置以下代理设置：

```bash
# 配置代理
git config --global http.proxy http://127.0.0.1:1080
git config --global https.proxy http://127.0.0.1:1080

# 取消代理（如果需要）
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 推送代码步骤
1. 添加更改到暂存区：
```bash
git add .
```

2. 提交更改：
```bash
git commit -m "你的提交信息"
```

3. 推送到远程仓库：
```bash
git push -f origin main
```

## 注意事项
1. 使用 443 端口可以避免一些网络限制
2. 如果遇到连接问题，可以尝试：
   - 重新添加 SSH 密钥：`ssh-add $env:USERPROFILE\.ssh\id_ed25519`
   - 配置 HTTPS 代理（见上文的代理配置）
   - 使用个人访问令牌（在 GitHub Settings -> Developer settings -> Personal access tokens 中创建）

3. 确保 SSH 配置文件使用正确的换行符（LF）
4. 如果遇到权限问题，检查 SSH 密钥是否已添加到 GitHub 账户