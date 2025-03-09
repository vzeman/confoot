/**
 * Lazy loading for YouTube videos
 * This script handles the loading of YouTube iframes only when the user clicks on the thumbnail
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find all lazy video containers
  const lazyVideos = document.querySelectorAll('.lazy-video-container');
  
  // Add click event listeners to each video thumbnail
  lazyVideos.forEach(function(videoContainer) {
    const thumbnail = videoContainer.querySelector('.lazy-video-thumbnail');
    const iframeContainer = videoContainer.querySelector('.lazy-video-iframe-container');
    const videoId = videoContainer.dataset.videoId;
    const videoTitle = videoContainer.dataset.videoTitle || 'YouTube Video';
    
    if (thumbnail && iframeContainer && videoId) {
      // Add click event listener to the thumbnail
      thumbnail.addEventListener('click', function() {
        // Create the iframe element
        const iframe = document.createElement('iframe');
        iframe.className = 'lazy-video-iframe';
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.title = videoTitle;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        
        // Clear the iframe container and add the iframe
        iframeContainer.innerHTML = '';
        iframeContainer.appendChild(iframe);
        
        // Hide the thumbnail and show the iframe container
        thumbnail.style.display = 'none';
        iframeContainer.style.display = 'block';

      });
      
      // Add hover effect to the thumbnail
      thumbnail.addEventListener('mouseenter', function() {
        thumbnail.classList.add('hover');
      });
      
      thumbnail.addEventListener('mouseleave', function() {
        thumbnail.classList.remove('hover');
      });
    }
  });
});
