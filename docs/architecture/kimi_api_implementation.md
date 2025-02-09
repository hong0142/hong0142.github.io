# KIMI API 实现指南

## 一、概述

本文档描述了如何在Vercel Serverless环境中实现和部署KIMI API的集成。

## 二、环境配置

### 1. API密钥配置
```bash
# 在Vercel中设置环境变量
vercel env add KIMI_API_KEY

# 值格式
KIMI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. vercel.json配置
```json
{
  "version": 2,
  "routes": [
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
    }
  ]
}
```

## 三、API实现

### 1. 基本结构
```javascript
// api/chat.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // CORS和错误处理配置
    // API调用逻辑
    // 响应处理
};
```

### 2. 请求参数
```javascript
const requestBody = {
    model: "moonshot-v1-8k",
    messages: [
        {
            role: "system",
            content: `系统提示内容`
        },
        {
            role: "user",
            content: message
        }
    ],
    temperature: 0.3,
    max_tokens: 1000
};
```

### 3. API调用
```javascript
const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.KIMI_API_KEY}`
    },
    body: JSON.stringify(requestBody)
});
```

## 四、错误处理

### 1. API错误处理
```javascript
try {
    // API调用逻辑
} catch (error) {
    console.error('完整错误信息:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    });
    return res.status(500).json({ 
        error: '服务器处理请求失败',
        message: '抱歉，服务器暂时无法响应，请稍后再试。',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
}
```

### 2. 常见错误类型
1. API密钥无效
2. 请求超时
3. 参数格式错误
4. 服务限流

## 五、日志记录

### 1. 请求日志
```javascript
console.log('API 请求体结构:', {
    hasModel: !!requestBody.model,
    messagesCount: requestBody.messages.length,
    temperature: requestBody.temperature
});
```

### 2. 响应日志
```javascript
console.log('API 响应状态:', {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok
});
```

### 3. 查看日志
```bash
# 查看实时日志
vercel logs <your-project-url>

# 查看构建日志
vercel inspect --logs <deployment-url>
```

## 六、性能优化

### 1. 响应优化
- 设置合理的max_tokens值
- 使用适当的temperature值
- 优化system prompt长度

### 2. 错误处理优化
- 实现请求重试机制
- 设置请求超时
- 添加错误恢复策略

## 七、安全考虑

### 1. API密钥保护
- 使用环境变量存储API密钥
- 不在客户端暴露API密钥
- 定期轮换API密钥

### 2. 请求验证
- 验证请求来源
- 检查请求参数
- 限制请求频率

## 八、维护建议

### 1. 监控指标
- API调用成功率
- 响应时间
- 错误率
- 使用量统计

### 2. 更新维护
- 定期检查API版本
- 更新依赖包
- 优化系统提示词
- 监控API限额使用情况

## 九、故障排除

### 1. API调用失败
- 检查API密钥是否有效
- 验证请求格式
- 查看错误日志
- 测试网络连接

### 2. 响应异常
- 检查请求参数
- 验证system prompt
- 调整模型参数
- 查看API限额

## 十、参考资源

1. [KIMI API文档](https://platform.moonshot.cn/docs)
2. [Vercel Serverless文档](https://vercel.com/docs/serverless-functions)
3. [Node Fetch文档](https://github.com/node-fetch/node-fetch) 