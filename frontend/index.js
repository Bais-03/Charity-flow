document.addEventListener('DOMContentLoaded', function() {
    // Hero Carousel
    const heroCarouselItems = document.querySelectorAll('.carousel-item');
    const heroIndicators = document.querySelectorAll('.carousel-indicators .indicator');
    let heroCurrentIndex = 0;
    const slideInterval = 4000; // 4 seconds per slide
    
    function updateHeroCarousel() {
        heroCarouselItems.forEach((item, index) => {
            item.classList.remove('active');
            heroIndicators[index].classList.remove('active');
            if (index === heroCurrentIndex) {
                item.classList.add('active');
                heroIndicators[index].classList.add('active');
            }
        });
    }
    
    function nextHeroSlide() {
        heroCurrentIndex = (heroCurrentIndex + 1) % heroCarouselItems.length;
        updateHeroCarousel();
    }
    
    // Set interval for hero carousel (4 seconds)
    let heroInterval = setInterval(nextHeroSlide, slideInterval);
    
    const heroCarousel = document.querySelector('.carousel');

    // Add click event to the entire carousel to go to the next slide
    heroCarousel.addEventListener('click', () => {
        nextHeroSlide();
        // Reset the timer when manually changing slides
        clearInterval(heroInterval);
        heroInterval = setInterval(nextHeroSlide, slideInterval);
    });
    
    // Pause on hover
    heroCarousel.addEventListener('mouseenter', () => {
        clearInterval(heroInterval);
    });
    
    heroCarousel.addEventListener('mouseleave', () => {
        // Clear existing interval before setting new one
        clearInterval(heroInterval);
        heroInterval = setInterval(nextHeroSlide, slideInterval);
    });
    
    // Enhanced indicator click events
    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            // Stop the event from bubbling up to the carousel click listener
            e.stopPropagation();

            heroCurrentIndex = index;
            updateHeroCarousel();
            
            // Reset the timer when manually changing slides
            clearInterval(heroInterval);
            heroInterval = setInterval(nextHeroSlide, slideInterval);
        });
        
        // Add hover effect for better UX
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
    
    // Needs Carousel (unchanged)
    const needsCarousel = document.querySelector('.needs-carousel');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    
    prevBtn.addEventListener('click', () => {
        needsCarousel.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        needsCarousel.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });
    
    // How It Works Toggle (unchanged)
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const processViews = document.querySelectorAll('.process-view');
    
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
    
    // Initialize the carousel
    updateHeroCarousel();
});