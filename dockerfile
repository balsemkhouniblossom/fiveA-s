FROM node:16-alpine
WORKDIR /app
COPY . /index
RUN npm install
EXPOSE 5000
CMD  ["npm", "start"]
