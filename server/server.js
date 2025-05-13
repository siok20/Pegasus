// server.js
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

// Crea el servidor HTTP a partir de Express
const server = http.createServer(app);

// Crea el servidor de Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

// Eventos de conexión
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido:', data);

    // Responder al cliente o emitir a todos
    socket.emit('respuesta', { mensaje: 'Mensaje recibido por el servidor' });
    //socket.emit('temperatura', {temperature: 1000, tiempo : 10})
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });

  socket.on('300', (data) => {
    console.log('Datos recibidos:', data);
    io.emit('300', data);
  });

  socket.on('100', (data) => {
    console.log('Datos recibidos:', data);
    io.emit('100', data);
  });

  socket.on('200', (data) => {
    console.log('Datos recibidos:', data);
    io.emit('200', data);
  });

  socket.on('400', (data) => {
    console.log('Datos recibidos:', data);
    io.emit('400', data);
  });

});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
