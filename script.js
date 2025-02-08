let model, labels = [];

async function loadModel() {
    console.log("🔄 Loading Teachable Machine Model...");

    try {
        // Load model and metadata
        model = await tmImage.load("static/models/model.json", "static/models/metadata.json");
        labels = model.getClassLabels(); // Dynamically fetch class labels

        console.log("✅ Model Loaded Successfully");
        console.log("🏷️ Labels:", labels); // Check loaded labels
    } catch (error) {
        console.error("❌ Model Loading Failed:", error);
    }
}

async function predictImage() {
    let imageElement = document.getElementById("imageUpload").files[0];

    if (!imageElement) {
        alert("⚠️ Please upload an image.");
        return;
    }

    console.log("📸 Image uploaded:", imageElement.name);

    let img = document.createElement("img");
    img.src = URL.createObjectURL(imageElement);

    img.onload = async function () {
        console.log("🖼️ Image loaded for prediction.");

        const prediction = await model.predict(img);
        console.log("🔍 Predictions:", prediction);

        // Find the highest confidence prediction
        let highestIndex = prediction
            .map(p => p.probability)
            .indexOf(Math.max(...prediction.map(p => p.probability)));

        let resultText = `🔴 **Predicted Disaster: ${labels[highestIndex]}**  
                          🏆 Confidence: ${(prediction[highestIndex].probability * 100).toFixed(2)}%  
                          \n---\n**All Predictions:**\n`;

        // Show all predictions
        prediction.forEach((p, index) => {
            resultText += `✔️ ${labels[index]}: ${(p.probability * 100).toFixed(2)}%\n`;
        });

        document.getElementById("result").innerText = resultText;
        document.getElementById("preview").src = img.src;
        document.getElementById("preview").style.display = "block";

        console.log("📌 Final Output:", resultText);
    };
}

// Load model when page is ready
window.onload = loadModel;
