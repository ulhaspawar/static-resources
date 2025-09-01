/**
 * Orbo Skin Analyzer Integration Module
 * Provides a clean function to initialize the Orbo skin analysis SDK
 */

let isInitialized = false;

/**
 * Dynamically loads a script and returns a promise
 * @param {string} src - The script source URL
 * @param {boolean} isAsync - Whether to load the script asynchronously
 * @returns {Promise} Promise that resolves when script is loaded
 */
function loadScript(src, isAsync = false) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = isAsync;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Dynamically loads a CSS stylesheet
 * @param {string} href - The stylesheet URL
 * @returns {Promise} Promise that resolves when stylesheet is loaded
 */
function loadStylesheet(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * Sets up event listeners for skin analysis
 */
function setupEventListeners() {
  // Remove existing listeners to prevent duplicates
  document.removeEventListener('skinAnalysisClose', handleSkinAnalysisClose);
  
  // Add the close event listener
  document.addEventListener('skinAnalysisClose', handleSkinAnalysisClose);
}

/**
 * Handles the skin analysis close event
 */
function handleSkinAnalysisClose() {
  const referrer = document.referrer;
  const currentDomain = window.location.origin;
  
  if (referrer && referrer.startsWith(currentDomain)) {
    // Last page is from same site
    window.location.href = referrer;
  } else {
    // No referrer or external site - go to home
    window.location.href = '/';
  }
}

/**
 * Starts the Orbo skin analyzer
 */
function startAnalyzer() {
  if (window.startOrboSkinAnalyzer) {
    console.log('Starting skin analyzers');
    window.startOrboSkinAnalyzer();
  } else {
    console.error('Orbo skin analyzer not available. Make sure all scripts are loaded.');
  }
}

/**
 * Main initialization function for Orbo Skin Analyzer
 * Loads all necessary scripts and stylesheets, then initializes the analyzer
 * @returns {Promise} Promise that resolves when initialization is complete
 */
export async function initializeOrboSkinAnalyzer() {
  // Prevent multiple initializations
  if (isInitialized) {
    console.warn('Orbo Skin Analyzer already initialized');
    startAnalyzer();
    return;
  }

  try {
    console.log('Initializing Orbo Skin Analyzer...');

    // Load all external resources in parallel
    const [, , { startOrboSkinAnalyzer }] = await Promise.all([
      loadScript('https://makeup.sdk.orbo.ai/93QCV3Pk/smart-capture/5.0.0/orbo-smart-capture.js', true),
      loadStylesheet('https://cdn.orbo.tech/ke433dIxa7/4.0.0/skin/style.css'),
      import('https://cdn.orbo.tech/ke433dIxa7/4.0.0/skin/orbo-skin-analyzer.es.js')
    ]);
    
    // Expose the skin analyzer function
    window.startOrboSkinAnalyzer = startOrboSkinAnalyzer;

    // Setup event listeners
    setupEventListeners();

    // Mark as initialized
    isInitialized = true;

    // Dispatch custom event to notify other scripts
    document.dispatchEvent(new CustomEvent('orboSkinAnalyzerReady', {
      detail: { startOrboSkinAnalyzer: window.startOrboSkinAnalyzer }
    }));

    // If DOM is already loaded, start immediately, otherwise wait for DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startAnalyzer);
    } else {
      startAnalyzer();
    }

    console.log('Orbo Skin Analyzer initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Orbo Skin Analyzer:', error);
    throw error;
  }
}

/**
 * Alternative function to manually start the analyzer (if already initialized)
 */
export function startOrboSkinAnalyzer() {
  if (!isInitialized) {
    console.warn('Orbo Skin Analyzer not initialized. Call initializeOrboSkinAnalyzer() first.');
    return;
  }
  startAnalyzer();
}

// Default export for convenience
export default initializeOrboSkinAnalyzer;
