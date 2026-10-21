# ---------- Backend Docker Image ----------
# Base image: Node already installed wala chhota Linux (alpine = halka)
FROM node:20-alpine

# Container ke andar kaam karne ka folder
WORKDIR /app

# Pehle sirf package files copy -> npm install cache ho jata hai (fast builds)
COPY package*.json ./
RUN npm install --omit=dev

# Ab baaki code copy karo
COPY src ./src

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Security: root ki jagah normal user se chalao
USER node

CMD ["node", "src/server.js"]
