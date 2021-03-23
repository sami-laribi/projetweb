FROM node:10-alpine

WORKDIR /app
COPY package.json .
COPY server.js .
COPY package-lock.json .
COPY index.html .
COPY script.js .

RUN npm install

# Run the server as a non-root user
RUN adduser -D myuser
USER myuser

CMD ["node", "server.js"]
