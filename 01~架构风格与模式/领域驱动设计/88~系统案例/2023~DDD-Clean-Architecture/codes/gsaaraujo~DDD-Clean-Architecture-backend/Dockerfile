FROM node:18.14-alpine3.16

WORKDIR /usr/app

COPY package.json .

COPY yarn.lock .

RUN npm install yarn

RUN yarn install

COPY . .

CMD ["yarn", "start:dev"]
