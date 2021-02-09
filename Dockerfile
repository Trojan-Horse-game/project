FROM node

WORKDIR /projet-integrateur/

RUN npm install
RUN apt update
RUN apt -y install vim

COPY . .

EXPOSE 3000
EXPOSE 8080
