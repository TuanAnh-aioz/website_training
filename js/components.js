// Function to load HTML component
async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
  }
}

// Load all components when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("trainingOptions", "components/training_options.html"),
    loadComponent("trainingProgress", "components/training_progress.html"),
    loadComponent("trainingLogs", "components/training_logs.html"),
    loadComponent("trainingResults", "components/training_results.html"),
  ]);

  // After components are loaded, initialize the app
  if (typeof initApp === "function") {
    initApp();
  }
});
