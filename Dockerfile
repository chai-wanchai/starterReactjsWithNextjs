FROM node:12.10.0

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

# Install all node modules
RUN yarn

COPY . .

# Build project
RUN npm run build

# Exposing port 4000 to connect external
EXPOSE 5000

# Start node server with production
CMD ["npm", "start"]