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
            const response = await fetch('docs/resume.md');
            this.context = await response.text();
        } catch (error) {
            console.error('加载简历内容失败:', error);
        }

        // 创建聊天界面
        this.createChatInterface();
        // 创建聊天入口
        this.createChatTrigger();
        // 添加事件监听
        this.attachEventListeners();
        
        // 发送欢迎消息
        this.addMessage('bot', '你好！我是洪泽平的AI助手，很高兴为您服务。您可以询问我关于简历中的任何问题。');
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
            <div class="chat-input">
                <input type="text" placeholder="请输入您的问题..." />
                <button>发送</button>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(this.container);

        // 获取元素引用
        this.messages = this.container.querySelector('.chat-messages');
        this.input = this.container.querySelector('input');
        this.sendButton = this.container.querySelector('button');
        this.toggleButton = this.container.querySelector('.chat-toggle');
    }

    attachEventListeners() {
        // 发送按钮点击事件
        this.sendButton.addEventListener('click', () => this.handleSend());

        // 输入框回车事件
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSend();
            }
        });

        // 切换聊天窗口
        this.toggleButton.addEventListener('click', () => {
            this.container.classList.toggle('open');
            const icon = this.toggleButton.querySelector('i');
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
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
            this.addMessage('bot', '抱歉，我遇到了一些问题，请稍后再试。');
        }

        this.isTyping = false;
    }

    async callKimiAPI(message) {
        const API_KEY = 'sk-I7LzcoUZXCsarClDKFBE8lt6rYdaGaY2pxV8wROEqgAdurGT';
        const API_ENDPOINT = 'https://api.moonshot.cn/v1/chat/completions';

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
                            content: `你是一个AI助手，负责回答关于洪泽平简历的问题。以下是简历内容作为上下文：\n${this.context}\n请基于以上内容回答用户的问题。`
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('API请求失败');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('KIMI API调用失败:', error);
            throw error;
        }
    }
}

// 初始化聊天机器人
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
}); 