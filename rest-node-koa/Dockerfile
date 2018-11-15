FROM node:alpine

WORKDIR /app
COPY package.json package-lock.json ./src/config.json ./dist/ ./
RUN npm install --prod
EXPOSE 8080
USER node
CMD ["npm", "run", "start-docker"]