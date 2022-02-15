FROM node:alpine

# install dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy Local Files into Image
COPY . .

RUN npm run build

## Only Copy over the Node pieces required
FROM node:alpine

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["node", "./build"]