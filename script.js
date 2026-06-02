document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            // Save preference
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Toggle icon
            if (isLight) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Dynamic Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Date today for newspaper edition formatting
    const editionDateSpan = document.getElementById('edition-date');
    if (editionDateSpan) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        editionDateSpan.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetArea = document.querySelector(targetId);
                if (targetArea) {
                    targetArea.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for snappy structural appearing animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-snap').forEach(el => {
        observer.observe(el);
    });

    // Starfield Background Effect
    const canvas = document.getElementById('starfield');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * 2 + 0.1;
                this.baseSize = Math.random() * 1.5;
                this.opacity = Math.random() * 0.8 + 0.2;
            }
            update(mouseX, mouseY, isWarping) {
                // Parallax effect
                let vx = (mouseX - width/2) * 0.005 / this.z;
                let vy = (mouseY - height/2) * 0.005 / this.z;
                this.x -= vx;
                this.y -= vy;

                // Slowly drift or WARP
                if (isWarping) {
                    this.z = Math.max(0.1, this.z - 0.05);
                    let dx = (this.x - width/2);
                    let dy = (this.y - height/2);
                    this.x += dx * 0.05 / this.z;
                    this.y += dy * 0.05 / this.z;
                } else {
                    this.y -= 0.15 / this.z;
                }

                // Wrap around
                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.z <= 0.1) {
                    if (isWarping) {
                        this.x = Math.random() * width;
                        this.y = Math.random() * height;
                        this.z = 2; // Reset deep for warp effect
                    } else {
                        if (this.x < 0) this.x = width;
                        if (this.x > width) this.x = 0;
                        if (this.y < 0) this.y = height;
                        if (this.y > height) this.y = 0;
                    }
                }
            }
            draw() {
                const isLight = document.body.classList.contains('light-theme');
                // Dynamic star colors: Deep brown for light theme, starlight white for dark theme
                ctx.fillStyle = isLight ? `rgba(45, 24, 16, ${this.opacity})` : `rgba(226, 232, 240, ${this.opacity})`;
                ctx.shadowBlur = 5;
                // Dynamic glow: Solar orange for light theme, cosmic cyan for dark theme
                ctx.shadowColor = isLight ? "rgba(234, 88, 12, 0.5)" : "rgba(56, 189, 248, 0.5)"; 
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 150; i++) {
            stars.push(new Star());
        }

        let mouseX = width / 2;
        let mouseY = height / 2;
        let isWarping = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        document.addEventListener('mousedown', () => isWarping = true);
        document.addEventListener('mouseup', () => isWarping = false);
        document.addEventListener('touchstart', () => isWarping = true, {passive: true});
        document.addEventListener('touchend', () => isWarping = false);

        function animate() {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(star => {
                star.update(mouseX, mouseY, isWarping);
                star.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // 3D Tilt Effect for Project Cards
    const tiltElements = document.querySelectorAll('.hard-shadow-hover');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit rotation strictly to 5 degrees
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    // --- Mini Rocket Game ---
    const gameContainer = document.getElementById('gameContainer');
    const playerShip = document.getElementById('playerShip');
    const startScreen = document.getElementById('gameStartScreen');
    const overScreen = document.getElementById('gameOverScreen');
    const scoreDisplay = document.getElementById('gameScore');
    const finalScoreDisplay = document.getElementById('finalScore');
    
    let isPlaying = false;
    let score = 0;
    let asteroids = [];
    let playerY = 50; // percentage
    let gameLoopId;
    let spawnIntervalId;
    let gameSpeed = 3;

    if (gameContainer) {
        // Handle Mouse Movement to control Rocket in 2D
        gameContainer.addEventListener('mousemove', (e) => {
            if (!isPlaying) return;
            const rect = gameContainer.getBoundingClientRect();
            
            // Calculate relative positions
            let relativeX = e.clientX - rect.left;
            let relativeY = e.clientY - rect.top;
            
            // Constrain to container bounds
            relativeX = Math.max(10, Math.min(relativeX, rect.width - 10));
            relativeY = Math.max(10, Math.min(relativeY, rect.height - 10));
            
            // Convert to percentages
            const playerX = (relativeX / rect.width) * 100;
            playerY = (relativeY / rect.height) * 100;
            
            // Update ship position
            playerShip.style.left = `${playerX}%`;
            playerShip.style.top = `${playerY}%`;
        });

        // Click to Start/Restart
        gameContainer.addEventListener('click', () => {
            if (!isPlaying) {
                startGame();
            }
        });

        function startGame() {
            isPlaying = true;
            score = 0;
            gameSpeed = 3;
            scoreDisplay.textContent = score;
            startScreen.style.display = 'none';
            overScreen.style.display = 'none';
            playerShip.style.display = 'block';
            
            // Clear existing asteroids
            asteroids.forEach(a => a.el.remove());
            asteroids = [];
            
            spawnIntervalId = setInterval(spawnAsteroid, 1000);
            gameLoopId = requestAnimationFrame(gameLoop);
        }

        function spawnAsteroid() {
            if (!isPlaying) return;
            const el = document.createElement('i');
            // Random asteroid icon
            const icons = ['fa-meteor', 'fa-satellite', 'fa-user-astronaut'];
            el.className = `fa-solid ${icons[Math.floor(Math.random()*icons.length)]} asteroid`;
            const size = Math.random() * 10 + 15; // 15-25px
            el.style.fontSize = `${size}px`;
            
            const startY = Math.random() * 80 + 10; // 10% to 90%
            el.style.top = `${startY}%`;
            el.style.left = '100%';
            
            gameContainer.appendChild(el);
            
            asteroids.push({
                el: el,
                x: 100, // percentage
                y: startY,
                size: size
            });
            
            // Increase speed slightly over time
            gameSpeed += 0.05;
        }

        function gameLoop() {
            if (!isPlaying) return;
            
            score++;
            if (score % 10 === 0) scoreDisplay.textContent = Math.floor(score / 10);
            
            // Get precise player bounding box
            const playerRect = playerShip.getBoundingClientRect();
            // Shrink player hitbox slightly to be forgiving
            const pBox = {
                left: playerRect.left + 5,
                right: playerRect.right - 5,
                top: playerRect.top + 5,
                bottom: playerRect.bottom - 5
            };
            
            // Move asteroids
            for (let i = asteroids.length - 1; i >= 0; i--) {
                let a = asteroids[i];
                a.x -= gameSpeed * 0.2; // Move left
                a.el.style.left = `${a.x}%`;
                
                // Get asteroid bounding box
                const aRect = a.el.getBoundingClientRect();
                
                // Shrink asteroid hitbox slightly for fairer gameplay
                const aBox = {
                    left: aRect.left + 4,
                    right: aRect.right - 4,
                    top: aRect.top + 4,
                    bottom: aRect.bottom - 4
                };
                
                // Check intersection
                const isColliding = !(
                    pBox.right < aBox.left ||
                    pBox.left > aBox.right ||
                    pBox.bottom < aBox.top ||
                    pBox.top > aBox.bottom
                );
                
                if (isColliding) {
                    const centerX = pBox.left + (pBox.right - pBox.left) / 2;
                    const centerY = pBox.top + (pBox.bottom - pBox.top) / 2;
                    createBlast(centerX, centerY);
                    gameOver();
                    return;
                }
                
                // Remove if off screen
                if (a.x < -10) {
                    a.el.remove();
                    asteroids.splice(i, 1);
                }
            }
            
            gameLoopId = requestAnimationFrame(gameLoop);
        }

        function createBlast(x, y) {
            const rect = gameContainer.getBoundingClientRect();
            const relativeX = x - rect.left;
            const relativeY = y - rect.top;
            
            // Create 15 fiery particles
            const numParticles = 15;
            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                
                // Set styles inline to bypass CSS caching bugs
                particle.style.position = 'absolute';
                particle.style.borderRadius = '50%';
                particle.style.zIndex = '50';
                
                particle.style.left = `${relativeX}px`;
                particle.style.top = `${relativeY}px`;
                
                // Randomize colors (yellow, orange, red)
                const colors = ['#fde047', '#f97316', '#ef4444'];
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Randomize size
                const size = Math.random() * 8 + 4; // 4px to 12px
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Adjust position so center aligns with collision point
                particle.style.left = `${relativeX - size/2}px`;
                particle.style.top = `${relativeY - size/2}px`;
                
                gameContainer.appendChild(particle);
                
                // Calculate trajectory
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 60 + 20; // 20px to 80px distance
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                const duration = Math.random() * 400 + 300; // 300ms to 700ms
                
                // Use Web Animations API for guaranteed dynamic execution
                particle.animate([
                    { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
                    { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
                ], {
                    duration: duration,
                    easing: 'ease-out',
                    fill: 'forwards'
                });
                
                // Remove particle after animation
                setTimeout(() => {
                    particle.remove();
                }, duration);
            }
            
            playerShip.style.display = 'none';
        }

        function gameOver() {
            isPlaying = false;
            cancelAnimationFrame(gameLoopId);
            clearInterval(spawnIntervalId);
            
            finalScoreDisplay.textContent = Math.floor(score / 10);
            overScreen.style.display = 'flex';
        }
    }
});
