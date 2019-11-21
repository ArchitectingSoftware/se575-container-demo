FROM node:alpine

WORKDIR /app
COPY package.json package-lock.json yarn.lock ./src/config.json ./dist/ ./
RUN yarn install --production
EXPOSE 8080
USER node
CMD ["npm", "run", "start-docker"]