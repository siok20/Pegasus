import socketio
sio = socketio.Client(logger=True)
sio.connect('http://localhost:3000')