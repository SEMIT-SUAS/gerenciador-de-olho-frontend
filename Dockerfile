# Estágio 1: O Construtor
# Usa uma imagem do Node.js completa para instalar dependências e compilar a aplicação
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração de dependências
COPY package.json package-lock.json* ./

# Instala as dependências de produção
RUN npm install --production=false

# Copia todos os arquivos da sua aplicação para o container
COPY . .

# Executa o comando de build do Vite. Isso cria a pasta 'dist' com os arquivos estáticos
RUN npm run build

# Estágio 2: O Servidor
# Usa uma imagem Nginx minimalista para servir os arquivos estáticos.
# Esta imagem não tem o Node.js nem as dependências de desenvolvimento.
FROM nginx:stable-alpine AS production

# Copia os arquivos de build gerados no estágio anterior para o diretório de serviço do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80, a porta HTTP padrão
EXPOSE 80

# O Nginx já tem um comando padrão para iniciar, então não precisamos de um CMD
