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
        hint.textContent = '你可以把我当作本人，我知道更加详细具体的简历信息，快来点击我了解项目的详细信息吧！';
        
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
        try {
            // 通过后端代理发送请求
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    context: this.context
                })
            });

            if (!response.ok) {
                throw new Error('API请求失败');
            }

            const data = await response.json();
            return data.response;
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