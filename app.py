"""from flask import Flask, render_template, request
from classify import classify_rice
from utils import get_suggestion
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return "No image uploaded", 400

    file = request.files["image"]
    if file.filename == "":
        return "No selected file", 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    label, confidence = classify_rice(filepath)
    suggestion = get_suggestion(label)

    return render_template("result.html", label=label, confidence=confidence, suggestion=suggestion, image_path=filepath)

if __name__ == "__main__":
    app.run(debug=True)"""


import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from classify import classify_rice
from utils import get_suggestion

app = Flask(__name__)
CORS(app)  # Enables cross-origin requests from GitHub Pages

UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    label, confidence = classify_rice(filepath)
    suggestion = get_suggestion(label)

    # Clean up temporary uploaded file after inference
    if os.path.exists(filepath):
        os.remove(filepath)

    return jsonify({
        "label": label,
        "confidence": confidence,
        "suggestion": suggestion
    })

if __name__ == "__main__":
    app.run(debug=True)