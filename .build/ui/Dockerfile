# Build the UI
FROM node:14-alpine as build

RUN apk add --no-cache \
    make \
    gcc \
    g++ \
    python3 \
    autoconf \
    automake \
    libtool \
    nasm \
    bash \
    optipng \
    zlib-dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls -la /app/node_modules/optipng-bin/vendor/ && /app/node_modules/optipng-bin/vendor/optipng --version

ENV NODE_OPTIONS=--max_old_space_size=8192

RUN npm run build

# Serve the UI
FROM node:14-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 3006

CMD ["serve", "-s", "build", "-l", "3006"]

