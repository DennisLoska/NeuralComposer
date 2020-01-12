FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8888

CMD [ "npm", "start", "--host", "0.0.0.0" ]