FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json .

RUN npm clean-install

COPY --chown=node:node . .

RUN npm run build

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm clean-install --only=production && npm cache clean --force

USER node
FROM node:lts-alpine

WORKDIR /app

COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist .
COPY --from=build --chown=node:node /app/migrations ./migrations
# COPY --from=build --chown=node:node /build/dist/migrations ./docker-entrypoint-initdb.d


CMD ["npm", "run", "start:prod"]
EXPOSE 4000
