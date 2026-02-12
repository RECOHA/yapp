FROM node:18-alpine

# Instala o FFmpeg e Python (necessário para yt-dlp)
# Instala python3 e garante que existe um binário 'python'
RUN apk add --no-cache ffmpeg python3 py3-pip && \
    ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro
COPY package*.json ./

# Instala as dependências
RUN YOUTUBE_DL_SKIP_PYTHON_CHECK=1 npm install

# Copia o restante do código fonte
COPY . .

# Build do TypeScript
RUN npm run build

# Cria os diretórios de armazenamento
RUN mkdir -p downloads processed && chmod 777 downloads processed

# Expõe a porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
