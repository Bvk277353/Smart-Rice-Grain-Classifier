// ================= TOP OF FILE (LINE 1) =================
const BACKEND_URL = "https://smart-rice-grain-classifier.onrender.com";

const form = document.getElementById("upload-form");
const imageInput = document.getElementById("image-input");
const spinner = document.getElementById("loading-spinner");
const resultContainer = document.getElementById("result-container");
const submitBtn = document.getElementById("submit-btn");

// Handle image submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = imageInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  // Show spinner, hide old result, disable button
  spinner.style.display = "block";
  resultContainer.style.display = "none";
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();

    // Populate data
    document.getElementById("result-label").textContent = data.label;
    document.getElementById("result-confidence").textContent = `${data.confidence}%`;
    document.getElementById("result-suggestion").textContent = data.suggestion;

    // Reveal result box
    resultContainer.style.display = "block";
  } catch (error) {
    alert("Prediction failed. If the server was sleeping, please retry in a few moments.");
    console.error(error);
  } finally {
    // Hide spinner and enable button
    spinner.style.display = "none";
    submitBtn.disabled = false;
  }
});