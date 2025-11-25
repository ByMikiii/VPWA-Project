FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# RUN node ace add @adonisjs/cors

EXPOSE 3333

EXPOSE 8082

CMD ["node", "ace", "serve", "--watch"]
