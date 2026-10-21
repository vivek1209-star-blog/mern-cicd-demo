# ---------- Frontend Docker Image (2 stage build) ----------
# Stage 1: React ko build karo (npm run build -> dist folder)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Sirf build output ko chhote nginx server me daalo
# (Node, node_modules kuch nahi jata -> image bahut chhoti)
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
