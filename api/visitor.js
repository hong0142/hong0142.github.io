// 访问者记录 API
module.exports = async (req, res) => {
    try {
        // 设置更完整的 CORS 和缓存头
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');

        // 处理 OPTIONS 请求
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        // 记录访问时间（北京时间）
        const visitTime = new Date().toLocaleString('zh-CN', { 
            timeZone: 'Asia/Shanghai',
            hour12: false 
        });
        
        // 获取访问者IP
        const ip = req.headers['x-forwarded-for'] || 
                req.headers['x-real-ip'] || 
                req.connection.remoteAddress || 
                'unknown';
        
        // 获取用户代理信息
        const userAgent = req.headers['user-agent'] || 'unknown';

        // 获取请求来源
        const referer = req.headers['referer'] || 'direct';

        // 获取地理位置信息（如果有）
        const geoLocation = req.headers['x-vercel-ip-country'] || 'unknown';

        // 获取设备信息
        const deviceInfo = {
            platform: req.headers['sec-ch-ua-platform'] || 'unknown',
            mobile: req.headers['sec-ch-ua-mobile'] || 'unknown',
            browser: req.headers['sec-ch-ua'] || 'unknown'
        };

        // 构建详细的访问记录
        const visitRecord = {
            time: visitTime,
            ip: ip,
            country: geoLocation,
            userAgent: userAgent,
            device: deviceInfo,
            path: req.url,
            referer: referer,
            method: req.method,
            timestamp: Date.now(),
            requestId: Math.random().toString(36).substring(7)
        };

        // 记录访问信息到控制台
        console.log('【访客记录】', JSON.stringify(visitRecord, null, 2));

        // 如果是POST请求且带有额外数据
        if (req.method === 'POST' && req.body) {
            console.log('【访客额外数据】', JSON.stringify(req.body, null, 2));
        }

        // 返回成功响应
        res.status(200).json({ 
            success: true,
            message: '访问记录已保存',
            data: {
                time: visitTime,
                country: geoLocation,
                requestId: visitRecord.requestId
            }
        });

    } catch (error) {
        // 错误处理
        console.error('【访客记录错误】', {
            error: error.message,
            stack: error.stack,
            time: new Date().toLocaleString('zh-CN', { 
                timeZone: 'Asia/Shanghai',
                hour12: false 
            }),
            headers: req.headers
        });

        // 返回错误响应
        res.status(500).json({ 
            success: false,
            message: '记录访问信息时发生错误',
            error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误',
            requestId: Math.random().toString(36).substring(7)
        });
    }
}; 