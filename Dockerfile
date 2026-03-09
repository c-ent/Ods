# ---------- BUILD STAGE ----------
# Use Chainguard Node for building React app (zero CVEs)
FROM cgr.dev/chainguard/node:latest-dev AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build


# ---------- RUNTIME STAGE ----------
# Use Chainguard Nginx for secure static hosting
FROM cgr.dev/chainguard/nginx:latest

# Image metadata
LABEL org.opencontainers.image.title="ODS"
LABEL org.opencontainers.image.description="React app served by Nginx"
LABEL org.opencontainers.image.version="1.0"

# Copy built files from builder stage
COPY --from=builder --chown=65532:65532 /app/dist /usr/share/nginx/html
COPY --chown=65532:65532 nginx.conf /etc/nginx/conf.d/default.conf

# Run as non-root user
USER 65532

# Expose port 8080
EXPOSE 8080

# Start Nginx in foreground
CMD ["-g", "daemon off;"]