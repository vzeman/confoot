/**
 * Lazy loading implementation for ConFoot website
 * This script replaces image src with data-src when the image comes into viewport
 */
(function() {
  // Function to initialize lazy loading
  function initLazyLoad() {
    // Get all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    // If IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      // Create IntersectionObserver instance
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          // If the image is in viewport
          if (entry.isIntersecting) {
            const img = entry.target;
            // Replace src with data-src
            img.src = img.dataset.src;
            
            // If there's a srcset, handle that too
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            
            // Remove the data attributes once loaded
            img.onload = function() {
              img.removeAttribute('data-src');
              img.removeAttribute('data-srcset');
              img.classList.add('loaded');
            };
            
            // Stop observing the image
            observer.unobserve(img);
          }
        });
      }, {
        // Options
        rootMargin: '50px 0px', // Start loading 50px before the image enters viewport
        threshold: 0.01 // Trigger when at least 1% of the image is visible
      });
      
      // Observe all images with data-src
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
      });
    }
  }
  
  // Initialize lazy loading when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoad);
  } else {
    initLazyLoad();
  }
})();
