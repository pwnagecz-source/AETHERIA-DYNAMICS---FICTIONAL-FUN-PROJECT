document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor Logic ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const hoverElements = document.querySelectorAll('[data-hover]');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Delay for the follower for smooth effect
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 50);
    });

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
    });

    // --- 2. Preloader Logic ---
    const loader = document.querySelector('.loader');
    const percentDisplay = document.querySelector('.loader-percent');
    const barFill = document.querySelector('.bar-fill');
    let percent = 0;

    const interval = setInterval(() => {
        percent += Math.floor(Math.random() * 5) + 1;
        if (percent > 100) percent = 100;
        
        percentDisplay.textContent = percent + '%';
        barFill.style.width = percent + '%';

        if (percent === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.transform = 'translateY(-100%)';
                // Trigger intro animations
                setTimeout(() => {
                    document.querySelectorAll('.reveal-text').forEach(el => el.classList.add('active'));
                }, 500);
            }, 500);
        }
    }, 30);

    // --- 3. Scroll Observer (Scrollytelling) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-scroll]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
        observer.observe(el);
    });

    // --- 4. Canvas Neural Network Animation ---
    const canvas = document.getElementById('neuro-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, ' : 'rgba(188, 19, 254, ';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + '0.5)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numParticles = Math.floor(width * 0.05); // Density
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect particles (Neural connections)
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance/100 * 0.1})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    resize();
    initParticles();
    animate();
});