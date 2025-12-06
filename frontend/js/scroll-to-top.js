/**
 * Scroll to Top Button Functionality
 * Automatically initializes when DOM is loaded
 */

(function() {
    'use strict';
    
    // Create and inject the scroll to top button into the page
    function createScrollToTopButton() {
        // Check if button already exists
        if (document.getElementById('scrollToTop')) {
            return;
        }
        
        // Create button element
        const button = document.createElement('button');
        button.id = 'scrollToTop';
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Scroll to top');
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        
        // Append to body
        document.body.appendChild(button);
        
        return button;
    }
    
    // Initialize scroll to top functionality
    function initScrollToTop() {
        const scrollToTopBtn = createScrollToTopButton();
        
        if (!scrollToTopBtn) {
            console.warn('Scroll to top button already exists');
            return;
        }
        
        // Show/hide button based on scroll position
        function toggleButtonVisibility() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
        
        // Smooth scroll to top
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Event listeners
        window.addEventListener('scroll', toggleButtonVisibility);
        scrollToTopBtn.addEventListener('click', scrollToTop);
        
        // Initial check
        toggleButtonVisibility();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollToTop);
    } else {
        initScrollToTop();
    }
})();
