FROM node:20-alpine

WORKDIR /usr/app

COPY pong.js . 
COPY package.json . 
COPY package-lock.json . 

RUN npm i

CMD node pong.js