FROM node:19.8.1-alpine3.17

RUN mkdir /app
WORKDIR /app
COPY requestLogger.js requestLogger.js

CMD [ "node", "requestLogger.js" ]
