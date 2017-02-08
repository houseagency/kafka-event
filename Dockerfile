FROM node:6.9.4
ADD . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
CMD ["node", "index.js"]
