FROM node:18-slim
ARG USERID=9999
ENV NODE_ENV=production
ENV TZ=Europe/Copenhagen
ENV npm_config_cache=/app/.npm

RUN addgroup --system fmk-dosistiltekst --gid ${USERID} && adduser --system --group fmk-dosistiltekst --uid ${USERID}

WORKDIR /app
COPY ["*.json",".npmrc","./"]
RUN npm ci --production && npm cache clean --force
RUN chown -R fmk-dosistiltekst:fmk-dosistiltekst /app/
USER fmk-dosistiltekst:fmk-dosistiltekst
COPY src src

CMD ["node","--max-old-space-size=370","/app/node_modules/.bin/ts-node","--transpile-only","src/index.ts"]
