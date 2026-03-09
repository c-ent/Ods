# ---------- BUILD STAGE ----------
FROM cgr.dev/chainguard/node:latest-dev AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- RUNTIME STAGE ----------
FROM cgr.dev/chainguard/nginx:latest

LABEL org.opencontainers.image.title="ODS"
LABEL org.opencontainers.image.description="React app served by Nginx"
LABEL org.opencontainers.image.version="1.0"

COPY --from=builder --chown=65532:65532 /app/dist /usr/share/nginx/html
COPY --chown=65532:65532 nginx.conf /etc/nginx/conf.d/default.conf

USER 65532

EXPOSE 8080

CMD ["-g", "daemon off;"]