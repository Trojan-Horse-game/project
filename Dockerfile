FROM node:15 AS builder

WORKDIR /client/
COPY ./client ./

RUN rm -rf node_modules/
RUN npm install 
RUN export NODE_ENV="production"
RUN npm run build --fix

FROM nginx:alpine
# Copy nginx conf file to container
COPY ./config/nginx/nginx.conf /etc/nginx/
# # Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /client/dist .