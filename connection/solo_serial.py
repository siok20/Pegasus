import socketio
import serial
import geocoder

# Configuración de Socket.IO
sio = socketio.Client(reconnection=True, reconnection_attempts=5, reconnection_delay=1000)

@sio.event
def connect():
    print("Conectado al servidor de Socket.IO")

@sio.event
def connect_error(error):
    print(f"Error de conexión: {error}")

@sio.event
def disconnect():
    print("Desconectado del servidor")

def parse_line(line: str) -> dict:
    """Convierte una línea en un diccionario {sensor: {clave: valor, ...}}"""
    parts = line.strip().split('\t')
    if not parts or len(parts) < 2:
        return {}

    header_name = parts[0]
    data_dict = {}
    for item in parts[1:]:
        if ':' in item:
            key, value = item.split(':', 1)
            try:
                value = float(value)
            except ValueError:
                pass  # Mantén como string si no se puede convertir
            data_dict[key] = value

    return header_name, data_dict

import numpy as np

def haversine(lon1, lat1, lon2, lat2):
    
    
    lon1 = np.radians(lon1)
    lat1 = np.radians(lat1)
    lon2 = np.radians(lon2)
    lat2 = np.radians(lat2)

    r = 6371
    
    
    dlon = np.subtract(lon2, lon1)
    dlat = np.subtract(lat2, lat1)

    a = np.add(np.power(np.sin(np.divide(dlat, 2)), 2),
               np.multiply(np.cos(lat1),
                           np.multiply(np.cos(lat2),
                                       np.power(np.sin(np.divide(dlon, 2)), 2))
                           )
              )
    c = np.multiply(2, np.arcsin(np.sqrt(a)))

    return c*r

# Configurar tu puerto serial
puerto = "COM6"
baudios = 9600

try:
    with serial.Serial(puerto, baudios, timeout=2) as ser:
        print(f"Conectado a {puerto} a {baudios} baudios\n")

        # Conectar al servidor Socket.IO
        print("Conectando al servidor Socket.IO...")
        sio.connect('http://localhost:3000', transports=['websocket'], wait_timeout=10)
        
        print("Conexión establecida. Leyendo datos:\n")

        while True:
            if ser.in_waiting > 0:
                raw_line = ser.readline().decode('utf-8', errors='ignore').strip()
                print(raw_line)
                if not raw_line:
                    continue

                # Verificar si es el mensaje de ausencia de datos
                if raw_line == "No hay datos de radio disponibles":
                    print("[AVISO] No hay datos de radio disponibles aún.")
                    continue

                if raw_line == "Header con error":
                    print("[AVISO] Header incorrecto.")
                    continue

                if raw_line == "Radio OK":
                    print("[AVISO] Antena encendida.")
                    continue

                header, dict_data = parse_line(raw_line)
                if dict_data:

                    if header == "200":
                        me_lat, me_lon = -12.016476269437243, -77.04890209378713
                        #dist = haversine(me_lat, me_lon, dict_data["latitude"], dict_data["longitude"])
                        #dict_data['distance'] = dist/1000

                    print(header, dict_data)
                    sio.emit(header, dict_data)




except serial.SerialException as e:
    print(f"Error al conectar con el puerto serial: {e}")
