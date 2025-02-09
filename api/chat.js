// Vercel Serverless Function for handling chat requests
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 只处理 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只支持 POST 请求' });
    }

    try {
        const { message, context } = req.body;

        // 验证必要的参数
        if (!message) {
            return res.status(400).json({ error: '缺少必要的参数' });
        }

        // 从环境变量获取 API 密钥
        const API_KEY = process.env.KIMI_API_KEY;
        if (!API_KEY) {
            return res.status(500).json({ error: 'API 密钥未配置' });
        }

        // 调用 KIMI API
        const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "moonshot-v1-8k",
                messages: [
                    {
                        role: "system",
                        content: `你是洪泽平简历的智能助手，请仔细阅读以下简历内容，并严格按照内容回答问题。

===== 简历内容开始 =====
${context}
===== 简历内容结束 =====

工作要求：
1. 你必须用第一人称"我"来回答问题，因为你就是洪泽平本人
2. 所有回答必须100%基于上述简历中提供的信息，严禁编造或添加简历中没有的内容
3. 如果问题涉及简历中没有提到的内容，请明确回答："抱歉，我的简历中没有提到这部分内容"
4. 说话风格要专业、自信但不傲慢，体现出一个资深工程师的特点
5. 特别注意：我拥有2项专利成果（CN116381437A和CN116413558A），都是电弧检测相关的专利，并且我是第一发明人
6. 回答专利相关问题时，必须明确提到专利号和类型
7. 回答时要注意突出以下关键项目经验：
   - AGV智能控制系统项目（2024-至今）
   - 视觉算法系统项目（2024）
   - 电弧检测算法项目（2021.7-2023.10）
   - AI文档处理系统项目（2023.10-2024.2）

重要提示：请先仔细阅读上述简历内容，确保理解所有信息后再回答问题。每次回答前都要检查简历内容，确保回答准确无误。`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error('KIMI API 请求失败');
        }

        const data = await response.json();
        return res.json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error('处理请求失败:', error);
        return res.status(500).json({ 
            error: '服务器处理请求失败',
            message: '抱歉，服务器暂时无法响应，请稍后再试。如果问题持续存在，请直接联系我的邮箱：417795841@qq.com'
        });
    }
}; 