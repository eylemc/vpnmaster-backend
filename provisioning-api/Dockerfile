FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --chown=node:node --chmod=0444 package.json server.mjs ./

USER node
EXPOSE 3000

CMD ["node", "server.mjs"]
