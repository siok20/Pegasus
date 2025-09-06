import socketio
import random
import time

# Configuración de Socket.IO
sio = socketio.Client(reconnection=True, reconnection_attempts=5, reconnection_delay=1000)

from datetime import datetime

@sio.event
def connect():
    print("Conectado al servidor de Socket.IO")
    now = datetime.now().isoformat(timespec="milliseconds")
    sio.emit("fecha_hora", {"datetime": now})

@sio.event
def connect_error(error):
    print(f"Error de conexión: {error}")

@sio.event
def disconnect():
    print("Desconectado del servidor")


def generar_linea(header: int) -> str:
    """Genera una línea de prueba en el mismo formato que Arduino."""
    t = int(time.time())  # simulamos 'time'
    if header == 100:
        return f"100\ttemperatura:{random.uniform(20, 30):.2f}\tpresion:{random.uniform(900, 1100):.2f}\taltitude:{random.uniform(0, 500):.2f}\tCO2:{random.uniform(350, 500):.2f}\ttime:{t}"
    elif header == 200:
        return f"200\tlongitud:{random.uniform(-77.1, -77.0):.6f}\tlatitud:{random.uniform(-12.1, -12.0):.6f}\tgx:{random.uniform(-1, 1):.2f}\tgz:{random.uniform(-1, 1):.2f}\ttime:{t}"
    elif header == 300:
        return f"300\tax:{random.uniform(-2, 2):.2f}\tay:{random.uniform(-2, 2):.2f}\taz:{random.uniform(-2, 2):.2f}\tgy:{random.uniform(-200, 200):.2f}\ttime:{t}"
    elif header == 400:
        return f"400\tvx:{random.uniform(-10, 10):.2f}\tvy:{random.uniform(-10, 10):.2f}\tvz:{random.uniform(-10, 10):.2f}\tCO2:{random.uniform(350, 500):.2f}\ttime:{t}"
    else:
        return "Header con error"


def parse_line(line: str):
    """Convierte una línea en (header, dict_data)."""
    parts = line.strip().split('\t')
    if not parts or len(parts) < 2:
        return None, {}

    header_name = parts[0]
    data_dict = {}
    for item in parts[1:]:
        if ':' in item:
            key, value = item.split(':', 1)
            try:
                value = float(value)
            except ValueError:
                pass
            data_dict[key] = value

    return header_name, data_dict


if __name__ == "__main__":
    # 🔧 Control de número de envíos
    NUM_PAQUETES = 1000   # cámbialo a lo que necesites
    DELAY = 0.5           # segundos entre paquetes

    print(f"Enviando {NUM_PAQUETES} paquetes de prueba con {DELAY}s de intervalo\n")

    print("Conectando al servidor Socket.IO...")
    sio.connect('http://localhost:3000', transports=['websocket'], wait_timeout=10)

    try:
        for i in range(NUM_PAQUETES):
            header = random.choice([100, 200, 300, 400])  # mezcla headers
            linea = generar_linea(header)
            print(f"[{i+1}/{NUM_PAQUETES}] {linea}")

            header_str, dict_data = parse_line(linea)
            if dict_data:
                sio.emit(header_str, dict_data)
                print("→ Emitido:", header_str, dict_data)

            time.sleep(DELAY)

        print("\n+ Envío de pruebas completado.")
        sio.disconnect()

    except KeyboardInterrupt:
        print("\n- Envío interrumpido por el usuario.")
        sio.disconnect()
