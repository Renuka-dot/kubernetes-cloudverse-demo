FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY src/ ./src/
EXPOSE 4008
USER node
CMD ["node", "src/index.js"]
