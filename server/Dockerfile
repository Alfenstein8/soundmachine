# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y \
        python3 \
        make \
        g++ \
        sqlite3 \
        libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# install with --production (exclude devDependencies)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun -b run build

RUN chmod +x run.sh
EXPOSE 3000
ENTRYPOINT [ "./run.sh" ]
