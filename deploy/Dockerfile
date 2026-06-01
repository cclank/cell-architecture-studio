FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5174
CMD ["npm", "run", "dev", "--", "--host", "--port", "5174"]
