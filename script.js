// Points directly to your live Render API
const BACKEND_URL = "https://smart-rice-grain-classifier.onrender.com";

const form = document.getElementById("upload-form");
const imageInput = document.getElementById("image-upload");
const spinner = document.getElementById("loading-spinner");
const resultContainer = document.getElementById("result-container");
const submitBtn = document.getElementById("submit-btn");

if (form) {
  form.addEventListener("submit", async (e) => {
    // CRITICAL FIX: This stops the browser from doing a default POST and hitting the 405 error
    e.preventDefault();

    const file = imageInput.files[0];
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    // Show loading spinner, hide old results, disable button to prevent double-clicks
    spinner.style.display = "block";
    resultContainer.style.display = "none";
    submitBtn.disabled = true;

    try {
      // Send the image invisibly to Render
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      // Read the JSON response from your app.py
      const data = await response.json();

      // Inject the results into the HTML
      document.getElementById("result-label").textContent = data.label;
      document.getElementById("result-confidence").textContent = `${data.confidence}%`;
      document.getElementById("result-suggestion").textContent = data.suggestion;
      
      // Reveal the result box
      resultContainer.style.display = "block";
      
    } catch (error) {
      console.error("Error:", error);
      alert("Connection failed. The Render server might be waking up. Please wait 30 seconds and click Classify again.");
    } finally {
      // Hide spinner, re-enable button
      spinner.style.display = "none";
      submitBtn.disabled = false;
    }
  });
}
