FROM node:10.16.3-alpine

RUN apk add ffmpeg

WORKDIR /app

COPY ./ /app

CMD ["npm", "start"]