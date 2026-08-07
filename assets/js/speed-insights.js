/* ==========================================================================
   VERCEL SPEED INSIGHTS INITIALIZATION
   ========================================================================== */

/**
 * Initialize Vercel Speed Insights queue
 * This function sets up the Speed Insights queue before the main script loads
 */
(function() {
    // Initialize the Speed Insights queue if not already initialized
    if (!window.si) {
        window.si = function() {
            (window.siq = window.siq || []).push(arguments);
        };
    }
})();

/**
 * Dynamically inject the Vercel Speed Insights script
 * This will track Core Web Vitals and send them to Vercel's analytics
 */
(function() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    // Create and configure the script element
    const script = document.createElement('script');
    script.src = '/_vercel/speed-insights/script.js';
    script.defer = true;
    script.dataset.sdkn = '@vercel/speed-insights/vanilla';
    script.dataset.sdkv = '1.3.1';
    
    // Error handler in case the script fails to load
    script.onerror = function() {
        console.warn('[Vercel Speed Insights] Failed to load script. Please check if any content blockers are enabled.');
    };

    // Inject the script into the document head
    if (document.head) {
        document.head.appendChild(script);
    } else {
        // Fallback: wait for DOM ready
        document.addEventListener('DOMContentLoaded', function() {
            document.head.appendChild(script);
        });
    }
})();
