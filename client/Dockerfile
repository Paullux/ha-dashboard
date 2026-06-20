FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
# envsubst substitutes SERVER_HOST and SERVER_PORT at container startup
ENV SERVER_HOST=server
ENV SERVER_PORT=3001
EXPOSE 80
