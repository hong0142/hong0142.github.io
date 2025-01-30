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