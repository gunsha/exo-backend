FROM node:carbon
WORKDIR /usr/nfc-provision-backend
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]