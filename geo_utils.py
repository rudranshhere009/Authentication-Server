import geoip2.database

GEOIP_DB_PATH = "/home/caio/Downloads/Authentication Server/geoip/GeoLite2-City.mmdb"
geoip_reader = geoip2.database.Reader(GEOIP_DB_PATH)

def get_location_from_ip(ip: str):
    try:
        response = geoip_reader.city(ip)
        country = response.country.name
        state = response.subdivisions.most_specific.name
        city = response.city.name
        return {"country": country, "state": state, "city": city}
    except Exception:
        return {"country": None, "state": None, "city": None}
