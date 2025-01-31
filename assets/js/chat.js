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
            if (!response.ok) {
                throw new Error('无法加载简历内容');
            }
            this.context = await response.text();
            console.log('简历内容加载成功:', this.context.slice(0, 100) + '...'); // 调试用
        } catch (error) {
            console.error('加载简历内容失败:', error);
            this.context = `# 洪泽平的个人简历

## 基本信息
- 姓名：洪泽平
- 职位：嵌入式开发工程师 | 视觉算法工程师
- 联系电话：18250688552
- 电子邮箱：417795841@qq.com

## 个人简介
具有丰富的嵌入式开发经验，专注于DSP开发和视觉算法开发。在航空电器领域有深入研究，主导过多个重要项目的开发。擅长C/C++编程，具备算法优化和系统架构设计能力。

## 专利成果
1. CN116381437A - 电弧检测相关专利
2. CN116413558A - 电弧检测相关专利

## 工作经验
### AGV系统与视觉算法开发（2023-至今）
- 主导AGV系统开发，实现机器人控制、通信、任务管理等核心功能
- 开发视觉算法系统，实现mAP50达0.734，推理速度<100ms/帧
- 设计并实现基于RS485、CANopen和WLAN的多层通信架构

### 上海航空电器有限公司（2021.3-2023.10）
- 负责电弧检测算法研发项目，带领9人团队完成算法开发与实验室建设
- 主导某型号飞机二次配电设备项目的软件开发，实现DO178c标准的代码编写
- 以第一发明人身份发表2篇项目专利（CN116381437A、CN116413558A）`;
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

        // 确保上下文内容已加载
        if (!this.context) {
            return '抱歉，我暂时无法访问简历内容，请稍后再试。';
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

重要提示：请先仔细阅读上述简历内容，确保理解所有信息后再回答问题。每次回答前都要检查简历内容，确保回答准确无误。`
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.3
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