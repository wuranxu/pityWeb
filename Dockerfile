FROM node:18.18.2

WORKDIR /app

COPY . .

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org && cnpm install

EXPOSE 8000

CMD ["npm", "start"]
