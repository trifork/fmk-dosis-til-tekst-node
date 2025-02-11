#FROM node:18-slim
FROM node:23-alpine
ARG USERID=9999
ENV NODE_ENV=production
ENV TZ=Europe/Copenhagen
ENV npm_config_cache=/app/.npm

RUN addgroup -S -g ${USERID} fmk-dosistiltekst
RUN adduser -S -u ${USERID} -G fmk-dosistiltekst fmk-dosistiltekst
RUN apk add jemalloc

WORKDIR /app

USER fmk-dosistiltekst:fmk-dosistiltekst
COPY --chown=fmk-dosistiltekst:fmk-dosistiltekst node_modules /app/node_modules/
COPY --chown=fmk-dosistiltekst:fmk-dosistiltekst src /app/src/

#Debugging: Jemalloc stats
#ENV MALLOC_CONF=stats_print:true

CMD ["env", "LD_PRELOAD=$LD_PRELOAD:/usr/lib/libjemalloc.so.2", "node", "--max-old-space-size=370", "/app/node_modules/.bin/ts-node", "--transpile-only","src/index.ts"]
#CMD ["node", "--max-old-space-size=370", "/app/node_modules/.bin/ts-node", "--transpile-only","src/index.ts"]
