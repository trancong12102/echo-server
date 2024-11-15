FROM denoland/deno AS builder
WORKDIR /app

COPY deno* ./
RUN deno install --frozen

COPY *.ts ./

EXPOSE 3000
CMD [ "deno", "run", "--allow-net", "main.ts" ]
