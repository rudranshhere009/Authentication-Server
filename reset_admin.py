import bcrypt
import psycopg2

# ---- CONFIG ----
DB_NAME = "auth_server"
DB_USER = "postgres"
DB_PASSWORD = "77"  # put your postgres password if any
DB_HOST = "localhost"
DB_PORT = "5432"

NEW_PASSWORD = "Admin@123"  # change this to your desired new admin password
ADMIN_USERNAME = "admin"

# ---- GENERATE BCRYPT HASH ----
hashed = bcrypt.hashpw(NEW_PASSWORD.encode(), bcrypt.gensalt()).decode()
print(f"Generated bcrypt hash: {hashed}")

# ---- CONNECT TO POSTGRES ----
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cur = conn.cursor()

# ---- UPDATE ADMIN PASSWORD ----
update_query = """
UPDATE users
SET password_hash = %s
WHERE username = %s;
"""
cur.execute(update_query, (hashed, ADMIN_USERNAME))
conn.commit()
cur.close()
conn.close()

print(f"Admin password for '{ADMIN_USERNAME}' has been reset successfully.")
