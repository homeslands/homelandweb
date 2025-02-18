FROM node:14.17.3

COPY package*.json ./

RUN npm install

ENV NODE_ENV=production

COPY . .

RUN npm run build

EXPOSE 5502

CMD ["npm", "start"]
