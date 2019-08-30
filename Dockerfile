FROM mhart/alpine-node:11.12
MAINTAINER kai@blockchaintp.com
RUN apk update
RUN apk upgrade
RUN apk add bash git
WORKDIR /app/frontend
COPY ./package.json /app/frontend/package.json
COPY ./package-lock.json /app/frontend/package-lock.json
RUN npm install
COPY ./ /app/frontend
ENTRYPOINT ["npm", "run", "develop"]
