FROM oven/bun:1
WORKDIR /usr/src/app

COPY index.ts .

USER bun

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]
