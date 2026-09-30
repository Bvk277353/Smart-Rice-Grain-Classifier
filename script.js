const BACKEND_URL = "https://smart-rice-grain-classifier.onrender.com";

const form = document.getElementById("upload-form");
const imageInput = document.getElementById("image-input") || document.querySelector('input[type="file"]');
const spinner = document.getElementById("loading-spinner");
const resultContainer = document.getElementById("result-container");
const submitBtn = document.getElementById("submit-btn") || document.querySelector('button[type="submit"]');

if (form) {
  form.addEventListener("submit", async (e) => {
    // Stop the browser from navigating to /predict on github.io
    e.preventDefault();

    const file = imageInput.files[0];
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    // Show loading state if elements exist
    if (spinner) spinner.style.display = "block";
    if (resultContainer) resultContainer.style.display = "none";
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      // Display the predictions
      if (document.getElementById("result-label")) {
        document.getElementById("result-label").textContent = data.label;
      }
      if (document.getElementById("result-confidence")) {
        document.getElementById("result-confidence").textContent = `${data.confidence}%`;
      }
      if (document.getElementById("result-suggestion")) {
        document.getElementById("result-suggestion").textContent = data.suggestion;
      }
      if (resultContainer) {
        resultContainer.style.display = "block";
      }

      // If you don't have result spans in your HTML, show an alert with the output
      if (!resultContainer) {
        alert(`Prediction: ${data.label} (${data.confidence}%)\n\nSuggestion: ${data.suggestion}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error: Unable to connect to Render. If the server was asleep, please wait 30 seconds and try again.");
    } finally {
      if (spinner) spinner.style.display = "none";
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
