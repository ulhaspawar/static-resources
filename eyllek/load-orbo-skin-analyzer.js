/**
 * Skin Analyzer Loader
 * Loads required scripts and CSS, then provides function to initialize the skin analyzer
 */

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
  try {
    // Load CSS files
    await Promise.all([
      loadCSS(
        "https://makeup.sdk.orbo.ai/WAjLANasI8/4.0.0/smart-capture/orbo-clinikally-skinanalysis.css"
      ),
      loadCSS(
        "https://cdn.jsdelivr.net/gh/ulhaspawar/static-resources/eyllek/style.css"
      ),
      loadScript(
        "https://makeup.sdk.orbo.ai/WAjLANasI8/4.0.0/smart-capture/orbo-clinikally-skinanalysis.js"
      ),
      loadScript(
        "https://cdn.jsdelivr.net/gh/ulhaspawar/static-resources@db8de68/eyllek/orbo-skin-analyzer.umd.js"
      ),
    ]);

    console.log("All skin analyzer resources loaded successfully");
  } catch (error) {
    console.error("Failed to load skin analyzer resources:", error);
    throw error;
  }
}

// Initialize skin analyzer
function initializeSkinAnalyzer() {
  // Inject HTML container into body
  const container = document.createElement("div");
  container.id = "orbo-cc-skin-analyzer-container";
  container.style.cssText =
    "width: 100%; min-height: 100vh; display: flex; justify-content: center; align-items: center; position: relative;";
  document.body.appendChild(container);

  // Add event listener for DOM content loaded
  function handleDOMContentLoaded() {
    const urlParams = new URLSearchParams(window.location.search);
    const ca = urlParams.get("ca");

    if (!ca || ca !== "t") {
      window.parent.postMessage(
        {
          type: "allowCameraAccess",
          src: window.location.href,
        },
        "*"
      );
    } else {
      // Check if OrboSkinAnalyzer1 is available
      if (
        typeof OrboSkinAnalyzer1 !== "undefined" &&
        OrboSkinAnalyzer1.startOrboSkinAnalyzer
      ) {
        OrboSkinAnalyzer1.startOrboSkinAnalyzer();
      } else {
        console.error("OrboSkinAnalyzer1 is not available");
      }
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
loadResources().catch(console.error);
