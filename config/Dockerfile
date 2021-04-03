FROM node

WORKDIR /projet-integrateur/

RUN apt update
RUN apt install -y zsh
RUN chsh -s $(which zsh)
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
RUN echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc
RUN apt -y install vim
RUN apt -y install less
RUN apt -y install tree

COPY . .
COPY .p10k.zsh /root/
COPY .zshrc /root/

EXPOSE 3000
EXPOSE 8080
EXPOSE 5432
