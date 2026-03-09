FROM node:18-alpine
WORKDIR /src
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
# RUN yarn dev
EXPOSE 2803
CMD ["yarn", "dev"]