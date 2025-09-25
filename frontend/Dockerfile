FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps --ignore-scripts

COPY . .

RUN npx quasar prepare

EXPOSE 8080

CMD ["npx", "quasar", "dev", "-H", "0.0.0.0"]
