// server.js
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const DataFrame = require('dataframe-js').DataFrame;

const columns = [
  "time", "temperatura", "presion", "altitude", "CO2",
  "latitud", "longitud",
  "ax", "ay", "az",
  "gx", "gy", "gz",
  "vx", "vy", "vz"
];

let df = new DataFrame([], columns);

function getTimestampName() {
  const now = new Date();
  const pad = n => n.toString().padStart(2, "0");
  return `log_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.csv`;
}

async function saveAndResetDF() {
  if (df.count() === 0) {
    console.log("* El DataFrame está vacío, no se guarda nada.");
    return;
  }

  const filename = getTimestampName();
  await df.toCSV(true, filename); // true = incluye headers

  console.log(`+ DataFrame guardado en ${filename}`);

  // Reiniciamos el DataFrame con las mismas columnas
  df = new DataFrame([], columns);
}

function parseLine(data) {
  // Inicializa el row con todos los posibles campos en null
  let row = {
    time: null,
    temperatura: null,
    presion: null,
    altitude: null,
    CO2: null,
    latitud: null,
    longitud: null,
    ax: null,
    ay: null,
    az: null,
    gx: null,
    gy: null,
    gz: null,
    vx: null,
    vy: null,
    vz: null
  };

  try {
    // Copia todos los valores del JSON recibido a row
    // Solo sobrescribirá los campos que existan en data
    for (let key in data) {
      if (row.hasOwnProperty(key)) {
        row[key] = data[key];
      }
    }

    // Asegura que al menos header y timestamp estén definidos
    /*if (!row.header) {
      console.warn("Dato recibido sin header:", data);
    }*/
    if (!row.time) {
      row.time = Date.now(); // fallback si no viene
    }
    else{
      row.time = new Date(TIME.getTime() + row.time).getTime();
    }

  } catch (err) {
    console.error("Error parseando JSON:", data, err);
    return null;
  }

  return row;
}

function addToDataFrame(data) {
  const row = parseLine(data);
  if (row) {
    df = df.push(row); // crea un nuevo DataFrame con la fila agregada
  }
}

// Crea el servidor HTTP a partir de Express
const server = http.createServer(app);

// Crea el servidor de Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

let TIME

// Eventos de conexión
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on("fecha_hora", (data) => {
    console.log("Raw recibido:", data);

    // Parsear el string ISO a objeto Date en JS
    const fecha = new Date(data.datetime);
    TIME = fecha
    console.log("Fecha interpretada:", fecha.toISOString());
    console.log("Timestamp ms:", fecha.getTime());
  });

  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido:', data);

    // Responder al cliente o emitir a todos
    socket.emit('respuesta', { mensaje: 'Mensaje recibido por el servidor' });
    //socket.emit('temperatura', {temperature: 1000, tiempo : 10})
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    (async () => {
      await saveAndResetDF();

      console.log("DataFrame después del reset:");
      df.show();
    })();
  });

  socket.on('300', (data) => {
    console.log('Datos recibidos:', data);
    addToDataFrame(data)
    io.emit('300', data);
  });

  socket.on('100', (data) => {
    console.log('Datos recibidos:', data);
    addToDataFrame(data)
    io.emit('100', data);
  });

  socket.on('200', (data) => {
    console.log('Datos recibidos:', data);
    addToDataFrame(data)
    io.emit('200', data);
  });

  socket.on('400', (data) => {
    console.log('Datos recibidos:', data);
    addToDataFrame(data)
    io.emit('400', data);
  });

});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
