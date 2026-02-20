#!/usr/bin/env python3
import time
import requests
import os

# === EDIT THIS ===
USERNAME = "your_registered_username"  # <-- Set this to the username you registered
SERVER_URL = "http://192.168.10.98:8000/api/client-status"  # Change to your server IP if needed
# ================

def block_system():
    # Disable and stop display manager (gdm3) instantly
    os.system("sudo systemctl disable gdm3")
    os.system("sudo systemctl stop gdm3")
    # Disable and stop TTYs instantly
    for i in range(1, 7):
        os.system(f"sudo systemctl disable getty@tty{i}.service")
        os.system(f"sudo systemctl stop getty@tty{i}.service")
    # Show blocking message on black screen
    os.system('clear')
    message = """
    \033[1;37;40m
    =============================================
    Your system is blocked now
    Contact the administrator at: 9871318578
    =============================================
    \033[0m
    """
    os.system(f'echo "{message}" | sudo tee /dev/tty1')
    print("System is now BLOCKED. Display manager and TTYs are disabled.")

def unblock_system():
    # Enable and start display manager (gdm3)
    os.system("sudo systemctl enable gdm3")
    os.system("sudo systemctl start gdm3")
    # Enable and start TTYs
    for i in range(1, 7):
        os.system(f"sudo systemctl enable getty@tty{i}.service")
        os.system(f"sudo systemctl start getty@tty{i}.service")
    print("System is now UNBLOCKED. Display manager and TTYs are enabled.")

def main():
    last_status = None
    while True:
        try:
            resp = requests.get(SERVER_URL, params={"username": USERNAME})
            if resp.status_code == 200:
                data = resp.json()
                is_blocked = data.get("is_blocked", False)
                # Always enforce the current state, even if already blocked/unblocked
                if is_blocked:
                    block_system()
                else:
                    unblock_system()
                last_status = is_blocked
            else:
                print("Failed to get status from server:", resp.text)
        except Exception as e:
            print("Error connecting to server:", e)
        time.sleep(15)  # Check every 15 seconds

if __name__ == "__main__":
    main()
