FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY greeter.js .

USER node

CMD ["npm", "start"]
