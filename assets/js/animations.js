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
    rootMargin: '0px',
    threshold: 0.2
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 观察所有章节
document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
});

// 观察时间线项目
document.querySelectorAll('.timeline-item').forEach(item => {
    sectionObserver.observe(item);
});

// 技能条动画
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillItems = entry.target.querySelectorAll('.skill-item');
            skillItems.forEach(item => {
                const level = item.querySelector('.skill-level');
                const percent = level.style.width;
                level.style.setProperty('--skill-percent', percent);
                item.classList.add('animate');
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// 观察技能部分
document.querySelectorAll('.skills-grid').forEach(grid => {
    skillObserver.observe(grid);
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
        }
    });
});

// 处理时间线动画
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const collapsibles = document.querySelectorAll('.collapsible');
    
    // 初始化Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    // 观察所有时间线项目
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // 处理展开/收起功能
    collapsibles.forEach(button => {
        let isFirstClick = true;  // 标记是否是首次点击
        
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.classList.contains('active')) {
                // 收起内容
                content.style.display = 'none';
                content.classList.remove('active');
                this.textContent = '查看详情';
                
                // 移除已加载的视频
                const videoContainers = content.querySelectorAll('.video-container');
                videoContainers.forEach(container => {
                    const video = container.querySelector('video');
                    if (video) {
                        video.pause();
                        video.remove();
                    }
                    // 恢复占位符
                    const placeholder = container.querySelector('.video-placeholder');
                    if (placeholder) {
                        placeholder.style.display = 'flex';
                    }
                });
            } else {
                // 展开内容
                content.style.display = 'block';
                content.classList.add('active');
                this.textContent = '收起详情';
                
                // 仅在首次点击时初始化视频容器
                if (isFirstClick) {
                    const videoContainers = content.querySelectorAll('.video-container');
                    videoContainers.forEach(container => {
                        const placeholder = container.querySelector('.video-placeholder');
                        const dataSrc = container.getAttribute('data-src');
                        
                        if (placeholder && dataSrc) {
                            placeholder.addEventListener('click', function() {
                                // 创建加载指示器
                                const loadingDiv = document.createElement('div');
                                loadingDiv.className = 'video-loading';
                                loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
                                container.appendChild(loadingDiv);
                                
                                // 创建视频元素
                                const video = document.createElement('video');
                                video.className = 'lazy-media';
                                video.controls = true;
                                video.addEventListener('loadeddata', () => {
                                    loadingDiv.remove();
                                    video.classList.add('loaded');
                                    placeholder.style.display = 'none';
                                });
                                video.addEventListener('error', () => {
                                    loadingDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> 加载失败';
                                });
                                
                                video.src = dataSrc;
                                container.appendChild(video);
                            });
                        }
                    });
                    isFirstClick = false;
                }
            }
        });
    });

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
                const video = document.createElement('video');
                video.addEventListener('loadeddata', () => {
                    loadingDiv.remove();
                });
                video.src = src;
                video.controls = true;
                video.autoplay = true;
                modalContent.appendChild(video);
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