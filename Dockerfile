ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS node
WORKDIR /usr/src/app

COPY ./package.json .
COPY ./tsconfig.json .
RUN npm install

COPY ./src ./src
RUN npm run build

FROM eturnal/eturnal:latest

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

WORKDIR /usr/src/app

COPY ./package.json .
RUN npm install --production

COPY --from=node /usr/src/app/dist ./

ENV NODE_ENV="production"
CMD [ "node", "index.js" ]
