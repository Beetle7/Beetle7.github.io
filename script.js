document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
});


function initEventTracking() {
  // For click events on any element
  document.addEventListener('click', function(event) {
    logEvent(event, 'click');
  });
  
  // For page view tracking using Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Element is considered viewed when 10% is visible
  };
  
  const viewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const viewEvent = { target: entry.target };
        logEvent(viewEvent, 'view');
      }
    });
  }, observerOptions);
  
  const sectionsToTrack = [
    'about',        // About section including profile and birthplace images
    'education',    // Education background and achievements
    'skills',       // Technical skills table
    'cv'            // CV PDF link section
  ];
  
  // Start observing all important sections
  sectionsToTrack.forEach(sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      viewObserver.observe(element);
    }
  });
  
  document.querySelectorAll('img, a, td, th').forEach(element => {
    viewObserver.observe(element);
  });
  
  // Helper function to determine element type and context
  function getElementType(element) {
    // Check for profile picture
    if (element.tagName === 'IMG' && element.classList.contains('profile-pic')) {
      return 'image (profile picture)';
    } 
    // Check for birthplace images in gallery
    else if (element.tagName === 'IMG' && element.closest('.gallery')) {
      return 'image (birthplace)';
    }
    // Check for CV link
    else if (element.tagName === 'A' && element.href.endsWith('.pdf')) {
      return 'pdf-link (CV)';
    }
    // Check for navigation links
    else if (element.tagName === 'A' && element.closest('nav')) {
      return 'nav-link';
    }
    // Check for other links
    else if (element.tagName === 'A') {
      return 'link';
    }
    // Check for section headings
    else if (['H1', 'H2', 'H3'].includes(element.tagName)) {
      return 'heading';
    }
    // Check for table cells - skills and levels
    else if (element.tagName === 'TD' || element.tagName === 'TH') {
      return 'cell';
    }
    // Check for educational info or achievements
    else if (element.tagName === 'LI' && element.closest('#education')) {
      return 'education-item';
    }
    // Check for about paragraph
    else if (element.tagName === 'P' && element.closest('#about')) {
      return 'text (about)';
    }
    // Default for other text elements
    else if (element.tagName === 'P' || element.tagName === 'SPAN') {
      return 'text';
    }
    // Get section context if available
    else {
      const section = element.closest('section');
      if (section && section.id) {
        return `${section.id}-element`;
      }
      return element.tagName.toLowerCase();
    }
  }
  
	// Output it
  function logEvent(event, eventType) {
    const timestamp = new Date().toISOString();
    const target = event.target;
    const elementType = getElementType(target);
    
    // Get additional context about the element
    let elementContext = '';
    
    // For images, include alt text
    if (target.tagName === 'IMG') {
      elementContext = target.alt;
    } 
    // For links, include text content or href
    else if (target.tagName === 'A') {
      elementContext = target.textContent.trim() || target.href.split('/').pop();
    }
    // For table cells, include content
    else if (target.tagName === 'TD' || target.tagName === 'TH') {
      elementContext = target.textContent.trim();
    }
    // For list items, include content
    else if (target.tagName === 'LI') {
      const text = target.textContent.trim();
      elementContext = text.length > 20 ? text.substring(0, 20) + '...' : text;
    }
    // For text elements, include truncated content
    else if (['P', 'SPAN', 'H1', 'H2', 'H3'].includes(target.tagName)) {
      const text = target.textContent.trim();
      elementContext = text.length > 20 ? text.substring(0, 20) + '...' : text;
    }
    
    // Add the context if available
    const objectInfo = elementContext ? `${elementType} (${elementContext})` : elementType;
    
    // Log in the required format
    console.log(`${timestamp}, ${eventType}, ${objectInfo}`);
  }
  
  // Log initial page view
  console.log(`${new Date().toISOString()}, view, page-load`);
}

// Initialize the tracking when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initEventTracking);
