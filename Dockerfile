FROM node:16-alpine

RUN apk update && apk upgrade

RUN apk add bash git

WORKDIR /app/frontend

COPY ./package.json /app/frontend/package.json

COPY ./package-lock.json /app/frontend/package-lock.json

RUN npm ci --legacy-peer-deps

COPY ./ /app/frontend

# copy in the edition module
ARG EDITION_MODULE=dev.js
COPY ./editions/${EDITION_MODULE} /app/frontend/src/edition.js

ENTRYPOINT ["npm", "run", "develop"]
