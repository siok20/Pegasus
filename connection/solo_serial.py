import socketio
import serial
import time
import json

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

    sensor_name = parts[0]
    data_dict = {}
    for item in parts[1:]:
        if ':' in item:
            key, value = item.split(':', 1)
            try:
                value = float(value)
            except ValueError:
                pass  # Mantén como string si no se puede convertir
            data_dict[key] = value

    data_dict['tiempo'] = time.time()
    return sensor_name, data_dict


# Configurar tu puerto serial
puerto = "COM7"
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

                if not raw_line:
                    continue

                # Verificar si es el mensaje de ausencia de datos
                if raw_line == "No hay datos de radio disponibles":
                    print("[AVISO] No hay datos de radio disponibles aún.")
                    continue

                sensor, dict_data = parse_line(raw_line)
                if dict_data:
                    print(sensor, dict_data)
                    sio.emit(sensor, dict_data)

except serial.SerialException as e:
    print(f"Error al conectar con el puerto serial: {e}")
