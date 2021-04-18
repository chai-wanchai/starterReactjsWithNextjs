FROM node:10.23.1-alpine3.9

RUN apk update
RUN apk --no-cache add curl
WORKDIR /app

COPY . /app
RUN ls -l

# Install all node modules
RUN npm install

# Build project
RUN npm run build

# Exposing port 8080 to connect external
EXPOSE 8080

# Start node server with production
CMD ["npm", "start"]