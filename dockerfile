FROM node:16-alpine

# Vider le cache npm pour éviter des conflits
RUN npm cache clean --force

WORKDIR /app
COPY . /app

# Installer les dépendances
RUN npm install

# Construire l'application
RUN npm run build-dev

EXPOSE 5000

# Démarrer l'application
CMD ["npm", "start"]
