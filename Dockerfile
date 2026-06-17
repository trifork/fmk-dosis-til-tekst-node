FROM node:24-slim
ARG USERID=9999
ENV NODE_ENV=production
ENV TZ=Europe/Copenhagen
ENV npm_config_cache=/app/.npm

RUN addgroup --system fmk-dosistiltekst --gid ${USERID} && adduser --system --group fmk-dosistiltekst --uid ${USERID}

RUN npm prune --omit=dev

WORKDIR /app

COPY node_modules node_modules
RUN chown -R fmk-dosistiltekst:fmk-dosistiltekst /app/
USER fmk-dosistiltekst:fmk-dosistiltekst
COPY target target

CMD ["node","--max-old-space-size=370","target/js/index.js"]
