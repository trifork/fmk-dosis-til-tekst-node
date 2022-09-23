FROM node:18
#ENV NODE_ENV=production
ENV TZ=Europe/Copenhagen
WORKDIR /app
COPY ["*.json",".npmrc", "./"]
RUN npm install
#RUN npm install --omit=dev
COPY src src
CMD ["npm", "run", "start"]