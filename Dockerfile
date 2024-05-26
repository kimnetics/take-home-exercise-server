FROM --platform=linux/amd64 node:18.18.2-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
ENV NODE_ENV production
WORKDIR /app
COPY --chown=node:node /dist .
RUN find . -name ".DS_Store" -delete
RUN npm ci --omit=dev
USER node
CMD ["dumb-init", "node", "--require", "newrelic", "app.js"]
EXPOSE 3000
