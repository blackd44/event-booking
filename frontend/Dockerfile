
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile && pnpm run build

FROM alpine:latest AS runner
RUN mkdir -p /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["echo", "Frontend image built. Nginx will serve the static files."]
