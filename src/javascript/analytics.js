// Vercel Web Analytics
// This script initializes Vercel Analytics for the site
// Documentation: https://vercel.com/docs/analytics/quickstart

// Initialize the analytics queue
window.va = window.va || function() {
  (window.vaq = window.vaq || []).push(arguments);
};

// Inject the Vercel Analytics script
(function() {
  if (typeof window === 'undefined') return;
  
  // Check if we're in development mode (localhost or development domains)
  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' ||
                window.location.hostname.includes('dev.');
  
  // Set mode - only track in production
  if (isDev) {
    console.log('[Vercel Analytics] Running in development mode - tracking disabled');
    return;
  }
  
  // Get the script URL from Vercel's infrastructure
  // This will be automatically configured when deployed to Vercel
  const src = '/_vercel/insights/script.js';
  
  // Check if script is already loaded
  if (document.head.querySelector(`script[src="${src}"]`)) return;
  
  // Create and inject the script
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  script.setAttribute('data-sdkn', '@vercel/analytics');
  script.setAttribute('data-sdkv', '1.4.1');
  
  script.onerror = function() {
    console.log('[Vercel Analytics] Please enable Web Analytics in your Vercel dashboard. See https://vercel.com/docs/analytics/quickstart for more information.');
  };
  
  document.head.appendChild(script);
})();
