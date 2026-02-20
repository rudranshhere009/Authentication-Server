#!/bin/bash

SERVER_IP="127.0.0.1"
SERVER_PORT="8000"

# Prompt for the username you registered
read -p "Enter the username you registered on the server: " REGISTERED_USERNAME

# Download the client agent
curl -O http://$SERVER_IP:$SERVER_PORT/static/client_agent.py
chmod +x client_agent.py

# Insert the registered username and server URL into client_agent.py
sed -i "s|USERNAME = .*|USERNAME = \"$REGISTERED_USERNAME\"  # <-- Set this to the username you registered|" client_agent.py
sed -i "s|SERVER_URL = .*|SERVER_URL = \"http://$SERVER_IP:$SERVER_PORT/api/client-status\"  # Change to your server IP if needed|" client_agent.py

# Add passwordless sudo for systemctl for this user
echo "$USER ALL=(ALL) NOPASSWD: /bin/systemctl" | sudo tee /etc/sudoers.d/grid-client-systemctl > /dev/null

# Always move the latest agent to the user's home directory
mv -f client_agent.py /home/$USER/
chown $USER:$USER /home/$USER/client_agent.py

# Create systemd service file
SERVICE_FILE="/etc/systemd/system/grid-client.service"

sudo bash -c "cat > $SERVICE_FILE" <<EOL
[Unit]
Description=Grid Auth Client Agent
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/$USER/client_agent.py
Restart=always
User=$USER

[Install]
WantedBy=multi-user.target
EOL

sudo systemctl daemon-reload
sudo systemctl enable grid-client
sudo systemctl restart grid-client

echo "Grid client agent installed and started as a systemd service."
echo "Agent is set up for registered username: $REGISTERED_USERNAME"
