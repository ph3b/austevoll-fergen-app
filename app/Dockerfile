FROM node:alpine
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json /usr/src/app/
ARG NODE_ENV=production
RUN yarn
# Bundle app source
COPY . /usr/src/app
RUN yarn run build
EXPOSE 3000
CMD [ "yarn", "start" ]