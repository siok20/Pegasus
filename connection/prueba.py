import geocoder
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

# Esto usa tu dirección IP para estimar tu ubicación
g = geocoder.ip('me')
mi_lat = g.latlng[0]
mi_lon = g.latlng[1]

print(f"Mi ubicación actual es: lat={mi_lat}, lon={mi_lon}")
lat2, lon2 = -12.018368271004327, -77.0515425872852
lat1, lon1 = -12.019839, -77.051271
print(f'Distancia: {haversine(mi_lon, mi_lat, lon2, lat2)}')
print(f'Distancia: {haversine(lon1, lat1, lon2, lat2)}')

