FROM node:12.16.1-alpine

RUN apk add --no-cache tzdata
ENV TZ='Asia/Seoul'

WORKDIR /app

COPY . /app

ENTRYPOINT npm start