/**
 * Skin Analyzer Loader
 * Loads required scripts and CSS, then provides function to initialize the skin analyzer
 */

let resourceLoadPromise = null;
let isInitialized = false;

// Function to load external scripts
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Function to load external CSS
function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.href = href;
    link.rel = "stylesheet";
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// Load all required resources
async function loadResources() {
  // If resources are already loaded, return immediately
  if (isInitialized) {
    return;
  }
  
  // If resources are currently loading, return the existing promise
  if (resourceLoadPromise) {
    return resourceLoadPromise;
  }

  // Create a new promise to track the loading state
  resourceLoadPromise = (async () => {
    try {
      const timestamp = new Date().getTime();
      // Load CSS and JS files with cache-busting timestamp
      await Promise.all([
        loadCSS(
          `https://cdn.jsdelivr.net/gh/ulhaspawar/static-resources@main/10h2/1.0.0/orbo-skin-analyzer.e76adbd8.css?t=${timestamp}`
        ),
        loadCSS(
          `https://cdn.jsdelivr.net/gh/ulhaspawar/static-resources@main/10h2/1.0.0/smart-capture/orbo-smart-capture.css?t=${timestamp}`
        ),
        loadScript(
          `https://cdn.jsdelivr.net/gh/ulhaspawar/static-resources@main/10h2/1.0.0/smart-capture/orbo-smart-capture.js?t=${timestamp}`
        ),
        loadScript(
          `https://cdn.jsdelivr.net/gh/ulhaspawar/static-resources@main/10h2/1.0.0/orbo-skin-analyzer.umd.7cff8b56.js?t=${timestamp}`
        ),
      ]);

      console.log("All skin analyzer resources loaded successfully");
      isInitialized = true;
      return true;
    } catch (error) {
      console.error("Failed to load skin analyzer resources:", error);
      resourceLoadPromise = null; // Reset on error to allow retry
      throw error;
    }
  })();

  return resourceLoadPromise;
}

// Initialize skin analyzer
function initializeSkinAnalyzer() {

  // Add event listener for DOM content loaded
  function handleDOMContentLoaded() {
      // Check if OrboSkinAnalyzer is available
      if (
        typeof OrboSkinAnalyzer !== "undefined" &&
        OrboSkinAnalyzer.startOrboSkinAnalyzer
      ) {
        OrboSkinAnalyzer.startOrboSkinAnalyzer();
      } else {
        console.error("OrboSkinAnalyzer is not available");
      }
    
  }

  // Execute immediately if DOM is already loaded, otherwise wait for it
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
  } else {
    handleDOMContentLoaded();
  }
}

// Main exported function
export async function startSkinAnalyzer() {
  try {
    await loadResources();
    initializeSkinAnalyzer();
  } catch (error) {
    console.error("Failed to start skin analyzer:", error);
    throw error;
  }
}

// Auto-load resources when this module is imported
// But don't initialize automatically, wait for startSkinAnalyzer to be called
loadResources().catch(console.error);
