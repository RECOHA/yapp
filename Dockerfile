FROM node:18-alpine

# Instala o FFmpeg e Python (necessário para yt-dlp)
RUN apk add --no-cache ffmpeg python3 py3-pip

# Cria link simbólico para que 'python' aponte para 'python3'
RUN ln -sf python3 /usr/bin/python

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
# Pula a verificação do binário python durante a instalação, pois já garantimos que ele existe
ENV YOUTUBE_DL_SKIP_PYTHON_CHECK=1
RUN npm install

# Copia o código fonte
COPY . .

# Build do TypeScript
RUN npm run build

# Cria os diretórios de armazenamento
RUN mkdir -p downloads processed && chmod 777 downloads processed

# Expõe a porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
