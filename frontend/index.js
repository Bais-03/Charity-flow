document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Mobile Navigation Toggle
    // =============================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuToggle && mobileNav) {
        const mobileMenuIcon = mobileMenuToggle.querySelector('i');
        
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            if (mobileNav.classList.contains('active')) {
                mobileMenuIcon.classList.replace('fa-bars', 'fa-times');
            } else {
                mobileMenuIcon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileMenuIcon.classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // =============================================
    // Hero Carousel
    // =============================================
    const heroCarousel = () => {
        const items = document.querySelectorAll('.carousel-item');
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        
        if (items.length === 0) return; // Exit if no carousel found
        
        let currentIndex = 0;
        let interval;

        function updateCarousel() {
            items.forEach((item, index) => {
                item.classList.remove('active');
                if (indicators[index]) {
                    indicators[index].classList.remove('active');
                }
                if (index === currentIndex) {
                    item.classList.add('active');
                    if (indicators[index]) {
                        indicators[index].classList.add('active');
                    }
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        }

        function startInterval() {
            clearInterval(interval);
            interval = setInterval(nextSlide, 4000);
        }

        // Initialize
        updateCarousel();
        startInterval();

        // Pause on hover
        const carouselContainer = document.querySelector('.carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(interval));
            carouselContainer.addEventListener('mouseleave', startInterval);
            
            // Click to advance
            carouselContainer.addEventListener('click', (e) => {
                // Only advance if clicking on the container itself, not indicators
                if (e.target === carouselContainer || e.target.classList.contains('carousel-inner')) {
                    nextSlide();
                    startInterval();
                }
            });
        }

        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = index;
                updateCarousel();
                startInterval();
            });
            
            // Hover effects
            indicator.addEventListener('mouseenter', () => {
                indicator.style.transform = 'scale(1.3)';
                indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            });
            
            indicator.addEventListener('mouseleave', () => {
                if (!indicator.classList.contains('active')) {
                    indicator.style.transform = 'scale(1)';
                    indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                }
            });
        });
    };

    // =============================================
    // Needs Carousel
    // =============================================
    const needsCarousel = () => {
        const carousel = document.querySelector('.needs-carousel');
        const prevBtn = document.querySelector('.carousel-control.prev');
        const nextBtn = document.querySelector('.carousel-control.next');
        
        if (!carousel) return;

        // Button controls
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -300, behavior: 'smooth' });
            });
            
            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }

        // Touch/swipe support
        let isDragging = false;
        let startX, scrollLeft;

        const startDrag = (clientX) => {
            isDragging = true;
            startX = clientX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.cursor = 'grabbing';
            carousel.style.scrollBehavior = 'auto';
        };

        const duringDrag = (clientX) => {
            if (!isDragging) return;
            const x = clientX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        };

        const endDrag = () => {
            isDragging = false;
            carousel.style.cursor = 'grab';
            carousel.style.scrollBehavior = 'smooth';
        };

        // Mouse events
        carousel.addEventListener('mousedown', (e) => {
            startDrag(e.pageX);
        });

        carousel.addEventListener('mousemove', (e) => {
            duringDrag(e.pageX);
        });

        carousel.addEventListener('mouseup', endDrag);
        carousel.addEventListener('mouseleave', endDrag);

        // Touch events
        carousel.addEventListener('touchstart', (e) => {
            startDrag(e.touches[0].pageX);
        });

        carousel.addEventListener('touchmove', (e) => {
            e.preventDefault();
            duringDrag(e.touches[0].pageX);
        });

        carousel.addEventListener('touchend', endDrag);
    };

    // =============================================
    // How It Works Toggle
    // =============================================
    const howItWorksToggle = () => {
        const toggleButtons = document.querySelectorAll('.toggle-btn');
        const processViews = document.querySelectorAll('.process-view');
        
        if (toggleButtons.length === 0) return;

        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                toggleButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const view = button.dataset.view;
                processViews.forEach(process => {
                    process.classList.remove('active');
                    if (process.id === `${view}-view`) {
                        process.classList.add('active');
                    }
                });
            });
        });
    };

    // Initialize all components
    heroCarousel();
    needsCarousel();
    howItWorksToggle();
});
