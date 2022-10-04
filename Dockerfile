FROM node:18
ARG USERID=9999
#ENV NODE_ENV=production
ENV TZ=Europe/Copenhagen

RUN addgroup --system dosistiltekst --gid ${USERID} && adduser --system --group dosistiltekst --uid ${USERID}
USER dosistiltekst:dosistiltekst

WORKDIR /app
COPY ["*.json",".npmrc", "./"]
RUN npm install
#RUN npm install --omit=dev
COPY src src
CMD ["npm", "run", "start"]