// 监听滚动事件，控制导航栏样式
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 监听滚动事件，控制章节显示动画
const observerOptions = {
    root: null,
    rootMargin: '100px 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
};

// 创建调试日志函数
const debugLog = (element, action, details = {}) => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const itemIndex = Array.from(timelineItems).indexOf(element);
    if (itemIndex !== -1) {
        console.log(
            `%c[Timeline Item ${itemIndex + 1}] ${action}`,
            'color: #2196F3',
            {
                visibility: element.style.visibility,
                opacity: element.style.opacity,
                transform: element.style.transform,
                classList: Array.from(element.classList),
                computedStyle: {
                    opacity: window.getComputedStyle(element).opacity,
                    transform: window.getComputedStyle(element).transform,
                    visibility: window.getComputedStyle(element).visibility
                },
                ...details
            }
        );
    }
};

// 统一的Intersection Observer
const createAnimationObserver = (options) => {
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const target = entry.target;
            debugLog(target, 'Intersection Update', {
                intersectionRatio: entry.intersectionRatio,
                isIntersecting: entry.isIntersecting
            });

            if (entry.isIntersecting) {
                // 根据元素类型应用不同的动画
                if (target.classList.contains('section')) {
                    target.classList.add('visible');
                } else if (target.classList.contains('timeline-item') && 
                         !target.classList.contains('animate') && 
                         entry.intersectionRatio >= 0.25) {
                    debugLog(target, 'Starting Animation');
                    
                    // 重置样式
                    target.style.cssText = '';
                    target.style.visibility = 'visible';
                    
                    requestAnimationFrame(() => {
                        debugLog(target, 'Before Adding Animate Class');
                        target.classList.add('animate');
                        debugLog(target, 'After Adding Animate Class');

                        const handleAnimationEnd = () => {
                            debugLog(target, 'Animation End Event');
                            target.style.opacity = '1';
                            target.style.transform = 'none';
                            target.style.visibility = 'visible';
                            debugLog(target, 'Final State Applied');
                            
                            target.removeEventListener('animationend', handleAnimationEnd);
                            observer.unobserve(target);
                            debugLog(target, 'Cleanup Complete');
                        };
                        
                        target.addEventListener('animationend', handleAnimationEnd);
                    });
                } else if (target.classList.contains('skills-grid')) {
                    const skillItems = target.querySelectorAll('.skill-item');
                    skillItems.forEach(item => {
                        const level = item.querySelector('.skill-level');
                        const percent = level.style.width;
                        level.style.setProperty('--skill-percent', percent);
                        item.classList.add('animate');
                    });
                    observer.unobserve(target);
                }
            }
        });
    }, options);
};

// 创建统一的观察者
const observer = createAnimationObserver(observerOptions);

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Animation System] DOM Content Loaded');
    
    // 初始化所有需要动画的元素
    const sections = document.querySelectorAll('.section');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const skillsGrids = document.querySelectorAll('.skills-grid');
    
    console.log(`[Animation System] Found: ${sections.length} sections, ${timelineItems.length} timeline items, ${skillsGrids.length} skills grids`);

    // 初始化时间线项目
    timelineItems.forEach((item, index) => {
        debugLog(item, 'Initializing Item');
        item.classList.remove('animate', 'visible');
        item.style.visibility = 'hidden';
        item.style.opacity = '0';
        debugLog(item, 'After Reset');
        observer.observe(item);
        debugLog(item, 'Started Observing');
    });

    // 初始化章节
    sections.forEach(section => {
        section.classList.remove('visible');
        observer.observe(section);
    });

    // 初始化技能网格
    skillsGrids.forEach(grid => {
        observer.observe(grid);
    });

    // 处理展开/收起功能
    const collapsibles = document.querySelectorAll('.collapsible');
    collapsibles.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const timelineItem = this.closest('.timeline-item');
            
            if (timelineItem) {
                debugLog(timelineItem, 'Collapsible Click', {
                    buttonState: this.classList.contains('active'),
                    contentState: content.classList.contains('active')
                });
            }

            // 确保展开/收起不影响时间线动画
            if (timelineItem && timelineItem.classList.contains('animate')) {
                timelineItem.style.visibility = 'visible';
                timelineItem.style.opacity = '1';
                timelineItem.style.transform = 'none';
                debugLog(timelineItem, 'After Collapsible State Update');
            }
            
            this.classList.toggle('active');
            content.classList.toggle('active');
            
            if (!content.classList.contains('active')) {
                content.style.maxHeight = '0px';
                this.textContent = '查看详情';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                this.textContent = '收起详情';
            }
        });
    });

    // 处理视频加载
    const handleVideoLoad = (container, videoSrc) => {
        // 移除旧的视频元素（如果存在）
        const oldVideo = container.querySelector('video');
        if (oldVideo) {
            oldVideo.pause();
            oldVideo.remove();
        }

        // 创建加载状态
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'video-loading';
        loadingDiv.innerHTML = `
            <i class="fas fa-spinner loading-spinner"></i>
            <span class="loading-text">正在加载视频...</span>
        `;
        container.appendChild(loadingDiv);

        // 隐藏占位符
        const placeholder = container.querySelector('.video-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // 创建视频元素
        const video = document.createElement('video');
        video.className = 'lazy-media';
        video.controls = true;

        // 加载成功处理
        video.addEventListener('loadeddata', () => {
            loadingDiv.remove();
            video.classList.add('loaded');
            video.play().catch(error => console.log('Auto-play prevented:', error));
        });

        // 加载失败处理
        video.addEventListener('error', () => {
            loadingDiv.remove();
            const errorDiv = document.createElement('div');
            errorDiv.className = 'video-error';
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span class="error-text">视频加载失败</span>
                <button class="retry-button">重试</button>
            `;
            container.appendChild(errorDiv);

            // 重试按钮点击处理
            const retryButton = errorDiv.querySelector('.retry-button');
            retryButton.addEventListener('click', () => {
                errorDiv.remove();
                handleVideoLoad(container, videoSrc);
            });

            // 显示占位符
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
        });

        // 设置视频源并开始加载
        video.src = videoSrc;
        container.appendChild(video);
    };

    // 处理项目展示图片和视频
    const showcaseItems = document.querySelectorAll('.showcase-item');
    showcaseItems.forEach(item => {
        item.addEventListener('click', function() {
            const modal = document.getElementById('mediaModal');
            const modalContent = document.getElementById('modalContent');
            const type = this.getAttribute('data-type');
            const src = this.getAttribute('data-src');
            
            modal.style.display = 'block';
            
            // 添加加载中提示
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-indicator modal-loading';
            loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            modalContent.appendChild(loadingDiv);
            
            if (type === 'image') {
                const img = new Image();
                img.onload = function() {
                    loadingDiv.remove();
                    modalContent.appendChild(this);
                };
                img.src = src;
                img.alt = this.querySelector('.showcase-caption').textContent;
            } else if (type === 'video') {
                handleVideoLoad(this, src);
            }
        });
    });

    // 关闭模态框
    const closeBtn = document.querySelector('.modal-close');
    const modal = document.getElementById('mediaModal');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        const video = modal.querySelector('video');
        if (video) {
            video.pause();
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            const video = modal.querySelector('video');
            if (video) {
                video.pause();
            }
        }
    });
}); 