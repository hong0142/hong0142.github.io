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
$env:GIT_TRACE=1
$env:GIT_CURL_VERBOSE=1
git push -f origin main
```

## 注意事项
1. 使用 443 端口可以避免一些网络限制
2. 如果遇到连接问题，可以尝试重新添加 SSH 密钥：
```bash
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

3. 确保 SSH 配置文件使用正确的换行符（LF）
4. 如果遇到权限问题，检查 SSH 密钥是否已添加到 GitHub 账户 