FROM node:7.7.0-alpine

ADD *.json /rsk/
ADD LICENSE.txt /rsk/
ADD src /rsk/src
ADD public /rsk/public
ADD tools /rsk/tools
WORKDIR /rsk

RUN npm install
RUN ./node_modules/.bin/babel-node tools/run build --release
EXPOSE 3000

CMD node build/server.js
