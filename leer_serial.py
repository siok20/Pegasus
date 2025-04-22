import socketio
import serial
import time
import json

# Configuración del puerto serial
puerto = '/dev/ttyUSB0'
baudrate = 9600

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

try:
    # Conectar al Arduino
    print("Conectando a Arduino...")
    arduino = serial.Serial(puerto, baudrate, timeout=1)
    time.sleep(2)  # Esperar a que Arduino se reinicie
    
    # Conectar al servidor Socket.IO
    print("Conectando al servidor Socket.IO...")
    sio.connect('http://localhost:3000', transports=['websocket'], wait_timeout=10)
    
    print("Conexión establecida. Leyendo datos:\n")
    
    while True:
        try:
            linea = arduino.readline().decode().strip()
            
            if linea:
                try:
                    valores = list(map(int, linea.split("\t")[1:]))
                    
                    if len(valores) >= 6:  # Asegurarse que tenemos todos los datos
                        data = {
                            'ax': valores[0], 'ay': valores[1], 'az': valores[2],
                            'gx': valores[3], 'gy': valores[4], 'gz': valores[5], 'tiempo' : time.time()
                        }
                        
                        sio.emit('MPU', data)
                        print(f"Enviando: {json.dumps(data)}")
                except (ValueError, IndexError) as e:
                    print(f"Error procesando datos: {e}")
        
        except serial.SerialException as e:
            print(f"Error en comunicación serial: {e}")
            break
            
        time.sleep(1)

except Exception as e:
    print(f"Error general: {e}")

finally:
    if 'arduino' in locals() and arduino.is_open:
        arduino.close()
        print("Puerto serial cerrado.")
    if sio.connected:
        sio.disconnect()
        print("Desconectado del servidor Socket.IO.")