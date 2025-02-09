// 访问者记录 API
module.exports = async (req, res) => {
    // 记录访问时间
    const visitTime = new Date().toISOString();
    
    // 获取访问者IP
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress;
    
    // 获取用户代理信息
    const userAgent = req.headers['user-agent'];

    // 记录访问信息
    console.log('访问记录:', {
        time: visitTime,
        ip: ip,
        userAgent: userAgent,
        path: req.url
    });

    // 返回成功响应
    res.status(200).json({ success: true });
}; 