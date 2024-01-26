FROM node:21-alpine

WORKDIR /app

COPY . .

# install pnpm
RUN npm install -g pnpm

# install dependencies
RUN pnpm install

EXPOSE 3000
EXPOSE 4000
