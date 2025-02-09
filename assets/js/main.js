document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 移动端菜单切换
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 移动端菜单自动关闭
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // 技能进度条动画
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.width || '0%';
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.5
    });

    skillLevels.forEach(level => {
        observer.observe(level);
    });

    // 页面加载动画
    document.body.classList.add('loaded');

    // 折叠面板功能
    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }

    // 模态框功能
    initializeModal();

    // 延迟加载媒体资源
    lazyLoadMedia();

    // 记录访问信息
    recordVisit();
});

// 模态框功能
function initializeModal() {
    const modal = document.getElementById('mediaModal');
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.getElementsByClassName('modal-close')[0];

    // 关闭模态框
    function closeModal() {
        modal.style.display = "none";
        modalContent.innerHTML = ''; // 清空内容，释放资源
    }

    // 点击关闭按钮
    closeBtn.onclick = closeModal;

    // 点击模态框外部关闭
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // 打开模态框
    document.querySelectorAll('.showcase-item').forEach(item => {
        item.onclick = function() {
            const mediaType = this.dataset.type;
            const mediaSrc = this.dataset.src;
            
            modal.style.display = "block";
            modalContent.innerHTML = ''; // 清空之前的内容
            
            // 添加加载指示器
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-indicator modal-loading';
            loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            modalContent.appendChild(loadingDiv);
            
            if (mediaType === 'video') {
                const video = document.createElement('video');
                video.addEventListener('loadeddata', () => {
                    loadingDiv.remove();
                    video.classList.add('loaded');
                });
                video.addEventListener('error', () => {
                    loadingDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> 加载失败';
                });
                video.controls = true;
                video.autoplay = true;
                video.src = mediaSrc;
                modalContent.appendChild(video);
            } else {
                const img = new Image();
                img.onload = function() {
                    loadingDiv.remove();
                    this.classList.add('loaded');
                    modalContent.appendChild(this);
                };
                img.onerror = function() {
                    loadingDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> 加载失败';
                };
                img.src = mediaSrc;
                img.alt = this.querySelector('.showcase-caption').textContent;
            }
        }
    });
}

// 延迟加载媒体资源
function lazyLoadMedia() {
    const lazyMedias = document.querySelectorAll('.lazy-media[data-src]');
    
    const mediaObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const media = entry.target;
                const src = media.getAttribute('data-src');
                
                if (media.tagName === 'VIDEO') {
                    media.src = src;
                    media.load();
                } else if (media.tagName === 'IMG') {
                    const img = new Image();
                    img.onload = function() {
                        media.src = src;
                        media.classList.add('loaded');
                    };
                    img.src = src;
                }
                
                media.removeAttribute('data-src');
                observer.unobserve(media);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    lazyMedias.forEach(media => {
        mediaObserver.observe(media);
    });
}

// 优化展开/收起性能
document.querySelectorAll('.collapsible').forEach(button => {
    button.addEventListener('click', function() {
        const content = this.nextElementSibling;
        
        // 在动画开始前计算高度
        if (!content.classList.contains('active')) {
            content.style.display = 'block';
            const height = content.scrollHeight;
            content.style.display = '';
            
            // 使用 requestAnimationFrame 确保在下一帧执行动画
            requestAnimationFrame(() => {
                content.style.height = height + 'px';
                content.classList.add('active');
            });
        } else {
            content.style.height = '0';
            content.addEventListener('transitionend', function handler() {
                content.classList.remove('active');
                content.removeEventListener('transitionend', handler);
            });
        }
    });
});

// 记录访问信息
async function recordVisit() {
    const startTime = Date.now();
    try {
        console.log('开始记录访问信息...');
        const requestBody = {
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || navigator.userLanguage
        };
        console.log('请求数据:', requestBody);

        // 获取当前域名
        const currentDomain = window.location.origin;
        const apiUrl = `${currentDomain}/api/visitor`;
        console.log('请求 URL:', apiUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

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
        
        console.log('响应状态:', response.status);
        
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
        if (error.name === 'AbortError') {
            console.error('记录访问信息超时');
        } else {
            console.error('记录访问信息失败:', {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        }
        // 错误发生时不重试，避免无限循环
    }
}

// 页面加载完成时执行
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadMedia();
    recordVisit();
}); 