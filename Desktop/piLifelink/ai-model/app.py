from flask import Flask, request, jsonify
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms
import io

# ⚙️ Configuration Flask
app = Flask(__name__)

# 🧠 Définition du modèle (doit être identique à celui que tu as entraîné)
class RetinaClassifier(nn.Module):
    def __init__(self):
        super(RetinaClassifier, self).__init__()
        self.conv1 = nn.Conv2d(1, 16, 3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.fc1 = nn.Linear(32 * 7 * 7, 64)
        self.fc2 = nn.Linear(64, 2)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 32 * 7 * 7)
        x = F.relu(self.fc1(x))
        return self.fc2(x)

# 📥 Charger le modèle entraîné
model = RetinaClassifier()
model.load_state_dict(torch.load("retina_model_binary.pt", map_location=torch.device('cpu')))
model.eval()

# 🔁 Prétraitement des images
transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((28, 28)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[.5], std=[.5])
])

# 📡 Endpoint de prédiction
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "Aucune image reçue."}), 400

    image_file = request.files['image']
    image = Image.open(image_file).convert('RGB')
    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)
        _, prediction = torch.max(output, 1)
        result = "Normal" if prediction.item() == 0 else "Malade"

    return jsonify({"diagnostic": result})

# ▶️ Lancer le serveur Flask
if __name__ == '__main__':
    app.run(port=5000, debug=True)
