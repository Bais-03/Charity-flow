document.addEventListener('DOMContentLoaded', function() {
    // Hero Carousel
    const heroCarouselItems = document.querySelectorAll('.carousel-item');
    const heroIndicators = document.querySelectorAll('.carousel-indicators .indicator');
    let heroCurrentIndex = 0;
    
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
    
    // Set interval for hero carousel
    let heroInterval = setInterval(nextHeroSlide, 5000);
    
    // Pause on hover
    const heroCarousel = document.querySelector('.carousel');
    heroCarousel.addEventListener('mouseenter', () => {
        clearInterval(heroInterval);
    });
    
    heroCarousel.addEventListener('mouseleave', () => {
        heroInterval = setInterval(nextHeroSlide, 5000);
    });
    
    // Indicator click events
    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            heroCurrentIndex = index;
            updateHeroCarousel();
            clearInterval(heroInterval);
            heroInterval = setInterval(nextHeroSlide, 5000);
        });
    });
    
    // Needs Carousel
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
    
    // How It Works Toggle
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
});
