class ChatBot {
    constructor() {
        this.container = null;
        this.messages = null;
        this.input = null;
        this.sendButton = null;
        this.context = '';
        this.isTyping = false;
        this.init();
    }

    async init() {
        // 加载简历内容作为上下文
        try {
            const response = await fetch('docs/personal_resume.md');
            if (!response.ok) {
                throw new Error('无法加载简历内容');
            }
            this.context = await response.text();
            console.log('简历内容加载成功:', this.context.slice(0, 100) + '...'); // 调试用
        } catch (error) {
            console.error('加载简历内容失败:', error);
            // 尝试备用路径
            try {
                const backupResponse = await fetch('docs/resume.md');
                if (backupResponse.ok) {
                    this.context = await backupResponse.text();
                    console.log('从备用路径加载简历成功');
                } else {
                    throw new Error('备用路径也无法访问');
                }
            } catch (backupError) {
                console.error('备用路径加载失败:', backupError);
                this.context = null;
            }
        }

        // 创建聊天界面
        this.createChatInterface();
        // 创建聊天入口
        this.createChatTrigger();
        // 添加事件监听
        this.attachEventListeners();
        
        // 根据简历加载状态发送不同的欢迎消息
        if (this.context) {
            this.addMessage('bot', '你好！我是洪泽平的AI助手，很高兴为您服务。您可以询问我关于简历中的任何问题。');
        } else {
            this.addMessage('bot', '抱歉，目前无法加载简历内容。请稍后再试或联系网站管理员。');
        }
    }

    createChatTrigger() {
        // 创建聊天图标
        const trigger = document.createElement('div');
        trigger.className = 'chat-trigger';
        trigger.innerHTML = '<i class="fas fa-robot"></i>';
        
        // 创建提示文字
        const hint = document.createElement('div');
        hint.className = 'chat-hint';
        hint.textContent = '我知道所有的简历信息，快来问我吧！';
        
        // 添加到页面
        document.body.appendChild(trigger);
        document.body.appendChild(hint);
        
        // 点击事件
        trigger.addEventListener('click', () => {
            this.container.classList.toggle('open');
            if (this.container.classList.contains('open')) {
                hint.style.display = 'none';
                // 如果是第一次打开，显示欢迎消息
                if (this.messages.children.length === 0) {
                    this.addMessage('bot', '你好！我是洪泽平的AI助手，很高兴为您服务。您可以询问我关于简历中的任何问题。');
                }
            } else {
                hint.style.display = 'block';
            }
        });
    }

    createChatInterface() {
        // 创建聊天容器
        this.container = document.createElement('div');
        this.container.className = 'chat-container';
        
        // 创建聊天界面HTML
        this.container.innerHTML = `
            <div class="chat-header">
                <h3>AI助手</h3>
                <button class="chat-toggle">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input-container">
                <input type="text" placeholder="请输入您的问题..." />
                <button class="send-button">发送</button>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(this.container);

        // 获取元素引用
        this.messages = this.container.querySelector('.chat-messages');
        this.input = this.container.querySelector('input');
        this.sendButton = this.container.querySelector('.send-button');
        this.toggleButton = this.container.querySelector('.chat-toggle');
    }

    attachEventListeners() {
        // 发送按钮点击事件
        this.sendButton.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleSend();
        });

        // 输入框回车事件
        this.input.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                await this.handleSend();
            }
        });

        // 切换聊天窗口
        this.toggleButton.addEventListener('click', () => {
            this.container.classList.toggle('open');
        });
    }

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        this.messages.appendChild(indicator);
        this.messages.scrollTop = this.messages.scrollHeight;
        return indicator;
    }

    async handleSend() {
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;

        // 禁用输入和发送按钮，防止重复发送
        this.input.disabled = true;
        this.sendButton.disabled = true;

        // 清空输入框
        this.input.value = '';

        // 添加用户消息
        this.addMessage('user', message);

        // 显示正在输入指示器
        this.isTyping = true;
        const typingIndicator = this.showTypingIndicator();

        try {
            // 调用KIMI API
            const response = await this.callKimiAPI(message);
            
            // 移除输入指示器
            typingIndicator.remove();
            
            // 添加机器人回复
            this.addMessage('bot', response);
        } catch (error) {
            console.error('API调用失败:', error);
            typingIndicator.remove();
            this.addMessage('bot', '抱歉，服务器暂时无法响应，请稍后再试。如果问题持续存在，请直接联系我的邮箱：417795841@qq.com');
        } finally {
            // 重新启用输入和发送按钮
            this.input.disabled = false;
            this.sendButton.disabled = false;
            this.isTyping = false;
            this.input.focus();
        }
    }

    async callKimiAPI(message) {
        const API_KEY = 'sk-I7LzcoUZXCsarClDKFBE8lt6rYdaGaY2pxV8wROEqgAdurGT';
        const API_ENDPOINT = 'https://api.moonshot.cn/v1/chat/completions';

        // 确保上下文内容已加载
        if (!this.context) {
            return '抱歉，我暂时无法访问简历内容，请刷新页面或稍后再试。';
        }

        try {
            const response = await fetch(API_ENDPOINT, {
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
${this.context}
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
                throw new Error('API请求失败');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('API调用失败:', error);
            return '抱歉，服务器暂时无法响应，请稍后再试。如果问题持续存在，请直接联系我的邮箱：417795841@qq.com';
        }
    }
}

// 初始化聊天机器人
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
}); 