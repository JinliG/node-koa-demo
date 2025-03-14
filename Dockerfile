FROM node:alpine

WORKDIR /home/app

COPY . /home/app
RUN cd /home/app && yarn install

EXPOSE 8001
CMD ["yarn", "start"]