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
});

// 模态框功能
function initializeModal() {
    const modal = document.getElementById('mediaModal');
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.getElementsByClassName('modal-close')[0];

    // 关闭模态框
    function closeModal() {
        modal.style.display = "none";
        if (modalContent.tagName === 'VIDEO') {
            modalContent.pause();
        }
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
            
            if (mediaType === 'video') {
                modalContent.innerHTML = `<video controls><source src="${mediaSrc}" type="video/mp4"></video>`;
            } else {
                modalContent.innerHTML = `<img src="${mediaSrc}" alt="项目展示">`;
            }
        }
    });
} 