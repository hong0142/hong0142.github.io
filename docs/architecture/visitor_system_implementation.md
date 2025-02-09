# 访客记录系统实现指南

## 一、系统概述

本文档描述了基于Vercel Serverless的访客记录系统的实现方案。该系统用于记录网站访问信息，支持实时日志查看。

## 二、系统架构

### 1. 技术栈
- 后端：Vercel Serverless Functions
- 前端：原生JavaScript
- 日志：Vercel Logs System

### 2. 文件结构
```
api/
└── visitor.js      # 访客记录API实现
assets/
└── js/
    └── main.js     # 前端访客记录逻辑
```

## 三、API实现

### 1. 基本配置（visitor.js）
```javascript
module.exports = async (req, res) => {
    try {
        // CORS配置
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
        
        // 缓存控制
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } catch (error) {
        // 错误处理
    }
};
```

### 2. 访客信息收集
```javascript
// 访问时间（北京时间）
const visitTime = new Date().toLocaleString('zh-CN', { 
    timeZone: 'Asia/Shanghai',
    hour12: false 
});

// 访客信息
const visitRecord = {
    time: visitTime,
    ip: req.headers['x-forwarded-for'] || 'unknown',
    country: req.headers['x-vercel-ip-country'] || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    device: {
        platform: req.headers['sec-ch-ua-platform'] || 'unknown',
        mobile: req.headers['sec-ch-ua-mobile'] || 'unknown',
        browser: req.headers['sec-ch-ua'] || 'unknown'
    },
    path: req.url,
    referer: req.headers['referer'] || 'direct',
    method: req.method,
    timestamp: Date.now(),
    requestId: Math.random().toString(36).substring(7)
};
```

### 3. 日志记录
```javascript
// 记录访问信息
console.log('【访客记录】', JSON.stringify(visitRecord, null, 2));

// 记录额外数据
if (req.method === 'POST' && req.body) {
    console.log('【访客额外数据】', JSON.stringify(req.body, null, 2));
}
```

## 四、前端实现

### 1. 访客记录函数（main.js）
```javascript
async function recordVisit() {
    const startTime = Date.now();
    try {
        // 构建请求数据
        const requestBody = {
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || navigator.userLanguage
        };

        // 发送请求
        const currentDomain = window.location.origin;
        const apiUrl = `${currentDomain}/api/visitor`;
        
        // 添加超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // 处理响应
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const endTime = Date.now();
        console.log('访问记录成功:', {
            ...data,
            responseTime: `${endTime - startTime}ms`
        });
    } catch (error) {
        console.error('记录访问信息失败:', error);
    }
}
```

### 2. 自动记录
```javascript
// 页面加载完成时记录访问
document.addEventListener('DOMContentLoaded', function() {
    recordVisit();
});
```

## 五、配置说明

### 1. vercel.json配置
```json
{
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
    }
  ]
}
```

## 六、错误处理

### 1. 后端错误处理
```javascript
try {
    // API逻辑
} catch (error) {
    console.error('【访客记录错误】', {
        error: error.message,
        stack: error.stack,
        time: new Date().toLocaleString('zh-CN', { 
            timeZone: 'Asia/Shanghai',
            hour12: false 
        }),
        headers: req.headers
    });

    res.status(500).json({ 
        success: false,
        message: '记录访问信息时发生错误',
        error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误',
        requestId: Math.random().toString(36).substring(7)
    });
}
```

### 2. 前端错误处理
```javascript
try {
    // 访问记录逻辑
} catch (error) {
    if (error.name === 'AbortError') {
        console.error('记录访问信息超时');
    } else {
        console.error('记录访问信息失败:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }
}
```

## 七、日志查看

### 1. 查看实时日志
```bash
# 查看所有日志
vercel logs <your-project-url>

# 查看特定部署的日志
vercel logs <deployment-url>
```

### 2. 日志格式
```javascript
// 访客记录日志
{
    "time": "2024/2/9 16:32:27",
    "ip": "xxx.xxx.xxx.xxx",
    "country": "US",
    "userAgent": "Mozilla/5.0...",
    "device": {
        "platform": "Windows",
        "mobile": "?0",
        "browser": "..."
    },
    "path": "/api/visitor",
    "referer": "https://...",
    "method": "POST",
    "timestamp": 1739089747777,
    "requestId": "xxx"
}
```

## 八、性能优化

### 1. 前端优化
- 使用请求超时控制
- 避免重复记录
- 异步加载和执行
- 错误重试机制

### 2. 后端优化
- 响应头缓存控制
- 请求体大小限制
- 日志分级记录
- 异常处理优化

## 九、安全考虑

### 1. 数据安全
- 不记录敏感信息
- IP地址脱敏处理
- 控制日志访问权限
- 定期清理日志

### 2. 访问控制
- 请求频率限制
- 来源验证
- CORS策略控制
- 防止恶意请求

## 十、维护建议

### 1. 日常维护
- 监控日志大小
- 检查错误率
- 分析访问模式
- 优化记录策略

### 2. 故障处理
- 检查网络连接
- 验证API配置
- 查看错误日志
- 测试记录功能

## 十一、扩展建议

### 1. 功能扩展
- 访问统计分析
- 地理位置展示
- 访问趋势图表
- 实时访客显示

### 2. 数据持久化
- 数据库存储
- 日志归档
- 数据导出
- 备份策略

## 十二、参考资源

1. [Vercel Serverless文档](https://vercel.com/docs/serverless-functions)
2. [Vercel日志系统](https://vercel.com/docs/observability/runtime-logs)
3. [Web API文档](https://developer.mozilla.org/en-US/docs/Web/API) 