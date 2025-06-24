FROM node:20-alpine

WORKDIR /usr/app

COPY random.js . 

CMD node random.js