import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
from medmnist import RetinaMNIST, INFO
from torch.utils.data import DataLoader
import torch.optim as optim

# Chargement des infos du dataset
info = INFO['retinamnist']
DataClass = getattr(__import__('medmnist'), info['python_class'])

# 🔁 Correction ici : conversion en niveaux de gris
transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.ToTensor(),
    transforms.Normalize(mean=[.5], std=[.5])
])

# Télécharger les données d'entraînement et de test
train_dataset = DataClass(split='train', transform=transform, download=True)
test_dataset = DataClass(split='test', transform=transform, download=True)

# Simplifier les labels : 0 = normal, 1-4 = malade → devient 1
def simplify_labels(dataset):
    for i in range(len(dataset.labels)):
        dataset.labels[i][0] = 0 if dataset.labels[i][0] == 0 else 1

simplify_labels(train_dataset)
simplify_labels(test_dataset)

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)

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

# Initialiser le modèle, la perte et l'optimiseur
model = RetinaClassifier()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Entraînement
print("Début de l'entraînement")
for epoch in range(5):
    running_loss = 0.0
    for images, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels.squeeze())
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    print(f"Époque {epoch+1}, Perte : {running_loss:.4f}")

# Évaluation
correct = 0
total = 0
with torch.no_grad():
    for images, labels in test_loader:
        outputs = model(images)
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels.squeeze()).sum().item()

print(f"Précision sur le test : {100 * correct / total:.2f}%")

# Sauvegarder le modèle entraîné
torch.save(model.state_dict(), "retina_model_binary.pt")
print("✅ Modèle sauvegardé dans retina_model_binary.pt")
