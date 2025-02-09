// 访问者记录 API
module.exports = async (req, res) => {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 记录访问时间
    const visitTime = new Date().toISOString();
    
    // 获取访问者IP
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress;
    
    // 获取用户代理信息
    const userAgent = req.headers['user-agent'];

    // 获取请求来源
    const referer = req.headers['referer'] || 'direct';

    // 记录访问信息
    console.log('访问记录:', {
        time: visitTime,
        ip: ip,
        userAgent: userAgent,
        path: req.url,
        referer: referer,
        method: req.method
    });

    // 返回成功响应
    res.status(200).json({ success: true });
}; 