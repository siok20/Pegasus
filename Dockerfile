# Imagen base con Node.js (elige la versión que uses en tu proyecto)
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json primero (para aprovechar la cache de Docker)
COPY ./server/package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código de la aplicación
COPY ./server .

# Exponemos el puerto 
EXPOSE 3000

# Comando de arranque
CMD ["npm", "start"]
