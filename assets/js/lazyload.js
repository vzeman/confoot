/**
 * Lazy loading for images and SVGs
 * Uses IntersectionObserver to load images only when they are in the viewport
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get all lazy images
  const lazyImages = document.querySelectorAll('img.lazy-image');
  
  // Get all lazy SVGs
  const lazySvgs = document.querySelectorAll('object.lazy-svg');
  
  // Get all picture source elements with data-srcset
  const lazySources = document.querySelectorAll('source[data-srcset]');
  
  if ('IntersectionObserver' in window) {
    // Image observer
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Set the src to what's in data-src
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          
          // Once the image is loaded, add the 'loaded' class
          img.onload = function() {
            img.classList.add('loaded');
          };
          
          // Stop watching this image
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Source observer for picture elements
    const sourceObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const source = entry.target;
          
          // Set the srcset to what's in data-srcset
          if (source.dataset.srcset) {
            source.srcset = source.dataset.srcset;
          }
          
          // Stop watching this source
          observer.unobserve(source);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // SVG observer
    const svgObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const svg = entry.target;
          
          // Set the data attribute to what's in data-src
          svg.setAttribute('data', svg.dataset.src);
          
          // Add the 'loaded' class
          svg.classList.add('loaded');
          
          // Stop watching this SVG
          observer.unobserve(svg);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Observe all lazy images
    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
    
    // Observe all lazy sources
    lazySources.forEach(function(source) {
      sourceObserver.observe(source);
    });
    
    // Observe all lazy SVGs
    lazySvgs.forEach(function(svg) {
      svgObserver.observe(svg);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(function(img) {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
    
    lazySources.forEach(function(source) {
      source.srcset = source.dataset.srcset;
    });
    
    lazySvgs.forEach(function(svg) {
      svg.setAttribute('data', svg.dataset.src);
      svg.classList.add('loaded');
    });
  }
});
