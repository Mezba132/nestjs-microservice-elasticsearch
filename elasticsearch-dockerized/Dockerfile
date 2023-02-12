FROM node:14
WORKDIR /elasticsearch/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# CMD [ "node", "dist/main.js" ]