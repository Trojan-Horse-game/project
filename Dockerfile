FROM node

WORKDIR /projet-integrateur/

RUN npm install -g typescript
RUN npm install
RUN apt update
RUN apt -y install vim

COPY . .

EXPOSE 3000