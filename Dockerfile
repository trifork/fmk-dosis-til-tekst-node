FROM node:18
ARG USERID=9999
#ENV NODE_ENV=production
ENV TZ=Europe/Copenhagen
ENV npm_config_cache=/app/.npm

RUN addgroup --system dosistiltekst --gid ${USERID} && adduser --system --group dosistiltekst --uid ${USERID}

WORKDIR /app
COPY ["*.json",".npmrc", "./"]
RUN npm install
#RUN npm install --omit=dev
RUN chown -R dosistiltekst:dosistiltekst /app/
USER dosistiltekst:dosistiltekst
COPY src src

CMD ["npm", "run", "start"]